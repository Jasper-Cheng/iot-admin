import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { FeedbackApi } from '#/api/iot/feedback';

import { h } from 'vue';

import { Image, Space, Tag } from 'ant-design-vue';

/** 搜索表单 Schema */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'userName',
      label: '用户',
      componentProps: {
        placeholder: '请输入用户名',
        allowClear: true,
      },
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: 'Bug反馈', value: 'bug' },
          { label: '功能建议', value: 'suggestion' },
          { label: '投诉', value: 'complaint' },
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
        ],
        placeholder: '请选择状态',
      },
      fieldName: 'status',
      label: '状态',
    },
  ];
}

const typeMap: Record<string, { color: string; text: string }> = {
  bug: { text: 'Bug反馈', color: 'red' },
  suggestion: { text: '功能建议', color: 'blue' },
  complaint: { text: '投诉', color: 'orange' },
  other: { text: '其他', color: 'default' },
};

const statusMap: Record<string, { color: string; text: string }> = {
  pending: { text: '待处理', color: 'default' },
  processing: { text: '处理中', color: 'processing' },
  resolved: { text: '已解决', color: 'success' },
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
      field: 'userName',
      title: '用户',
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
      field: 'title',
      title: '标题',
      minWidth: 150,
    },
    {
      field: 'content',
      title: '内容',
      minWidth: 200,
      showOverflow: true,
    },
    {
      field: 'images',
      title: '图片',
      width: 120,
      slots: {
        default: ({ row }) => {
          if (!row.images || row.images.length === 0) {
            return h('span', { class: 'text-gray-400' }, '无');
          }
          return h(Space, {}, () =>
            row.images
              .slice(0, 2)
              .map((img: string) =>
                h(Image, { src: img, width: 40, height: 40 }),
              ),
          );
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
      field: 'reply',
      title: '回复',
      width: 150,
      showOverflow: true,
      slots: {
        default: ({ row }) =>
          row.reply || h('span', { class: 'text-gray-400' }, '未回复'),
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
        ],
        optionType: 'button',
      },
      fieldName: 'status',
      label: '状态',
      rules: 'required',
    },
    {
      component: 'Textarea',
      fieldName: 'reply',
      label: '回复内容',
      rules: 'required',
      componentProps: {
        placeholder: '请输入回复内容',
        rows: 4,
      },
    },
  ];
}
