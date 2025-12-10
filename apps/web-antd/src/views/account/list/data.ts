import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { AccountApi } from '#/api/iot/account';

import { h } from 'vue';

import { Tag } from 'ant-design-vue';

import { z } from '#/adapter/form';

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
      component: 'InputPassword',
      fieldName: 'confirmPassword',
      label: '确认密码',
      componentProps: {
        placeholder: '请再次输入密码',
      },
      dependencies: {
        show: (values) => !values.id,
        rules: (values) => {
          if (values.id) return [];
          const { password } = values;
          return z
            .string({ required_error: '请再次输入密码' })
            .min(1, { message: '请再次输入密码' })
            .refine((value) => value === password, {
              message: '两次输入的密码不一致',
            });
        },
        triggerFields: ['password'],
      },
    },
    {
      component: 'Upload',
      fieldName: 'avatar',
      label: '头像',
      componentProps: {
        listType: 'picture-card',
        maxCount: 1,
        accept: 'image/*',
        beforeUpload: () => false, // 阻止自动上传，手动处理
      },
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
      field: 'password',
      title: '密码',
      width: 120,
      slots: {
        default: ({ row }) => row.password || '-',
      },
    },
    {
      field: 'email',
      title: '邮箱',
      minWidth: 180,
      slots: {
        default: ({ row }) => row.email || '-',
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
