<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

interface Member {
  id: number;
  userId: number;
  userName: string;
  homeId: number;
  homeName: string;
  role: string;
  nickname: string;
  phone: string;
  createdAt: string;
}

// Mock 数据 - 成员管理
const mockMembers: Member[] = [
  {
    id: 1,
    userId: 1,
    userName: '张三',
    homeId: 1,
    homeName: '我的家',
    role: 'owner',
    nickname: '户主',
    phone: '13900139000',
    createdAt: '2024-01-10 08:00:00',
  },
  {
    id: 2,
    userId: 5,
    userName: '张三妈妈',
    homeId: 1,
    homeName: '我的家',
    role: 'admin',
    nickname: '妈妈',
    phone: '13900139005',
    createdAt: '2024-02-15 10:00:00',
  },
  {
    id: 3,
    userId: 6,
    userName: '张三爸爸',
    homeId: 1,
    homeName: '我的家',
    role: 'member',
    nickname: '爸爸',
    phone: '13900139006',
    createdAt: '2024-02-15 10:00:00',
  },
  {
    id: 4,
    userId: 2,
    userName: '李四',
    homeId: 2,
    homeName: '李四的家',
    role: 'owner',
    nickname: '户主',
    phone: '13900139001',
    createdAt: '2024-02-20 14:00:00',
  },
];

const gridFormSchema = [
  {
    component: 'Input',
    fieldName: 'userName',
    label: '用户名',
    componentProps: {
      placeholder: '请输入用户名',
      allowClear: true,
    },
  },
  {
    component: 'Input',
    fieldName: 'homeName',
    label: '家庭名称',
    componentProps: {
      placeholder: '请输入家庭名称',
      allowClear: true,
    },
  },
  {
    component: 'Select',
    componentProps: {
      allowClear: true,
      options: [
        { label: '户主', value: 'owner' },
        { label: '管理员', value: 'admin' },
        { label: '成员', value: 'member' },
      ],
      placeholder: '请选择角色',
    },
    fieldName: 'role',
    label: '角色',
  },
];

const roleMap: Record<string, { color: string; text: string }> = {
  owner: { text: '户主', color: 'gold' },
  admin: { text: '管理员', color: 'blue' },
  member: { text: '成员', color: 'default' },
};

const [Grid] = useVbenVxeGrid({
  formOptions: {
    schema: gridFormSchema,
    submitOnChange: true,
  },
  gridOptions: {
    columns: [
      { field: 'id', title: 'ID', width: 80 },
      { field: 'userName', title: '用户名', minWidth: 120 },
      { field: 'homeName', title: '家庭名称', minWidth: 120 },
      {
        field: 'role',
        title: '角色',
        width: 100,
        formatter: ({ cellValue }) => roleMap[cellValue]?.text || cellValue,
      },
      { field: 'nickname', title: '昵称', minWidth: 100 },
      { field: 'phone', title: '手机号', width: 140 },
      { field: 'createdAt', title: '加入时间', width: 180 },
    ],
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => {
          // Mock 分页
          const pageSize = page.pageSize || 10;
          const currentPage = page.currentPage || 1;
          const start = (currentPage - 1) * pageSize;
          const end = start + pageSize;
          return {
            items: mockMembers.slice(start, end),
            total: mockMembers.length,
          };
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
    toolbarConfig: {
      refresh: true,
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<Member>,
});
</script>

<template>
  <Page auto-content-height title="成员管理" description="查看家庭成员信息">
    <Grid table-title="成员列表" />
  </Page>
</template>
