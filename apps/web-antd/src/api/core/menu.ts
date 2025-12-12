import type { RouteRecordStringComponent } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取用户所有菜单
 * 接口路径: /api/v1/iot/menu/all
 * baseURL 是 /api/v1/iot，所以这里使用 /menu/all
 */
export async function getAllMenusApi() {
  return requestClient.get<RouteRecordStringComponent[]>('/menu/all');
}
