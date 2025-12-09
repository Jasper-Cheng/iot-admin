<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { FamilyApi } from '#/api/iot/family';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteFamily, getFamilyList } from '#/api/iot/family';

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
    columns: useColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getFamilyList({
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
  } as VxeTableGridOptions<FamilyApi.Family>,
});

function onActionClick(e: OnActionClickParams<FamilyApi.Family>) {
  switch (e.code) {
    case 'delete': {
      onDelete(e.row);
      break;
    }
    case 'edit': {
      onEdit(e.row);
      break;
    }
    case 'view': {
      onView(e.row);
      break;
    }
  }
}

function onEdit(row: FamilyApi.Family) {
  formDrawerApi.setData(row).open();
}

function onView(row: FamilyApi.Family) {
  Modal.info({
    title: `家庭详情 - ${row.name}`,
    content: `
      家庭名称: ${row.name}
      邀请码: ${row.inviteCode || '未设置'}
      描述: ${row.description || '无'}
      成员数: ${row.memberCount || 0}
      设备数: ${row.deviceCount || 0}
      创建时间: ${row.createdAt}
    `,
    width: 500,
  });
}

function onDelete(row: FamilyApi.Family) {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除家庭【${row.name}】吗？此操作将同时删除所有家庭成员关联和设备关联。`,
    okType: 'danger',
    onOk: async () => {
      await deleteFamily(row.id);
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
  <Page auto-content-height title="家庭管理" description="查看和管理所有家庭组">
    <FormDrawer @success="onRefresh" />
    <Grid table-title="家庭列表">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          新增家庭
        </Button>
      </template>
    </Grid>
  </Page>
</template>

