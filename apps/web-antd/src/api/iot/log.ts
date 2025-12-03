import { requestClient } from '#/api/request';

export namespace LogApi {
  export interface OperationLog {
    id: number;
    userId: number;
    userName: string;
    action: string;
    actionName: string;
    target: string;
    detail: string;
    ip: string;
    userAgent: string;
    createdAt: string;
  }

  export interface LogListParams {
    page?: number;
    pageSize?: number;
    userName?: string;
    action?: string;
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
