import { requestClient } from '#/api/request';

export namespace NoticeApi {
  export type NoticeType = 'activity' | 'feature' | 'security' | 'system';
  export type NoticeStatus = 'draft' | 'published';

  export interface Notice {
    id: number;
    title: string;
    content: string;
    type: NoticeType;
    status: NoticeStatus;
    publishTime: null | string;
    createdAt: string;
  }

  export interface NoticeListParams {
    page?: number;
    pageSize?: number;
    title?: string;
    type?: NoticeType;
    status?: NoticeStatus;
  }

  export interface NoticeListResult {
    items: Notice[];
    total: number;
  }

  export interface CreateNoticeParams {
    title: string;
    content: string;
    type: NoticeType;
    status: NoticeStatus;
  }
}

/** 获取消息列表 */
export function getNoticeList(params: NoticeApi.NoticeListParams) {
  return requestClient.get<NoticeApi.NoticeListResult>('/iot/notice/list', {
    params,
  });
}

/** 创建消息 */
export function createNotice(data: NoticeApi.CreateNoticeParams) {
  return requestClient.post('/iot/notice', data);
}

/** 更新消息 */
export function updateNotice(
  id: number,
  data: Partial<NoticeApi.CreateNoticeParams>,
) {
  return requestClient.put(`/iot/notice/${id}`, data);
}

/** 删除消息 */
export function deleteNotice(id: number) {
  return requestClient.delete(`/iot/notice/${id}`);
}

/** 发布消息 */
export function publishNotice(id: number) {
  return requestClient.post(`/iot/notice/${id}/publish`);
}
