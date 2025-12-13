import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { DeviceModelApi } from '#/api/iot/device-model';

import { h } from 'vue';

import { Tag } from 'ant-design-vue';

interface OnActionClickParams<T> {
  code: string;
  row: T;
}

type OnActionClickFn<T> = (e: OnActionClickParams<T>) => void;

/** 表单 Schema */
export function useFormSchema(thingModelOptions?: Array<{ label: string; value: number }>): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '型号名称',
      rules: 'required',
      componentProps: {
        placeholder: '请输入型号名称',
      },
    },
    {
      component: 'Input',
      fieldName: 'code',
      label: '型号编码',
      rules: 'required',
      componentProps: {
        placeholder: '请输入型号编码',
      },
    },
    {
      component: thingModelOptions && thingModelOptions.length > 0 ? 'Select' : 'ApiSelect',
      fieldName: 'thingModelId',
      label: '物模型',
      rules: 'required',
      componentProps: thingModelOptions && thingModelOptions.length > 0
        ? {
            placeholder: '请选择物模型',
            options: thingModelOptions,
          }
        : {
            placeholder: '请选择物模型',
            api: () =>
              import('#/api/iot/thing-model').then((m) =>
                m.getThingModelList({ pageSize: 100 }),
              ),
            resultField: 'items',
            labelField: 'name',
            valueField: 'id',
          },
    },
    {
      component: 'Input',
      fieldName: 'manufacturer',
      label: '制造商',
      componentProps: {
        placeholder: '请输入制造商',
      },
    },
    {
      component: 'Textarea',
      fieldName: 'description',
      label: '描述',
      componentProps: {
        placeholder: '请输入描述',
        rows: 3,
      },
    },
  ];
}

/** 搜索表单 Schema */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '型号名称',
      componentProps: {
        placeholder: '请输入型号名称',
        allowClear: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'code',
      label: '型号编码',
      componentProps: {
        placeholder: '请输入型号编码',
        allowClear: true,
      },
    },
    {
      component: 'ApiSelect',
      fieldName: 'thingModelId',
      label: '物模型',
      componentProps: {
        placeholder: '请选择物模型',
        allowClear: true,
        api: () =>
          import('#/api/iot/thing-model').then((m) =>
            m.getThingModelList({ pageSize: 100 }),
          ),
        resultField: 'items',
        labelField: 'name',
        valueField: 'id',
      },
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: '启用', value: 'active' },
          { label: '停用', value: 'inactive' },
        ],
        placeholder: '请选择状态',
      },
      fieldName: 'status',
      label: '状态',
    },
  ];
}

const statusMap: Record<string, { color: string; text: string }> = {
  active: { text: '启用', color: 'success' },
  inactive: { text: '停用', color: 'default' },
};

// 解析属性JSON并格式化显示
function formatProperties(properties: Record<string, any> | string | undefined): string {
  if (!properties) return '-';
  try {
    const props = typeof properties === 'string' ? JSON.parse(properties) : properties;
    if (!props || typeof props !== 'object') return '-';
    const keys = Object.keys(props);
    return keys.length > 0 ? keys.join(', ') : '-';
  } catch {
    return '-';
  }
}

// 解析服务JSON并格式化显示
function formatServices(services: string[] | Record<string, any> | string | undefined): string {
  if (!services) return '-';
  try {
    let serviceList: string[] = [];
    if (typeof services === 'string') {
      const parsed = JSON.parse(services);
      serviceList = Array.isArray(parsed) ? parsed : [];
    } else if (Array.isArray(services)) {
      serviceList = services;
    }
    return serviceList.length > 0 ? serviceList.join(', ') : '-';
  } catch {
    return '-';
  }
}

// 解析事件JSON并格式化显示
function formatEvents(events: string[] | Record<string, any> | string | undefined): string {
  if (!events) return '-';
  try {
    let eventList: string[] = [];
    if (typeof events === 'string') {
      const parsed = JSON.parse(events);
      eventList = Array.isArray(parsed) ? parsed : [];
    } else if (Array.isArray(events)) {
      eventList = events;
    }
    return eventList.length > 0 ? eventList.join(', ') : '-';
  } catch {
    return '-';
  }
}

/** 表格列定义 */
export function useColumns<T = DeviceModelApi.DeviceModel>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: 'ID',
      width: 80,
    },
    {
      field: 'code',
      title: '型号编码',
      width: 120,
    },
    {
      field: 'name',
      title: '型号名称',
      minWidth: 150,
    },
    {
      field: 'manufacturer',
      title: '供应商',
      width: 120,
    },
    {
      field: 'thingModelId',
      title: '物模型ID',
      width: 120,
    },
    {
      field: 'properties',
      title: '属性',
      minWidth: 200,
      showOverflow: true,
      slots: {
        default: ({ row }) => {
          return formatProperties(row.properties);
        },
      },
    },
    {
      field: 'services',
      title: '服务',
      minWidth: 200,
      showOverflow: true,
      slots: {
        default: ({ row }) => {
          return formatServices(row.services);
        },
      },
    },
    {
      field: 'events',
      title: '事件',
      minWidth: 200,
      showOverflow: true,
      slots: {
        default: ({ row }) => {
          return formatEvents(row.events);
        },
      },
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: '型号',
          onClick: onActionClick,
          actions: ['edit', 'delete'],
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
