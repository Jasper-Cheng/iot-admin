import { requestClient } from '#/api/request';

export namespace DeviceModelApi {
  export interface DeviceModel {
    id: number;
    name: string;
    code: string;
    thingModelId: number;
    thingModelName: string;
    manufacturer: string;
    description: string;
    status: 'active' | 'inactive';
    deviceCount: number;
    createdAt: string;
  }

  export interface DeviceModelListParams {
    page?: number;
    pageSize?: number;
    name?: string;
    code?: string;
    status?: string;
  }

  export interface DeviceModelListResult {
    items: DeviceModel[];
    total: number;
  }

  export interface CreateDeviceModelParams {
    name: string;
    code: string;
    thingModelId: number;
    manufacturer: string;
    description: string;
    status: 'active' | 'inactive';
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
