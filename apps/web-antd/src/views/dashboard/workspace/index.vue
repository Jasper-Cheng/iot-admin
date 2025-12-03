<script lang="ts" setup>
import type {
  WorkbenchProjectItem,
  WorkbenchQuickNavItem,
  WorkbenchTodoItem,
  WorkbenchTrendItem,
} from '@vben/common-ui';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import {
  WorkbenchHeader,
  WorkbenchProject,
  WorkbenchQuickNav,
  WorkbenchTodo,
  WorkbenchTrends,
} from '@vben/common-ui';
import { preferences } from '@vben/preferences';
import { useUserStore } from '@vben/stores';

import { Card, Statistic, Tag } from 'ant-design-vue';

const userStore = useUserStore();
const router = useRouter();

// 快捷导航 - 物联网管理
const quickNavItems: WorkbenchQuickNavItem[] = [
  {
    color: '#1890ff',
    icon: 'lucide:cpu',
    title: '设备列表',
    url: '/device/list',
  },
  {
    color: '#52c41a',
    icon: 'lucide:box',
    title: '物模型',
    url: '/device/thing-model',
  },
  {
    color: '#faad14',
    icon: 'lucide:component',
    title: '型号管理',
    url: '/device/model',
  },
  {
    color: '#722ed1',
    icon: 'lucide:users',
    title: '用户管理',
    url: '/account/users',
  },
  {
    color: '#eb2f96',
    icon: 'lucide:message-square',
    title: '意见反馈',
    url: '/feedback/list',
  },
  {
    color: '#13c2c2',
    icon: 'lucide:bell',
    title: '系统消息',
    url: '/system/notice',
  },
];

// 功能模块
const projectItems: WorkbenchProjectItem[] = [
  {
    color: '#1890ff',
    content: '管理设备入库、绑定、状态监控',
    date: '核心模块',
    group: '设备管理',
    icon: 'lucide:server',
    title: '设备管理',
    url: '/device/list',
  },
  {
    color: '#52c41a',
    content: '定义设备属性、事件、服务',
    date: '核心模块',
    group: '物模型',
    icon: 'lucide:box',
    title: '物模型管理',
    url: '/device/thing-model',
  },
  {
    color: '#faad14',
    content: '管理 App 用户和家庭成员',
    date: '基础模块',
    group: '用户中心',
    icon: 'lucide:users',
    title: '用户管理',
    url: '/account/users',
  },
  {
    color: '#722ed1',
    content: '处理用户反馈和建议',
    date: '运营模块',
    group: '反馈中心',
    icon: 'lucide:message-circle',
    title: '意见反馈',
    url: '/feedback/list',
  },
  {
    color: '#eb2f96',
    content: '发布系统通知和公告',
    date: '运营模块',
    group: '消息中心',
    icon: 'lucide:bell',
    title: '系统消息',
    url: '/system/notice',
  },
  {
    color: '#13c2c2',
    content: '管理 App 版本发布',
    date: '运营模块',
    group: '版本管理',
    icon: 'lucide:git-branch',
    title: '版本管理',
    url: '/system/version',
  },
];

// 待办事项
const todoItems = ref<WorkbenchTodoItem[]>([
  {
    completed: false,
    content: '有 15 条用户反馈待处理，请及时回复',
    date: '今天',
    title: '处理用户反馈',
  },
  {
    completed: false,
    content: '12 个设备告警未处理，请检查设备状态',
    date: '今天',
    title: '处理设备告警',
  },
  {
    completed: true,
    content: 'Android v2.1.0 已发布，iOS 版本待审核',
    date: '昨天',
    title: '发布新版本',
  },
  {
    completed: false,
    content: '检查服务器性能，优化接口响应时间',
    date: '本周',
    title: '系统性能优化',
  },
]);

// 最新动态
const trendItems: WorkbenchTrendItem[] = [
  {
    avatar: 'svg:avatar-1',
    content: '新增设备 <a>智能温控器</a> 入库成功',
    date: '5分钟前',
    title: '系统',
  },
  {
    avatar: 'svg:avatar-2',
    content: '用户 <a>张三</a> 提交了新的反馈',
    date: '30分钟前',
    title: '反馈',
  },
  {
    avatar: 'svg:avatar-3',
    content: '设备 <a>智能空调E</a> 触发故障告警',
    date: '1小时前',
    title: '告警',
  },
  {
    avatar: 'svg:avatar-4',
    content: '发布系统消息 <a>系统维护通知</a>',
    date: '2小时前',
    title: '消息',
  },
  {
    avatar: 'svg:avatar-1',
    content: 'Android 版本 <a>v2.1.0</a> 发布成功',
    date: '昨天',
    title: '版本',
  },
  {
    avatar: 'svg:avatar-2',
    content: '处理用户反馈 <a>设备无法连接</a>',
    date: '昨天',
    title: '反馈',
  },
];

// 统计数据
const statistics = [
  { title: '今日新增设备', value: 12, suffix: '台' },
  { title: '今日活跃用户', value: 1280, suffix: '人' },
  { title: '本周告警数', value: 36, suffix: '条' },
  { title: '待处理反馈', value: 15, suffix: '条' },
];

function navTo(nav: WorkbenchProjectItem | WorkbenchQuickNavItem) {
  if (nav.url?.startsWith('/')) {
    router.push(nav.url);
  }
}
</script>

<template>
  <div class="p-5">
    <!-- 欢迎头部 -->
    <WorkbenchHeader
      :avatar="userStore.userInfo?.avatar || preferences.app.defaultAvatar"
    >
      <template #title>
        早安, {{ userStore.userInfo?.realName || '管理员' }},
        欢迎使用物联网管理平台！
      </template>
      <template #description>
        <div class="flex items-center gap-2">
          <span>今日晴，20℃ - 32℃</span>
          <Tag color="blue">系统运行正常</Tag>
        </div>
      </template>
    </WorkbenchHeader>

    <!-- 统计卡片 -->
    <div class="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Card
        v-for="stat in statistics"
        :key="stat.title"
        :bordered="false"
        size="small"
      >
        <Statistic
          :title="stat.title"
          :value="stat.value"
          :suffix="stat.suffix"
        />
      </Card>
    </div>

    <div class="mt-5 flex flex-col lg:flex-row">
      <div class="mr-0 w-full lg:mr-4 lg:w-3/5">
        <!-- 功能模块 -->
        <WorkbenchProject
          :items="projectItems"
          title="功能模块"
          @click="navTo"
        />
        <!-- 最新动态 -->
        <WorkbenchTrends :items="trendItems" class="mt-5" title="最新动态" />
      </div>
      <div class="w-full lg:w-2/5">
        <!-- 快捷导航 -->
        <WorkbenchQuickNav
          :items="quickNavItems"
          class="mt-5 lg:mt-0"
          title="快捷导航"
          @click="navTo"
        />
        <!-- 待办事项 -->
        <WorkbenchTodo :items="todoItems" class="mt-5" title="待办事项" />
      </div>
    </div>
  </div>
</template>
