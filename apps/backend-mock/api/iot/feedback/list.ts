import { usePageResponseSuccess } from '../../../utils/response';

// Mock 反馈数据
const MOCK_FEEDBACKS = [
  {
    id: 1,
    userId: 1,
    userName: '张三',
    type: 'bug',
    title: '设备无法连接',
    content: '智能灯泡一直显示离线状态，无法控制',
    images: ['https://picsum.photos/200/200?random=1'],
    status: 'pending',
    reply: null,
    createdAt: '2024-12-01 10:00:00',
    updatedAt: '2024-12-01 10:00:00',
  },
  {
    id: 2,
    userId: 2,
    userName: '李四',
    type: 'suggestion',
    title: '希望增加定时功能',
    content: '能否为智能插座增加定时开关功能',
    images: [],
    status: 'processing',
    reply: '感谢您的建议，我们正在评估该功能',
    createdAt: '2024-11-28 14:30:00',
    updatedAt: '2024-11-29 09:00:00',
  },
  {
    id: 3,
    userId: 3,
    userName: '王五',
    type: 'complaint',
    title: 'App 闪退问题',
    content: '打开设备详情页面时 App 经常闪退',
    images: [
      'https://picsum.photos/200/200?random=2',
      'https://picsum.photos/200/200?random=3',
    ],
    status: 'resolved',
    reply: '问题已在最新版本 v2.1.0 中修复，请更新 App',
    createdAt: '2024-11-20 16:00:00',
    updatedAt: '2024-11-25 11:00:00',
  },
  {
    id: 4,
    userId: 4,
    userName: '赵六',
    type: 'suggestion',
    title: '支持更多设备类型',
    content: '希望能支持扫地机器人的接入',
    images: [],
    status: 'pending',
    reply: null,
    createdAt: '2024-12-02 09:00:00',
    updatedAt: '2024-12-02 09:00:00',
  },
];

export default eventHandler(async (event) => {
  const { page = 1, pageSize = 10 } = getQuery(event);
  return usePageResponseSuccess(page, pageSize, MOCK_FEEDBACKS);
});
