<script lang="ts" setup>
import { computed, h, nextTick, ref } from 'vue';

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
  accountPhone?: string;
  currentBalance?: number;
} | null>(null);

// 使用 computed 确保响应式更新
const displayAccountId = computed(() => userInfo.value?.accountId ?? '-');
const displayAccountName = computed(() => userInfo.value?.accountName || '未知');
const displayAccountPhone = computed(() => userInfo.value?.accountPhone || '-');
const displayCurrentBalance = computed(() => userInfo.value?.currentBalance ?? '-');

const [Drawer, drawerApi] = useVbenDrawer({
  footer: false, // 隐藏默认的取消和确认按钮
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<{
        accountId: number;
        accountName?: string | null;
        accountPhone?: string;
        currentBalance?: number;
      }>();
      if (data) {
        accountId.value = data.accountId;
        // 直接使用传递过来的用户信息
        userInfo.value = {
          accountId: data.accountId,
          accountName: data.accountName || null,
          accountPhone: data.accountPhone || '',
          currentBalance: data.currentBalance || 0,
        };
        console.log('Set userInfo:', userInfo.value);
        // 确保响应式更新
        await nextTick();
        console.log('After nextTick, userInfo:', userInfo.value);
      }
    } else {
      accountId.value = undefined;
      userInfo.value = null;
    }
  },
  async onOpened() {
    // 抽屉完全打开后再查询表格数据
    if (accountId.value) {
      try {
        await gridApi.query();
      } catch (error) {
        console.error('Failed to query grid:', error);
      }
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
        field: 'extra',
        title: '扩展信息',
        minWidth: 200,
        showOverflow: true,
        slots: {
          default: ({ row }) => {
            if (!row.extra || Object.keys(row.extra).length === 0) {
              return h('span', { class: 'text-gray-400' }, '无');
            }
            return h('span', {}, JSON.stringify(row.extra));
          },
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
      autoLoad: false, // 禁用自动加载，手动在 onOpened 中调用
      ajax: {
        query: async ({ page }) => {
          if (!accountId.value) {
            return { items: [], total: 0 };
          }
          const result = await getPointsDetail(accountId.value, {
            page: page.currentPage,
            pageSize: page.pageSize,
          });
          // 用户信息已从列表传递，不需要从API更新
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

</script>

<template>
  <Drawer title="积分记录详情" class="w-[900px]">
    <div v-if="userInfo" class="mb-4 space-y-2 p-4">
      <div class="flex items-center gap-4">
        <div>
          <span class="text-gray-500">用户ID：</span>
          <span class="font-medium">{{ displayAccountId }}</span>
        </div>
        <div>
          <span class="text-gray-500">用户名称：</span>
          <span class="font-medium">{{ displayAccountName }}</span>
        </div>
        <div>
          <span class="text-gray-500">手机号：</span>
          <span class="font-medium">{{ displayAccountPhone }}</span>
        </div>
        <div>
          <span class="text-gray-500">当前余额：</span>
          <span class="text-lg font-bold text-blue-600">{{ displayCurrentBalance }}</span>
        </div>
      </div>
    </div>
    <Grid table-title="积分记录" />
  </Drawer>
</template>

