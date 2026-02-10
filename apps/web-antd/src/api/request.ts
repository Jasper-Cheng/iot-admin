/**
 * 该文件可自行根据业务逻辑进行调整
 */
import type { RequestClientOptions } from '@vben/request';

import { preferences } from '@vben/preferences';
import {
  authenticateResponseInterceptor,
  errorMessageResponseInterceptor,
  RequestClient,
} from '@vben/request';
import { useAccessStore } from '@vben/stores';

import { message } from 'ant-design-vue';

import { useAuthStore } from '#/store';

import appConfig from '#/config/env';

// 直接使用 baseUrl，不走 Vite 代理
const apiURL = `${appConfig.baseUrl}/v1/admin`;

function createRequestClient(baseURL: string, options?: RequestClientOptions) {
  const client = new RequestClient({
    ...options,
    baseURL,
  });

  /**
   * 重新认证逻辑
   */
  async function doReAuthenticate() {
    console.warn('Access token or refresh token is invalid or expired. ');
    const accessStore = useAccessStore();
    const authStore = useAuthStore();
    accessStore.setAccessToken(null);
    if (
      preferences.app.loginExpiredMode === 'modal' &&
      accessStore.isAccessChecked
    ) {
      accessStore.setLoginExpired(true);
    } else {
      await authStore.logout();
    }
  }

  /**
   * 刷新token逻辑（已禁用）
   */
  async function doRefreshToken(): Promise<string> {
    // 刷新 token 功能已禁用，直接抛出错误
    throw new Error('Refresh token is disabled');
  }

  function formatToken(token: null | string) {
    return token ? `Bearer ${token}` : null;
  }

  // 请求头处理
  client.addRequestInterceptor({
    fulfilled: async (config) => {
      const accessStore = useAccessStore();

      config.headers.Authorization = formatToken(accessStore.accessToken);
      config.headers['Accept-Language'] = preferences.app.locale;
      return config;
    },
  });

  // 响应直接返回数据，不使用包装格式
  // 后端接口直接返回数据，异常直接抛出 HTTP 异常

  // 处理 responseReturn: 'body' 选项，直接返回响应数据的 body 部分
  client.addResponseInterceptor({
    fulfilled: (response) => {
      const { config, data: responseData, status } = response;
      
      // 如果配置了 responseReturn: 'body'，直接返回响应数据的 body 部分
      if (config.responseReturn === 'body' && status >= 200 && status < 400) {
        return responseData;
      }
      
      // 其他情况返回原始响应
      return response;
    },
    rejected: (error) => Promise.reject(error),
  });

  // token过期的处理（禁用刷新 token 功能）
  client.addResponseInterceptor(
    authenticateResponseInterceptor({
      client,
      doReAuthenticate,
      doRefreshToken,
      enableRefreshToken: false, // 禁用刷新 token
      formatToken,
    }),
  );

  // 通用的错误处理,如果没有进入上面的错误处理逻辑，就会进入这里
  client.addResponseInterceptor(
    errorMessageResponseInterceptor((msg: string, error) => {
      // 优先显示后端返回的 detail 字段，如果没有则显示 error 或 message
      const responseData = error?.response?.data ?? {};
      const errorMessage = responseData?.detail ?? responseData?.error ?? responseData?.message ?? '';
      // 如果没有错误信息，则会根据状态码进行提示
      message.error(errorMessage || msg);
    }),
  );

  return client;
}

export const requestClient = createRequestClient(apiURL, {
  // 后端接口直接返回数据，不使用包装格式
  // responseReturn: 'body' 返回响应数据的 BODY 部分，不做 code 检查
  responseReturn: 'body',
});

export const baseRequestClient = new RequestClient({ baseURL: apiURL });
