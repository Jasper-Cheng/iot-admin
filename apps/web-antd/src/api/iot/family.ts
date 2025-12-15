import { requestClient } from '#/api/request';

export namespace FamilyApi {
  export interface Family {
    id: number;
    name: string;
    avatar?: string;
    description?: string;
    inviteCode?: string;
    memberCount?: number; // 扩展字段，用于显示
    memberIds?: number[]; // 成员ID列表
    memberNames?: string[]; // 成员名称列表
    deviceCount?: number; // 扩展字段，用于显示
    deviceIds?: number[]; // 设备ID列表
    deviceNames?: string[]; // 设备名称列表
    createdAt: string;
    updatedAt?: string;
  }

  export interface FamilyMember {
    id: number;
    familyId: number;
    accountId: number;
    accountName?: string; // 扩展字段，用于显示
    nickname?: string; // 在家庭中的昵称（可选）
    joinedAt: string;
    createdAt: string;
  }

  export interface FamilyListParams {
    page?: number;
    pageSize?: number;
    name?: string;
    inviteCode?: string;
    memberId?: number;
    deviceId?: number;
  }

  export interface FamilyListResult {
    items: Family[];
    total: number;
  }

  export interface FamilyMemberListParams {
    familyId: number;
    page?: number;
    pageSize?: number;
  }

  export interface FamilyMemberListResult {
    items: FamilyMember[];
    total: number;
  }

  export interface CreateFamilyParams {
    name: string;
    description?: string;
    avatar?: string;
  }

  export interface UpdateFamilyParams {
    name?: string;
    description?: string;
    avatar?: string;
  }

  export interface AddFamilyMemberParams {
    familyId: number;
    accountId: number;
    nickname?: string; // 在家庭中的昵称（可选）
  }

  export interface UpdateFamilyMemberParams {
    nickname: string | null; // 在家庭中的昵称，可以是字符串或 null（清空昵称）
  }
}

/** 获取家庭列表 */
export function getFamilyList(params: FamilyApi.FamilyListParams) {
  return requestClient.get<FamilyApi.FamilyListResult>('/family/list', {
    params,
  });
}

/** 获取家庭详情 */
export function getFamily(id: number) {
  return requestClient.get<FamilyApi.Family>(`/family/${id}`);
}

/** 创建家庭 */
export function createFamily(data: FamilyApi.CreateFamilyParams) {
  return requestClient.post('/family', data);
}

/** 更新家庭 */
export function updateFamily(id: number, data: FamilyApi.UpdateFamilyParams) {
  return requestClient.put(`/family/${id}`, data);
}

/** 删除家庭 */
export function deleteFamily(id: number) {
  return requestClient.delete(`/family/${id}`);
}

/** 获取家庭成员列表 */
export function getFamilyMemberList(params: FamilyApi.FamilyMemberListParams) {
  return requestClient.get<FamilyApi.FamilyMemberListResult>(
    `/family/${params.familyId}/members`,
    {
      params: {
        page: params.page,
        pageSize: params.pageSize,
      },
    },
  );
}

/** 添加家庭成员 */
export function addFamilyMember(data: FamilyApi.AddFamilyMemberParams) {
  return requestClient.post(`/family/${data.familyId}/members`, {
    accountId: data.accountId,
    nickname: data.nickname,
  });
}

/** 移除家庭成员 */
export function removeFamilyMember(familyId: number, memberId: number) {
  return requestClient.delete(`/family/${familyId}/members/${memberId}`);
}

/** 更新家庭成员昵称 */
export function updateFamilyMember(
  familyId: number,
  memberId: number,
  data: FamilyApi.UpdateFamilyMemberParams,
) {
  return requestClient.put(`/family/${familyId}/members/${memberId}`, data);
}

/** 添加设备到家庭 */
export function addFamilyDevice(familyId: number, deviceId: number) {
  return requestClient.post(`/family/${familyId}/devices/${deviceId}`);
}

/** 删除家庭设备关联 */
export function removeFamilyDevice(familyId: number, deviceId: number) {
  return requestClient.delete(`/family/${familyId}/devices/${deviceId}`);
}

