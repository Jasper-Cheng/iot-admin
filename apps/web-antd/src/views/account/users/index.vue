<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { UserApi } from '#/api/iot/user';

import { Page } from '@vben/common-ui';

import { message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getUserList, updateUserStatus } from '#/api/iot/user';

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
  const statusText = newStatus === 'active' ? '启用' : '禁用';
  try {
    await confirm(`确定要${statusText}用户【${row.nickname}】吗？`, '切换状态');
    await updateUserStatus(row.id, newStatus as 'active' | 'disabled');
    message.success(`${statusText}成功`);
    return true;
  } catch {
    return false;
  }
}

function onView(row: UserApi.AppUser) {
  Modal.info({
    title: `用户详情 - ${row.nickname}`,
    content: `
      手机号: ${row.phone}
      设备数: ${row.deviceCount}
      家庭数: ${row.homeCount}
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
