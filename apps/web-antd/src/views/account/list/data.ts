import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { AccountApi } from '#/api/iot/account';

/** 表单 Schema - 用于新增/编辑 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'username',
      label: '用户名',
      rules: 'required',
      componentProps: {
        placeholder: '请输入用户名',
      },
    },
    {
      component: 'Input',
      fieldName: 'realName',
      label: '真实姓名',
      rules: 'required',
      componentProps: {
        placeholder: '请输入真实姓名',
      },
    },
    {
      component: 'Input',
      fieldName: 'email',
      label: '邮箱',
      rules: 'required|email',
      componentProps: {
        placeholder: '请输入邮箱',
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
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: '启用', value: 'active' },
          { label: '禁用', value: 'disabled' },
        ],
        optionType: 'button',
      },
      defaultValue: 'active',
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
      fieldName: 'username',
      label: '用户名',
      componentProps: {
        placeholder: '请输入用户名',
        allowClear: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'realName',
      label: '真实姓名',
      componentProps: {
        placeholder: '请输入真实姓名',
        allowClear: true,
      },
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: '启用', value: 'active' },
          { label: '禁用', value: 'disabled' },
        ],
        placeholder: '请选择状态',
      },
      fieldName: 'status',
      label: '状态',
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
      field: 'username',
      title: '用户名',
      minWidth: 120,
    },
    {
      field: 'realName',
      title: '真实姓名',
      minWidth: 120,
    },
    {
      field: 'email',
      title: '邮箱',
      minWidth: 180,
    },
    {
      field: 'phone',
      title: '手机号',
      width: 140,
    },
    {
      cellRender: {
        attrs: {
          beforeChange: onStatusChange,
          checkedValue: 'active',
          unCheckedValue: 'disabled',
        },
        name: onStatusChange ? 'CellSwitch' : 'CellTag',
      },
      field: 'status',
      title: '状态',
      width: 100,
    },
    {
      field: 'lastLoginTime',
      title: '最后登录',
      width: 180,
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
          nameField: 'realName',
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
