import { baseRequestClient, requestClient } from '#/api/request';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    password?: string;
    username?: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    accessToken: string;
  }
}

/**
 * 登录
 * 接口路径: /api/v1/web/auth/login
 */
export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<AuthApi.LoginResult>('/web/auth/login', data);
}

/**
 * 刷新accessToken
 * 接口路径: /api/v1/web/auth/refresh
 */
export async function refreshTokenApi() {
  return baseRequestClient.post<string>('/web/auth/refresh', {
    withCredentials: true,
  });
}

/**
 * 退出登录
 * 接口路径: /api/v1/web/auth/logout
 */
export async function logoutApi() {
  return baseRequestClient.post('/web/auth/logout', {
    withCredentials: true,
  });
}
