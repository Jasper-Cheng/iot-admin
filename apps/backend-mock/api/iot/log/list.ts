import { usePageResponseSuccess } from '../../../utils/response';

// Mock 操作日志数据（基于新的 user_operation_log 表结构）
const MOCK_LOGS = [
  {
    id: 1,
    accountId: 3,
    accountName: '张三',
    role: 'user',
    operationType: 'quick_control',
    description: '控制设备：智能灯泡B - 开启设备',
    extra: { deviceId: 2, deviceName: '智能灯泡B', action: 'turn_on' },
    createdAt: '2024-12-03 11:30:00',
  },
  {
    id: 2,
    accountId: 3,
    accountName: '张三',
    role: 'user',
    operationType: 'device_bind',
    description: '绑定设备：智能空调E',
    extra: { deviceId: 5, deviceName: '智能空调E', method: 'scan_qr' },
    createdAt: '2024-12-03 11:00:00',
  },
  {
    id: 3,
    accountId: 4,
    accountName: '李四',
    role: 'user',
    operationType: 'device_bind',
    description: '绑定设备：环境监测器',
    extra: { deviceId: 3, deviceName: '环境监测器', method: 'scan_qr' },
    createdAt: '2024-12-03 10:45:00',
  },
  {
    id: 4,
    accountId: 3,
    accountName: '张三',
    role: 'user',
    operationType: 'family_create',
    description: '创建家庭：我的家',
    extra: { familyId: 1, familyName: '我的家' },
    createdAt: '2024-12-03 09:30:00',
  },
  {
    id: 5,
    accountId: 5,
    accountName: '王五',
    role: 'user',
    operationType: 'device_unbind',
    description: '解绑设备：智能插座C',
    extra: { deviceId: 3, deviceName: '智能插座C' },
    createdAt: '2024-12-02 16:20:00',
  },
  {
    id: 6,
    accountId: 1,
    accountName: '系统管理员',
    role: 'admin',
    operationType: 'login',
    description: '管理员登录',
    extra: { ip: '192.168.1.100', userAgent: 'IoT Admin/1.0.0' },
    createdAt: '2024-12-03 08:00:00',
  },
  {
    id: 7,
    accountId: 6,
    accountName: '赵六',
    role: 'user',
    operationType: 'feedback_create',
    description: '提交反馈：希望能支持扫地机器人的接入',
    extra: { feedbackId: 4, feedbackType: 'feature' },
    createdAt: '2024-12-02 09:00:00',
  },
];

// Mock 账户角色映射（accountId -> role）
// 假设 accountId 1-2 是管理员，3+ 是普通用户
const ACCOUNT_ROLE_MAP: Record<number, 'admin' | 'user'> = {
  1: 'admin',
  2: 'admin',
  3: 'user',
  4: 'user',
  5: 'user',
  6: 'user',
};

function getAccountRole(accountId: number): 'admin' | 'user' {
  return ACCOUNT_ROLE_MAP[accountId] || 'user';
}

export default eventHandler(async (event) => {
  const { page = 1, pageSize = 10, accountId, operationType, role, startTime, endTime } = getQuery(event);
  
  let filtered = MOCK_LOGS.map((item) => ({
    ...item,
    // 如果 mock 数据中没有 role 字段，根据 accountId 添加
    role: item.role || getAccountRole(item.accountId),
  }));
  
  if (accountId) {
    filtered = filtered.filter((item) => item.accountId === Number(accountId));
  }
  if (operationType) {
    filtered = filtered.filter((item) => item.operationType === operationType);
  }
  if (role) {
    filtered = filtered.filter((item) => {
      const itemRole = item.role || getAccountRole(item.accountId);
      return itemRole === role;
    });
  }
  if (startTime) {
    filtered = filtered.filter((item) => item.createdAt >= startTime as string);
  }
  if (endTime) {
    filtered = filtered.filter((item) => item.createdAt <= endTime as string);
  }
  
  return usePageResponseSuccess(page, pageSize, filtered);
});
