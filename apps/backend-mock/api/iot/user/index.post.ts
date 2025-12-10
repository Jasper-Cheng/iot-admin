import { eventHandler, readBody } from 'h3';

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
  const body = await readBody(event);

  // 验证必填字段
  if (!body.nickname || !body.phone || !body.password) {
    return useResponseError('Missing required fields: nickname, phone, password');
  }

  // 检查手机号是否已存在
  const existingUser = MOCK_USERS.find((u) => u.phone === body.phone);
  if (existingUser) {
    return useResponseError('Phone number already exists');
  }

  // 生成新 ID
  const newId = Math.max(...MOCK_USERS.map((u) => u.id), 0) + 1;

  // 创建新用户
  const newUser = {
    id: newId,
    nickname: body.nickname,
    phone: body.phone,
    email: body.email || undefined,
    avatar: body.avatar || undefined,
    password: body.password,
    role: 'user' as const,
    gender: body.gender || 'other',
    unionid: null,
    currentFamilyId: undefined,
    deviceCount: 0,
    familyCount: 0,
    createdAt: new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).replace(/\//g, '-'),
  };

  MOCK_USERS.push(newUser);

  // 返回创建的用户（不包含密码）
  const { password: _, ...userWithoutPassword } = newUser;
  return useResponseSuccess(userWithoutPassword);
});

