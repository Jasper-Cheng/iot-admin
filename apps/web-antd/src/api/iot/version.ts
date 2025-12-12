import { requestClient } from '#/api/request';

export namespace VersionApi {
  export type Platform = 'web' | 'app';

  export interface AppVersion {
    id: number;
    versionCode: string;
    versionName: string;
    platform: Platform;
    title: string;
    description: string;
    downloadUrl?: string;
    fileSize?: number;
    isForceUpdate: boolean;
    minSupportedVersion?: string;
    extra?: Record<string, any>;
    createdAt: string;
    updatedAt?: string;
  }

  export interface VersionListParams {
    page?: number;
    pageSize?: number;
    versionCode?: string;
    platform?: Platform;
  }

  export interface VersionListResult {
    items: AppVersion[];
    total: number;
  }

  export interface CreateVersionParams {
    versionCode: string;
    versionName: string;
    platform: Platform;
    title: string;
    description: string;
    downloadUrl?: string;
    fileSize?: number;
    isForceUpdate?: boolean;
    minSupportedVersion?: string;
    extra?: Record<string, any>;
  }
}

/** 获取版本列表 */
export function getVersionList(params: VersionApi.VersionListParams) {
  return requestClient.get<VersionApi.VersionListResult>('/version/list', {
    params,
  });
}

/** 创建版本 */
export function createVersion(data: VersionApi.CreateVersionParams) {
  return requestClient.post('/version', data);
}

/** 更新版本 */
export function updateVersion(
  id: number,
  data: Partial<VersionApi.CreateVersionParams>,
) {
  return requestClient.put(`/version/${id}`, data);
}

/** 删除版本 */
export function deleteVersion(id: number) {
  return requestClient.delete(`/version/${id}`);
}

/** 发布版本 */
export function publishVersion(id: number) {
  return requestClient.post(`/version/${id}/publish`);
}
