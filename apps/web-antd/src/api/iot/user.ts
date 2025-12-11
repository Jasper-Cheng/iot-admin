import { requestClient } from '#/api/request';

export namespace UserApi {
  export interface AppUser {
    id: number;
    nickname: string;
    phone: string;
    email?: string;
    avatar?: string;
    password?: string;
    unionid?: string;
    gender: 'male' | 'female' | 'other';
    role: 'user' | 'admin';
    currentFamilyId?: number;
    currentFamilyName?: string;
    deviceCount?: number;
    familyCount?: number;
    createdAt: string;
  }

  export interface UserListParams {
    page?: number;
    pageSize?: number;
    nickname?: string;
    phone?: string;
    email?: string;
    gender?: 'male' | 'female' | 'other';
  }

  export interface UserListResult {
    items: AppUser[];
    total: number;
  }

  export interface CreateUserParams {
    nickname: string;
    phone: string;
    email?: string;
    password: string;
    avatar?: string;
    gender?: 'male' | 'female' | 'other';
  }

  export interface UpdateUserParams {
    nickname?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    gender?: 'male' | 'female' | 'other';
    role?: 'user' | 'admin';
  }
}

/** 获取 App 用户列表 */
export function getUserList(params: UserApi.UserListParams) {
  return requestClient.get<UserApi.UserListResult>('/iot/user/list', {
    params,
  });
}

/** 创建用户 */
export function createUser(data: UserApi.CreateUserParams) {
  return requestClient.post('/iot/user', data);
}

/** 更新用户 */
export function updateUser(id: number, data: UserApi.UpdateUserParams) {
  return requestClient.put(`/iot/user/${id}`, data);
}

/** 删除用户 */
export function deleteUser(id: number) {
  return requestClient.delete(`/iot/user/${id}`);
}
