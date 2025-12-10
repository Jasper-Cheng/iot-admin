import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { FeedbackApi } from '#/api/iot/feedback';

import { h } from 'vue';

import { Image, Space, Tag } from 'ant-design-vue';

interface OnActionClickParams<T> {
  code: string;
  row: T;
}

type OnActionClickFn<T> = (e: OnActionClickParams<T>) => void;

/** 搜索表单 Schema */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'accountName',
      label: '用户',
      componentProps: {
        placeholder: '请输入用户名',
        allowClear: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: '反馈人姓名',
      componentProps: {
        placeholder: '请输入反馈人姓名',
        allowClear: true,
      },
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: 'Bug反馈', value: 'bug' },
          { label: '功能建议', value: 'feature' },
          { label: '改进建议', value: 'improvement' },
          { label: '投诉', value: 'complaint' },
          { label: '表扬', value: 'praise' },
          { label: '其他', value: 'other' },
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
          { label: '待处理', value: 'pending' },
          { label: '处理中', value: 'processing' },
          { label: '已解决', value: 'resolved' },
          { label: '已拒绝', value: 'rejected' },
          { label: '已关闭', value: 'closed' },
        ],
        placeholder: '请选择状态',
      },
      fieldName: 'status',
      label: '状态',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: 'Web', value: 'web' },
          { label: 'App', value: 'app' },
        ],
        placeholder: '请选择来源',
      },
      fieldName: 'source',
      label: '来源',
    },
  ];
}

const typeMap: Record<string, { color: string; text: string }> = {
  bug: { text: 'Bug反馈', color: 'red' },
  feature: { text: '功能建议', color: 'blue' },
  improvement: { text: '改进建议', color: 'cyan' },
  complaint: { text: '投诉', color: 'orange' },
  praise: { text: '表扬', color: 'green' },
  other: { text: '其他', color: 'default' },
};

const statusMap: Record<string, { color: string; text: string }> = {
  pending: { text: '待处理', color: 'default' },
  processing: { text: '处理中', color: 'processing' },
  resolved: { text: '已解决', color: 'success' },
  rejected: { text: '已拒绝', color: 'error' },
  closed: { text: '已关闭', color: 'default' },
};

/** 表格列定义 */
export function useColumns<T = FeedbackApi.Feedback>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: 'ID',
      width: 80,
    },
    {
      field: 'accountName',
      title: '用户',
      width: 100,
    },
    {
      field: 'name',
      title: '反馈人',
      width: 100,
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
      title: '反馈内容',
      minWidth: 200,
      showOverflow: true,
    },
    {
      field: 'source',
      title: '来源',
      width: 80,
      slots: {
        default: ({ row }) => {
          const sourceText = row.source === 'web' ? 'Web' : 'App';
          const sourceColor = row.source === 'web' ? 'blue' : 'green';
          return h(Tag, { color: sourceColor }, () => sourceText);
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
      field: 'replay',
      title: '回复',
      width: 150,
      showOverflow: true,
      slots: {
        default: ({ row }) =>
          row.replay || h('span', { class: 'text-gray-400' }, '未回复'),
      },
    },
    {
      field: 'createdAt',
      title: '提交时间',
      width: 180,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'title',
          nameTitle: '反馈',
          onClick: onActionClick,
          actions: ['view'],
        },
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 100,
    },
  ];
}

/** 回复表单 Schema */
export function useReplyFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: '处理中', value: 'processing' },
          { label: '已解决', value: 'resolved' },
          { label: '已拒绝', value: 'rejected' },
          { label: '已关闭', value: 'closed' },
        ],
        optionType: 'button',
      },
      fieldName: 'status',
      label: '状态',
      rules: 'required',
    },
    {
      component: 'Textarea',
      fieldName: 'replay',
      label: '回复内容',
      rules: 'required',
      componentProps: {
        placeholder: '请输入回复内容',
        rows: 4,
      },
    },
  ];
}
