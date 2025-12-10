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
export function useFormSchema(): VbenFormSchema[] {
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
      component: 'ApiSelect',
      fieldName: 'thingModelId',
      label: '物模型',
      rules: 'required',
      componentProps: {
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
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: '启用', value: 'active' },
          { label: '停用', value: 'inactive' },
        ],
        optionType: 'button',
      },
      defaultValue: 'active',
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
      field: 'name',
      title: '型号名称',
      minWidth: 150,
    },
    {
      field: 'code',
      title: '型号编码',
      width: 120,
    },
    {
      field: 'thingModelName',
      title: '物模型',
      width: 150,
    },
    {
      field: 'manufacturer',
      title: '制造商',
      width: 120,
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
      field: 'deviceCount',
      title: '设备数量',
      width: 100,
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
          nameTitle: '型号',
          onClick: onActionClick,
        },
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 130,
    },
  ];
}
