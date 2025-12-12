import { requestClient } from '#/api/request';

export namespace FeedbackApi {
  export type FeedbackStatus = 'pending' | 'processing' | 'resolved' | 'rejected' | 'closed';
  export type FeedbackType = 'bug' | 'feature' | 'improvement' | 'complaint' | 'praise' | 'other';
  export type FeedbackSource = 'web' | 'app';

  export interface Feedback {
    id: number;
    accountId: number;
    accountName?: string; // 扩展字段，用于显示
    name?: string;
    type: FeedbackType;
    content: string;
    status: FeedbackStatus;
    source: FeedbackSource;
    contactInfo?: string;
    replay?: string;
    processedAt?: string;
    extra?: Record<string, any>;
    createdAt: string;
    updatedAt?: string;
  }

  export interface FeedbackListParams {
    page?: number;
    pageSize?: number;
    accountName?: string;
    name?: string;
    type?: FeedbackType;
    status?: FeedbackStatus;
    source?: FeedbackSource;
    hasReply?: boolean;
  }

  export interface FeedbackListResult {
    items: Feedback[];
    total: number;
  }

  export interface ReplyFeedbackParams {
    status: FeedbackStatus;
    replay: string;
  }
}

/** 获取反馈列表 */
export function getFeedbackList(params: FeedbackApi.FeedbackListParams) {
  return requestClient.get<FeedbackApi.FeedbackListResult>(
    '/feedback/list',
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
  return requestClient.put(`/feedback/${id}/reply`, data);
}

/** 更新反馈状态 */
export function updateFeedbackStatus(
  id: number,
  status: FeedbackApi.FeedbackStatus,
) {
  return requestClient.put(`/feedback/${id}/status`, { status });
}
