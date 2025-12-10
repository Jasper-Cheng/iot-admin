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
          { label: 'Wi-Fi', value: 'wifi' },
          { label: '蓝牙', value: 'ble' },
          { label: 'Zigbee', value: 'zigbee' },
        ],
        placeholder: '请选择连接类型',
      },
      fieldName: 'type',
      label: '连接类型',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: '优秀', value: 'excellent' },
          { label: '良好', value: 'good' },
          { label: '一般', value: 'fair' },
          { label: '较弱', value: 'weak' },
        ],
        placeholder: '请选择信号强度',
      },
      fieldName: 'signalStrength',
      label: '信号强度',
    },
  ];
}

const signalMap: Record<string, { color: string; text: string }> = {
  excellent: { text: '优秀', color: 'success' },
  good: { text: '良好', color: 'processing' },
  fair: { text: '一般', color: 'warning' },
  weak: { text: '较弱', color: 'error' },
};

const typeMap: Record<string, string> = {
  wifi: 'Wi-Fi',
  ble: '蓝牙',
  zigbee: 'Zigbee',
};

/** 表格列定义 */
export function useColumns(): VxeTableGridOptions<DeviceApi.NetworkInfo>['columns'] {
  return [
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
      field: 'netType',
      title: '网络类型',
      width: 100,
      slots: {
        default: ({ row }) => {
          return typeMap[row.netType] || row.netType;
        },
      },
    },
    {
      field: 'name',
      title: '网络名称',
      width: 150,
      slots: {
        default: ({ row }) => row.name || '-',
      },
    },
    {
      field: 'ip',
      title: 'IP',
      width: 130,
      slots: {
        default: ({ row }) => row.ip || '-',
      },
    },
    {
      field: 'mac',
      title: 'MAC',
      width: 150,
      slots: {
        default: ({ row }) => row.mac || '-',
      },
    },
    {
      field: 'rssi',
      title: 'RSSI',
      width: 100,
      slots: {
        default: ({ row }) => {
          if (row.rssi === undefined || row.rssi === null) {
            return '-';
          }
          return `${row.rssi} dBm`;
        },
      },
    },
    {
      field: 'extra',
      title: '额外信息',
      minWidth: 200,
      slots: {
        default: ({ row }) => {
          if (!row.extra || Object.keys(row.extra).length === 0) {
            return '-';
          }
          return JSON.stringify(row.extra);
        },
      },
    },
    {
      field: 'lastUpdate',
      title: '更新时间',
      width: 180,
    },
  ];
}
