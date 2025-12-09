import { usePageResponseSuccess } from '../../../utils/response';

// Mock App 用户数据（基于新的 account 表结构，role='user'）
const MOCK_USERS = [
  {
    id: 3,
    nickname: '张三',
    phone: '13900139000',
    email: 'zhangsan@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    role: 'user',
    gender: 'male',
    unionid: null,
    currentFamilyId: 1,
    deviceCount: 5,
    familyCount: 1,
    createdAt: '2024-01-10 08:00:00',
  },
  {
    id: 4,
    nickname: '李四',
    phone: '13900139001',
    email: 'lisi@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    role: 'user',
    gender: 'male',
    unionid: null,
    currentFamilyId: 2,
    deviceCount: 12,
    familyCount: 2,
    createdAt: '2024-02-20 14:00:00',
  },
  {
    id: 5,
    nickname: '王五',
    phone: '13900139002',
    email: 'wangwu@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    role: 'user',
    gender: 'female',
    unionid: null,
    currentFamilyId: 1,
    deviceCount: 3,
    familyCount: 1,
    createdAt: '2024-03-05 10:30:00',
  },
  {
    id: 6,
    nickname: '赵六',
    phone: '13900139003',
    email: 'zhaoliu@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    role: 'user',
    gender: 'male',
    unionid: null,
    currentFamilyId: 3,
    deviceCount: 8,
    familyCount: 1,
    createdAt: '2024-04-12 09:00:00',
  },
  {
    id: 7,
    nickname: '孙七',
    phone: '13900139004',
    email: 'sunqi@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
    role: 'user',
    gender: 'other',
    unionid: null,
    currentFamilyId: 4,
    deviceCount: 15,
    familyCount: 3,
    createdAt: '2024-05-18 11:00:00',
  },
];

export default eventHandler(async (event) => {
  const { page = 1, pageSize = 10, nickname, phone, email, gender } = getQuery(event);
  
  let filtered = MOCK_USERS;
  
  if (nickname) {
    filtered = filtered.filter((item) => item.nickname.includes(nickname as string));
  }
  if (phone) {
    filtered = filtered.filter((item) => item.phone.includes(phone as string));
  }
  if (email) {
    filtered = filtered.filter((item) => item.email?.includes(email as string));
  }
  if (gender) {
    filtered = filtered.filter((item) => item.gender === gender);
  }
  
  return usePageResponseSuccess(page, pageSize, filtered);
});
