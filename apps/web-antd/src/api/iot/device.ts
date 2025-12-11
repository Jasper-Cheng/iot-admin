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
    status: 'unconfigured' | 'configured' | 'unbound' | 'bound' | 'offline' | 'online' | 'fault';
    createdAt: string;
    // 扩展字段（用于显示）
    accountName?: string;
    familyIds?: number[];
    familyNames?: string[];
  }

  export interface DeviceListParams {
    page?: number;
    pageSize?: number;
    sn?: string;
    name?: string;
    modelId?: number;
    status?: string;
  }

  export interface DeviceListResult {
    items: Device[];
    total: number;
  }

  export interface NetworkInfo {
    id: number;
    deviceId: number;
    deviceSn?: string;
    deviceName?: string;
    netType: string; // 'wifi' | 'ble' | 'cellular' | 'zigbee'
    name?: string; // 网络名称（SSID 或蓝牙名称）
    ip?: string;
    mac?: string;
    rssi?: number;
    connectState: 0 | 1 | 2; // 0=断开, 1=连接中, 2=已连接
    extra?: Record<string, any>;
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
  return requestClient.get<DeviceApi.DeviceListResult>('/iot/device/list', {
    params,
  });
}

/** 获取设备详情 */
export function getDevice(id: number) {
  return requestClient.get<DeviceApi.Device>(`/iot/device/${id}`);
}

/** 更新设备 */
export function updateDevice(
  id: number,
  data: {
    name?: string;
    modelId?: number;
    accountId?: number | null; // null 表示解绑用户
    familyIds?: number[]; // 空数组表示移除所有家庭关联
  },
) {
  return requestClient.put(`/iot/device/${id}`, data);
}

/** 删除设备 */
export function deleteDevice(id: number) {
  return requestClient.delete(`/iot/device/${id}`);
}

/** 获取设备网络信息列表 */
export function getDeviceNetworkList(params: {
  page?: number;
  pageSize?: number;
}) {
  return requestClient.get<{ items: DeviceApi.NetworkInfo[]; total: number }>(
    '/iot/network/list',
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
}) {
  return requestClient.get<{ items: DeviceApi.DeviceMessage[]; total: number }>(
    '/iot/device-message/list',
    {
      params,
    },
  );
}
