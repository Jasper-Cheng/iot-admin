<script lang="ts" setup>
import type { DeviceApi } from '#/api/iot/device';

import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import {
  Badge,
  Button,
  Card,
  Descriptions,
  DescriptionsItem,
  Empty,
  message,
  Select,
  Spin,
  Table,
  TabPane,
  Tabs,
  Tag,
} from 'ant-design-vue';

import { getDevice, getDeviceMessageList } from '#/api/iot/device';

const route = useRoute();
const router = useRouter();

const deviceId = computed(() => Number(route.params.id));
const activeTab = ref((route.query.tab as string) || 'basic');

const loading = ref(false);
const device = ref<DeviceApi.Device | null>(null);
const messages = ref<DeviceApi.DeviceMessage[]>([]);
const messagesLoading = ref(false);

// Mock 家庭数据
const families = [
  { id: 1, name: '我的家' },
  { id: 2, name: '李四的家' },
  { id: 3, name: '赵六的家' },
];

const statusMap: Record<string, { color: string; text: string }> = {
  online: { text: '在线', color: 'success' },
  offline: { text: '离线', color: 'default' },
  fault: { text: '故障', color: 'error' },
};

const messageLevelMap: Record<string, string> = {
  info: 'blue',
  warning: 'orange',
  error: 'red',
};

async function loadDevice() {
  loading.value = true;
  try {
    const res = await getDevice(deviceId.value);
    device.value = res;
  } catch {
    message.error('加载设备信息失败');
  } finally {
    loading.value = false;
  }
}

async function loadMessages() {
  messagesLoading.value = true;
  try {
    const res = await getDeviceMessageList({
      deviceId: deviceId.value,
      pageSize: 20,
    });
    messages.value = res.items;
  } catch {
    // ignore
  } finally {
    messagesLoading.value = false;
  }
}

function onTabChange(key: string) {
  activeTab.value = key;
  router.replace({ query: { ...route.query, tab: key } });

  if (key === 'messages' && messages.value.length === 0) {
    loadMessages();
  }
}

function goBack() {
  router.push('/device/list');
}

async function onFamilyChange(familyId: number) {
  message.success('家庭绑定成功');
  if (device.value) {
    // 更新设备关联的家庭信息
    if (!device.value.familyIds) {
      device.value.familyIds = [];
    }
    if (!device.value.familyIds.includes(familyId)) {
      device.value.familyIds.push(familyId);
    }
    if (!device.value.familyNames) {
      device.value.familyNames = [];
    }
    const familyName = families.find((f) => f.id === familyId)?.name;
    if (familyName && !device.value.familyNames.includes(familyName)) {
      device.value.familyNames.push(familyName);
    }
  }
}

const messageColumns = [
  { title: '类型', dataIndex: 'type', width: 100 },
  { title: '级别', dataIndex: 'level', width: 80 },
  { title: '标题', dataIndex: 'title', width: 150 },
  { title: '内容', dataIndex: 'content', ellipsis: true },
  { title: '时间', dataIndex: 'createdAt', width: 180 },
];

onMounted(() => {
  loadDevice();
});

watch(deviceId, () => {
  loadDevice();
  messages.value = [];
});
</script>

<template>
  <Page auto-content-height>
    <template #title>
      <div class="flex items-center gap-2">
        <Button @click="goBack">返回</Button>
        <span>设备详情</span>
        <template v-if="device">
          <span class="text-gray-400">-</span>
          <span>{{ device.name }}</span>
          <Tag :color="statusMap[device.status]?.color">
            {{ statusMap[device.status]?.text }}
          </Tag>
        </template>
      </div>
    </template>

    <Spin :spinning="loading">
      <Card v-if="device">
        <Tabs v-model:active-key="activeTab" @change="onTabChange">
          <!-- 基础信息 Tab -->
          <TabPane key="basic" tab="基础信息">
            <Descriptions :column="2" bordered>
              <DescriptionsItem label="设备ID">
                {{ device.id }}
              </DescriptionsItem>
              <DescriptionsItem label="设备SN">
                {{ device.sn }}
              </DescriptionsItem>
              <DescriptionsItem label="设备名称">
                {{ device.name }}
              </DescriptionsItem>
              <DescriptionsItem label="设备型号">
                {{ device.modelName }}
              </DescriptionsItem>
              <DescriptionsItem label="状态">
                <Tag :color="statusMap[device.status]?.color">
                  {{ statusMap[device.status]?.text }}
                </Tag>
              </DescriptionsItem>
              <DescriptionsItem label="固件版本">
                {{ device.firmware || '-' }}
              </DescriptionsItem>
              <DescriptionsItem label="MAC地址">
                {{ device.mac || '-' }}
              </DescriptionsItem>
              <DescriptionsItem label="所属家庭">
                {{ device.familyNames?.join(', ') || '未绑定' }}
              </DescriptionsItem>
              <DescriptionsItem label="最后在线">
                {{ device.lastOnlineTime }}
              </DescriptionsItem>
              <DescriptionsItem label="入库时间">
                {{ device.createdAt }}
              </DescriptionsItem>
            </Descriptions>
          </TabPane>

          <!-- 网络信息 Tab -->
          <TabPane key="network" tab="网络信息">
            <Descriptions :column="2" bordered>
              <DescriptionsItem label="连接类型">Wi-Fi</DescriptionsItem>
              <DescriptionsItem label="Wi-Fi名称">
                Home_WiFi_5G
              </DescriptionsItem>
              <DescriptionsItem label="MAC地址">
                {{ device.mac || '-' }}
              </DescriptionsItem>
              <DescriptionsItem label="IP地址">192.168.1.101</DescriptionsItem>
              <DescriptionsItem label="信号强度">
                <Tag color="green">优秀 (-45 dBm)</Tag>
              </DescriptionsItem>
              <DescriptionsItem label="最后连接">
                {{ device.lastOnlineTime }}
              </DescriptionsItem>
            </Descriptions>
          </TabPane>

          <!-- 实时属性 Tab -->
          <TabPane key="properties" tab="实时属性">
            <template
              v-if="
                device.properties && Object.keys(device.properties).length > 0
              "
            >
              <Descriptions :column="2" bordered>
                <DescriptionsItem
                  v-for="(value, key) in device.properties"
                  :key="key"
                  :label="key"
                >
                  <template v-if="typeof value === 'boolean'">
                    <Badge
                      :status="value ? 'success' : 'default'"
                      :text="value ? '开' : '关'"
                    />
                  </template>
                  <template v-else>
                    {{ value }}
                  </template>
                </DescriptionsItem>
              </Descriptions>
            </template>
            <Empty v-else description="暂无属性数据" />
          </TabPane>

          <!-- 消息列表 Tab -->
          <TabPane key="messages" tab="消息列表">
            <Spin :spinning="messagesLoading">
              <Table
                :columns="messageColumns"
                :data-source="messages"
                :pagination="false"
                size="small"
                row-key="id"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.dataIndex === 'level'">
                    <Tag :color="messageLevelMap[record.level]">
                      {{ record.level }}
                    </Tag>
                  </template>
                </template>
              </Table>
              <Empty
                v-if="messages.length === 0 && !messagesLoading"
                description="暂无消息"
              />
            </Spin>
          </TabPane>

          <!-- 家庭绑定 Tab -->
          <TabPane key="family" tab="家庭绑定">
            <div class="py-4">
              <div class="mb-4">
                <span class="mr-2">当前家庭:</span>
                <template v-if="device.familyNames && device.familyNames.length > 0">
                  <Tag
                    v-for="(familyName, idx) in device.familyNames"
                    :key="idx"
                    color="blue"
                    class="mr-2"
                  >
                    {{ familyName }}
                  </Tag>
                </template>
                <span v-else class="text-gray-400">未绑定</span>
              </div>
              <div class="flex items-center gap-4">
                <span>添加到家庭:</span>
                <Select
                  :value="device.familyIds?.[0]"
                  placeholder="请选择家庭"
                  style="width: 200px"
                  allow-clear
                  @change="onFamilyChange"
                >
                  <Select.Option
                    v-for="family in families"
                    :key="family.id"
                    :value="family.id"
                  >
                    {{ family.name }}
                  </Select.Option>
                </Select>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </Card>

      <Empty v-else-if="!loading" description="设备不存在" />
    </Spin>
  </Page>
</template>
