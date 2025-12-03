import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ThingModelApi } from '#/api/iot/thing-model';

import { h } from 'vue';

import { Tag } from 'ant-design-vue';

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
      component: 'Input',
      fieldName: 'code',
      label: '标识符',
      rules: 'required',
      componentProps: {
        placeholder: '请输入唯一标识符',
      },
    },
    {
      component: 'Input',
      fieldName: 'version',
      label: '版本',
      rules: 'required',
      defaultValue: '1.0.0',
      componentProps: {
        placeholder: '如 1.0.0',
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
      field: 'code',
      title: '标识符',
      width: 150,
    },
    {
      field: 'version',
      title: '版本',
      width: 100,
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
      title: '关联设备',
      width: 100,
    },
    {
      field: 'description',
      title: '描述',
      minWidth: 200,
      showOverflow: true,
    },
    {
      field: 'updatedAt',
      title: '更新时间',
      width: 180,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: '物模型',
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

/** 属性类型选项 */
export const propertyTypeOptions = [
  { label: '布尔值', value: 'boolean' },
  { label: '整数', value: 'int' },
  { label: '浮点数', value: 'float' },
  { label: '字符串', value: 'string' },
  { label: '枚举', value: 'enum' },
  { label: '日期时间', value: 'datetime' },
];
