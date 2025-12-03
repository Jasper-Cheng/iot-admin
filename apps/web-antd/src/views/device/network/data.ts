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
      minWidth: 150,
    },
    {
      field: 'type',
      title: '连接类型',
      width: 100,
      slots: {
        default: ({ row }) => typeMap[row.type] || row.type,
      },
    },
    {
      field: 'ssid',
      title: 'Wi-Fi名称',
      width: 150,
      slots: {
        default: ({ row }) => row.ssid || '-',
      },
    },
    {
      field: 'mac',
      title: 'MAC地址',
      width: 150,
    },
    {
      field: 'ip',
      title: 'IP地址',
      width: 130,
      slots: {
        default: ({ row }) => row.ip || '-',
      },
    },
    {
      field: 'rssi',
      title: 'RSSI',
      width: 100,
      slots: {
        default: ({ row }) => `${row.rssi} dBm`,
      },
    },
    {
      field: 'signalStrength',
      title: '信号强度',
      width: 100,
      slots: {
        default: ({ row }) => {
          const signal = signalMap[row.signalStrength] || {
            text: row.signalStrength,
            color: 'default',
          };
          return h(Tag, { color: signal.color }, () => signal.text);
        },
      },
    },
    {
      field: 'lastConnectedAt',
      title: '最后连接',
      width: 180,
    },
  ];
}
