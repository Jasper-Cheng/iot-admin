import { requestClient } from '#/api/request';

export namespace AccountApi {
  export interface Admin {
    id: number;
    password?: string;
    nickname: string;
    unionid?: string;
    gender: 'male' | 'female' | 'other';
    phone: string;
    email?: string;
    avatar?: string;
    role: 'user' | 'admin';
    currentFamilyId?: number;
    createdAt: string;
  }

  export interface AdminListParams {
    page?: number;
    pageSize?: number;
    nickname?: string;
    phone?: string;
    email?: string;
    role?: 'user' | 'admin';
  }

  export interface AdminListResult {
    items: Admin[];
    total: number;
  }

  export interface CreateAdminParams {
    nickname: string;
    phone: string;
    email?: string;
    password: string;
    role?: 'user' | 'admin';
    gender?: 'male' | 'female' | 'other';
  }

  export interface UpdateAdminParams {
    nickname?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    gender?: 'male' | 'female' | 'other';
    role?: 'user' | 'admin';
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
