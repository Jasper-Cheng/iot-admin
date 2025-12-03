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

const typeMap: Record<string, { color: string; text: string }> = {
  alarm: { text: '告警', color: 'orange' },
  fault: { text: '故障', color: 'red' },
  event: { text: '事件', color: 'blue' },
  offline: { text: '离线', color: 'default' },
};

const levelMap: Record<string, { color: string; text: string }> = {
  info: { text: '信息', color: 'blue' },
  warning: { text: '警告', color: 'orange' },
  error: { text: '错误', color: 'red' },
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
    },
    {
      field: 'deviceName',
      title: '设备名称',
      width: 150,
    },
    {
      field: 'type',
      title: '类型',
      width: 100,
      slots: {
        default: ({ row }) => {
          const type = typeMap[row.type] || {
            text: row.type,
            color: 'default',
          };
          return h(Tag, { color: type.color }, () => type.text);
        },
      },
    },
    {
      field: 'level',
      title: '级别',
      width: 80,
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
      field: 'title',
      title: '标题',
      width: 150,
    },
    {
      field: 'content',
      title: '内容',
      minWidth: 250,
      showOverflow: true,
    },
    {
      field: 'isRead',
      title: '已读',
      width: 80,
      slots: {
        default: ({ row }) => {
          return row.isRead
            ? h(Tag, { color: 'default' }, () => '已读')
            : h(Tag, { color: 'red' }, () => '未读');
        },
      },
    },
    {
      field: 'createdAt',
      title: '时间',
      width: 180,
    },
  ];
}
