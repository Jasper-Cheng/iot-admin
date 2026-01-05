import { requestClient } from '#/api/request';

export namespace DeviceApi {
  export interface Device {
    id: number;
    accountId?: number;
    modelId: number;
    modelName?: string;
    thingModelId?: number;
    name: string;
    sn: string;
    status: 'unbound' | 'bound' | 'offline' | 'online' | 'fatal';
    createdAt: string;
    // 扩展字段（用于显示）
    accountName?: string;
    familyIds?: number[];
    familyNames?: string[];
    ble_name?: string;
    ble_mac?: string;
  }

  export interface DeviceListParams {
    page?: number;
    pageSize?: number;
    sn?: string;
    name?: string;
    modelId?: number;
    accountId?: number;
    status?: string;
    bleName?: string;
  }

  export interface DeviceListResult {
    items: Device[];
    total: number;
  }

  export interface CreateDeviceParams {
    name: string;
    sn: string;
    modelId: number;
    accountId?: number | null;
    status?: 'unbound' | 'bound' | 'offline' | 'online' | 'fatal';
    ble_name: string;
    ble_mac?: string;
  }

  export interface CreateDeviceResult {
    id: number;
    name: string;
    sn: string;
    modelId: number;
    modelName?: string | null;
    accountId?: number | null;
    accountName?: string | null;
    status: string;
    createdAt: string;
  }

  export interface NetworkInfo {
    id: number;
    sn: string;
    deviceSn: string;
    deviceName?: string | null;
    ip?: string | null;
    mac?: string | null;
    bleName?: string | null;
    wifiName?: string | null;
    wifiPassword?: string | null;
    mqttBroker?: string | null;
    mqttPort?: number | null;
    firmware?: string | null;
    lastUpdate: string;
  }

  export interface DeviceMessage {
    id: number;
    deviceId: number;
    deviceSn?: string;
    deviceName?: string;
    level: 'low' | 'normal' | 'error' | 'fatal';
    status: 'new' | 'read';
    message?: string;
    detail?: Record<string, any>;
    createdAt: string;
    updatedAt?: string;
  }
}

/** 获取设备列表 */
export function getDeviceList(params: DeviceApi.DeviceListParams) {
  return requestClient.get<DeviceApi.DeviceListResult>('/device/list', {
    params,
  });
}

/** 创建设备（设备入库） */
export function createDevice(data: DeviceApi.CreateDeviceParams) {
  return requestClient.post<DeviceApi.CreateDeviceResult>('/device', data);
}

/** 获取设备详情 */
export function getDevice(id: number) {
  return requestClient.get<DeviceApi.Device>(`/device/${id}`);
}

/** 更新设备 */
export function updateDevice(
  id: number,
  data: {
    name?: string;
    modelId?: number;
    accountId?: number | null; // null 表示解绑用户
    familyIds?: number[]; // 空数组表示移除所有家庭关联
    ble_name?: string;
    ble_mac?: string;
  },
) {
  return requestClient.put(`/device/${id}`, data);
}

/** 删除设备 */
export function deleteDevice(id: number) {
  return requestClient.delete(`/device/${id}`);
}

/** 获取设备网络信息列表 */
export function getDeviceNetworkList(params: {
  page?: number;
  pageSize?: number;
  deviceSn?: string;
  deviceName?: string;
}) {
  return requestClient.get<{ items: DeviceApi.NetworkInfo[]; total: number }>(
    '/network/list',
    {
      params,
    },
  );
}

/** 获取设备消息列表 */
export function getDeviceMessageList(params: {
  deviceId?: number;
  level?: string;
  page?: number;
  pageSize?: number;
  type?: string;
  status?: 'new' | 'read';
  deviceSn?: string;
  startDate?: string; // 开始日期 YYYY-MM-DD
  endDate?: string; // 结束日期 YYYY-MM-DD
}) {
  return requestClient.get<{ items: DeviceApi.DeviceMessage[]; total: number }>(
    '/device-message/list',
    {
      params,
    },
  );
}

/** 获取今日告警列表 */
export function getTodayAlerts(params: { page?: number; pageSize?: number }) {
  return requestClient.get<{
    items: DeviceApi.DeviceMessage[];
    total: number;
    date: string;
  }>('/device-message/today-alerts', {
    params,
  });
}
