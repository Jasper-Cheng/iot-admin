import { requestClient } from '#/api/request';

export namespace ThingModelApi {
  export interface ThingModel {
    id: number;
    name: string;
    description?: string;
    properties: Record<string, any>; // JSON 格式的属性定义
    services: string[] | Record<string, any>; // JSON 格式的服务定义
    events: string[] | Record<string, any>; // JSON 格式的事件定义
    createdAt: string;
    // 扩展字段（用于显示）
    deviceCount?: number;
  }

  export interface ThingModelListParams {
    page?: number;
    pageSize?: number;
    name?: string;
  }

  export interface ThingModelListResult {
    items: ThingModel[];
    total: number;
  }

  export interface CreateThingModelParams {
    name: string;
    description?: string;
    properties: Record<string, any>;
    services: string[] | Record<string, any>;
    events: string[] | Record<string, any>;
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
