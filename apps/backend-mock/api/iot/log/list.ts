import { usePageResponseSuccess } from '../../../utils/response';

// Mock 操作日志数据
const MOCK_LOGS = [
  {
    id: 1,
    userId: 1,
    userName: '张三',
    action: 'device.control',
    actionName: '控制设备',
    target: '智能灯泡B',
    detail: '开启设备',
    ip: '192.168.1.100',
    userAgent: 'IoT App/2.1.0 (Android 13)',
    createdAt: '2024-12-03 11:30:00',
  },
  {
    id: 2,
    userId: 1,
    userName: '张三',
    action: 'scene.trigger',
    actionName: '触发场景',
    target: '回家模式',
    detail: '自动触发场景：回家模式',
    ip: '192.168.1.100',
    userAgent: 'IoT App/2.1.0 (Android 13)',
    createdAt: '2024-12-03 11:00:00',
  },
  {
    id: 3,
    userId: 2,
    userName: '李四',
    action: 'device.add',
    actionName: '添加设备',
    target: '智能空调E',
    detail: '通过扫码添加设备',
    ip: '192.168.2.50',
    userAgent: 'IoT App/2.1.0 (iOS 17)',
    createdAt: '2024-12-03 10:45:00',
  },
  {
    id: 4,
    userId: 1,
    userName: '张三',
    action: 'room.create',
    actionName: '创建房间',
    target: '阳台',
    detail: '创建新房间：阳台',
    ip: '192.168.1.100',
    userAgent: 'IoT App/2.1.0 (Android 13)',
    createdAt: '2024-12-03 09:30:00',
  },
  {
    id: 5,
    userId: 3,
    userName: '王五',
    action: 'device.delete',
    actionName: '删除设备',
    target: '智能插座C',
    detail: '解绑并删除设备',
    ip: '10.0.0.15',
    userAgent: 'IoT App/2.0.0 (Android 12)',
    createdAt: '2024-12-02 16:20:00',
  },
];

export default eventHandler(async (event) => {
  const { page = 1, pageSize = 10 } = getQuery(event);
  return usePageResponseSuccess(page, pageSize, MOCK_LOGS);
});
