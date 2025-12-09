import { requestClient } from '#/api/request';

export namespace FamilyApi {
  export interface Family {
    id: number;
    name: string;
    avatar?: string;
    description?: string;
    inviteCode?: string;
    memberCount?: number; // 扩展字段，用于显示
    deviceCount?: number; // 扩展字段，用于显示
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
}

/** 获取家庭列表 */
export function getFamilyList(params: FamilyApi.FamilyListParams) {
  return requestClient.get<FamilyApi.FamilyListResult>('/iot/family/list', {
    params,
  });
}

/** 获取家庭详情 */
export function getFamily(id: number) {
  return requestClient.get<FamilyApi.Family>(`/iot/family/${id}`);
}

/** 创建家庭 */
export function createFamily(data: FamilyApi.CreateFamilyParams) {
  return requestClient.post('/iot/family', data);
}

/** 更新家庭 */
export function updateFamily(id: number, data: FamilyApi.UpdateFamilyParams) {
  return requestClient.put(`/iot/family/${id}`, data);
}

/** 删除家庭 */
export function deleteFamily(id: number) {
  return requestClient.delete(`/iot/family/${id}`);
}

/** 获取家庭成员列表 */
export function getFamilyMemberList(params: FamilyApi.FamilyMemberListParams) {
  return requestClient.get<FamilyApi.FamilyMemberListResult>(
    `/iot/family/${params.familyId}/members`,
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
  return requestClient.post(`/iot/family/${data.familyId}/members`, {
    accountId: data.accountId,
    nickname: data.nickname,
  });
}

/** 移除家庭成员 */
export function removeFamilyMember(familyId: number, memberId: number) {
  return requestClient.delete(`/iot/family/${familyId}/members/${memberId}`);
}

