import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { NoticeApi } from '#/api/iot/notice';

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
          { label: '通知', value: 'notification' },
          { label: '公告', value: 'announcement' },
          { label: '警告', value: 'alert' },
          { label: '维护', value: 'maintenance' },
          { label: '更新', value: 'update' },
        ],
        placeholder: '请选择类型',
      },
      fieldName: 'type',
      label: '类型',
      rules: 'required',
    },
    {
      component: 'ApiSelect',
      fieldName: 'versionId',
      label: '版本',
      dependencies: {
        triggerFields: ['type'],
        if: (formValues: any) => {
          return formValues.type === 'update';
        },
        componentProps: (formValues: any) => {
          const isUpdate = formValues.type === 'update';
          return {
            placeholder: '请选择版本',
            disabled: !isUpdate,
            api: async () => {
              const { getVersionList } = await import('#/api/iot/version');
              const result = await getVersionList({ pageSize: 100 });
              return (result.items || []).map((version) => ({
                label: `${version.versionCode}_${version.versionName}`,
                value: version.id,
              }));
            },
            resultField: '',
            labelField: 'label',
            valueField: 'value',
            immediate: false,
            dropdownMatchSelectWidth: false,
            dropdownStyle: {
              minWidth: '300px',
            },
          };
        },
      },
    },
    {
      component: 'Select',
      componentProps: {
        options: [
          { label: '低', value: 'low' },
          { label: '普通', value: 'normal' },
          { label: '高', value: 'high' },
          { label: '紧急', value: 'urgent' },
        ],
        placeholder: '请选择优先级',
      },
      defaultValue: 'normal',
      fieldName: 'priority',
      label: '优先级',
    },
    {
      component: 'CheckboxGroup',
      componentProps: {
        options: [
          { label: 'Web', value: 'web' },
          { label: 'App', value: 'app' },
        ],
      },
      defaultValue: ['web'],
      fieldName: 'platforms',
      label: '目标平台',
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
          { label: '通知', value: 'notification' },
          { label: '公告', value: 'announcement' },
          { label: '警告', value: 'alert' },
          { label: '维护', value: 'maintenance' },
          { label: '更新', value: 'update' },
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
          { label: '低', value: 'low' },
          { label: '普通', value: 'normal' },
          { label: '高', value: 'high' },
          { label: '紧急', value: 'urgent' },
        ],
        placeholder: '请选择优先级',
      },
      fieldName: 'priority',
      label: '优先级',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: 'Web', value: 'web' },
          { label: 'Android', value: 'android' },
          { label: 'iOS', value: 'ios' },
        ],
        placeholder: '请选择平台',
      },
      fieldName: 'platform',
      label: '平台',
    },
  ];
}

const typeMap: Record<string, { color: string; text: string }> = {
  notification: { text: '通知', color: 'blue' },
  announcement: { text: '公告', color: 'green' },
  alert: { text: '警告', color: 'orange' },
  maintenance: { text: '维护', color: 'purple' },
  update: { text: '更新', color: 'cyan' },
};

const priorityMap: Record<string, { color: string; text: string }> = {
  low: { text: '低', color: 'default' },
  normal: { text: '普通', color: 'blue' },
  high: { text: '高', color: 'orange' },
  urgent: { text: '紧急', color: 'red' },
};

/** 表格列定义 */
export function useColumns<T = NoticeApi.Notice>(): VxeTableGridOptions['columns'] {
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
      field: 'priority',
      title: '优先级',
      width: 100,
      slots: {
        default: ({ row }) => {
          const priority = priorityMap[row.priority] || {
            text: row.priority,
            color: 'default',
          };
          return h(Tag, { color: priority.color }, () => priority.text);
        },
      },
    },
    {
      field: 'platforms',
      title: '目标平台',
      width: 150,
      slots: {
        default: ({ row }) => {
          if (!row.platforms || row.platforms.length === 0) {
            return h('span', { class: 'text-gray-400' }, '未设置');
          }
          return h(
            'div',
            { class: 'flex gap-1' },
            row.platforms.map((p: string) =>
              h(Tag, { color: p === 'web' ? 'blue' : 'green' }, () => p === 'web' ? 'Web' : 'App'),
            ),
          );
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
      field: 'createdAt',
      title: '创建时间',
      width: 180,
    },
  ];
}
