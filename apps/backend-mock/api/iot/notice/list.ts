import { usePageResponseSuccess } from '../../../utils/response';

// Mock 系统消息数据（基于新的 system_message 表结构）
const MOCK_NOTICES = [
  {
    id: 1,
    title: '系统维护通知',
    content:
      '系统将于 2024年12月5日 凌晨2:00-4:00 进行维护升级，届时服务将暂停，请提前做好准备。',
    type: 'maintenance',
    priority: 'high',
    platforms: ['web', 'app'],
    extra: null,
    createdAt: '2024-12-03 09:00:00',
    updatedAt: '2024-12-03 10:00:00',
  },
  {
    id: 2,
    title: '新功能上线：场景联动',
    content: '全新场景联动功能已上线，支持多设备自动化控制，快来体验吧！',
    type: 'update',
    priority: 'normal',
    platforms: ['app'],
    extra: null,
    createdAt: '2024-11-27 15:00:00',
    updatedAt: '2024-11-28 10:00:00',
  },
  {
    id: 3,
    title: '安全提醒',
    content: '请定期修改您的登录密码，确保账号安全。',
    type: 'alert',
    priority: 'normal',
    platforms: ['web', 'app'],
    extra: null,
    createdAt: '2024-11-14 16:00:00',
    updatedAt: '2024-11-15 09:00:00',
  },
  {
    id: 4,
    title: '节日活动预告',
    content: '双十二活动即将开启，敬请期待！',
    type: 'announcement',
    priority: 'normal',
    platforms: ['app'],
    extra: null,
    createdAt: '2024-12-01 11:00:00',
    updatedAt: '2024-12-01 11:00:00',
  },
];

export default eventHandler(async (event) => {
  const { page = 1, pageSize = 10, title, type, priority, platform } = getQuery(event);
  
  let filtered = MOCK_NOTICES;
  
  if (title) {
    filtered = filtered.filter((item) => item.title.includes(title as string));
  }
  if (type) {
    filtered = filtered.filter((item) => item.type === type);
  }
  if (priority) {
    filtered = filtered.filter((item) => item.priority === priority);
  }
  if (platform) {
    filtered = filtered.filter((item) => item.platforms.includes(platform as string));
  }
  
  return usePageResponseSuccess(page, pageSize, filtered);
});
