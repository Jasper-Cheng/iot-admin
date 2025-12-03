import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { RoomApi } from '#/api/iot/room';

/** 搜索表单 Schema */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '房间名称',
      componentProps: {
        placeholder: '请输入房间名称',
        allowClear: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'userName',
      label: '所属用户',
      componentProps: {
        placeholder: '请输入用户名',
        allowClear: true,
      },
    },
  ];
}

const iconMap: Record<string, string> = {
  sofa: '🛋️',
  bed: '🛏️',
  book: '📚',
  kitchen: '🍳',
  sun: '☀️',
  bath: '🛁',
  car: '🚗',
};

/** 表格列定义 */
export function useColumns(): VxeTableGridOptions<RoomApi.Room>['columns'] {
  return [
    {
      field: 'id',
      title: 'ID',
      width: 80,
    },
    {
      field: 'icon',
      title: '图标',
      width: 80,
      slots: {
        default: ({ row }) => iconMap[row.icon] || '🏠',
      },
    },
    {
      field: 'name',
      title: '房间名称',
      minWidth: 120,
    },
    {
      field: 'userName',
      title: '所属用户',
      width: 120,
    },
    {
      field: 'homeName',
      title: '所属家庭',
      width: 120,
    },
    {
      field: 'deviceCount',
      title: '设备数量',
      width: 100,
    },
    {
      field: 'sort',
      title: '排序',
      width: 80,
    },
    {
      field: 'createdAt',
      title: '创建时间',
      width: 180,
    },
  ];
}
