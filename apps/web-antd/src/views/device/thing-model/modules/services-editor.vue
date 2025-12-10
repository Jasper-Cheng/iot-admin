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

const services = ref<string[]>([]);

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

// 初始化
watch(
  () => props.modelValue,
  (value) => {
    services.value = parseServices(value);
  },
  { immediate: true },
);

// 序列化为 JSON 字符串
function serializeServices() {
  try {
    const json = JSON.stringify(services.value);
    emits('update:modelValue', json);
  } catch (error) {
    message.error('服务格式错误');
  }
}

// 添加服务
function addService() {
  services.value.push('');
  serializeServices();
}

// 删除服务
function removeService(index: number) {
  services.value.splice(index, 1);
  serializeServices();
}

// 更新服务
function updateService(index: number, value: string) {
  services.value[index] = value;
  serializeServices();
}
</script>

<template>
  <div class="services-editor">
    <div class="mb-4 flex justify-between items-center">
      <span class="font-medium">服务定义</span>
      <Button type="primary" size="small" @click="addService">
        <Plus class="size-4" />
        添加服务
      </Button>
    </div>
    <Space direction="vertical" style="width: 100%" :size="8">
      <div
        v-for="(service, index) in services"
        :key="index"
        class="flex items-center gap-2"
      >
        <Input
          :value="service"
          placeholder="请输入服务名称"
          @change="(e: any) => updateService(index, e.target?.value || '')"
        />
        <Button
          type="link"
          danger
          size="small"
          @click="removeService(index)"
        >
          删除
        </Button>
      </div>
      <div v-if="services.length === 0" class="text-gray-400 text-center py-4">
        暂无服务，点击上方按钮添加
      </div>
    </Space>
  </div>
</template>

