import { requestClient } from '#/api/request';

export namespace LogApi {
  export type OperationType =
    | 'login'
    | 'logout'
    | 'register'
    | 'account_delete'
    | 'account_update'
    | 'device_create'
    | 'device_update'
    | 'device_delete'
    | 'device_bind'
    | 'device_unbind'
    | 'device_name_update'
    | 'device_add_to_family'
    | 'device_remove_from_family'
    | 'family_create'
    | 'family_update'
    | 'family_delete'
    | 'family_member_add'
    | 'family_member_remove'
    | 'family_member_update'
    | 'permission_update'
    | 'quick_control'
    | 'feedback_create'
    | 'feedback_reply'
    | 'feedback_status_update'
    | 'notice_create'
    | 'notice_update'
    | 'notice_delete'
    | 'notice_publish'
    | 'device_model_create'
    | 'device_model_update'
    | 'device_model_delete'
    | 'thing_model_create'
    | 'thing_model_update'
    | 'thing_model_delete'
    | 'thing_model_publish'
    | 'version_create'
    | 'version_update'
    | 'version_delete'
    | 'version_publish'
    | 'points_adjust'
    | 'points_deduct';

  export interface OperationLog {
    id: number;
    accountId: number;
    accountName?: string; // 扩展字段，用于显示
    role?: 'user' | 'admin'; // 角色，用于显示
    operationType: OperationType;
    description: string;
    extra?: Record<string, any>;
    createdAt: string;
  }

  export interface LogListParams {
    page?: number;
    pageSize?: number;
    accountId?: number;
    operationType?: OperationType;
    role?: 'user' | 'admin';
    startTime?: string;
    endTime?: string;
  }

  export interface LogListResult {
    items: OperationLog[];
    total: number;
  }
}

/** 获取操作日志列表 */
export function getLogList(params: LogApi.LogListParams) {
  return requestClient.get<LogApi.LogListResult>('/log/list', {
    params,
  });
}
