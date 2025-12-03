import { usePageResponseSuccess } from '../../../utils/response';

// Mock 管理员数据
const MOCK_ADMINS = [
  {
    id: 1,
    username: 'admin',
    realName: '系统管理员',
    email: 'admin@iot.com',
    phone: '13800138000',
    status: 'active',
    lastLoginTime: '2024-12-03 09:00:00',
    createdAt: '2024-01-01 00:00:00',
  },
  {
    id: 2,
    username: 'operator',
    realName: '运维人员',
    email: 'operator@iot.com',
    phone: '13800138001',
    status: 'active',
    lastLoginTime: '2024-12-02 14:30:00',
    createdAt: '2024-02-15 10:00:00',
  },
];

export default eventHandler(async (event) => {
  const { page = 1, pageSize = 10 } = getQuery(event);
  return usePageResponseSuccess(page, pageSize, MOCK_ADMINS);
});
