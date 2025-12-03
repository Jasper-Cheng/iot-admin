import { requestClient } from '#/api/request';

export namespace UserApi {
  export interface AppUser {
    id: number;
    nickname: string;
    phone: string;
    avatar: string;
    status: 'active' | 'disabled';
    deviceCount: number;
    homeCount: number;
    createdAt: string;
    lastActiveTime: string;
  }

  export interface UserListParams {
    page?: number;
    pageSize?: number;
    nickname?: string;
    phone?: string;
    status?: string;
  }

  export interface UserListResult {
    items: AppUser[];
    total: number;
  }
}

/** 获取 App 用户列表 */
export function getUserList(params: UserApi.UserListParams) {
  return requestClient.get<UserApi.UserListResult>('/iot/user/list', {
    params,
  });
}

/** 禁用/启用用户 */
export function updateUserStatus(id: number, status: 'active' | 'disabled') {
  return requestClient.put(`/iot/user/${id}/status`, { status });
}
