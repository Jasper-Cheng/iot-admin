import { usePageResponseSuccess } from '../../../utils/response';

// Mock 管理员数据（基于新的 account 表结构）
const MOCK_ADMINS = [
  {
    id: 1,
    nickname: '系统管理员',
    phone: '13800000000',
    email: 'admin@fastiot.com',
    role: 'admin',
    gender: 'other',
    avatar: null,
    unionid: null,
    currentFamilyId: null,
    createdAt: '2024-01-01 00:00:00',
  },
  {
    id: 2,
    nickname: '运维人员',
    phone: '13800138001',
    email: 'operator@fastiot.com',
    role: 'admin',
    gender: 'male',
    avatar: null,
    unionid: null,
    currentFamilyId: null,
    createdAt: '2024-02-15 10:00:00',
  },
];

export default eventHandler(async (event) => {
  const { page = 1, pageSize = 10, nickname, phone, email, role } = getQuery(event);
  
  let filtered = MOCK_ADMINS;
  
  if (nickname) {
    filtered = filtered.filter((item) => item.nickname.includes(nickname as string));
  }
  if (phone) {
    filtered = filtered.filter((item) => item.phone.includes(phone as string));
  }
  if (email) {
    filtered = filtered.filter((item) => item.email?.includes(email as string));
  }
  if (role) {
    filtered = filtered.filter((item) => item.role === role);
  }
  
  return usePageResponseSuccess(page, pageSize, filtered);
});
