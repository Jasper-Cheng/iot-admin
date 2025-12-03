import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { UserApi } from '#/api/iot/user';

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
          { label: '正常', value: 'active' },
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
      field: 'homeCount',
      title: '家庭数',
      width: 100,
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
      field: 'lastActiveTime',
      title: '最后活跃',
      width: 180,
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
