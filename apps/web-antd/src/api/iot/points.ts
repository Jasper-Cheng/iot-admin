import { requestClient } from '#/api/request';

export namespace PointsApi {
  export interface PointsRecord {
    id: number;
    accountId: number;
    accountName?: string | null;
    accountPhone: string;
    points: number; // 积分变动数量（正数为增加，负数为减少）
    balance: number; // 变动后积分余额
    type: 'check_in' | 'task' | 'reward' | 'exchange' | 'penalty' | 'admin_adjust';
    description?: string | null;
    extra?: Record<string, any> | null;
    createdAt: string;
  }

  export interface PointsListParams {
    page?: number;
    pageSize?: number;
    accountId?: number;
  }

  export interface PointsListResult {
    items: PointsRecord[];
    total: number;
    page: number;
    pageSize: number;
  }

  export interface PointsDetailParams {
    accountId: number;
    page?: number;
    pageSize?: number;
    type?: string;
  }

  export interface PointsDetailResult {
    accountId: number;
    accountName?: string | null;
    accountPhone: string;
    currentBalance: number;
    items: Array<{
      id: number;
      points: number;
      balance: number;
      type: string;
      description?: string | null;
      extra?: Record<string, any> | null;
      createdAt: string;
    }>;
    total: number;
    page: number;
    pageSize: number;
  }

  export interface PointsAdjustParams {
    points: number; // 正数为奖励，负数为扣除
    type?: string; // 默认 "admin_adjust"
    description?: string;
    extra?: Record<string, any>;
  }

  export interface PointsAdjustResult {
    id: number;
    accountId: number;
    accountName?: string | null;
    accountPhone: string;
    points: number;
    oldBalance: number;
    newBalance: number;
    type: string;
    description: string;
    extra?: Record<string, any>;
    createdAt: string;
  }
}

/** 获取用户积分记录列表 */
export function getPointsList(params: PointsApi.PointsListParams) {
  return requestClient.get<PointsApi.PointsListResult>('/points/list', {
    params,
  });
}

/** 查看用户积分详情 */
export function getPointsDetail(
  accountId: number,
  params?: Omit<PointsApi.PointsDetailParams, 'accountId'>,
) {
  return requestClient.get<PointsApi.PointsDetailResult>(
    `/points/${accountId}/detail`,
    {
      params,
    },
  );
}

/** 积分奖励/扣除 */
export function adjustPoints(
  accountId: number,
  data: PointsApi.PointsAdjustParams,
) {
  return requestClient.post<PointsApi.PointsAdjustResult>(
    `/points/${accountId}/adjust`,
    data,
  );
}

