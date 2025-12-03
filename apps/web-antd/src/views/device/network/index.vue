<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { DeviceApi } from '#/api/iot/device';

import { Page } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getDeviceNetworkList } from '#/api/iot/device';

import { useColumns, useGridFormSchema } from './data';

const [Grid] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: true,
  },
  gridOptions: {
    columns: useColumns(),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getDeviceNetworkList({
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
  } as VxeTableGridOptions<DeviceApi.NetworkInfo>,
});
</script>

<template>
  <Page auto-content-height title="网络信息" description="查看设备网络连接状态">
    <Grid table-title="网络信息列表" />
  </Page>
</template>
