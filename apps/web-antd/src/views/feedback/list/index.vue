<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { FeedbackApi } from '#/api/iot/feedback';

interface OnActionClickParams<T> {
  code: string;
  row: T;
}

import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getFeedbackList } from '#/api/iot/feedback';

import { useColumns, useGridFormSchema } from './data';
import ReplyModal from './modules/reply-modal.vue';

const route = useRoute();

// 从URL参数中获取表单值
const getFormValuesFromQuery = () => {
  const query = route.query;
  const formValues: Record<string, any> = {};
  
  if (query.status) {
    formValues.status = query.status as string;
  }
  
  return formValues;
};

// 检查是否有URL查询参数
const hasQueryParams = computed(() => {
  const query = route.query;
  return !!query.status;
});

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
      autoLoad: !hasQueryParams.value, // 如果有查询参数，禁用自动加载
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

// 监听路由查询参数变化，更新表单值并触发查询
watch(
  () => route.query,
  () => {
    const values = getFormValuesFromQuery();
    
    // 更新表单值
    if (Object.keys(values).length > 0) {
      gridApi.formApi.setValues(values);
      // 延迟触发查询，确保表单值已更新
      setTimeout(() => {
        gridApi.reload();
      }, 100);
    } else {
      // 如果查询参数为空，清空表单并重新查询
      gridApi.formApi.setValues({});
      gridApi.reload();
    }
  },
  { immediate: false },
);

// 页面加载时，如果有查询参数，自动设置表单值（submitOnChange 会自动触发查询）
onMounted(async () => {
  const initialValues = getFormValuesFromQuery();
  if (Object.keys(initialValues).length > 0) {
    // 等待表单 API 准备就绪
    await new Promise((resolve) => setTimeout(resolve, 200));
    
    // 设置表单值，submitOnChange 会自动触发查询
    await gridApi.formApi.setValues(initialValues, true, false);
  }
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
  if (!row) {
    return;
  }
  // 确保数据正确设置并打开弹窗
  replyModalApi.setData(row);
  replyModalApi.open();
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
