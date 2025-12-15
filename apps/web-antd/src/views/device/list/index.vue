<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { DeviceApi } from '#/api/iot/device';

import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteDevice, getDeviceList } from '#/api/iot/device';

import { useColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue'; // eslint-disable-line
import CreateForm from './modules/create-form.vue'; // eslint-disable-line

// 定义操作点击参数类型
interface OnActionClickParams<T> {
  code: string;
  row: T;
}

const route = useRoute();

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [CreateFormDrawer, createFormDrawerApi] = useVbenDrawer({
  connectedComponent: CreateForm,
  destroyOnClose: true,
});

// 从URL参数中获取表单值
const getFormValuesFromQuery = () => {
  const query = route.query;
  const formValues: Record<string, any> = {};
  
  if (query.status) {
    formValues.status = query.status as string;
  }
  if (query.sn) {
    formValues.sn = query.sn as string;
  }
  if (query.name) {
    formValues.name = query.name as string;
  }
  if (query.accountId) {
    formValues.accountId = Number(query.accountId);
  }
  
  return formValues;
};

// 检查是否有URL查询参数
const hasQueryParams = computed(() => {
  const query = route.query;
  return !!(query.status || query.sn || query.name || query.accountId);
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
          const result = await getDeviceList({
            page: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
          return {
            items: result.items || [],
            total: result.total || 0,
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
  }
}

function onEdit(row: DeviceApi.Device) {
  formDrawerApi.setData(row).open();
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

function onCreate() {
  createFormDrawerApi.open();
}

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
  <Page auto-content-height title="设备列表" description="查看和管理所有设备">
    <template #extra>
      <Button type="primary" @click="onCreate">
        <template #icon>
          <Plus />
        </template>
        设备入库
      </Button>
    </template>
    <Grid table-title="设备列表" />
    <FormDrawer @success="onRefresh" />
    <CreateFormDrawer @success="onRefresh" />
  </Page>
</template>
