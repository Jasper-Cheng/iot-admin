<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { VersionApi } from '#/api/iot/version';

interface OnActionClickParams<T> {
  code: string;
  row: T;
}

import { Page, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteVersion, getVersionList } from '#/api/iot/version';

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
          return await getVersionList({
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
  } as VxeTableGridOptions<VersionApi.AppVersion>,
});

function onActionClick(e: OnActionClickParams<VersionApi.AppVersion>) {
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

function onEdit(row: VersionApi.AppVersion) {
  formDrawerApi.setData(row).open();
}

function onDelete(row: VersionApi.AppVersion) {
  if (row.status === 'published') {
    Modal.warning({
      title: '无法删除',
      content: `版本【${row.version}】已发布，无法删除`,
    });
    return;
  }
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除版本【${row.version}】吗？`,
    okType: 'danger',
    onOk: async () => {
      await deleteVersion(row.id);
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
  <Page auto-content-height title="版本管理" description="管理 App 版本发布">
    <FormDrawer @success="onRefresh" />
    <Grid table-title="版本列表">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          新增版本
        </Button>
      </template>
    </Grid>
  </Page>
</template>
