import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { UserApi } from '#/api/iot/user';

import { h } from 'vue';

import { Tag } from 'ant-design-vue';

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
      component: 'Input',
      fieldName: 'email',
      label: '邮箱',
      componentProps: {
        placeholder: '请输入邮箱',
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
      field: 'deviceCount',
      title: '设备数',
      width: 100,
    },
    {
      field: 'familyCount',
      title: '家庭数',
      width: 100,
    },
    {
      field: 'email',
      title: '邮箱',
      minWidth: 180,
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
      title: '注册时间',
      width: 180,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'nickname',
          nameTitle: '用户',
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
