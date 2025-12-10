import { eventHandler, getRouterParam, readBody } from 'h3';

import { useResponseError, useResponseSuccess } from '../../../utils/response';

// Mock 设备数据（与 list.ts 保持一致）
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
  },
];

// 获取家庭名称（根据 familyIds）
function getFamilyNames(familyIds: number[]): string[] {
  const familyMap: Record<number, string> = {
    1: '我的家',
    2: '李四的家',
    3: '赵六的家',
    4: '孙七的家',
  };
  return familyIds.map((id) => familyMap[id] || `家庭${id}`);
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

export default eventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);

  const deviceIndex = MOCK_DEVICES.findIndex((d) => d.id === Number(id));

  if (deviceIndex === -1) {
    return useResponseError('Device not found');
  }

  const device = MOCK_DEVICES[deviceIndex];

  // 更新设备信息
  if (body.name !== undefined) {
    device.name = body.name;
  }
  if (body.modelId !== undefined) {
    device.modelId = body.modelId;
    device.modelName = getModelName(body.modelId);
  }
  if (body.accountId !== undefined) {
    device.accountId = body.accountId || undefined;
    device.accountName = body.accountId ? getAccountName(body.accountId) : undefined;
  }
  if (body.familyIds !== undefined) {
    device.familyIds = body.familyIds || [];
    device.familyNames = device.familyIds.length > 0 ? getFamilyNames(device.familyIds) : [];
  }

  return useResponseSuccess(device);
});

