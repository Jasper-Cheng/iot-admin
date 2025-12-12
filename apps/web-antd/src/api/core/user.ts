import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取用户信息
 * 接口路径: /api/v1/iot/user/info
 * baseURL 是 /api/v1/iot，所以这里使用 /user/info
 */
export async function getUserInfoApi() {
  return requestClient.get<UserInfo>('/user/info');
}
