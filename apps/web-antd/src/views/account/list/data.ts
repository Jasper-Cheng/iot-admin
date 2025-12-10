import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { AccountApi } from '#/api/iot/account';

import { h } from 'vue';

import { Tag } from 'ant-design-vue';

/** 表单 Schema - 用于新增/编辑 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'nickname',
      label: '昵称',
      rules: 'required',
      componentProps: {
        placeholder: '请输入昵称',
      },
    },
    {
      component: 'Input',
      fieldName: 'phone',
      label: '手机号',
      rules: 'required',
      componentProps: {
        placeholder: '请输入手机号',
      },
    },
    {
      component: 'Input',
      fieldName: 'email',
      label: '邮箱',
      rules: 'email',
      componentProps: {
        placeholder: '请输入邮箱（可选）',
      },
    },
    {
      component: 'InputPassword',
      fieldName: 'password',
      label: '密码',
      componentProps: {
        placeholder: '请输入密码',
      },
      dependencies: {
        show: (values) => !values.id,
        rules: (values) => (values.id ? [] : ['required']),
      },
    },
    {
      component: 'Select',
      componentProps: {
        options: [
          { label: '管理员', value: 'admin' },
          { label: '普通用户', value: 'user' },
        ],
        placeholder: '请选择角色',
      },
      defaultValue: 'admin',
      fieldName: 'role',
      label: '角色',
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        options: [
          { label: '男', value: 'male' },
          { label: '女', value: 'female' },
          { label: '其他', value: 'other' },
        ],
        placeholder: '请选择性别',
      },
      defaultValue: 'other',
      fieldName: 'gender',
      label: '性别',
    },
  ];
}

/** 搜索表单 Schema */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'nickname',
      label: '昵称',
      componentProps: {
        placeholder: '请输入昵称',
        allowClear: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'phone',
      label: '手机号',
      componentProps: {
        placeholder: '请输入手机号',
        allowClear: true,
      },
    },
  ];
}

/** 表格列定义 */
export function useColumns<T = AccountApi.Admin>(
  onActionClick: OnActionClickFn<T>,
  onStatusChange?: (
    newStatus: string,
    row: T,
  ) => PromiseLike<boolean | undefined>,
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
      field: 'nickname',
      title: '昵称',
      minWidth: 120,
    },
    {
      field: 'phone',
      title: '手机号',
      width: 140,
    },
    {
      field: 'email',
      title: '邮箱',
      minWidth: 180,
    },
    {
      field: 'role',
      title: '角色',
      width: 100,
      slots: {
        default: ({ row }) => {
          const roleText = row.role === 'admin' ? '管理员' : '普通用户';
          const roleColor = row.role === 'admin' ? 'red' : 'blue';
          return h(Tag, { color: roleColor }, () => roleText);
        },
      },
    },
    {
      field: 'gender',
      title: '性别',
      width: 80,
      slots: {
        default: ({ row }) => {
          const genderMap: Record<string, string> = {
            male: '男',
            female: '女',
            other: '其他',
          };
          return genderMap[row.gender] || '其他';
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
          nameField: 'nickname',
          nameTitle: '管理员',
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
