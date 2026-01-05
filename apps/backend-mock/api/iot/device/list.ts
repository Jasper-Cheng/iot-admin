import { usePageResponseSuccess } from '../../../utils/response';

// Mock 设备数据（基于新的 device 表结构）
const MOCK_DEVICES = [
  {
    id: 1,
    accountId: 3,
    accountName: '张三',
    modelId: 1,
    modelName: '温度传感器',
    thingModelId: 1,
    name: '客厅温度传感器',
    sn: 'TEMP001-2024-001',
    status: 'online',
    familyIds: [1],
    familyNames: ['我的家'],
    createdAt: '2024-01-15 09:00:00',
    ble_name: 'TempSensor-001',
    ble_mac: 'AA:BB:CC:DD:EE:01',
  },
  {
    id: 2,
    accountId: 4,
    accountName: '李四',
    modelId: 2,
    modelName: '湿度传感器',
    thingModelId: 2,
    name: '卧室湿度传感器',
    sn: 'HUM001-2024-001',
    status: 'offline',
    familyIds: [2],
    familyNames: ['李四的家'],
    createdAt: '2024-02-20 14:30:00',
    ble_name: 'HumSensor-001',
    ble_mac: 'AA:BB:CC:DD:EE:02',
  },
  {
    id: 3,
    accountId: 3,
    accountName: '张三',
    modelId: 3,
    modelName: '环境监测器',
    thingModelId: 3,
    name: '客厅环境监测器',
    sn: 'ENV001-2024-001',
    status: 'bound',
    familyIds: [1],
    familyNames: ['我的家'],
    createdAt: '2024-03-10 10:00:00',
    ble_name: 'EnvMonitor-001',
    ble_mac: 'AA:BB:CC:DD:EE:03',
  },
  {
    id: 4,
    accountId: 5,
    accountName: '王五',
    modelId: 4,
    modelName: '室内空气质量监测器',
    thingModelId: 4,
    name: '主卧空气质量监测器',
    sn: 'M701001-2024-001',
    status: 'online',
    familyIds: [1],
    familyNames: ['我的家'],
    createdAt: '2024-04-05 16:20:00',
    ble_name: 'AirQuality-001',
    ble_mac: 'AA:BB:CC:DD:EE:04',
  },
  {
    id: 5,
    accountId: 6,
    accountName: '赵六',
    modelId: 1,
    modelName: '温度传感器',
    thingModelId: 1,
    name: '书房温度传感器',
    sn: 'TEMP001-2024-002',
    status: 'fault',
    familyIds: [3],
    familyNames: ['赵六的家'],
    createdAt: '2024-05-12 11:10:00',
    ble_name: 'TempSensor-002',
    ble_mac: 'AA:BB:CC:DD:EE:05',
  },
];

export default eventHandler(async (event) => {
  const query = getQuery(event);
  const page = query.page ? Number(query.page) : 1;
  const pageSize = query.pageSize ? Number(query.pageSize) : 10;
  const { sn, name, modelId, status, bleName } = query;
  
  let filtered = MOCK_DEVICES;
  
  if (sn) {
    filtered = filtered.filter((item) => item.sn.includes(sn as string));
  }
  if (name) {
    filtered = filtered.filter((item) => item.name.includes(name as string));
  }
  if (modelId) {
    filtered = filtered.filter((item) => item.modelId === Number(modelId));
  }
  if (status) {
    filtered = filtered.filter((item) => item.status === status);
  }
  if (bleName && typeof bleName === 'string') {
    filtered = filtered.filter((item) => item.ble_name && item.ble_name.includes(bleName));
  }
  
  return usePageResponseSuccess(page, pageSize, filtered);
});
