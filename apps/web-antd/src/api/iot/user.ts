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
    phone?: string;
    email?: string;
    avatar?: string;
    gender?: 'male' | 'female' | 'other';
    password?: string; // RSA加密后的密码，可选
  }
}

/** 获取 App 用户列表 */
export function getUserList(params: UserApi.UserListParams) {
  return requestClient.get<UserApi.UserListResult>('/user/list', {
    params,
  });
}

/** 创建用户 */
export function createUser(data: UserApi.CreateUserParams) {
  return requestClient.post('/user', data);
}

/** 更新用户 */
export function updateUser(id: number, data: UserApi.UpdateUserParams) {
  return requestClient.put(`/user/${id}`, data);
}

/** 删除用户 */
export function deleteUser(id: number) {
  return requestClient.delete(`/user/${id}`);
}
