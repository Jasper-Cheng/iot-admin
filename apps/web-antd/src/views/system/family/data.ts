import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { FamilyApi } from '#/api/iot/family';

import { h } from 'vue';

import { Tag } from 'ant-design-vue';

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
        placeholder: '请输入邀请码（可选，系统可自动生成）',
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
      component: 'Input',
      fieldName: 'avatar',
      label: '家庭头像URL',
      componentProps: {
        placeholder: '请输入头像URL（可选）',
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
      component: 'Input',
      fieldName: 'inviteCode',
      label: '邀请码',
      componentProps: {
        placeholder: '请输入邀请码',
        allowClear: true,
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
      width: 100,
      slots: {
        default: ({ row }) => row.memberCount || 0,
      },
    },
    {
      field: 'deviceCount',
      title: '设备数',
      width: 100,
      slots: {
        default: ({ row }) => row.deviceCount || 0,
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
          nameTitle: '家庭',
          onClick: onActionClick,
          actions: ['view', 'edit', 'delete'],
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

