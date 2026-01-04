import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { DeviceApi } from '#/api/iot/device';

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
      component: 'Input',
      fieldName: 'deviceName',
      label: '设备名称',
      componentProps: {
        placeholder: '请输入设备名称',
        allowClear: true,
      },
    },
  ];
}

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
      width: 180,
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
      field: 'bleName',
      title: '蓝牙名称',
      width: 150,
      slots: {
        default: ({ row }) => row.bleName || '-',
      },
    },
    {
      field: 'wifiName',
      title: 'Wi-Fi名称',
      width: 150,
      slots: {
        default: ({ row }) => row.wifiName || '-',
      },
    },
    {
      field: 'wifiPassword',
      title: 'Wi-Fi密码',
      width: 150,
      slots: {
        default: ({ row }) => row.wifiPassword || '-',
      },
    },
    {
      field: 'mqttBroker',
      title: 'MQTT代理',
      width: 180,
      slots: {
        default: ({ row }) => row.mqttBroker || '-',
      },
    },
    {
      field: 'mqttPort',
      title: 'MQTT端口',
      width: 120,
      slots: {
        default: ({ row }) => (row.mqttPort ? String(row.mqttPort) : '-'),
      },
    },
    {
      field: 'firmware',
      title: '固件版本',
      width: 120,
      slots: {
        default: ({ row }) => row.firmware || '-',
      },
    },
    {
      field: 'lastUpdate',
      title: '更新时间',
      width: 180,
      slots: {
        default: ({ row }) => row.lastUpdate || '-',
      },
    },
  ];
}
