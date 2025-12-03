import { requestClient } from '#/api/request';

export namespace VersionApi {
  export type Platform = 'android' | 'ios';
  export type VersionStatus = 'draft' | 'published';

  export interface AppVersion {
    id: number;
    version: string;
    platform: Platform;
    downloadUrl: string;
    description: string;
    forceUpdate: boolean;
    status: VersionStatus;
    publishTime: null | string;
    createdAt: string;
  }

  export interface VersionListParams {
    page?: number;
    pageSize?: number;
    version?: string;
    platform?: Platform;
    status?: VersionStatus;
  }

  export interface VersionListResult {
    items: AppVersion[];
    total: number;
  }

  export interface CreateVersionParams {
    version: string;
    platform: Platform;
    downloadUrl: string;
    description: string;
    forceUpdate: boolean;
    status: VersionStatus;
  }
}

/** 获取版本列表 */
export function getVersionList(params: VersionApi.VersionListParams) {
  return requestClient.get<VersionApi.VersionListResult>('/iot/version/list', {
    params,
  });
}

/** 创建版本 */
export function createVersion(data: VersionApi.CreateVersionParams) {
  return requestClient.post('/iot/version', data);
}

/** 更新版本 */
export function updateVersion(
  id: number,
  data: Partial<VersionApi.CreateVersionParams>,
) {
  return requestClient.put(`/iot/version/${id}`, data);
}

/** 删除版本 */
export function deleteVersion(id: number) {
  return requestClient.delete(`/iot/version/${id}`);
}

/** 发布版本 */
export function publishVersion(id: number) {
  return requestClient.post(`/iot/version/${id}/publish`);
}
