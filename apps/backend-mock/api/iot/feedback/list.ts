import { usePageResponseSuccess } from '../../../utils/response';

// Mock 反馈数据（基于新的 feedback 表结构）
const MOCK_FEEDBACKS = [
  {
    id: 1,
    accountId: 3,
    accountName: '张三',
    name: '张三',
    type: 'bug',
    content: '智能灯泡一直显示离线状态，无法控制',
    status: 'pending',
    source: 'app',
    contactInfo: '13900139000',
    replay: null,
    processedAt: null,
    extra: null,
    createdAt: '2024-12-01 10:00:00',
    updatedAt: '2024-12-01 10:00:00',
  },
  {
    id: 2,
    accountId: 4,
    accountName: '李四',
    name: '李四',
    type: 'feature',
    content: '能否为智能插座增加定时开关功能',
    status: 'processing',
    source: 'app',
    contactInfo: '13900139001',
    replay: '感谢您的建议，我们正在评估该功能',
    processedAt: '2024-11-29 09:00:00',
    extra: null,
    createdAt: '2024-11-28 14:30:00',
    updatedAt: '2024-11-29 09:00:00',
  },
  {
    id: 3,
    accountId: 5,
    accountName: '王五',
    name: '王五',
    type: 'complaint',
    content: '打开设备详情页面时 App 经常闪退',
    status: 'resolved',
    source: 'app',
    contactInfo: '13900139002',
    replay: '问题已在最新版本 v2.1.0 中修复，请更新 App',
    processedAt: '2024-11-25 11:00:00',
    extra: null,
    createdAt: '2024-11-20 16:00:00',
    updatedAt: '2024-11-25 11:00:00',
  },
  {
    id: 4,
    accountId: 6,
    accountName: '赵六',
    name: '赵六',
    type: 'feature',
    content: '希望能支持扫地机器人的接入',
    status: 'pending',
    source: 'web',
    contactInfo: '13900139003',
    replay: null,
    processedAt: null,
    extra: null,
    createdAt: '2024-12-02 09:00:00',
    updatedAt: '2024-12-02 09:00:00',
  },
];

export default eventHandler(async (event) => {
  const { page = 1, pageSize = 10, accountName, name, type, status, source, hasReply } = getQuery(event);
  
  let filtered = MOCK_FEEDBACKS;
  
  if (accountName) {
    filtered = filtered.filter((item) => item.accountName?.includes(accountName as string));
  }
  if (name) {
    filtered = filtered.filter((item) => item.name?.includes(name as string));
  }
  if (type) {
    filtered = filtered.filter((item) => item.type === type);
  }
  if (status) {
    filtered = filtered.filter((item) => item.status === status);
  }
  if (source) {
    filtered = filtered.filter((item) => item.source === source);
  }
  if (hasReply !== undefined) {
    const hasReplyBool = hasReply === 'true' || hasReply === true;
    filtered = filtered.filter((item) => {
      const hasReplied = !!item.replay;
      return hasReplyBool ? hasReplied : !hasReplied;
    });
  }
  
  return usePageResponseSuccess(page, pageSize, filtered);
});
