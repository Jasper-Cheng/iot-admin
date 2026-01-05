import { eventHandler, readBody } from 'h3';

import { useResponseError, useResponseSuccess } from '../../../utils/response';

// Mock 设备数据（与 list.ts 保持一致，用于存储新创建的设备）
const MOCK_DEVICES: any[] = [
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

// 获取型号名称（根据 modelId）
function getModelName(modelId: number): string {
  const modelMap: Record<number, string> = {
    1: '温度传感器',
    2: '湿度传感器',
    3: '环境监测器',
    4: '室内空气质量监测器',
  };
  return modelMap[modelId] || `型号${modelId}`;
}

// 获取账号名称（根据 accountId）
function getAccountName(accountId?: number): string | undefined {
  const accountMap: Record<number, string> = {
    3: '张三',
    4: '李四',
    5: '王五',
    6: '赵六',
  };
  return accountId ? accountMap[accountId] : undefined;
}

export default eventHandler(async (event) => {
  const body = await readBody(event);

  // 验证必填字段
  if (!body.name || !body.sn || !body.modelId || !body.ble_name) {
    return useResponseError('Missing required fields: name, sn, modelId, ble_name');
  }

  // 检查序列号是否已存在
  const existingDevice = MOCK_DEVICES.find((d) => d.sn === body.sn);
  if (existingDevice) {
    return useResponseError('Device SN already exists');
  }

  // 生成新 ID
  const newId = Math.max(...MOCK_DEVICES.map((d) => d.id), 0) + 1;

  // 创建新设备
  const newDevice = {
    id: newId,
    name: body.name,
    sn: body.sn,
    modelId: body.modelId,
    modelName: getModelName(body.modelId),
    thingModelId: body.modelId, // 简化处理，实际应该根据 modelId 查询
    accountId: body.accountId || undefined,
    accountName: body.accountId ? getAccountName(body.accountId) : undefined,
    status: body.status || 'unbound',
    familyIds: [],
    familyNames: [],
    ble_name: body.ble_name,
    ble_mac: body.ble_mac || undefined,
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

  MOCK_DEVICES.push(newDevice);

  // 返回创建的设备
  return useResponseSuccess({
    id: newDevice.id,
    name: newDevice.name,
    sn: newDevice.sn,
    modelId: newDevice.modelId,
    modelName: newDevice.modelName,
    accountId: newDevice.accountId || null,
    accountName: newDevice.accountName || null,
    status: newDevice.status,
    createdAt: newDevice.createdAt,
  });
});

