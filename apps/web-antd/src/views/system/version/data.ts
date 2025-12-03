import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { VersionApi } from '#/api/iot/version';

import { h } from 'vue';

import { Tag } from 'ant-design-vue';

/** 表单 Schema */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'version',
      label: '版本号',
      rules: 'required',
      componentProps: {
        placeholder: '如 2.1.0',
      },
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: 'Android', value: 'android' },
          { label: 'iOS', value: 'ios' },
        ],
        optionType: 'button',
      },
      fieldName: 'platform',
      label: '平台',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'downloadUrl',
      label: '下载地址',
      rules: 'required',
      componentProps: {
        placeholder: '请输入下载链接',
      },
    },
    {
      component: 'Textarea',
      fieldName: 'description',
      label: '更新说明',
      rules: 'required',
      componentProps: {
        placeholder: '请输入更新说明，每行一条',
        rows: 5,
      },
    },
    {
      component: 'Switch',
      fieldName: 'forceUpdate',
      label: '强制更新',
      defaultValue: false,
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: '草稿', value: 'draft' },
          { label: '发布', value: 'published' },
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
      fieldName: 'version',
      label: '版本号',
      componentProps: {
        placeholder: '请输入版本号',
        allowClear: true,
      },
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: 'Android', value: 'android' },
          { label: 'iOS', value: 'ios' },
        ],
        placeholder: '请选择平台',
      },
      fieldName: 'platform',
      label: '平台',
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

const platformMap: Record<string, { color: string; text: string }> = {
  android: { text: 'Android', color: 'green' },
  ios: { text: 'iOS', color: 'blue' },
};

const statusMap: Record<string, { color: string; text: string }> = {
  draft: { text: '草稿', color: 'default' },
  published: { text: '已发布', color: 'success' },
};

/** 表格列定义 */
export function useColumns<T = VersionApi.AppVersion>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: 'ID',
      width: 80,
    },
    {
      field: 'version',
      title: '版本号',
      width: 120,
    },
    {
      field: 'platform',
      title: '平台',
      width: 100,
      slots: {
        default: ({ row }) => {
          const platform = platformMap[row.platform] || {
            text: row.platform,
            color: 'default',
          };
          return h(Tag, { color: platform.color }, () => platform.text);
        },
      },
    },
    {
      field: 'description',
      title: '更新说明',
      minWidth: 250,
      showOverflow: true,
    },
    {
      field: 'forceUpdate',
      title: '强制更新',
      width: 100,
      slots: {
        default: ({ row }) => {
          return row.forceUpdate
            ? h(Tag, { color: 'red' }, () => '是')
            : h(Tag, { color: 'default' }, () => '否');
        },
      },
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
      field: 'publishTime',
      title: '发布时间',
      width: 180,
      slots: {
        default: ({ row }) =>
          row.publishTime || h('span', { class: 'text-gray-400' }, '未发布'),
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
          nameField: 'version',
          nameTitle: '版本',
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
