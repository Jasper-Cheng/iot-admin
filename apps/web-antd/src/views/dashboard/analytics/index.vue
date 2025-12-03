<script lang="ts" setup>
import type { AnalysisOverviewItem } from '@vben/common-ui';
import type { TabOption } from '@vben/types';

import { h } from 'vue';

import {
  AnalysisChartCard,
  AnalysisChartsTabs,
  AnalysisOverview,
} from '@vben/common-ui';

import { Badge, Card, Progress, Table, Tag } from 'ant-design-vue';

import AnalyticsTrends from './analytics-trends.vue';
import AnalyticsVisitsSource from './analytics-visits-source.vue';
import AnalyticsVisits from './analytics-visits.vue';

// 物联网数据概览
const overviewItems: AnalysisOverviewItem[] = [
  {
    icon: 'lucide:cpu',
    title: '设备总数',
    totalTitle: '在线设备',
    totalValue: 756,
    value: 1234,
  },
  {
    icon: 'lucide:users',
    title: '今日活跃用户',
    totalTitle: '总用户数',
    totalValue: 8560,
    value: 1280,
  },
  {
    icon: 'lucide:alert-triangle',
    title: '今日告警',
    totalTitle: '未处理告警',
    totalValue: 12,
    value: 36,
  },
  {
    icon: 'lucide:message-square',
    title: '待处理反馈',
    totalTitle: '本月反馈',
    totalValue: 89,
    value: 15,
  },
];

const chartTabs: TabOption[] = [
  {
    label: '设备激活趋势',
    value: 'trends',
  },
  {
    label: '月度数据',
    value: 'visits',
  },
];

// 设备状态分布数据
const deviceStatusData = [
  { status: '在线', count: 756, percent: 61 },
  { status: '离线', count: 423, percent: 34 },
  { status: '故障', count: 55, percent: 5 },
];

// 最近告警
const recentAlarms = [
  {
    id: 1,
    device: '智能温控器A',
    message: '温度异常',
    level: 'warning',
    time: '5分钟前',
  },
  {
    id: 2,
    device: '智能空调E',
    message: '压缩机故障',
    level: 'error',
    time: '30分钟前',
  },
  {
    id: 3,
    device: '智能灯泡B',
    message: '设备离线',
    level: 'info',
    time: '1小时前',
  },
  {
    id: 4,
    device: '智能门锁D',
    message: '电池电量低',
    level: 'warning',
    time: '2小时前',
  },
];

const alarmColumns = [
  { title: '设备', dataIndex: 'device', width: 140 },
  { title: '告警信息', dataIndex: 'message' },
  {
    title: '级别',
    dataIndex: 'level',
    width: 80,
    customRender: ({ text }: { text: string }) => {
      const colorMap: Record<string, string> = {
        info: 'blue',
        warning: 'orange',
        error: 'red',
      };
      return h(Tag, { color: colorMap[text] || 'default' }, () => text);
    },
  },
  { title: '时间', dataIndex: 'time', width: 100 },
];

// 型号分布
const modelDistribution = [
  { name: '温控器 T100', count: 156, color: '#1890ff' },
  { name: '智能灯泡 L200', count: 328, color: '#52c41a' },
  { name: '智能插座 S300', count: 245, color: '#faad14' },
  { name: '智能门锁 K400', count: 89, color: '#722ed1' },
  { name: '智能空调 A500', count: 67, color: '#eb2f96' },
];

const totalDevices = modelDistribution.reduce(
  (acc, item) => acc + item.count,
  0,
);
</script>

<template>
  <div class="p-5">
    <!-- 数据概览卡片 -->
    <AnalysisOverview :items="overviewItems" />

    <!-- 图表区域 -->
    <AnalysisChartsTabs :tabs="chartTabs" class="mt-5">
      <template #trends>
        <AnalyticsTrends />
      </template>
      <template #visits>
        <AnalyticsVisits />
      </template>
    </AnalysisChartsTabs>

    <!-- 三列布局 -->
    <div class="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
      <!-- 设备状态分布 -->
      <Card title="设备状态分布" :bordered="false">
        <div class="space-y-4">
          <div
            v-for="item in deviceStatusData"
            :key="item.status"
            class="flex items-center"
          >
            <span class="w-16 text-sm">{{ item.status }}</span>
            <Progress
              :percent="item.percent"
              :stroke-color="
                item.status === '在线'
                  ? '#52c41a'
                  : item.status === '离线'
                    ? '#d9d9d9'
                    : '#ff4d4f'
              "
              :show-info="false"
              class="mx-3 flex-1"
            />
            <span class="w-16 text-right text-sm text-gray-500"
              >{{ item.count }} 台</span
            >
          </div>
        </div>
        <div class="mt-4 flex justify-between border-t pt-4 text-sm">
          <span class="text-gray-500">设备总数</span>
          <span class="font-medium">{{ overviewItems[0].value }} 台</span>
        </div>
      </Card>

      <!-- 型号分布 -->
      <Card title="型号分布 TOP5" :bordered="false">
        <div class="space-y-3">
          <div
            v-for="(item, index) in modelDistribution"
            :key="item.name"
            class="flex items-center"
          >
            <Badge :color="item.color" />
            <span class="ml-2 flex-1 truncate text-sm">{{ item.name }}</span>
            <span class="text-sm text-gray-500">{{ item.count }}</span>
            <span class="ml-2 text-xs text-gray-400">
              {{ ((item.count / totalDevices) * 100).toFixed(1) }}%
            </span>
          </div>
        </div>
        <div class="mt-4 flex justify-between border-t pt-4 text-sm">
          <span class="text-gray-500">型号总数</span>
          <span class="font-medium">5 种</span>
        </div>
      </Card>

      <!-- 设备来源 -->
      <AnalysisChartCard title="设备分布">
        <AnalyticsVisitsSource />
      </AnalysisChartCard>
    </div>

    <!-- 最近告警 -->
    <Card title="最近告警" :bordered="false" class="mt-5">
      <template #extra>
        <a href="/device/message" class="text-primary">查看全部</a>
      </template>
      <Table
        :columns="alarmColumns"
        :data-source="recentAlarms"
        :pagination="false"
        size="small"
        row-key="id"
      />
    </Card>
  </div>
</template>
