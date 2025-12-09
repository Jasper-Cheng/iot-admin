import { usePageResponseSuccess } from '../../../utils/response';

// Mock 设备消息数据（基于新的 device_message 表结构）
const MOCK_DEVICE_MESSAGES = [
  {
    id: 1,
    deviceId: 1,
    deviceSn: 'TEMP001-2024-001',
    deviceName: '客厅温度传感器',
    level: 'normal',
    status: 'new',
    message: '当前温度 35°C 超过设定阈值 30°C',
    detail: { temperature: 35, threshold: 30, unit: '°C' },
    createdAt: '2024-12-03 11:30:00',
    updatedAt: null,
  },
  {
    id: 2,
    deviceId: 5,
    deviceSn: 'TEMP001-2024-002',
    deviceName: '书房温度传感器',
    level: 'error',
    status: 'read',
    message: '传感器故障，错误代码：E03',
    detail: { errorCode: 'E03', errorType: 'sensor_fault' },
    createdAt: '2024-12-01 08:30:00',
    updatedAt: '2024-12-01 09:00:00',
  },
  {
    id: 3,
    deviceId: 4,
    deviceSn: 'M701001-2024-001',
    deviceName: '主卧空气质量监测器',
    level: 'low',
    status: 'read',
    message: '空气质量正常',
    detail: { co2: 450, pm25: 25, pm10: 35 },
    createdAt: '2024-12-03 09:45:00',
    updatedAt: '2024-12-03 10:00:00',
  },
  {
    id: 4,
    deviceId: 2,
    deviceSn: 'HUM001-2024-001',
    deviceName: '卧室湿度传感器',
    level: 'normal',
    status: 'new',
    message: '设备已离线，请检查网络连接',
    detail: { lastOnlineTime: '2024-12-02 18:00:00' },
    createdAt: '2024-12-02 18:05:00',
    updatedAt: null,
  },
  {
    id: 5,
    deviceId: 3,
    deviceSn: 'ENV001-2024-001',
    deviceName: '客厅环境监测器',
    level: 'low',
    status: 'read',
    message: '环境数据正常',
    detail: { temperature: 22, humidity: 55, pressure: 1013 },
    createdAt: '2024-12-01 00:00:00',
    updatedAt: '2024-12-01 00:05:00',
  },
];

export default eventHandler(async (event) => {
  const { page = 1, pageSize = 10, deviceId, level, type, status } = getQuery(event);
  
  let filtered = MOCK_DEVICE_MESSAGES;
  
  if (deviceId) {
    filtered = filtered.filter((item) => item.deviceId === Number(deviceId));
  }
  if (level) {
    filtered = filtered.filter((item) => item.level === level);
  }
  if (status) {
    filtered = filtered.filter((item) => item.status === status);
  }
  
  return usePageResponseSuccess(page, pageSize, filtered);
});
