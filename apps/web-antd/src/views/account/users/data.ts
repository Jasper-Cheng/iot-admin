import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { UserApi } from '#/api/iot/user';

interface OnActionClickParams<T> {
  code: string;
  row: T;
}

type OnActionClickFn<T> = (e: OnActionClickParams<T>) => void;

import { h } from 'vue';

import { Tag } from 'ant-design-vue';

import { z } from '#/adapter/form';

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
      component: 'Select',
      fieldName: 'avatar',
      label: '头像',
      componentProps: {
        placeholder: '请选择头像',
        allowClear: true,
        options: Array.from({ length: 20 }, (_, i) => ({
          label: `头像 ${i + 1}`,
          value: `/avatars/avatar${i + 1}.png`,
        })),
      },
      suffix: ({ formValues }: { formValues: any }) => {
        const avatarPath = formValues?.avatar;
        if (!avatarPath) return null;
        return h('img', {
          src: avatarPath,
          style: 'width: 48px; height: 48px; border-radius: 4px; object-fit: cover; margin-left: 8px;',
          onError: (e: Event) => {
            (e.target as HTMLImageElement).src = '/avatars/no-avatar.png';
          },
        });
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
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: '男', value: 'male' },
          { label: '女', value: 'female' },
          { label: '其他', value: 'other' },
        ],
        placeholder: '请选择性别',
      },
      fieldName: 'gender',
      label: '性别',
    },
  ];
}

/** 表格列定义 */
export function useColumns<T = UserApi.AppUser>(
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
      width: 70,
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
        default: ({ row }) => (row as any).password || '-',
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
      field: 'currentFamilyName',
      title: '当前家庭名称',
      width: 150,
      slots: {
        default: ({ row }) => (row as any).currentFamilyName || '-',
      },
    },
    {
      field: 'deviceCount',
      title: '设备数',
      width: 100,
      slots: {
        default: ({ row }) => row.deviceCount ?? 0,
      },
    },
    {
      field: 'familyCount',
      title: '家庭数',
      width: 100,
      slots: {
        default: ({ row }) => row.familyCount ?? 0,
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
          nameTitle: '用户',
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
