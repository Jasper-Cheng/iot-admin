<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { DeviceApi } from '#/api/iot/device';

import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteDevice, getDeviceList } from '#/api/iot/device';

import { useColumns, useGridFormSchema } from './data';

const router = useRouter();

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
          return await getDeviceList({
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
      export: true,
      refresh: true,
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<DeviceApi.Device>,
});

function onActionClick(e: OnActionClickParams<DeviceApi.Device>) {
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

function onView(row: DeviceApi.Device) {
  router.push(`/device/detail/${row.id}`);
}

function onEdit(row: DeviceApi.Device) {
  router.push(`/device/detail/${row.id}?tab=basic`);
}

function onDelete(row: DeviceApi.Device) {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除设备【${row.name}】吗？此操作不可恢复。`,
    okType: 'danger',
    onOk: async () => {
      await deleteDevice(row.id);
      message.success('删除成功');
      onRefresh();
    },
  });
}

function onRefresh() {
  gridApi.query();
}
</script>

<template>
  <Page auto-content-height title="设备列表" description="查看和管理所有设备">
    <Grid table-title="设备列表" />
  </Page>
</template>
