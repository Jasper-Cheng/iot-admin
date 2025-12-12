<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { UserApi } from '#/api/iot/user';

interface OnActionClickParams<T> {
  code: string;
  row: T;
}

import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteUser, getUserList } from '#/api/iot/user';

import { useColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

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

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

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
    columns: useColumns(onActionClick, onStatusChange),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      autoLoad: !hasQueryParams.value, // 如果有查询参数，禁用自动加载
      ajax: {
        query: async ({ page }, formValues) => {
          // 处理日期范围参数
          const params: UserApi.UserListParams = {
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
          
          return await getUserList(params);
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
  } as VxeTableGridOptions<UserApi.AppUser>,
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

function onActionClick(e: OnActionClickParams<UserApi.AppUser>) {
  switch (e.code) {
    case 'edit': {
      onEdit(e.row);
      break;
    }
    case 'delete': {
      onDelete(e.row);
      break;
    }
  }
}

async function onStatusChange(_newStatus: string, _row: UserApi.AppUser) {
  // 注意：新数据结构中没有 status 字段，此函数保留用于兼容性，但实际不会调用
  return false;
}

function onEdit(row: UserApi.AppUser) {
  formDrawerApi.setData(row).open();
}

function onDelete(row: UserApi.AppUser) {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除用户【${row.nickname}】吗？`,
    okType: 'danger',
    onOk: async () => {
      await deleteUser(row.id);
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
  <Page auto-content-height title="用户管理" description="管理 App 用户">
    <FormDrawer @success="onRefresh" />
    <Grid table-title="用户列表">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          新增用户
        </Button>
      </template>
    </Grid>
  </Page>
</template>
