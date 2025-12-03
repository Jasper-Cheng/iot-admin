import { requestClient } from '#/api/request';

export namespace ThingModelApi {
  export interface Property {
    id: string;
    name: string;
    type: 'boolean' | 'datetime' | 'enum' | 'float' | 'int' | 'string';
    unit?: string;
    min?: number;
    max?: number;
    values?: string[];
  }

  export interface ThingModel {
    id: number;
    name: string;
    code: string;
    description: string;
    status: 'draft' | 'published';
    version: string;
    deviceCount: number;
    properties: Property[];
    createdAt: string;
    updatedAt: string;
  }

  export interface ThingModelListParams {
    page?: number;
    pageSize?: number;
    name?: string;
    code?: string;
    status?: string;
  }

  export interface ThingModelListResult {
    items: ThingModel[];
    total: number;
  }

  export interface CreateThingModelParams {
    name: string;
    code: string;
    description: string;
    status: 'draft' | 'published';
    version: string;
    properties: Property[];
  }
}

/** 获取物模型列表 */
export function getThingModelList(params: ThingModelApi.ThingModelListParams) {
  return requestClient.get<ThingModelApi.ThingModelListResult>(
    '/iot/thing-model/list',
    {
      params,
    },
  );
}

/** 获取物模型详情 */
export function getThingModel(id: number) {
  return requestClient.get<ThingModelApi.ThingModel>(`/iot/thing-model/${id}`);
}

/** 创建物模型 */
export function createThingModel(data: ThingModelApi.CreateThingModelParams) {
  return requestClient.post('/iot/thing-model', data);
}

/** 更新物模型 */
export function updateThingModel(
  id: number,
  data: Partial<ThingModelApi.CreateThingModelParams>,
) {
  return requestClient.put(`/iot/thing-model/${id}`, data);
}

/** 删除物模型 */
export function deleteThingModel(id: number) {
  return requestClient.delete(`/iot/thing-model/${id}`);
}

/** 发布物模型 */
export function publishThingModel(id: number) {
  return requestClient.post(`/iot/thing-model/${id}/publish`);
}
