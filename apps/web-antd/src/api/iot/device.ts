import { requestClient } from '#/api/request';

export namespace DeviceApi {
  export interface Device {
    id: number;
    sn: string;
    name: string;
    modelId: number;
    modelName: string;
    thingModelId?: number;
    status: 'fault' | 'offline' | 'online';
    lastOnlineTime: string;
    createdAt: string;
    roomId: null | number;
    roomName: null | string;
    firmware?: string;
    mac?: string;
    properties?: Record<string, any>;
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
    deviceSn: string;
    deviceName: string;
    type: 'ble' | 'wifi' | 'zigbee';
    ssid: null | string;
    mac: string;
    ip: null | string;
    rssi: number;
    signalStrength: 'excellent' | 'fair' | 'good' | 'weak';
    lastConnectedAt: string;
  }

  export interface DeviceMessage {
    id: number;
    deviceId: number;
    deviceSn: string;
    deviceName: string;
    type: 'alarm' | 'event' | 'fault' | 'offline';
    level: 'error' | 'info' | 'warning';
    title: string;
    content: string;
    isRead: boolean;
    createdAt: string;
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
export function updateDevice(id: number, data: Partial<DeviceApi.Device>) {
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
