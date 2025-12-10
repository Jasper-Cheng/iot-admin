<script lang="ts" setup>
import { ref, watch } from 'vue';

import { Button, Input, message, Space } from 'ant-design-vue';

import { Plus } from '@vben/icons';

const props = defineProps<{
  modelValue?: string | string[];
}>();

const emits = defineEmits<{
  'update:modelValue': [value: string];
}>();

const events = ref<string[]>([]);

// 解析 JSON 字符串或数组
function parseEvents(value?: string | string[]): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// 初始化
watch(
  () => props.modelValue,
  (value) => {
    events.value = parseEvents(value);
  },
  { immediate: true },
);

// 序列化为 JSON 字符串
function serializeEvents() {
  try {
    const json = JSON.stringify(events.value);
    emits('update:modelValue', json);
  } catch (error) {
    message.error('事件格式错误');
  }
}

// 添加事件
function addEvent() {
  events.value.push('');
  serializeEvents();
}

// 删除事件
function removeEvent(index: number) {
  events.value.splice(index, 1);
  serializeEvents();
}

// 更新事件
function updateEvent(index: number, value: string) {
  events.value[index] = value;
  serializeEvents();
}
</script>

<template>
  <div class="events-editor">
    <div class="mb-4 flex justify-between items-center">
      <span class="font-medium">事件定义</span>
      <Button type="primary" size="small" @click="addEvent">
        <Plus class="size-4" />
        添加事件
      </Button>
    </div>
    <Space direction="vertical" style="width: 100%" :size="8">
      <div
        v-for="(event, index) in events"
        :key="index"
        class="flex items-center gap-2"
      >
        <Input
          :value="event"
          placeholder="请输入事件名称"
          @change="(e: any) => updateEvent(index, e.target?.value || '')"
        />
        <Button
          type="link"
          danger
          size="small"
          @click="removeEvent(index)"
        >
          删除
        </Button>
      </div>
      <div v-if="events.length === 0" class="text-gray-400 text-center py-4">
        暂无事件，点击上方按钮添加
      </div>
    </Space>
  </div>
</template>

