<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { DeviceModelApi } from '#/api/iot/device-model';

interface OnActionClickParams<T> {
  code: string;
  row: T;
}

import { onMounted, provide, ref } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteDeviceModel, getDeviceModelList } from '#/api/iot/device-model';
import { getThingModelList } from '#/api/iot/thing-model';

import { useColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

// 预加载物模型列表，供表单组件使用
const thingModelOptions = ref<Array<{ label: string; value: number }>>([]);

onMounted(async () => {
  try {
    const res = await getThingModelList({ pageSize: 100 });
    thingModelOptions.value = (res.items || []).map((item) => ({
      label: item.name,
      value: item.id,
    }));
  } catch {
    // 忽略错误
  }
});

// 通过 provide 传递给表单组件
provide('thingModelOptions', thingModelOptions);

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
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
          return await getDeviceModelList({
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
  } as VxeTableGridOptions<DeviceModelApi.DeviceModel>,
});

function onActionClick(e: OnActionClickParams<DeviceModelApi.DeviceModel>) {
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

function onEdit(row: DeviceModelApi.DeviceModel) {
  formDrawerApi.setData(row).open();
}

function onDelete(row: DeviceModelApi.DeviceModel) {
  if (row.deviceCount > 0) {
    Modal.warning({
      title: '无法删除',
      content: `型号【${row.name}】已关联 ${row.deviceCount} 个设备，无法删除`,
    });
    return;
  }
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除型号【${row.name}】吗？`,
    okType: 'danger',
    onOk: async () => {
      await deleteDeviceModel(row.id);
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
  <Page auto-content-height title="型号管理" description="管理设备型号信息">
    <FormDrawer @success="onRefresh" />
    <Grid table-title="型号列表">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          新增型号
        </Button>
      </template>
    </Grid>
  </Page>
</template>
