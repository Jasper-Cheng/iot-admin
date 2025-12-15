import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { PointsApi } from '#/api/iot/points';

import { h } from 'vue';

interface OnActionClickParams<T> {
  code: string;
  row: T;
}

type OnActionClickFn<T> = (e: OnActionClickParams<T>) => void;

/** 积分类型映射 */
export const POINTS_TYPE_MAP: Record<string, string> = {
  check_in: '签到奖励',
  task: '任务奖励',
  reward: '活动奖励',
  exchange: '积分兑换',
  penalty: '违规扣除',
  admin_adjust: '管理员调整',
};

/** 搜索表单 Schema */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'InputNumber',
      fieldName: 'accountId',
      label: '用户ID',
      componentProps: {
        placeholder: '请输入用户ID',
        allowClear: true,
        min: 1,
        style: { width: '100%' },
      },
    },
  ];
}

/** 表格列定义 */
export function useColumns<T = PointsApi.PointsRecord>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: 'ID',
      width: 100,
    },
    {
      field: 'accountId',
      title: '用户ID',
      width: 100,
    },
    {
      field: 'accountName',
      title: '用户名称',
      minWidth: 150,
      slots: {
        default: ({ row }) =>
          row.accountName || h('span', { class: 'text-gray-400' }, '未知'),
      },
    },
    {
      field: 'accountPhone',
      title: '手机号',
      width: 130,
    },
    {
      field: 'balance',
      title: '积分余额',
      width: 120,
      slots: {
        default: ({ row }) =>
          h('span', { class: 'font-medium' }, row.balance),
      },
    },
    {
      field: 'type',
      title: '类型',
      width: 120,
      slots: {
        default: ({ row }) =>
          POINTS_TYPE_MAP[row.type] || row.type,
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
      field: 'createdAt',
      title: '时间',
      width: 180,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'accountName',
          nameTitle: '用户',
          onClick: onActionClick,
          actions: ['detail', 'checkin', 'adjust'],
        },
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: '操作',
      minWidth: 120,
    },
  ];
}

