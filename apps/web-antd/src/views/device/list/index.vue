<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { DeviceApi } from '#/api/iot/device';

import { onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteDevice, getDeviceList } from '#/api/iot/device';

import { useColumns, useGridFormSchema } from './data';

// 定义操作点击参数类型
interface OnActionClickParams<T> {
  code: string;
  row: T;
}

const route = useRoute();
const router = useRouter();

// 从路由查询参数获取初始筛选条件
function getFormValuesFromQuery() {
  const query = route.query;
  const values: Record<string, any> = {};
  
  if (query.status) {
    values.status = query.status;
  }
  if (query.sn) {
    values.sn = query.sn;
  }
  if (query.name) {
    values.name = query.name;
  }
  
  return values;
}

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
        gridApi.reload(values);
      }, 100);
    } else {
      // 如果查询参数为空，清空表单并重新查询
      gridApi.formApi.setValues({});
      gridApi.reload({});
    }
  },
  { immediate: false },
);

// 页面加载时，如果有查询参数，自动设置表单值并触发查询
onMounted(async () => {
  const initialValues = getFormValuesFromQuery();
  if (Object.keys(initialValues).length > 0) {
    // 等待表单 API 准备就绪
    await new Promise((resolve) => setTimeout(resolve, 200));
    // 确保表单值已设置
    await gridApi.formApi.setValues(initialValues);
    // 触发查询
    gridApi.reload(initialValues);
  }
});
</script>

<template>
  <Page auto-content-height title="设备列表" description="查看和管理所有设备">
    <Grid table-title="设备列表" />
  </Page>
</template>
