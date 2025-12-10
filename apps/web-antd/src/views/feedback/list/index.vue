<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { FeedbackApi } from '#/api/iot/feedback';

interface OnActionClickParams<T> {
  code: string;
  row: T;
}

import { Page, useVbenModal } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getFeedbackList } from '#/api/iot/feedback';

import { useColumns, useGridFormSchema } from './data';
import ReplyModal from './modules/reply-modal.vue';

const [ReplyModalComponent, replyModalApi] = useVbenModal({
  connectedComponent: ReplyModal,
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
          return await getFeedbackList({
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
  } as VxeTableGridOptions<FeedbackApi.Feedback>,
});

function onActionClick(e: OnActionClickParams<FeedbackApi.Feedback>) {
  switch (e.code) {
    case 'view': {
      onView(e.row);
      break;
    }
  }
}

function onView(row: FeedbackApi.Feedback) {
  replyModalApi.setData(row).open();
}

function onRefresh() {
  gridApi.query();
}
</script>

<template>
  <Page auto-content-height title="意见反馈" description="处理用户反馈和建议">
    <ReplyModalComponent @success="onRefresh" />
    <Grid table-title="反馈列表" />
  </Page>
</template>
