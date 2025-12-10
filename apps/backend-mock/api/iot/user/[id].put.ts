import { eventHandler, getRouterParam, readBody } from 'h3';

import { useResponseError, useResponseSuccess } from '../../../utils/response';

// Mock App 用户数据（与 list.ts 保持一致）
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
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);

  const userIndex = MOCK_USERS.findIndex((u) => u.id === Number(id));

  if (userIndex === -1) {
    return useResponseError('User not found');
  }

  const user = MOCK_USERS[userIndex];

  // 更新用户信息
  if (body.nickname !== undefined) {
    user.nickname = body.nickname;
  }
  if (body.phone !== undefined) {
    // 检查手机号是否已被其他用户使用
    const existingUser = MOCK_USERS.find(
      (u) => u.id !== Number(id) && u.phone === body.phone,
    );
    if (existingUser) {
      return useResponseError('Phone number already exists');
    }
    user.phone = body.phone;
  }
  if (body.email !== undefined) {
    user.email = body.email || undefined;
  }
  if (body.avatar !== undefined) {
    user.avatar = body.avatar || undefined;
  }
  if (body.gender !== undefined) {
    user.gender = body.gender;
  }
  if (body.role !== undefined) {
    user.role = body.role;
  }

  // 返回更新后的用户（不包含密码）
  const { password: _, ...userWithoutPassword } = user;
  return useResponseSuccess(userWithoutPassword);
});

