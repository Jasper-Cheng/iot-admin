import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { LogApi } from '#/api/iot/log';

import { h } from 'vue';

import { Tag } from 'ant-design-vue';

/** 搜索表单 Schema */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'accountId',
      label: '账户ID',
      componentProps: {
        placeholder: '请输入账户ID',
        allowClear: true,
      },
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: '登录', value: 'login' },
          { label: '登出', value: 'logout' },
          { label: '注册', value: 'register' },
          { label: '绑定设备', value: 'device_bind' },
          { label: '解绑设备', value: 'device_unbind' },
          { label: '创建家庭', value: 'family_create' },
          { label: '删除家庭', value: 'family_delete' },
          { label: '快速控制', value: 'quick_control' },
          { label: '创建反馈', value: 'feedback_create' },
          { label: '其他', value: 'other' },
        ],
        placeholder: '请选择操作类型',
      },
      fieldName: 'operationType',
      label: '操作类型',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: '用户', value: 'user' },
          { label: '管理员', value: 'admin' },
        ],
        placeholder: '请选择角色',
      },
      fieldName: 'role',
      label: '角色',
    },
  ];
}

const operationTypeMap: Record<string, { color: string; text: string }> = {
  login: { text: '登录', color: 'blue' },
  logout: { text: '登出', color: 'default' },
  register: { text: '注册', color: 'green' },
  account_delete: { text: '删除账户', color: 'red' },
  account_update: { text: '更新账户', color: 'orange' },
  device_bind: { text: '绑定设备', color: 'cyan' },
  device_unbind: { text: '解绑设备', color: 'orange' },
  device_name_update: { text: '更新设备名', color: 'blue' },
  device_add_to_family: { text: '添加设备到家庭', color: 'green' },
  device_remove_from_family: { text: '从家庭移除设备', color: 'orange' },
  family_create: { text: '创建家庭', color: 'green' },
  family_delete: { text: '删除家庭', color: 'red' },
  family_member_add: { text: '添加家庭成员', color: 'cyan' },
  family_member_remove: { text: '移除家庭成员', color: 'orange' },
  quick_control: { text: '快速控制', color: 'blue' },
  feedback_create: { text: '创建反馈', color: 'purple' },
  feedback_reply: { text: '回复反馈', color: 'purple' },
  other: { text: '其他', color: 'default' },
};

/** 表格列定义 */
export function useColumns<T = LogApi.OperationLog>(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: 'ID',
      width: 80,
    },
    {
      field: 'accountId',
      title: '账户ID',
      width: 100,
    },
    {
      field: 'accountName',
      title: '账户名称',
      minWidth: 120,
      slots: {
        default: ({ row }) =>
          row.accountName || h('span', { class: 'text-gray-400' }, `用户${row.accountId}`),
      },
    },
    {
      field: 'operationType',
      title: '操作类型',
      width: 120,
      slots: {
        default: ({ row }) => {
          const type = operationTypeMap[row.operationType] || {
            text: row.operationType,
            color: 'default',
          };
          return h(Tag, { color: type.color }, () => type.text);
        },
      },
    },
    {
      field: 'description',
      title: '描述',
      minWidth: 200,
      showOverflow: true,
    },
    {
      field: 'role',
      title: '角色',
      width: 80,
      slots: {
        default: ({ row }) => {
          if (!row.role) return h('span', { class: 'text-gray-400' }, '-');
          return row.role === 'admin'
            ? h(Tag, { color: 'red' }, () => '管理员')
            : h(Tag, { color: 'blue' }, () => '用户');
        },
      },
    },
    {
      field: 'createdAt',
      title: '创建时间',
      width: 180,
    },
  ];
}
