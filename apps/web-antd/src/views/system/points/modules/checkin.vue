<script lang="ts" setup>
import { h, ref } from 'vue';

import { message } from 'ant-design-vue';
import { useVbenDrawer } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { getCheckInList } from '#/api/iot/points';
import type { PointsApi } from '#/api/iot/points';

const emits = defineEmits(['success']);

const accountId = ref<number>();
const userInfo = ref<{
  accountId: number;
  accountName?: string | null;
  accountPhone?: string;
}>();

const [Drawer, drawerApi] = useVbenDrawer({
  footer: false, // 隐藏默认的取消和确认按钮
  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<{
        accountId: number;
        accountName?: string | null;
        accountPhone?: string;
      }>();
      if (data) {
        accountId.value = data.accountId;
        // 直接使用传递过来的用户信息
        userInfo.value = {
          accountId: data.accountId ?? 0,
          accountName: data.accountName ?? null,
          accountPhone: data.accountPhone ?? '',
        };
      }
    } else {
      accountId.value = undefined;
      userInfo.value = undefined;
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

const checkInTypeMap: Record<string, string> = {
  normal: '正常签到',
  bonus: '奖励签到',
  makeup: '补签',
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      {
        field: 'id',
        title: 'ID',
        width: 100,
      },
      {
        field: 'checkInDate',
        title: '签到日期',
        width: 120,
        slots: {
          default: ({ row }) =>
            row.checkInDate || h('span', { class: 'text-gray-400' }, '-'),
        },
      },
      {
        field: 'checkInTime',
        title: '签到时间',
        width: 180,
        slots: {
          default: ({ row }) =>
            row.checkInTime || h('span', { class: 'text-gray-400' }, '-'),
        },
      },
      {
        field: 'pointsEarned',
        title: '获得积分',
        width: 120,
        slots: {
          default: ({ row }) => {
            return h(
              'span',
              {
                class: 'text-green-600',
                style: { fontWeight: '500' },
              },
              `+${row.pointsEarned}`,
            );
          },
        },
      },
      {
        field: 'continuousDays',
        title: '连续天数',
        width: 120,
        slots: {
          default: ({ row }) =>
            h('span', { class: 'font-medium' }, row.continuousDays || 0),
        },
      },
      {
        field: 'checkInType',
        title: '签到类型',
        width: 120,
        slots: {
          default: ({ row }) =>
            checkInTypeMap[row.checkInType] || row.checkInType,
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
            return JSON.stringify(row.extra);
          },
        },
      },
      {
        field: 'createdAt',
        title: '创建时间',
        width: 180,
        slots: {
          default: ({ row }) =>
            row.createdAt || h('span', { class: 'text-gray-400' }, '-'),
        },
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
          const result = await getCheckInList(accountId.value, {
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
  <Drawer title="签到记录" class="w-[900px]">
    <div v-if="userInfo" class="mb-4 space-y-2 p-4">
      <div class="flex items-center gap-4">
        <div>
          <span class="text-gray-500">用户ID：</span>
          <span class="font-medium">{{ userInfo?.accountId || accountId || '-' }}</span>
        </div>
        <div>
          <span class="text-gray-500">用户名称：</span>
          <span class="font-medium">{{ userInfo?.accountName || '未知' }}</span>
        </div>
        <div>
          <span class="text-gray-500">手机号：</span>
          <span class="font-medium">{{ userInfo?.accountPhone || '-' }}</span>
        </div>
      </div>
    </div>
    <Grid table-title="签到记录" />
  </Drawer>
</template>

