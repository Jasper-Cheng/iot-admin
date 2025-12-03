import { requestClient } from '#/api/request';

export namespace AccountApi {
  export interface Admin {
    id: number;
    username: string;
    realName: string;
    email: string;
    phone: string;
    status: 'active' | 'disabled';
    lastLoginTime: string;
    createdAt: string;
  }

  export interface AdminListParams {
    page?: number;
    pageSize?: number;
    username?: string;
    realName?: string;
    status?: string;
  }

  export interface AdminListResult {
    items: Admin[];
    total: number;
  }

  export interface CreateAdminParams {
    username: string;
    realName: string;
    email: string;
    phone: string;
    password: string;
    status: 'active' | 'disabled';
  }

  export interface UpdateAdminParams {
    realName?: string;
    email?: string;
    phone?: string;
    status?: 'active' | 'disabled';
  }
}

/** 获取管理员列表 */
export function getAdminList(params: AccountApi.AdminListParams) {
  return requestClient.get<AccountApi.AdminListResult>('/iot/account/list', {
    params,
  });
}

/** 创建管理员 */
export function createAdmin(data: AccountApi.CreateAdminParams) {
  return requestClient.post('/iot/account', data);
}

/** 更新管理员 */
export function updateAdmin(id: number, data: AccountApi.UpdateAdminParams) {
  return requestClient.put(`/iot/account/${id}`, data);
}

/** 删除管理员 */
export function deleteAdmin(id: number) {
  return requestClient.delete(`/iot/account/${id}`);
}
