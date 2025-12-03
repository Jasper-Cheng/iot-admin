import { requestClient } from '#/api/request';

export namespace FeedbackApi {
  export type FeedbackStatus = 'pending' | 'processing' | 'resolved';
  export type FeedbackType = 'bug' | 'complaint' | 'other' | 'suggestion';

  export interface Feedback {
    id: number;
    userId: number;
    userName: string;
    type: FeedbackType;
    title: string;
    content: string;
    images: string[];
    status: FeedbackStatus;
    reply: null | string;
    createdAt: string;
    updatedAt: string;
  }

  export interface FeedbackListParams {
    page?: number;
    pageSize?: number;
    userName?: string;
    type?: FeedbackType;
    status?: FeedbackStatus;
  }

  export interface FeedbackListResult {
    items: Feedback[];
    total: number;
  }

  export interface ReplyFeedbackParams {
    status: FeedbackStatus;
    reply: string;
  }
}

/** 获取反馈列表 */
export function getFeedbackList(params: FeedbackApi.FeedbackListParams) {
  return requestClient.get<FeedbackApi.FeedbackListResult>(
    '/iot/feedback/list',
    {
      params,
    },
  );
}

/** 回复反馈 */
export function replyFeedback(
  id: number,
  data: FeedbackApi.ReplyFeedbackParams,
) {
  return requestClient.put(`/iot/feedback/${id}/reply`, data);
}

/** 更新反馈状态 */
export function updateFeedbackStatus(
  id: number,
  status: FeedbackApi.FeedbackStatus,
) {
  return requestClient.put(`/iot/feedback/${id}/status`, { status });
}
