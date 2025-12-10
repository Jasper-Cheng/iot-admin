import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { VersionApi } from '#/api/iot/version';

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
      fieldName: 'versionCode',
      label: '版本号',
      rules: 'required',
      componentProps: {
        placeholder: '如 2.1.0',
      },
    },
    {
      component: 'Input',
      fieldName: 'versionName',
      label: '版本名称',
      rules: 'required',
      componentProps: {
        placeholder: '如 FastIoT v2.1.0',
      },
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: 'Web', value: 'web' },
          { label: 'App', value: 'app' },
        ],
        optionType: 'button',
      },
      fieldName: 'platform',
      label: '平台',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'title',
      label: '版本标题',
      rules: 'required',
      componentProps: {
        placeholder: '请输入版本标题',
      },
    },
    {
      component: 'Textarea',
      fieldName: 'description',
      label: '版本描述',
      rules: 'required',
      componentProps: {
        placeholder: '请输入版本描述，每行一条',
        rows: 5,
      },
    },
    {
      component: 'Input',
      fieldName: 'downloadUrl',
      label: '下载地址',
      componentProps: {
        placeholder: '请输入下载链接（可选）',
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'fileSize',
      label: '文件大小（字节）',
      componentProps: {
        placeholder: '请输入文件大小',
        min: 0,
      },
    },
    {
      component: 'Switch',
      fieldName: 'isForceUpdate',
      label: '强制更新',
      defaultValue: false,
    },
    {
      component: 'Input',
      fieldName: 'minSupportedVersion',
      label: '最低支持版本',
      componentProps: {
        placeholder: '如 2.0.0（可选）',
      },
    },
  ];
}

/** 搜索表单 Schema */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'versionCode',
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
          { label: 'Web', value: 'web' },
          { label: 'App', value: 'app' },
        ],
        placeholder: '请选择平台',
      },
      fieldName: 'platform',
      label: '平台',
    },
  ];
}

const platformMap: Record<string, { color: string; text: string }> = {
  web: { text: 'Web', color: 'blue' },
  app: { text: 'App', color: 'green' },
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
      field: 'versionCode',
      title: '版本号',
      width: 120,
    },
    {
      field: 'versionName',
      title: '版本名称',
      width: 150,
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
      field: 'title',
      title: '版本标题',
      minWidth: 150,
    },
    {
      field: 'description',
      title: '版本描述',
      minWidth: 250,
      showOverflow: true,
    },
    {
      field: 'isForceUpdate',
      title: '强制更新',
      width: 100,
      slots: {
        default: ({ row }) => {
          return row.isForceUpdate
            ? h(Tag, { color: 'red' }, () => '是')
            : h(Tag, { color: 'default' }, () => '否');
        },
      },
    },
    {
      field: 'fileSize',
      title: '文件大小',
      width: 120,
      slots: {
        default: ({ row }) => {
          if (!row.fileSize) return h('span', { class: 'text-gray-400' }, '未设置');
          const sizeMB = (row.fileSize / 1024 / 1024).toFixed(2);
          return `${sizeMB} MB`;
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
          nameField: 'versionName',
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
