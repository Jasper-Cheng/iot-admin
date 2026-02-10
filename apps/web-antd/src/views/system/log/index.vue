<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { LogApi } from '#/api/iot/log';

import { Page } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getLogList } from '#/api/iot/log';

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
          // 过滤空值，避免后端 422
          const filtered = Object.fromEntries(
            Object.entries(formValues || {}).filter(
              ([, v]) => v !== '' && v !== null && v !== undefined,
            ),
          );
          const res = await getLogList({
            page: page.currentPage,
            pageSize: page.pageSize,
            ...filtered,
          });
          return {
            items: res.items || [],
            total: res.total || 0,
          };
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
  } as VxeTableGridOptions<LogApi.OperationLog>,
});
</script>

<template>
  <Page
    auto-content-height
    title="操作日志"
    description="查看系统操作日志记录"
  >
    <Grid table-title="日志列表" />
  </Page>
</template>
