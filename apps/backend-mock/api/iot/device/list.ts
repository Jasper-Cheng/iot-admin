import { usePageResponseSuccess } from '../../../utils/response';

// Mock 设备数据
const MOCK_DEVICES = [
  {
    id: 1,
    sn: 'DEV-2024-001',
    name: '智能温控器A',
    modelId: 1,
    modelName: '温控器 T100',
    status: 'online',
    lastOnlineTime: '2024-12-03 10:30:00',
    createdAt: '2024-01-15 09:00:00',
    roomId: 1,
    roomName: '客厅',
  },
  {
    id: 2,
    sn: 'DEV-2024-002',
    name: '智能灯泡B',
    modelId: 2,
    modelName: '智能灯泡 L200',
    status: 'offline',
    lastOnlineTime: '2024-12-02 18:00:00',
    createdAt: '2024-02-20 14:30:00',
    roomId: 2,
    roomName: '卧室',
  },
  {
    id: 3,
    sn: 'DEV-2024-003',
    name: '智能插座C',
    modelId: 3,
    modelName: '智能插座 S300',
    status: 'online',
    lastOnlineTime: '2024-12-03 11:00:00',
    createdAt: '2024-03-10 10:00:00',
    roomId: 1,
    roomName: '客厅',
  },
  {
    id: 4,
    sn: 'DEV-2024-004',
    name: '智能门锁D',
    modelId: 4,
    modelName: '智能门锁 K400',
    status: 'online',
    lastOnlineTime: '2024-12-03 09:45:00',
    createdAt: '2024-04-05 16:20:00',
    roomId: null,
    roomName: null,
  },
  {
    id: 5,
    sn: 'DEV-2024-005',
    name: '智能空调E',
    modelId: 5,
    modelName: '智能空调 A500',
    status: 'fault',
    lastOnlineTime: '2024-12-01 08:00:00',
    createdAt: '2024-05-12 11:10:00',
    roomId: 3,
    roomName: '书房',
  },
];

export default eventHandler(async (event) => {
  const { page = 1, pageSize = 10 } = getQuery(event);
  return usePageResponseSuccess(page, pageSize, MOCK_DEVICES);
});
