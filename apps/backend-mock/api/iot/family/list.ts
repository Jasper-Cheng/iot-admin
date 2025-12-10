import { usePageResponseSuccess } from '../../../utils/response';

// Mock 家庭数据（基于新的 family 表结构）
const MOCK_FAMILIES = [
  {
    id: 1,
    name: '我的家',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=home1',
    description: '温馨的家庭',
    inviteCode: 'HOME001',
    memberCount: 3,
    memberIds: [3, 5, 7],
    deviceCount: 5,
    deviceIds: [1, 3, 4, 5, 6],
    createdAt: '2024-01-10 08:00:00',
    updatedAt: '2024-12-01 10:00:00',
  },
  {
    id: 2,
    name: '李四的家',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=home2',
    description: '幸福的家',
    inviteCode: 'HOME002',
    memberCount: 2,
    memberIds: [4, 6],
    deviceCount: 12,
    deviceIds: [2, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
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
    memberIds: [6],
    deviceCount: 8,
    deviceIds: [5, 18, 19, 20, 21, 22, 23, 24],
    createdAt: '2024-04-12 09:00:00',
    updatedAt: '2024-04-12 09:00:00',
  },
  {
    id: 4,
    name: '孙七的家',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=home4',
    description: '智能家居',
    inviteCode: null,
    memberCount: 4,
    memberIds: [7, 8, 9, 10],
    deviceCount: 15,
    deviceIds: [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
    createdAt: '2024-05-18 11:00:00',
    updatedAt: '2024-12-03 11:00:00',
  },
];

export default eventHandler(async (event) => {
  const { page = 1, pageSize = 10, name, inviteCode, memberId, deviceId } = getQuery(event);
  
  let filtered = MOCK_FAMILIES;
  
  if (name) {
    filtered = filtered.filter((item) => item.name.includes(name as string));
  }
  if (inviteCode) {
    filtered = filtered.filter((item) => item.inviteCode?.includes(inviteCode as string));
  }
  if (memberId) {
    const memberIdNum = Number(memberId);
    filtered = filtered.filter((item) => 
      item.memberIds && item.memberIds.includes(memberIdNum)
    );
  }
  if (deviceId) {
    const deviceIdNum = Number(deviceId);
    filtered = filtered.filter((item) => 
      item.deviceIds && item.deviceIds.includes(deviceIdNum)
    );
  }
  
  return usePageResponseSuccess(page, pageSize, filtered);
});

