import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { FamilyApi } from '#/api/iot/family';

import { h, markRaw } from 'vue';

import AvatarSelector from './components/avatar-selector.vue';

interface OnActionClickParams<T> {
  code: string;
  row: T;
}

type OnActionClickFn<T> = (e: OnActionClickParams<T>) => void;

/** 表单 Schema - 用于新增/编辑 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '家庭名称',
      rules: 'required',
      componentProps: {
        placeholder: '请输入家庭名称',
      },
    },
    {
      component: 'Input',
      fieldName: 'inviteCode',
      label: '邀请码',
      componentProps: {
        placeholder: '系统自动生成',
        disabled: true,
      },
      dependencies: {
        show: (values) => !!values.id, // 只在编辑时显示
      },
    },
    {
      component: 'Textarea',
      fieldName: 'description',
      label: '家庭描述',
      componentProps: {
        placeholder: '请输入家庭描述（可选）',
        rows: 4,
      },
    },
    {
      component: markRaw(AvatarSelector),
      fieldName: 'avatar',
      label: '头像',
      componentProps: {
        avatars: Array.from({ length: 20 }, (_, i) => `/avatars/family/avatar${i + 1}.png`),
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
      label: '家庭名称',
      componentProps: {
        placeholder: '请输入家庭名称',
        allowClear: true,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'memberId',
      label: '成员ID',
      componentProps: {
        placeholder: '请输入成员ID',
        allowClear: true,
        min: 1,
        style: { width: '100%' },
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'deviceId',
      label: '设备ID',
      componentProps: {
        placeholder: '请输入设备ID',
        allowClear: true,
        min: 1,
        style: { width: '100%' },
      },
    },
  ];
}

/** 表格列定义 */
export function useColumns<T = FamilyApi.Family>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: 'ID',
      width: 80,
    },
    {
      cellRender: {
        name: 'CellImage',
      },
      field: 'avatar',
      title: '头像',
      width: 80,
    },
    {
      field: 'name',
      title: '家庭名称',
      minWidth: 150,
    },
    {
      field: 'inviteCode',
      title: '邀请码',
      width: 150,
      slots: {
        default: ({ row }) =>
          row.inviteCode || h('span', { class: 'text-gray-400' }, '未设置'),
      },
    },
    {
      field: 'description',
      title: '描述',
      minWidth: 200,
      showOverflow: true,
      slots: {
        default: ({ row }) =>
          row.description || h('span', { class: 'text-gray-400' }, '无'),
      },
    },
    {
      field: 'memberCount',
      title: '成员数',
      width: 150,
      slots: {
        default: ({ row }) => {
          const count = row.memberCount || 0;
          const ids = (row as any).memberIds || [];
          if (ids.length > 0) {
            return `${count} (${ids.join(', ')})`;
          }
          return count;
        },
      },
    },
    {
      field: 'deviceCount',
      title: '设备数',
      width: 150,
      slots: {
        default: ({ row }) => {
          const count = row.deviceCount || 0;
          const ids = (row as any).deviceIds || [];
          if (ids.length > 0) {
            return `${count} (${ids.join(', ')})`;
          }
          return count;
        },
      },
    },
    {
      field: 'updatedAt',
      title: '更新时间',
      width: 180,
      slots: {
        default: ({ row }) => row.updatedAt || row.createdAt || '-',
      },
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: '家庭',
          onClick: onActionClick,
          actions: ['edit', 'delete'],
        },
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 120,
    },
  ];
}

