import { requestClient } from '#/api/request';

export namespace DeviceModelApi {
  export interface DeviceModel {
    id: number;
    modelCode: string;
    name: string;
    vendor?: string;
    thingModelId: number;
    thingModelName?: string; // 扩展字段，用于显示
    properties: Record<string, any>; // JSON 格式的属性定义
    services: string[] | Record<string, any>; // JSON 格式的服务定义
    events: string[] | Record<string, any>; // JSON 格式的事件定义
    createdAt: string;
    // 扩展字段（用于显示）
    deviceCount?: number;
  }

  export interface DeviceModelListParams {
    page?: number;
    pageSize?: number;
    name?: string;
    modelCode?: string;
    vendor?: string;
    thingModelId?: number;
  }

  export interface DeviceModelListResult {
    items: DeviceModel[];
    total: number;
  }

  export interface CreateDeviceModelParams {
    modelCode: string;
    name: string;
    vendor?: string;
    thingModelId: number;
    properties: Record<string, any>;
    services: string[] | Record<string, any>;
    events: string[] | Record<string, any>;
  }
}

/** 获取设备型号列表 */
export function getDeviceModelList(
  params: DeviceModelApi.DeviceModelListParams,
) {
  return requestClient.get<DeviceModelApi.DeviceModelListResult>(
    '/iot/device-model/list',
    {
      params,
    },
  );
}

/** 获取所有设备型号（下拉选择用） */
export function getAllDeviceModels() {
  return requestClient.get<DeviceModelApi.DeviceModel[]>(
    '/iot/device-model/all',
  );
}

/** 创建设备型号 */
export function createDeviceModel(
  data: DeviceModelApi.CreateDeviceModelParams,
) {
  return requestClient.post('/iot/device-model', data);
}

/** 更新设备型号 */
export function updateDeviceModel(
  id: number,
  data: Partial<DeviceModelApi.CreateDeviceModelParams>,
) {
  return requestClient.put(`/iot/device-model/${id}`, data);
}

/** 删除设备型号 */
export function deleteDeviceModel(id: number) {
  return requestClient.delete(`/iot/device-model/${id}`);
}
