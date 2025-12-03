import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { DeviceApi } from '#/api/iot/device';

import { h } from 'vue';

import { Tag } from 'ant-design-vue';

/** 搜索表单 Schema */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'sn',
      label: '设备SN',
      componentProps: {
        placeholder: '请输入设备SN',
        allowClear: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: '设备名称',
      componentProps: {
        placeholder: '请输入设备名称',
        allowClear: true,
      },
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: '在线', value: 'online' },
          { label: '离线', value: 'offline' },
          { label: '故障', value: 'fault' },
        ],
        placeholder: '请选择状态',
      },
      fieldName: 'status',
      label: '状态',
    },
  ];
}

const statusMap: Record<string, { color: string; text: string }> = {
  online: { text: '在线', color: 'success' },
  offline: { text: '离线', color: 'default' },
  fault: { text: '故障', color: 'error' },
};

/** 表格列定义 */
export function useColumns<T = DeviceApi.Device>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: 'ID',
      width: 80,
    },
    {
      field: 'sn',
      title: '设备SN',
      width: 150,
    },
    {
      field: 'name',
      title: '设备名称',
      minWidth: 150,
    },
    {
      field: 'modelName',
      title: '型号',
      width: 150,
    },
    {
      field: 'status',
      title: '状态',
      width: 100,
      slots: {
        default: ({ row }) => {
          const status = statusMap[row.status] || {
            text: row.status,
            color: 'default',
          };
          return h(Tag, { color: status.color }, () => status.text);
        },
      },
    },
    {
      field: 'roomName',
      title: '所属房间',
      width: 120,
      slots: {
        default: ({ row }) => {
          return (
            row.roomName || h('span', { class: 'text-gray-400' }, '未绑定')
          );
        },
      },
    },
    {
      field: 'lastOnlineTime',
      title: '最后在线',
      width: 180,
    },
    {
      field: 'createdAt',
      title: '入库时间',
      width: 180,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: '设备',
          onClick: onActionClick,
          actions: ['view', 'edit', 'delete'],
        },
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 150,
    },
  ];
}
