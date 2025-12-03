import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { NoticeApi } from '#/api/iot/notice';

import { h } from 'vue';

import { Tag } from 'ant-design-vue';

/** 表单 Schema */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'title',
      label: '标题',
      rules: 'required',
      componentProps: {
        placeholder: '请输入标题',
      },
    },
    {
      component: 'Select',
      componentProps: {
        options: [
          { label: '系统通知', value: 'system' },
          { label: '功能更新', value: 'feature' },
          { label: '安全提醒', value: 'security' },
          { label: '活动公告', value: 'activity' },
        ],
        placeholder: '请选择类型',
      },
      fieldName: 'type',
      label: '类型',
      rules: 'required',
    },
    {
      component: 'Textarea',
      fieldName: 'content',
      label: '内容',
      rules: 'required',
      componentProps: {
        placeholder: '请输入内容',
        rows: 6,
      },
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
      fieldName: 'title',
      label: '标题',
      componentProps: {
        placeholder: '请输入标题',
        allowClear: true,
      },
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: '系统通知', value: 'system' },
          { label: '功能更新', value: 'feature' },
          { label: '安全提醒', value: 'security' },
          { label: '活动公告', value: 'activity' },
        ],
        placeholder: '请选择类型',
      },
      fieldName: 'type',
      label: '类型',
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

const typeMap: Record<string, { color: string; text: string }> = {
  system: { text: '系统通知', color: 'blue' },
  feature: { text: '功能更新', color: 'green' },
  security: { text: '安全提醒', color: 'orange' },
  activity: { text: '活动公告', color: 'purple' },
};

const statusMap: Record<string, { color: string; text: string }> = {
  draft: { text: '草稿', color: 'default' },
  published: { text: '已发布', color: 'success' },
};

/** 表格列定义 */
export function useColumns<T = NoticeApi.Notice>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: 'ID',
      width: 80,
    },
    {
      field: 'title',
      title: '标题',
      minWidth: 200,
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
      field: 'content',
      title: '内容',
      minWidth: 250,
      showOverflow: true,
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
          nameField: 'title',
          nameTitle: '消息',
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
