import { usePageResponseSuccess } from '../../../utils/response';

// Mock App 用户数据
const MOCK_USERS = [
  {
    id: 1,
    nickname: '张三',
    phone: '13900139000',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    status: 'active',
    deviceCount: 5,
    homeCount: 1,
    createdAt: '2024-01-10 08:00:00',
    lastActiveTime: '2024-12-03 10:30:00',
  },
  {
    id: 2,
    nickname: '李四',
    phone: '13900139001',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    status: 'active',
    deviceCount: 12,
    homeCount: 2,
    createdAt: '2024-02-20 14:00:00',
    lastActiveTime: '2024-12-03 09:15:00',
  },
  {
    id: 3,
    nickname: '王五',
    phone: '13900139002',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    status: 'disabled',
    deviceCount: 3,
    homeCount: 1,
    createdAt: '2024-03-05 10:30:00',
    lastActiveTime: '2024-11-15 16:00:00',
  },
  {
    id: 4,
    nickname: '赵六',
    phone: '13900139003',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    status: 'active',
    deviceCount: 8,
    homeCount: 1,
    createdAt: '2024-04-12 09:00:00',
    lastActiveTime: '2024-12-02 20:45:00',
  },
  {
    id: 5,
    nickname: '孙七',
    phone: '13900139004',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
    status: 'active',
    deviceCount: 15,
    homeCount: 3,
    createdAt: '2024-05-18 11:00:00',
    lastActiveTime: '2024-12-03 11:00:00',
  },
];

export default eventHandler(async (event) => {
  const { page = 1, pageSize = 10 } = getQuery(event);
  return usePageResponseSuccess(page, pageSize, MOCK_USERS);
});
