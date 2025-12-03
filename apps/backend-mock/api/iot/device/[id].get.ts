import { useResponseError, useResponseSuccess } from '../../../utils/response';

// Mock 设备详情数据
const MOCK_DEVICE_DETAILS: Record<string, any> = {
  '1': {
    id: 1,
    sn: 'DEV-2024-001',
    name: '智能温控器A',
    modelId: 1,
    modelName: '温控器 T100',
    thingModelId: 1,
    status: 'online',
    lastOnlineTime: '2024-12-03 10:30:00',
    createdAt: '2024-01-15 09:00:00',
    roomId: 1,
    roomName: '客厅',
    firmware: 'v1.2.3',
    mac: 'AA:BB:CC:DD:EE:01',
    properties: {
      temperature: 25.5,
      humidity: 60,
      targetTemperature: 26,
      mode: 'auto',
    },
  },
  '2': {
    id: 2,
    sn: 'DEV-2024-002',
    name: '智能灯泡B',
    modelId: 2,
    modelName: '智能灯泡 L200',
    thingModelId: 2,
    status: 'offline',
    lastOnlineTime: '2024-12-02 18:00:00',
    createdAt: '2024-02-20 14:30:00',
    roomId: 2,
    roomName: '卧室',
    firmware: 'v2.0.1',
    mac: 'AA:BB:CC:DD:EE:02',
    properties: {
      power: false,
      brightness: 80,
      colorTemp: 4000,
    },
  },
};

export default eventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const device = MOCK_DEVICE_DETAILS[id || ''];

  if (device) {
    return useResponseSuccess(device);
  }

  return useResponseError('Device not found');
});
