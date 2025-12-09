import { requestClient } from '#/api/request';

export namespace LogApi {
  export type OperationType =
    | 'login'
    | 'logout'
    | 'register'
    | 'account_delete'
    | 'account_update'
    | 'device_bind'
    | 'device_unbind'
    | 'device_name_update'
    | 'device_add_to_family'
    | 'device_remove_from_family'
    | 'family_create'
    | 'family_delete'
    | 'family_member_add'
    | 'family_member_remove'
    | 'quick_control'
    | 'feedback_create';

  export interface OperationLog {
    id: number;
    accountId: number;
    accountName?: string; // 扩展字段，用于显示
    operationType: OperationType;
    description: string;
    extra?: Record<string, any>;
    createdAt: string;
  }

  export interface LogListParams {
    page?: number;
    pageSize?: number;
    accountName?: string;
    operationType?: OperationType;
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
  return requestClient.get<LogApi.LogListResult>('/iot/log/list', {
    params,
  });
}
