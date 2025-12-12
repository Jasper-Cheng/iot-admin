<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { DeviceApi } from '#/api/iot/device';

import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

import { Page } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getDeviceMessageList } from '#/api/iot/device';

import { useColumns, useGridFormSchema } from './data';

const route = useRoute();

// 从URL参数中获取表单值
const getFormValuesFromQuery = () => {
  const query = route.query;
  const formValues: Record<string, any> = {};
  
  if (query.startDate && query.endDate) {
    formValues.dateRange = [query.startDate as string, query.endDate as string];
  }
  
  return formValues;
};

// 检查是否有URL查询参数
const hasQueryParams = computed(() => {
  const query = route.query;
  return !!(query.startDate && query.endDate);
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: true,
  },
  gridOptions: {
    columns: useColumns(),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      autoLoad: !hasQueryParams.value, // 如果有查询参数，禁用自动加载
      ajax: {
        query: async ({ page }, formValues) => {
          // 处理日期范围参数
          const params: Parameters<typeof getDeviceMessageList>[0] = {
            page: page.currentPage,
            pageSize: page.pageSize,
          };
          
          // 复制其他参数
          Object.keys(formValues || {}).forEach((key) => {
            if (key === 'dateRange' && formValues.dateRange) {
              // 将日期范围转换为 startDate 和 endDate
              const [startDate, endDate] = formValues.dateRange;
              params.startDate = startDate;
              params.endDate = endDate;
            } else if (key !== 'dateRange') {
              (params as any)[key] = formValues[key];
            }
          });
          
          return await getDeviceMessageList(params);
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
  } as VxeTableGridOptions<DeviceApi.DeviceMessage>,
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
</script>

<template>
  <Page auto-content-height title="设备消息" description="查看设备消息记录">
    <Grid table-title="消息列表" />
  </Page>
</template>
