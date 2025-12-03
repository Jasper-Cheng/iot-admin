import { requestClient } from '#/api/request';

export namespace RoomApi {
  export interface Room {
    id: number;
    name: string;
    icon: string;
    userId: number;
    userName: string;
    homeId: number;
    homeName: string;
    deviceCount: number;
    sort: number;
    createdAt: string;
  }

  export interface RoomListParams {
    page?: number;
    pageSize?: number;
    name?: string;
    userName?: string;
  }

  export interface RoomListResult {
    items: Room[];
    total: number;
  }
}

/** 获取房间列表 */
export function getRoomList(params: RoomApi.RoomListParams) {
  return requestClient.get<RoomApi.RoomListResult>('/iot/room/list', {
    params,
  });
}
