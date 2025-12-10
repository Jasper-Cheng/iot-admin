<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import { Button, Input, message, Table } from 'ant-design-vue';

import { Plus } from '@vben/icons';

const props = defineProps<{
  modelValue?: string | string[];
  baseServices?: string[]; // 物模型的基础服务（只读）
}>();

const emits = defineEmits<{
  'update:modelValue': [value: string];
}>();

const services = ref<string[]>([]);
const newServices = ref<string[]>([]); // 新增的服务

// 解析 JSON 字符串或数组
function parseServices(value?: string | string[]): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// 合并基础服务和新增服务
function mergeServices() {
  const base = props.baseServices || [];
  const newSvc = newServices.value;
  services.value = [...base, ...newSvc];
}

// 初始化
watch(
  () => [props.modelValue, props.baseServices],
  () => {
    const existing = parseServices(props.modelValue);
    const base = props.baseServices || [];
    // 新增的服务 = 现有服务中不属于基础服务的部分
    newServices.value = existing.filter((s) => !base.includes(s));
    mergeServices();
  },
  { immediate: true, deep: true },
);

// 序列化为 JSON 字符串
function serializeServices() {
  try {
    // 只序列化新增的服务
    const json = JSON.stringify(newServices.value);
    emits('update:modelValue', json);
  } catch (error) {
    message.error('服务格式错误');
  }
}

// 添加新服务
function addService() {
  newServices.value.push('');
  mergeServices();
  serializeServices();
}

// 删除新服务
function removeService(index: number) {
  newServices.value.splice(index, 1);
  mergeServices();
  serializeServices();
}

// 更新服务
function updateService(index: number, value: string) {
  if (index >= 0 && index < newServices.value.length) {
    newServices.value[index] = value;
    mergeServices();
    serializeServices();
  }
}

const columns = [
  {
    dataIndex: 'name',
    title: '服务名称',
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
  const base = props.baseServices || [];
  const baseItems = base.map((service, index) => ({
    key: `base_${index}`,
    name: service,
    isBase: true,
  }));
  const newItems = newServices.value.map((service, index) => ({
    key: `new_${index}`,
    name: service,
    isBase: false,
  }));
  return [...baseItems, ...newItems];
});
</script>

<template>
  <div class="services-editor">
    <div class="mb-2 flex items-center justify-between">
      <span class="font-medium">服务</span>
      <Button type="primary" size="small" @click="addService">
        <template #icon>
          <Plus />
        </template>
        添加服务
      </Button>
    </div>

    <Table :columns="columns" :data-source="tableData" :pagination="false" size="small" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'name'">
          <Input
            v-if="!record.isBase"
            :value="record.name"
            placeholder="请输入服务名称"
            @blur="(e: any) => {
              const index = newServices.findIndex((s, i) => `new_${i}` === record.key);
              if (index >= 0) {
                updateService(index, e.target?.value || '');
              }
            }"
          />
          <span v-else class="text-gray-500">{{ record.name }}</span>
        </template>
        <template v-else-if="column.dataIndex === 'isBase'">
          <span v-if="record.isBase" class="text-gray-400 text-xs">基础服务</span>
          <span v-else class="text-gray-400 text-xs">新增服务</span>
        </template>
        <template v-else-if="column.dataIndex === 'action'">
          <Button
            v-if="!record.isBase"
            type="link"
            danger
            size="small"
            @click="() => {
              const index = newServices.findIndex((s, i) => `new_${i}` === record.key);
              if (index >= 0) {
                removeService(index);
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
.services-editor {
  width: 100%;
}
</style>

