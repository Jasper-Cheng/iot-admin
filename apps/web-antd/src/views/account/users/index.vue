<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { UserApi } from '#/api/iot/user';

interface OnActionClickParams<T> {
  code: string;
  row: T;
}

import { Page } from '@vben/common-ui';

import { message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getUserList } from '#/api/iot/user';

import { useColumns, useGridFormSchema } from './data';

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: true,
  },
  gridOptions: {
    columns: useColumns(onActionClick, onStatusChange),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getUserList({
            page: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: true,
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<UserApi.AppUser>,
});

function onActionClick(e: OnActionClickParams<UserApi.AppUser>) {
  switch (e.code) {
    case 'view': {
      onView(e.row);
      break;
    }
  }
}

function confirm(content: string, title: string) {
  return new Promise((resolve, reject) => {
    Modal.confirm({
      content,
      onCancel() {
        reject(new Error('已取消'));
      },
      onOk() {
        resolve(true);
      },
      title,
    });
  });
}

async function onStatusChange(newStatus: string, row: UserApi.AppUser) {
  // 注意：新数据结构中没有 status 字段，此函数保留用于兼容性，但实际不会调用
  return false;
}

function onView(row: UserApi.AppUser) {
  Modal.info({
    title: `用户详情 - ${row.nickname}`,
    content: `
      手机号: ${row.phone}
      邮箱: ${row.email || '未设置'}
      性别: ${row.gender === 'male' ? '男' : row.gender === 'female' ? '女' : '其他'}
      角色: ${row.role === 'admin' ? '管理员' : '普通用户'}
      设备数: ${row.deviceCount || 0}
      家庭数: ${row.familyCount || 0}
      注册时间: ${row.createdAt}
    `,
    width: 500,
  });
}

function onRefresh() {
  gridApi.query();
}
</script>

<template>
  <Page auto-content-height title="用户管理" description="管理 App 用户">
    <Grid table-title="用户列表" />
  </Page>
</template>
