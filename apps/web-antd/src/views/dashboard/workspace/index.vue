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
    // 如果数据不够多，添加一些模拟数据以测试滚动
    const items = res.items || [];
    if (items.length < 8) {
      // 添加模拟反馈数据
      const mockFeedbacks: FeedbackApi.Feedback[] = [
        {
          id: 1001,
          accountId: 1,
          accountName: '张三',
          name: '张三',
          type: 'bug',
          content: '设备连接不稳定，经常掉线，希望能优化网络连接',
          status: 'pending',
          source: 'app',
          createdAt: new Date().toISOString(),
        },
        {
          id: 1002,
          accountId: 2,
          accountName: '李四',
          name: '李四',
          type: 'feature',
          content: '希望增加设备定时开关功能，方便远程控制',
          status: 'pending',
          source: 'web',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 1003,
          accountId: 3,
          accountName: '王五',
          name: '王五',
          type: 'complaint',
          content: '设备响应速度太慢，操作延迟明显',
          status: 'pending',
          source: 'app',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: 1004,
          accountId: 4,
          accountName: '赵六',
          name: '赵六',
          type: 'improvement',
          content: '建议增加设备分组功能，方便管理多个设备',
          status: 'pending',
          source: 'web',
          createdAt: new Date(Date.now() - 10800000).toISOString(),
        },
        {
          id: 1005,
          accountId: 5,
          accountName: '钱七',
          name: '钱七',
          type: 'bug',
          content: 'APP闪退问题，在查看设备详情时经常崩溃',
          status: 'pending',
          source: 'app',
          createdAt: new Date(Date.now() - 14400000).toISOString(),
        },
        {
          id: 1006,
          accountId: 6,
          accountName: '孙八',
          name: '孙八',
          type: 'feature',
          content: '希望支持语音控制功能，可以通过语音助手控制设备',
          status: 'pending',
          source: 'web',
          createdAt: new Date(Date.now() - 18000000).toISOString(),
        },
        {
          id: 1007,
          accountId: 7,
          accountName: '周九',
          name: '周九',
          type: 'other',
          content: '设备外观设计很好，但希望能有更多颜色选择',
          status: 'pending',
          source: 'app',
          createdAt: new Date(Date.now() - 21600000).toISOString(),
        },
        {
          id: 1008,
          accountId: 8,
          accountName: '吴十',
          name: '吴十',
          type: 'bug',
          content: '数据同步有问题，手机端和网页端数据不一致',
          status: 'pending',
          source: 'web',
          createdAt: new Date(Date.now() - 25200000).toISOString(),
        },
      ];
      pendingFeedbacks.value = [...items, ...mockFeedbacks].slice(0, 10);
    } else {
      pendingFeedbacks.value = items;
    }
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
    // 模拟今日告警数据
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    // 生成今日不同时间的告警（增加更多数据以测试滚动）
    const mockAlerts: DeviceApi.DeviceMessage[] = [
      {
        id: 1,
        deviceId: 1,
        deviceSn: 'TEMP001-2024-001',
        deviceName: '客厅温度传感器',
        level: 'error',
        status: 'new',
        message: '温度异常：当前温度 45°C，超过安全阈值 40°C',
        detail: { temperature: 45, threshold: 40 },
        createdAt: `${todayStr} ${String(now.getHours() - 1).padStart(2, '0')}:30:00`,
      },
      {
        id: 2,
        deviceId: 2,
        deviceSn: 'HUM001-2024-001',
        deviceName: '卧室湿度传感器',
        level: 'fatal',
        status: 'new',
        message: '设备离线：已超过30分钟未收到数据，请检查设备连接',
        detail: { lastOnlineTime: `${todayStr} ${String(now.getHours() - 1).padStart(2, '0')}:00:00` },
        createdAt: `${todayStr} ${String(now.getHours() - 1).padStart(2, '0')}:35:00`,
      },
      {
        id: 3,
        deviceId: 3,
        deviceSn: 'ENV001-2024-001',
        deviceName: '客厅环境监测器',
        level: 'error',
        status: 'read',
        message: 'PM2.5浓度超标：当前值 180 μg/m³，超过标准值 75 μg/m³',
        detail: { pm25: 180, standard: 75 },
        createdAt: `${todayStr} ${String(now.getHours() - 2).padStart(2, '0')}:15:00`,
      },
      {
        id: 4,
        deviceId: 4,
        deviceSn: 'M701001-2024-001',
        deviceName: '主卧空气质量监测器',
        level: 'error',
        status: 'new',
        message: 'CO2浓度过高：当前值 1200 ppm，超过健康标准 1000 ppm',
        detail: { co2: 1200, standard: 1000 },
        createdAt: `${todayStr} ${String(now.getHours() - 3).padStart(2, '0')}:45:00`,
      },
      {
        id: 5,
        deviceId: 5,
        deviceSn: 'TEMP001-2024-002',
        deviceName: '书房温度传感器',
        level: 'fatal',
        status: 'new',
        message: '传感器故障：错误代码 E05，温度读数异常，需要立即检修',
        detail: { errorCode: 'E05', errorType: 'sensor_fault' },
        createdAt: `${todayStr} ${String(now.getHours() - 4).padStart(2, '0')}:20:00`,
      },
      {
        id: 6,
        deviceId: 6,
        deviceSn: 'AIR001-2024-001',
        deviceName: '厨房空气净化器',
        level: 'error',
        status: 'new',
        message: '滤网寿命到期：当前使用率 100%，需要更换滤网',
        detail: { filterUsage: 100 },
        createdAt: `${todayStr} ${String(now.getHours() - 5).padStart(2, '0')}:10:00`,
      },
      {
        id: 7,
        deviceId: 7,
        deviceSn: 'SMOKE001-2024-001',
        deviceName: '烟雾报警器',
        level: 'fatal',
        status: 'new',
        message: '检测到烟雾：烟雾浓度异常，请立即检查',
        detail: { smokeLevel: 85 },
        createdAt: `${todayStr} ${String(now.getHours() - 6).padStart(2, '0')}:00:00`,
      },
      {
        id: 8,
        deviceId: 8,
        deviceSn: 'DOOR001-2024-001',
        deviceName: '智能门锁',
        level: 'error',
        status: 'read',
        message: '电池电量低：当前电量 15%，建议更换电池',
        detail: { batteryLevel: 15 },
        createdAt: `${todayStr} ${String(now.getHours() - 7).padStart(2, '0')}:30:00`,
      },
    ];
    
    todayAlerts.value = mockAlerts.sort((a, b) => {
      // 按时间倒序排列
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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
