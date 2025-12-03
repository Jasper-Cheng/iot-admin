<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { AccountApi } from '#/api/iot/account';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteAdmin, getAdminList, updateAdmin } from '#/api/iot/account';

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
          return await getAdminList({
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
  } as VxeTableGridOptions<AccountApi.Admin>,
});

function onActionClick(e: OnActionClickParams<AccountApi.Admin>) {
  switch (e.code) {
    case 'delete': {
      onDelete(e.row);
      break;
    }
    case 'edit': {
      onEdit(e.row);
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

async function onStatusChange(newStatus: string, row: AccountApi.Admin) {
  const statusText = newStatus === 'active' ? '启用' : '禁用';
  try {
    await confirm(
      `确定要${statusText}管理员【${row.realName}】吗？`,
      '切换状态',
    );
    await updateAdmin(row.id, { status: newStatus as 'active' | 'disabled' });
    return true;
  } catch {
    return false;
  }
}

function onEdit(row: AccountApi.Admin) {
  formDrawerApi.setData(row).open();
}

function onDelete(row: AccountApi.Admin) {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除管理员【${row.realName}】吗？`,
    okType: 'danger',
    onOk: async () => {
      await deleteAdmin(row.id);
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
  <Page auto-content-height title="管理员管理" description="管理系统管理员账号">
    <FormDrawer @success="onRefresh" />
    <Grid table-title="管理员列表">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          新增管理员
        </Button>
      </template>
    </Grid>
  </Page>
</template>
