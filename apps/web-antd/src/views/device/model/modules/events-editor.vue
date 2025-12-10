<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import { Button, Input, message, Table } from 'ant-design-vue';

import { Plus } from '@vben/icons';

const props = defineProps<{
  modelValue?: string | string[];
  baseEvents?: string[]; // 物模型的基础事件（只读）
}>();

const emits = defineEmits<{
  'update:modelValue': [value: string];
}>();

const events = ref<string[]>([]);
const newEvents = ref<string[]>([]); // 新增的事件

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

// 合并基础事件和新增事件
function mergeEvents() {
  const base = props.baseEvents || [];
  const newEvt = newEvents.value;
  events.value = [...base, ...newEvt];
}

// 初始化
watch(
  () => [props.modelValue, props.baseEvents],
  () => {
    const existing = parseEvents(props.modelValue);
    const base = props.baseEvents || [];
    // 新增的事件 = 现有事件中不属于基础事件的部分
    newEvents.value = existing.filter((e) => !base.includes(e));
    mergeEvents();
  },
  { immediate: true, deep: true },
);

// 序列化为 JSON 字符串
function serializeEvents() {
  try {
    // 只序列化新增的事件
    const json = JSON.stringify(newEvents.value);
    emits('update:modelValue', json);
  } catch (error) {
    message.error('事件格式错误');
  }
}

// 添加新事件
function addEvent() {
  newEvents.value.push('');
  mergeEvents();
  serializeEvents();
}

// 删除新事件
function removeEvent(index: number) {
  newEvents.value.splice(index, 1);
  mergeEvents();
  serializeEvents();
}

// 更新事件
function updateEvent(index: number, value: string) {
  if (index >= 0 && index < newEvents.value.length) {
    newEvents.value[index] = value;
    mergeEvents();
    serializeEvents();
  }
}

const columns = [
  {
    dataIndex: 'name',
    title: '事件名称',
    width: 300,
  },
  {
    dataIndex: 'isBase',
    title: '类型',
    width: 100,
  },
  {
    dataIndex: 'action',
    title: '操作',
    width: 100,
    fixed: 'right' as const,
  },
];

const tableData = computed(() => {
  const base = props.baseEvents || [];
  const baseItems = base.map((event, index) => ({
    key: `base_${index}`,
    name: event,
    isBase: true,
  }));
  const newItems = newEvents.value.map((event, index) => ({
    key: `new_${index}`,
    name: event,
    isBase: false,
  }));
  return [...baseItems, ...newItems];
});
</script>

<template>
  <div class="events-editor">
    <div class="mb-2 flex items-center justify-between">
      <span class="font-medium">事件</span>
      <Button type="primary" size="small" @click="addEvent">
        <template #icon>
          <Plus />
        </template>
        添加事件
      </Button>
    </div>

    <Table :columns="columns" :data-source="tableData" :pagination="false" size="small" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'name'">
          <Input
            v-if="!record.isBase"
            :value="record.name"
            placeholder="请输入事件名称"
            @blur="(e: any) => {
              const index = newEvents.findIndex((_, i) => `new_${i}` === record.key);
              if (index >= 0) {
                updateEvent(index, e.target?.value || '');
              }
            }"
          />
          <span v-else class="text-gray-500">{{ record.name }}</span>
        </template>
        <template v-else-if="column.dataIndex === 'isBase'">
          <span v-if="record.isBase" class="text-gray-400 text-xs">基础事件</span>
          <span v-else class="text-gray-400 text-xs">新增事件</span>
        </template>
        <template v-else-if="column.dataIndex === 'action'">
          <Button
            v-if="!record.isBase"
            type="link"
            danger
            size="small"
            @click="() => {
              const index = newEvents.findIndex((_, i) => `new_${i}` === record.key);
              if (index >= 0) {
                removeEvent(index);
              }
            }"
          >
            删除
          </Button>
          <span v-else class="text-gray-400 text-xs">-</span>
        </template>
      </template>
    </Table>
  </div>
</template>

<style scoped>
.events-editor {
  width: 100%;
}
</style>

