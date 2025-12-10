import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { DeviceApi } from '#/api/iot/device';

import { h } from 'vue';

import { Tag } from 'ant-design-vue';

/** 搜索表单 Schema */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'deviceSn',
      label: '设备SN',
      componentProps: {
        placeholder: '请输入设备SN',
        allowClear: true,
      },
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: '告警', value: 'alarm' },
          { label: '故障', value: 'fault' },
          { label: '事件', value: 'event' },
          { label: '离线', value: 'offline' },
        ],
        placeholder: '请选择类型',
      },
      fieldName: 'type',
      label: '消息类型',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: '信息', value: 'info' },
          { label: '警告', value: 'warning' },
          { label: '错误', value: 'error' },
        ],
        placeholder: '请选择级别',
      },
      fieldName: 'level',
      label: '消息级别',
    },
  ];
}

const levelMap: Record<string, { color: string; text: string }> = {
  low: { text: '低', color: 'default' },
  normal: { text: '普通', color: 'blue' },
  error: { text: '错误', color: 'orange' },
  fatal: { text: '严重', color: 'red' },
};

const statusMap: Record<string, { color: string; text: string }> = {
  new: { text: '未读', color: 'red' },
  read: { text: '已读', color: 'default' },
};

/** 表格列定义 */
export function useColumns(): VxeTableGridOptions<DeviceApi.DeviceMessage>['columns'] {
  return [
    {
      field: 'id',
      title: 'ID',
      width: 80,
    },
    {
      field: 'deviceSn',
      title: '设备SN',
      width: 150,
      slots: {
        default: ({ row }) => row.deviceSn || '-',
      },
    },
    {
      field: 'deviceName',
      title: '设备名称',
      minWidth: 150,
      slots: {
        default: ({ row }) => row.deviceName || '-',
      },
    },
    {
      field: 'level',
      title: '消息级别',
      width: 100,
      slots: {
        default: ({ row }) => {
          const level = levelMap[row.level] || {
            text: row.level,
            color: 'default',
          };
          return h(Tag, { color: level.color }, () => level.text);
        },
      },
    },
    {
      field: 'status',
      title: '消息状态',
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
      field: 'message',
      title: '内容',
      minWidth: 250,
      showOverflow: true,
      slots: {
        default: ({ row }) => row.message || '-',
      },
    },
    {
      field: 'detail',
      title: '消息参数',
      minWidth: 200,
      slots: {
        default: ({ row }) => {
          if (!row.detail || Object.keys(row.detail).length === 0) {
            return '-';
          }
          return JSON.stringify(row.detail);
        },
      },
    },
    {
      field: 'updatedAt',
      title: '更新时间',
      width: 180,
      slots: {
        default: ({ row }) => {
          // 如果有 updatedAt 则显示 updatedAt，否则显示 createdAt
          return row.updatedAt || row.createdAt || '-';
        },
      },
    },
  ];
}


