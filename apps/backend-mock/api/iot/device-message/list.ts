import { usePageResponseSuccess } from '../../../utils/response';

// Mock 设备消息数据
const MOCK_DEVICE_MESSAGES = [
  {
    id: 1,
    deviceId: 1,
    deviceSn: 'DEV-2024-001',
    deviceName: '智能温控器A',
    type: 'alarm',
    level: 'warning',
    title: '温度异常',
    content: '当前温度 35°C 超过设定阈值 30°C',
    isRead: false,
    createdAt: '2024-12-03 11:30:00',
  },
  {
    id: 2,
    deviceId: 5,
    deviceSn: 'DEV-2024-005',
    deviceName: '智能空调E',
    type: 'fault',
    level: 'error',
    title: '设备故障',
    content: '压缩机异常，错误代码：E03',
    isRead: true,
    createdAt: '2024-12-01 08:30:00',
  },
  {
    id: 3,
    deviceId: 4,
    deviceSn: 'DEV-2024-004',
    deviceName: '智能门锁D',
    type: 'event',
    level: 'info',
    title: '开锁记录',
    content: '用户张三使用指纹开锁',
    isRead: true,
    createdAt: '2024-12-03 09:45:00',
  },
  {
    id: 4,
    deviceId: 2,
    deviceSn: 'DEV-2024-002',
    deviceName: '智能灯泡B',
    type: 'offline',
    level: 'warning',
    title: '设备离线',
    content: '设备已离线，请检查网络连接',
    isRead: false,
    createdAt: '2024-12-02 18:05:00',
  },
  {
    id: 5,
    deviceId: 3,
    deviceSn: 'DEV-2024-003',
    deviceName: '智能插座C',
    type: 'event',
    level: 'info',
    title: '用电统计',
    content: '本月累计用电 15.6 kWh',
    isRead: true,
    createdAt: '2024-12-01 00:00:00',
  },
];

export default eventHandler(async (event) => {
  const { page = 1, pageSize = 10 } = getQuery(event);
  return usePageResponseSuccess(page, pageSize, MOCK_DEVICE_MESSAGES);
});
