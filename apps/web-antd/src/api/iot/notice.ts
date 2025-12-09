import { requestClient } from '#/api/request';

export namespace NoticeApi {
  export type NoticeType = 'notification' | 'announcement' | 'alert' | 'maintenance' | 'update';
  export type NoticePriority = 'low' | 'normal' | 'high' | 'urgent';

  export interface Notice {
    id: number;
    title: string;
    content: string;
    type: NoticeType;
    priority: NoticePriority;
    platforms: string[]; // ['android', 'ios', 'web']
    extra?: Record<string, any>;
    createdAt: string;
    updatedAt?: string;
  }

  export interface NoticeListParams {
    page?: number;
    pageSize?: number;
    title?: string;
    type?: NoticeType;
    priority?: NoticePriority;
    platform?: string;
  }

  export interface NoticeListResult {
    items: Notice[];
    total: number;
  }

  export interface CreateNoticeParams {
    title: string;
    content: string;
    type: NoticeType;
    priority?: NoticePriority;
    platforms: string[];
    extra?: Record<string, any>;
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
