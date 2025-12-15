<script lang="ts" setup>
import { h } from 'vue';

import { message } from 'ant-design-vue';
import { useVbenDrawer } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { getPointsDetail } from '#/api/iot/points';
import type { PointsApi } from '#/api/iot/points';

import { POINTS_TYPE_MAP } from '../data';

const emits = defineEmits(['success']);

const accountId = ref<number>();
const userInfo = ref<{
  accountId: number;
  accountName?: string | null;
  accountPhone: string;
  currentBalance: number;
}>();

const [Drawer, drawerApi] = useVbenDrawer({
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<{ accountId: number }>();
      if (data?.accountId) {
        accountId.value = data.accountId;
        await loadUserInfo();
        await gridApi.query();
      }
    } else {
      accountId.value = undefined;
      userInfo.value = undefined;
    }
  },
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      {
        field: 'id',
        title: 'ID',
        width: 100,
      },
      {
        field: 'points',
        title: '积分变动',
        width: 120,
        slots: {
          default: ({ row }) => {
            const points = row.points;
            const isPositive = points > 0;
            return h(
              'span',
              {
                class: isPositive ? 'text-green-600' : 'text-red-600',
                style: { fontWeight: '500' },
              },
              `${isPositive ? '+' : ''}${points}`,
            );
          },
        },
      },
      {
        field: 'balance',
        title: '积分余额',
        width: 120,
        slots: {
          default: ({ row }) =>
            h('span', { class: 'font-medium' }, row.balance),
        },
      },
      {
        field: 'type',
        title: '类型',
        width: 120,
        slots: {
          default: ({ row }) => POINTS_TYPE_MAP[row.type] || row.type,
        },
      },
      {
        field: 'description',
        title: '描述',
        minWidth: 200,
        showOverflow: true,
        slots: {
          default: ({ row }) =>
            row.description || h('span', { class: 'text-gray-400' }, '无'),
        },
      },
      {
        field: 'createdAt',
        title: '时间',
        width: 180,
      },
    ] as VxeTableGridOptions['columns'],
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => {
          if (!accountId.value) {
            return { items: [], total: 0 };
          }
          const result = await getPointsDetail(accountId.value, {
            page: page.currentPage,
            pageSize: page.pageSize,
          });
          userInfo.value = {
            accountId: result.accountId,
            accountName: result.accountName,
            accountPhone: result.accountPhone,
            currentBalance: result.currentBalance,
          };
          return {
            items: result.items,
            total: result.total,
          };
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
      search: false,
      zoom: true,
    },
  } as VxeTableGridOptions,
});

async function loadUserInfo() {
  if (!accountId.value) return;
  try {
    const result = await getPointsDetail(accountId.value, { page: 1, pageSize: 1 });
    userInfo.value = {
      accountId: result.accountId,
      accountName: result.accountName,
      accountPhone: result.accountPhone,
      currentBalance: result.currentBalance,
    };
  } catch (error: any) {
    message.error(error?.response?.data?.detail || '加载用户信息失败');
  }
}
</script>

<template>
  <Drawer title="积分记录详情" class="w-[900px]">
    <div v-if="userInfo" class="mb-4 space-y-2 rounded-lg bg-gray-50 p-4">
      <div class="flex items-center gap-4">
        <div>
          <span class="text-gray-500">用户ID：</span>
          <span class="font-medium">{{ userInfo.accountId }}</span>
        </div>
        <div>
          <span class="text-gray-500">用户名称：</span>
          <span class="font-medium">{{ userInfo.accountName || '未知' }}</span>
        </div>
        <div>
          <span class="text-gray-500">手机号：</span>
          <span class="font-medium">{{ userInfo.accountPhone }}</span>
        </div>
        <div>
          <span class="text-gray-500">当前余额：</span>
          <span class="text-lg font-bold text-blue-600">{{ userInfo.currentBalance }}</span>
        </div>
      </div>
    </div>
    <Grid table-title="积分记录" />
  </Drawer>
</template>

