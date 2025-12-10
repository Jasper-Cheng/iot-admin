<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ThingModelApi } from '#/api/iot/thing-model';

interface OnActionClickParams<T> {
  code: string;
  row: T;
}

import { Page, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteThingModel,
  getThingModelList,
  publishThingModel,
} from '#/api/iot/thing-model';

import { useColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

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
          return await getThingModelList({
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
  } as VxeTableGridOptions<ThingModelApi.ThingModel>,
});

function onActionClick(e: OnActionClickParams<ThingModelApi.ThingModel>) {
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

function onEdit(row: ThingModelApi.ThingModel) {
  formDrawerApi.setData(row).open();
}

function onDelete(row: ThingModelApi.ThingModel) {
  if ((row.deviceCount ?? 0) > 0) {
    Modal.warning({
      title: '无法删除',
      content: `物模型【${row.name}】已关联 ${row.deviceCount ?? 0} 个设备，无法删除`,
    });
    return;
  }
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除物模型【${row.name}】吗？`,
    okType: 'danger',
    onOk: async () => {
      await deleteThingModel(row.id);
      message.success('删除成功');
      onRefresh();
    },
  });
}

async function onPublish(row: ThingModelApi.ThingModel) {
  Modal.confirm({
    title: '确认发布',
    content: `确定要发布物模型【${row.name}】吗？发布后将无法修改属性定义。`,
    onOk: async () => {
      await publishThingModel(row.id);
      message.success('发布成功');
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
  <Page
    auto-content-height
    title="物模型管理"
    description="定义设备的属性、事件和服务"
  >
    <FormDrawer @success="onRefresh" />
    <Grid table-title="物模型列表">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          新增物模型
        </Button>
      </template>
    </Grid>
  </Page>
</template>
