<script lang="ts" setup>
import type { DeviceApi } from '#/api/iot/device';
import type { FeedbackApi } from '#/api/iot/feedback';

import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import {
  WorkbenchHeader,
} from '@vben/common-ui';
import { preferences } from '@vben/preferences';
import { useUserStore } from '@vben/stores';

import { Card, Statistic, Tag } from 'ant-design-vue';

import { getFeedbackList } from '#/api/iot/feedback';
import { getDeviceMessageList } from '#/api/iot/device';
import { getLogList } from '#/api/iot/log';
import type { LogApi } from '#/api/iot/log';

import { useVbenModal } from '@vben/common-ui';

import ReplyModal from '#/views/feedback/list/modules/reply-modal.vue';

const userStore = useUserStore();
const router = useRouter();

// 回复反馈弹窗
const [ReplyModalComponent, replyModalApi] = useVbenModal({
  connectedComponent: ReplyModal,
  destroyOnClose: true,
});

// 待办反馈列表
const pendingFeedbacks = ref<FeedbackApi.Feedback[]>([]);
const loadingFeedbacks = ref(false);

// 今日告警列表
const todayAlerts = ref<DeviceApi.DeviceMessage[]>([]);
const loadingAlerts = ref(false);

// 操作日志列表
const operationLogs = ref<LogApi.OperationLog[]>([]);
const loadingLogs = ref(false);

// 加载未处理的反馈
async function loadPendingFeedbacks() {
  loadingFeedbacks.value = true;
  try {
    const res = await getFeedbackList({
      status: 'pending',
      page: 1,
      pageSize: 10,
    });
    const items = res.items || [];
    pendingFeedbacks.value = items.slice(0, 10);
  } catch {
    // 忽略错误
  } finally {
    loadingFeedbacks.value = false;
  }
}

// 加载今日告警
async function loadTodayAlerts() {
  loadingAlerts.value = true;
  try {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    // 获取今日的告警消息
    const res = await getDeviceMessageList({
      level: 'error',
      page: 1,
      pageSize: 10,
    });
    
    // 过滤出今日的消息
    const items = res.items || [];
    const todayItems = items.filter((item) => {
      const itemDate = item.createdAt?.split('T')[0] || item.updatedAt?.split('T')[0];
      return itemDate === todayStr;
    });
    
    todayAlerts.value = todayItems.sort((a, b) => {
      const timeA = new Date(a.updatedAt || a.createdAt).getTime();
      const timeB = new Date(b.updatedAt || b.createdAt).getTime();
      return timeB - timeA;
    });
  } catch {
    // 忽略错误
  } finally {
    loadingAlerts.value = false;
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

// 告警级别映射
const alertLevelMap: Record<string, { text: string; color: string }> = {
  low: { text: '低', color: 'default' },
  normal: { text: '普通', color: 'blue' },
  error: { text: '错误', color: 'orange' },
  fatal: { text: '严重', color: 'red' },
};

// 打开回复反馈弹窗
function openReplyModal(feedback: FeedbackApi.Feedback) {
  replyModalApi.setData(feedback).open();
}

// 回复成功后刷新待办反馈列表
function onReplySuccess() {
  loadPendingFeedbacks();
}

// 跳转到设备消息列表
function goToAlerts() {
  router.push(`/device/message`);
}

// 跳转到操作日志
function goToOperationLogs() {
  router.push(`/system/logs`);
}

// 加载操作日志
async function loadOperationLogs() {
  loadingLogs.value = true;
  try {
    const res = await getLogList({
      page: 1,
      pageSize: 10,
    });
    operationLogs.value = res.items || [];
  } catch {
    // 忽略错误，使用默认数据
    operationLogs.value = [];
  } finally {
    loadingLogs.value = false;
  }
}

onMounted(() => {
  loadPendingFeedbacks();
  loadTodayAlerts();
  loadOperationLogs();
});

// 操作类型映射
const operationTypeMap: Record<string, { text: string; color: string }> = {
  login: { text: '登录', color: 'blue' },
  logout: { text: '登出', color: 'default' },
  register: { text: '注册', color: 'green' },
  account_delete: { text: '删除账户', color: 'red' },
  account_update: { text: '更新账户', color: 'orange' },
  device_bind: { text: '绑定设备', color: 'cyan' },
  device_unbind: { text: '解绑设备', color: 'orange' },
  device_name_update: { text: '更新设备名', color: 'blue' },
  device_add_to_family: { text: '添加设备到家庭', color: 'green' },
  device_remove_from_family: { text: '从家庭移除设备', color: 'orange' },
  family_create: { text: '创建家庭', color: 'green' },
  family_delete: { text: '删除家庭', color: 'red' },
  family_member_add: { text: '添加家庭成员', color: 'cyan' },
  family_member_remove: { text: '移除家庭成员', color: 'orange' },
  quick_control: { text: '快速控制', color: 'blue' },
  feedback_create: { text: '创建反馈', color: 'purple' },
};

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
    <!-- 回复反馈弹窗 -->
    <ReplyModalComponent @success="onReplySuccess" />
    
    <!-- 欢迎头部 -->
    <WorkbenchHeader
      :avatar="userStore.userInfo?.avatar || '/avatars/no-avatar.png'"
      class="[&_.flex.flex-1.justify-end>div]:hidden [&_.flex.flex-1.justify-end]:after:content-['加油！每一天都是新的开始，让我们一起创造更美好的未来！'] [&_.flex.flex-1.justify-end]:after:text-foreground/80 [&_.flex.flex-1.justify-end]:after:text-lg [&_.flex.flex-1.justify-end]:after:font-medium [&_.flex.flex-1.justify-end]:after:text-right [&_.flex.flex-1.justify-end]:after:flex [&_.flex.flex-1.justify-end]:after:items-center"
    >
      <template #title>
        早安, {{ userStore.userInfo?.nickname || userStore.userInfo?.realName || '管理员' }},
        欢迎使用物联网管理平台！
      </template>
      <template #description>
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-4">
            <span v-if="userStore.userInfo?.phone" class="text-foreground/80">
              电话：{{ userStore.userInfo.phone }}
            </span>
            <span v-if="userStore.userInfo?.email" class="text-foreground/80">
              邮箱：{{ userStore.userInfo.email }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <span>今日晴，20℃ - 32℃</span>
            <Tag color="blue">系统运行正常</Tag>
          </div>
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

    <div class="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
      <!-- 待办反馈 -->
      <Card
        :body-style="{ height: 'calc(500px - 57px)', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }"
        style="height: 500px; display: flex; flex-direction: column;"
      >
        <template #title>
          <span class="text-lg">待办反馈</span>
        </template>
        <div class="flex-1 overflow-y-auto p-5 min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <ul v-if="pendingFeedbacks.length > 0" class="divide-border w-full divide-y" role="list">
            <li
              v-for="feedback in pendingFeedbacks"
              :key="feedback.id"
              class="flex cursor-pointer justify-between gap-x-6 py-3 rounded-lg px-0 hover:bg-muted/50 transition-colors"
              @click="openReplyModal(feedback)"
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
                <span class="text-foreground/80 text-xs leading-6">
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
      
      <!-- 今日告警 -->
      <Card
        :body-style="{ height: 'calc(500px - 57px)', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }"
        style="height: 500px; display: flex; flex-direction: column;"
      >
        <template #title>
          <span class="text-lg">今日告警</span>
        </template>
        <div class="flex-1 overflow-y-auto p-5 min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <ul v-if="todayAlerts.length > 0" class="divide-border w-full divide-y" role="list">
            <li
              v-for="alert in todayAlerts"
              :key="alert.id"
              class="flex cursor-pointer justify-between gap-x-6 py-3 rounded-lg px-0"
              @click="goToAlerts"
            >
              <div class="flex min-w-0 flex-auto items-center gap-x-4">
                <div class="min-w-0 flex-auto">
                  <div class="flex items-center gap-2">
                    <p class="text-foreground text-sm font-semibold leading-6">
                      {{ alert.deviceName || alert.deviceSn || '未知设备' }}
                    </p>
                    <Tag :color="alertLevelMap[alert.level]?.color || 'default'">
                      {{ alertLevelMap[alert.level]?.text || alert.level }}
                    </Tag>
                  </div>
                  <p class="text-foreground/80 mt-1 line-clamp-2 text-xs leading-5">
                    {{ alert.message || '无消息内容' }}
                  </p>
                </div>
              </div>
              <div class="hidden h-full shrink-0 sm:flex sm:flex-col sm:items-end">
                <span class="text-foreground/80 text-xs leading-6">
                  {{ formatDate(alert.createdAt) }}
                </span>
              </div>
            </li>
          </ul>
          <div v-else class="py-10 text-center text-foreground/60 text-sm">
            今日暂无告警
          </div>
        </div>
      </Card>
      
      <!-- 操作日志 -->
      <Card
        :body-style="{ height: 'calc(500px - 57px)', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }"
        style="height: 500px; display: flex; flex-direction: column;"
      >
        <template #title>
          <span class="text-lg">操作日志</span>
        </template>
        <div class="flex-1 overflow-y-auto p-5 min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <ul v-if="operationLogs.length > 0" class="divide-border w-full divide-y" role="list">
            <li
              v-for="log in operationLogs"
              :key="log.id"
              class="flex cursor-pointer justify-between gap-x-6 py-3 rounded-lg px-0 hover:bg-muted/50 transition-colors"
              @click="goToOperationLogs"
            >
              <div class="flex min-w-0 flex-auto items-center gap-x-4">
                <div class="min-w-0 flex-auto">
                  <div class="flex items-center gap-2">
                    <p class="text-foreground text-sm font-semibold leading-6">
                      {{ log.accountName || `用户${log.accountId}` }}
                    </p>
                    <Tag :color="operationTypeMap[log.operationType]?.color || 'default'">
                      {{ operationTypeMap[log.operationType]?.text || log.operationType }}
                    </Tag>
                  </div>
                  <p class="text-foreground/80 mt-1 line-clamp-2 text-xs leading-5">
                    {{ log.description }}
                  </p>
                </div>
              </div>
              <div class="hidden h-full shrink-0 sm:flex sm:flex-col sm:items-end">
                <span class="text-foreground/80 text-xs leading-6">
                  {{ formatDate(log.createdAt) }}
                </span>
              </div>
            </li>
          </ul>
          <div v-else class="py-10 text-center text-foreground/60 text-sm">
            暂无操作日志
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
