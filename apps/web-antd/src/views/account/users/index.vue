<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { UserApi } from '#/api/iot/user';

interface OnActionClickParams<T> {
  code: string;
  row: T;
}

import { Page, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteUser, getUserList } from '#/api/iot/user';

import { useColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

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
    case 'edit': {
      onEdit(e.row);
      break;
    }
    case 'delete': {
      onDelete(e.row);
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

function onEdit(row: UserApi.AppUser) {
  formDrawerApi.setData(row).open();
}

function onDelete(row: UserApi.AppUser) {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除用户【${row.nickname}】吗？`,
    okType: 'danger',
    onOk: async () => {
      await deleteUser(row.id);
      message.success('删除成功');
      onRefresh();
    },
  });
}

function onRefresh() {
  gridApi.query();
}

function onCreate() {
  formDrawerApi.setData({}).open();
}
</script>

<template>
  <Page auto-content-height title="用户管理" description="管理 App 用户">
    <FormDrawer @success="onRefresh" />
    <Grid table-title="用户列表">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          新增用户
        </Button>
      </template>
    </Grid>
  </Page>
</template>
