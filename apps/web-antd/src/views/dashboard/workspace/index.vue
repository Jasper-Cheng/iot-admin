<script lang="ts" setup>
import type { WorkbenchTrendItem } from '@vben/common-ui';
import type { FeedbackApi } from '#/api/iot/feedback';

import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import {
  WorkbenchHeader,
  WorkbenchTrends,
} from '@vben/common-ui';
import { preferences } from '@vben/preferences';
import { useUserStore } from '@vben/stores';

import { Card, Statistic, Tag } from 'ant-design-vue';

import { getFeedbackList } from '#/api/iot/feedback';

const userStore = useUserStore();
const router = useRouter();

// 待办反馈列表
const pendingFeedbacks = ref<FeedbackApi.Feedback[]>([]);
const loadingFeedbacks = ref(false);

// 加载未处理的反馈
async function loadPendingFeedbacks() {
  loadingFeedbacks.value = true;
  try {
    const res = await getFeedbackList({
      status: 'pending',
      page: 1,
      pageSize: 10,
    });
    pendingFeedbacks.value = res.items || [];
  } catch {
    // 忽略错误
  } finally {
    loadingFeedbacks.value = false;
  }
}

// 反馈类型映射
const feedbackTypeMap: Record<FeedbackApi.FeedbackType, { text: string; color: string }> = {
  bug: { text: 'Bug', color: 'red' },
  feature: { text: '功能', color: 'blue' },
  improvement: { text: '改进', color: 'cyan' },
  complaint: { text: '投诉', color: 'orange' },
  praise: { text: '表扬', color: 'green' },
  other: { text: '其他', color: 'default' },
};

// 格式化日期
function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60));
      return minutes <= 0 ? '刚刚' : `${minutes}分钟前`;
    }
    return `${hours}小时前`;
  } else if (days === 1) {
    return '昨天';
  } else if (days < 7) {
    return `${days}天前`;
  } else {
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  }
}

// 跳转到反馈列表
function goToFeedback() {
  router.push(`/feedback/list`);
}

onMounted(() => {
  loadPendingFeedbacks();
});

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
  { title: '未绑定设备', value: 12, suffix: '台', url: '/device/list?status=unbound' },
  { title: '今日在线用户', value: 1280, suffix: '人' },
  { title: '今日告警', value: 36, suffix: '条' },
  { title: '待处理反馈', value: 15, suffix: '条' },
];

function onStatisticClick(stat: typeof statistics[0]) {
  if (stat.url) {
    router.push(stat.url);
  }
}

</script>

<template>
  <div class="p-5">
    <!-- 欢迎头部 -->
    <WorkbenchHeader
      :avatar="userStore.userInfo?.avatar || preferences.app.defaultAvatar"
      class="[&_.flex.flex-1.justify-end>div]:hidden [&_.flex.flex-1.justify-end]:after:content-['加油！每一天都是新的开始，让我们一起创造更美好的未来！'] [&_.flex.flex-1.justify-end]:after:text-foreground/80 [&_.flex.flex-1.justify-end]:after:text-lg [&_.flex.flex-1.justify-end]:after:font-medium [&_.flex.flex-1.justify-end]:after:text-right [&_.flex.flex-1.justify-end]:after:flex [&_.flex.flex-1.justify-end]:after:items-center"
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
        :class="{ 'cursor-pointer hover:shadow-md transition-shadow': stat.url }"
        size="small"
        @click="stat.url ? onStatisticClick(stat) : undefined"
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
        <!-- 待办反馈 -->
        <Card>
          <template #title>
            <span class="text-lg">待办反馈</span>
          </template>
          <div class="p-5 pt-0">
            <ul v-if="pendingFeedbacks.length > 0" class="divide-border w-full divide-y" role="list">
              <li
                v-for="feedback in pendingFeedbacks"
                :key="feedback.id"
                class="flex cursor-pointer justify-between gap-x-6 py-5 rounded-lg px-2"
                @click="goToFeedback"
              >
                <div class="flex min-w-0 flex-auto items-center gap-x-4">
                  <div class="min-w-0 flex-auto">
                    <div class="flex items-center gap-2">
                      <p class="text-foreground text-sm font-semibold leading-6">
                        {{ feedback.accountName || feedback.name || '匿名用户' }}
                      </p>
                      <Tag :color="feedbackTypeMap[feedback.type]?.color || 'default'">
                        {{ feedbackTypeMap[feedback.type]?.text || '其他' }}
                      </Tag>
                    </div>
                    <p class="text-foreground/80 mt-1 line-clamp-2 text-xs leading-5">
                      {{ feedback.content }}
                    </p>
                  </div>
                </div>
                <div class="hidden h-full shrink-0 sm:flex sm:flex-col sm:items-end">
                  <span class="text-foreground/80 mt-6 text-xs leading-6">
                    {{ formatDate(feedback.createdAt) }}
                  </span>
                </div>
              </li>
            </ul>
            <div v-else class="py-10 text-center text-foreground/60 text-sm">
              暂无待处理反馈
            </div>
          </div>
        </Card>
      </div>
      <div class="w-full lg:w-2/5">
        <!-- 最新动态 -->
        <WorkbenchTrends :items="trendItems" class="mt-5 lg:mt-0" title="最新动态" />
      </div>
    </div>
  </div>
</template>
