import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ThingModelApi } from '#/api/iot/thing-model';


interface OnActionClickParams<T> {
  code: string;
  row: T;
}

type OnActionClickFn<T> = (e: OnActionClickParams<T>) => void;

/** 表单 Schema */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '名称',
      rules: 'required',
      componentProps: {
        placeholder: '请输入物模型名称',
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
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: '草稿', value: 'draft' },
          { label: '已发布', value: 'published' },
        ],
        optionType: 'button',
      },
      defaultValue: 'draft',
      fieldName: 'status',
      label: '状态',
    },
  ];
}

/** 搜索表单 Schema */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '名称',
      componentProps: {
        placeholder: '请输入名称',
        allowClear: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'code',
      label: '标识符',
      componentProps: {
        placeholder: '请输入标识符',
        allowClear: true,
      },
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: '草稿', value: 'draft' },
          { label: '已发布', value: 'published' },
        ],
        placeholder: '请选择状态',
      },
      fieldName: 'status',
      label: '状态',
    },
  ];
}

const statusMap: Record<string, { color: string; text: string }> = {
  draft: { text: '草稿', color: 'default' },
  published: { text: '已发布', color: 'success' },
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
export function useColumns<T = ThingModelApi.ThingModel>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: 'ID',
      width: 80,
    },
    {
      field: 'name',
      title: '名称',
      minWidth: 150,
    },
    {
      field: 'description',
      title: '描述',
      minWidth: 200,
      showOverflow: true,
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
      field: 'createdAt',
      title: '创建时间',
      width: 180,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: '物模型',
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

/** 属性类型选项 */
export const propertyTypeOptions = [
  { label: '布尔值', value: 'boolean' },
  { label: '整数', value: 'int' },
  { label: '浮点数', value: 'float' },
  { label: '字符串', value: 'string' },
  { label: '枚举', value: 'enum' },
  { label: '日期时间', value: 'datetime' },
];


