<script lang="ts" setup>
import type { DeviceApi } from '#/api/iot/device';
import type { FeedbackApi } from '#/api/iot/feedback';

import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import {
  WorkbenchHeader,
} from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { Card, Statistic, Tag } from 'ant-design-vue';

import { getFeedbackList } from '#/api/iot/feedback';
import { getDeviceList, getTodayAlerts } from '#/api/iot/device';
import { getLogList } from '#/api/iot/log';
import type { LogApi } from '#/api/iot/log';
import { getTodayNewUsers } from '#/api/iot/user';

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
const feedbackPage = ref(1);
const feedbackHasMore = ref(true);
const feedbackTotal = ref(0);

// 今日告警列表
const todayAlerts = ref<DeviceApi.DeviceMessage[]>([]);
const loadingAlerts = ref(false);
const alertsPage = ref(1);
const alertsHasMore = ref(true);
const alertsTotal = ref(0);

// 操作日志列表
const operationLogs = ref<LogApi.OperationLog[]>([]);
const loadingLogs = ref(false);
const logsPage = ref(1);
const logsHasMore = ref(true);

// 统计数据
// 获取今日日期字符串 (YYYY-MM-DD)
const todayStr = new Date().toISOString().split('T')[0];

const statistics = ref([
  { title: '未绑定设备', value: 0, suffix: '台', url: '/device/list?status=unbound', loading: false },
  { title: '今日新增用户', value: 0, suffix: '人', url: `/account/users?startDate=${todayStr}&endDate=${todayStr}`, loading: false },
  { title: '今日告警', value: 0, suffix: '条', url: `/device/message?startDate=${todayStr}&endDate=${todayStr}`, loading: false },
  { title: '待处理反馈', value: 0, suffix: '条', url: '/system/feedback?status=pending', loading: false },
]);

// 加载未处理的反馈
async function loadPendingFeedbacks(reset = false) {
  if (loadingFeedbacks.value || (!feedbackHasMore.value && !reset)) return;
  
  if (reset) {
    feedbackPage.value = 1;
    feedbackHasMore.value = true;
    pendingFeedbacks.value = [];
  }
  
  loadingFeedbacks.value = true;
  try {
    const res = await getFeedbackList({
      status: 'pending',
      page: feedbackPage.value,
      pageSize: 10,
    });
    const items = res.items || [];
    const total = res.total || 0;
    
    if (reset) {
      pendingFeedbacks.value = items;
    } else {
      pendingFeedbacks.value.push(...items);
    }
    
    feedbackTotal.value = total;
    feedbackHasMore.value = pendingFeedbacks.value.length < total;
    feedbackPage.value += 1;
    
    updatePendingFeedbacksCount();
  } catch {
    // 忽略错误
  } finally {
    loadingFeedbacks.value = false;
  }
}

// 加载今日告警
async function loadTodayAlerts(reset = false) {
  if (loadingAlerts.value || (!alertsHasMore.value && !reset)) return;
  
  if (reset) {
    alertsPage.value = 1;
    alertsHasMore.value = true;
    todayAlerts.value = [];
  }
  
  loadingAlerts.value = true;
  try {
    // 使用专门的今日告警接口
    const res = await getTodayAlerts({
      page: alertsPage.value,
      pageSize: 10,
    });
    
    const items = res.items || [];
    const total = res.total || 0;
    
    if (reset) {
      todayAlerts.value = items.sort((a, b) => {
        const timeA = new Date(a.updatedAt || a.createdAt).getTime();
        const timeB = new Date(b.updatedAt || b.createdAt).getTime();
        return timeB - timeA;
      });
    } else {
      // 合并并去重
      const existingIds = new Set(todayAlerts.value.map(item => item.id));
      const newItems = items.filter(item => !existingIds.has(item.id));
      todayAlerts.value.push(...newItems);
      todayAlerts.value.sort((a, b) => {
        const timeA = new Date(a.updatedAt || a.createdAt).getTime();
        const timeB = new Date(b.updatedAt || b.createdAt).getTime();
        return timeB - timeA;
      });
    }
    
    alertsTotal.value = total;
    alertsHasMore.value = todayAlerts.value.length < total;
    alertsPage.value += 1;
    
    updateTodayAlertsCount();
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
  loadPendingFeedbacks(true);
}

// 处理待办反馈列表滚动
function handleFeedbackScroll(event: Event) {
  const target = event.target as HTMLElement;
  const scrollTop = target.scrollTop;
  const scrollHeight = target.scrollHeight;
  const clientHeight = target.clientHeight;
  
  // 距离底部50px时加载更多
  if (scrollHeight - scrollTop - clientHeight < 50) {
    loadPendingFeedbacks();
  }
}

// 处理今日告警列表滚动
function handleAlertsScroll(event: Event) {
  const target = event.target as HTMLElement;
  const scrollTop = target.scrollTop;
  const scrollHeight = target.scrollHeight;
  const clientHeight = target.clientHeight;
  
  // 距离底部50px时加载更多
  if (scrollHeight - scrollTop - clientHeight < 50) {
    loadTodayAlerts();
  }
}

// 处理操作日志列表滚动
function handleLogsScroll(event: Event) {
  const target = event.target as HTMLElement;
  const scrollTop = target.scrollTop;
  const scrollHeight = target.scrollHeight;
  const clientHeight = target.clientHeight;
  
  // 距离底部50px时加载更多
  if (scrollHeight - scrollTop - clientHeight < 50) {
    loadOperationLogs();
  }
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
async function loadOperationLogs(reset = false) {
  if (loadingLogs.value || (!logsHasMore.value && !reset)) return;
  
  if (reset) {
    logsPage.value = 1;
    logsHasMore.value = true;
    operationLogs.value = [];
  }
  
  loadingLogs.value = true;
  try {
    const res = await getLogList({
      page: logsPage.value,
      pageSize: 10,
    });
    const items = res.items || [];
    const total = res.total || 0;
    
    if (reset) {
      operationLogs.value = items;
    } else {
      operationLogs.value.push(...items);
    }
    
    logsHasMore.value = operationLogs.value.length < total;
    logsPage.value += 1;
  } catch {
    // 忽略错误，使用默认数据
    if (reset) {
      operationLogs.value = [];
    }
  } finally {
    loadingLogs.value = false;
  }
}

// 加载未绑定设备数量
async function loadUnboundDeviceCount() {
  const stat = statistics.value.find(s => s.title === '未绑定设备');
  if (!stat) return;
  
  stat.loading = true;
  try {
    const res = await getDeviceList({
      status: 'unbound',
      page: 1,
      pageSize: 1, // 只需要总数
    });
    stat.value = res.total || 0;
  } catch {
    stat.value = 0;
  } finally {
    stat.loading = false;
  }
}

// 加载今日新增用户数量
async function loadTodayNewUsersCount() {
  const stat = statistics.value.find(s => s.title === '今日新增用户');
  if (!stat) return;
  
  stat.loading = true;
  try {
    // 使用专门的今日新增用户接口
    const res = await getTodayNewUsers({
      page: 1,
      pageSize: 1, // 只需要总数
    });
    
    stat.value = res.total || 0;
  } catch {
    stat.value = 0;
  } finally {
    stat.loading = false;
  }
}

// 更新今日告警数量
function updateTodayAlertsCount() {
  const stat = statistics.value.find(s => s.title === '今日告警');
  if (stat) {
    // 直接使用API返回的total，而不是todayAlerts数组的长度
    // 因为todayAlerts只是分页加载的部分数据
    stat.value = alertsTotal.value;
  }
}

// 更新待处理反馈数量
function updatePendingFeedbacksCount() {
  const stat = statistics.value.find(s => s.title === '待处理反馈');
  if (stat) {
    // 直接使用API返回的total，而不是pendingFeedbacks数组的长度
    // 因为pendingFeedbacks只是分页加载的部分数据
    stat.value = feedbackTotal.value;
  }
}

onMounted(() => {
  loadPendingFeedbacks(true);
  loadTodayAlerts(true);
  loadOperationLogs(true);
  loadUnboundDeviceCount();
  loadTodayNewUsersCount();
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

function onStatisticClick(stat: typeof statistics.value[0]) {
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
      <!-- 操作日志 -->
      <Card
        :body-style="{ height: 'calc(500px - 57px)', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }"
        style="height: 500px; display: flex; flex-direction: column;"
      >
        <template #title>
          <span class="text-lg">操作日志</span>
        </template>
        <div 
          class="flex-1 overflow-y-auto p-5 min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          @scroll="handleLogsScroll"
        >
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
          <div v-else-if="!loadingLogs" class="py-10 text-center text-foreground/60 text-sm">
            暂无操作日志
          </div>
          <div v-if="loadingLogs && operationLogs.length === 0" class="py-10 text-center text-foreground/60 text-sm">
            加载中...
          </div>
          <div v-if="loadingLogs && operationLogs.length > 0" class="py-4 text-center text-foreground/60 text-sm">
            加载中...
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
        <div 
          class="flex-1 overflow-y-auto p-5 min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          @scroll="handleAlertsScroll"
        >
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
          <div v-else-if="!loadingAlerts" class="py-10 text-center text-foreground/60 text-sm">
            今日暂无告警
          </div>
          <div v-if="loadingAlerts && todayAlerts.length === 0" class="py-10 text-center text-foreground/60 text-sm">
            加载中...
          </div>
          <div v-if="loadingAlerts && todayAlerts.length > 0" class="py-4 text-center text-foreground/60 text-sm">
            加载中...
          </div>
        </div>
      </Card>
      
      <!-- 待办反馈 -->
      <Card
        :body-style="{ height: 'calc(500px - 57px)', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }"
        style="height: 500px; display: flex; flex-direction: column;"
      >
        <template #title>
          <span class="text-lg">待办反馈</span>
        </template>
        <div 
          class="flex-1 overflow-y-auto p-5 min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          @scroll="handleFeedbackScroll"
        >
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
          <div v-else-if="!loadingFeedbacks" class="py-10 text-center text-foreground/60 text-sm">
            暂无待处理反馈
          </div>
          <div v-if="loadingFeedbacks && pendingFeedbacks.length === 0" class="py-10 text-center text-foreground/60 text-sm">
            加载中...
          </div>
          <div v-if="loadingFeedbacks && pendingFeedbacks.length > 0" class="py-4 text-center text-foreground/60 text-sm">
            加载中...
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>
