<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { PointsApi } from '#/api/iot/points';

interface OnActionClickParams<T> {
  code: string;
  row: T;
}

import { Page, useVbenDrawer } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getPointsList } from '#/api/iot/points';

import { useColumns, useGridFormSchema } from './data';
import DetailDrawer from './modules/detail.vue'; // eslint-disable-line
import CheckinDrawer from './modules/checkin.vue'; // eslint-disable-line
import AdjustDrawer from './modules/adjust.vue'; // eslint-disable-line

const [DetailDrawerComponent, detailDrawerApi] = useVbenDrawer({
  connectedComponent: DetailDrawer,
  destroyOnClose: true,
});

const [CheckinDrawerComponent, checkinDrawerApi] = useVbenDrawer({
  connectedComponent: CheckinDrawer,
  destroyOnClose: true,
});

const [AdjustDrawerComponent, adjustDrawerApi] = useVbenDrawer({
  connectedComponent: AdjustDrawer,
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
          return await getPointsList({
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
  } as VxeTableGridOptions<PointsApi.PointsRecord>,
});

function onActionClick(e: OnActionClickParams<PointsApi.PointsRecord>) {
  switch (e.code) {
    case 'detail': {
      onViewDetail(e.row);
      break;
    }
    case 'checkin': {
      onViewCheckin(e.row);
      break;
    }
    case 'adjust': {
      onAdjust(e.row);
      break;
    }
  }
}

function onViewDetail(row: PointsApi.PointsRecord) {
  detailDrawerApi.setData({ accountId: row.accountId }).open();
}

function onViewCheckin(row: PointsApi.PointsRecord) {
  checkinDrawerApi.setData({ accountId: row.accountId }).open();
}

function onAdjust(row: PointsApi.PointsRecord) {
  adjustDrawerApi.setData({ accountId: row.accountId }).open();
}

function onRefresh() {
  gridApi.query();
}
</script>

<template>
  <Page auto-content-height title="积分管理" description="查看和管理用户积分记录">
    <DetailDrawerComponent @success="onRefresh" />
    <CheckinDrawerComponent @success="onRefresh" />
    <AdjustDrawerComponent @success="onRefresh" />
    <Grid table-title="积分记录列表" />
  </Page>
</template>

