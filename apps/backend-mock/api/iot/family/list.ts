import { usePageResponseSuccess } from '../../../utils/response';

// Mock 家庭数据（基于新的 family 表结构）
const MOCK_FAMILIES = [
  {
    id: 1,
    name: '我的家',
    avatar: null,
    description: '温馨的家庭',
    inviteCode: 'HOME001',
    memberCount: 3,
    deviceCount: 5,
    createdAt: '2024-01-10 08:00:00',
    updatedAt: '2024-12-01 10:00:00',
  },
  {
    id: 2,
    name: '李四的家',
    avatar: null,
    description: '幸福的家',
    inviteCode: 'HOME002',
    memberCount: 2,
    deviceCount: 12,
    createdAt: '2024-02-20 14:00:00',
    updatedAt: '2024-12-02 09:00:00',
  },
  {
    id: 3,
    name: '赵六的家',
    avatar: null,
    description: null,
    inviteCode: 'HOME003',
    memberCount: 1,
    deviceCount: 8,
    createdAt: '2024-04-12 09:00:00',
    updatedAt: '2024-04-12 09:00:00',
  },
  {
    id: 4,
    name: '孙七的家',
    avatar: null,
    description: '智能家居',
    inviteCode: null,
    memberCount: 4,
    deviceCount: 15,
    createdAt: '2024-05-18 11:00:00',
    updatedAt: '2024-12-03 11:00:00',
  },
];

export default eventHandler(async (event) => {
  const { page = 1, pageSize = 10, name, inviteCode } = getQuery(event);
  
  let filtered = MOCK_FAMILIES;
  
  if (name) {
    filtered = filtered.filter((item) => item.name.includes(name as string));
  }
  if (inviteCode) {
    filtered = filtered.filter((item) => item.inviteCode?.includes(inviteCode as string));
  }
  
  return usePageResponseSuccess(page, pageSize, filtered);
});

