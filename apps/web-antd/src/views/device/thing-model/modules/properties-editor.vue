<script lang="ts" setup>
import { ref, watch } from 'vue';

import { Button, Input, InputNumber, message, Select, Table } from 'ant-design-vue';

import { Plus } from '@vben/icons';

interface Property {
  type: string;
  unit?: string;
  default?: any;
  min?: number;
  max?: number;
  enum?: string[];
  precision?: number;
}

const props = defineProps<{
  modelValue?: string;
}>();

const emits = defineEmits<{
  'update:modelValue': [value: string];
}>();

const properties = ref<Record<string, Property>>({});

// 解析 JSON 字符串
function parseProperties(value?: string): Record<string, Property> {
  if (!value) return {};
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    return parsed || {};
  } catch {
    return {};
  }
}

// 初始化
watch(
  () => props.modelValue,
  (value) => {
    properties.value = parseProperties(value);
  },
  { immediate: true },
);

// 序列化为 JSON 字符串
function serializeProperties() {
  try {
    const json = JSON.stringify(properties.value);
    emits('update:modelValue', json);
  } catch (error) {
    message.error('属性格式错误');
  }
}

// 添加属性
function addProperty() {
  const key = `property_${Date.now()}`;
  properties.value[key] = {
    type: 'string',
  };
  serializeProperties();
}

// 删除属性
function removeProperty(key: string) {
  delete properties.value[key];
  serializeProperties();
}

// 更新属性名
function updatePropertyName(oldKey: string | undefined, newKey: string) {
  if (!oldKey || oldKey === newKey || !newKey) return;
  if (properties.value[newKey]) {
    message.warning('属性名已存在');
    return;
  }
  const value = properties.value[oldKey];
  if (value) {
    delete properties.value[oldKey];
    properties.value[newKey] = value;
    serializeProperties();
  }
}

// 更新属性字段
function updateProperty(key: string | undefined, field: keyof Property, value: any) {
  if (!key || !properties.value[key]) return;
  properties.value[key] = {
    ...properties.value[key],
    [field]: value === '' ? undefined : value,
  };
  serializeProperties();
}

// 更新枚举值
function updateEnum(key: string | undefined, value: string) {
  if (!key) return;
  const enumValues = value.split(',').map((v) => v.trim()).filter(Boolean);
  updateProperty(key, 'enum', enumValues.length > 0 ? enumValues : undefined);
}

// 辅助函数：安全地更新属性名
function handlePropertyNameUpdate(key: string | undefined, newKey: string) {
  if (key) {
    updatePropertyName(key, newKey);
  }
}

// 辅助函数：安全地更新枚举
function handleEnumUpdate(key: string | undefined, value: string) {
  if (key) {
    updateEnum(key, value);
  }
}

const typeOptions = [
  { label: '布尔值', value: 'boolean' },
  { label: '整数', value: 'int' },
  { label: '浮点数', value: 'float' },
  { label: '字符串', value: 'string' },
  { label: '枚举', value: 'enum' },
  { label: '日期时间', value: 'datetime' },
];

const columns = [
  {
    title: '属性标识',
    dataIndex: 'key',
    key: 'key',
    width: 150,
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    width: 120,
  },
  {
    title: '单位',
    dataIndex: 'unit',
    key: 'unit',
    width: 100,
  },
  {
    title: '默认值',
    dataIndex: 'default',
    key: 'default',
    width: 120,
  },
  {
    title: '最小值',
    dataIndex: 'min',
    key: 'min',
    width: 100,
  },
  {
    title: '最大值',
    dataIndex: 'max',
    key: 'max',
    width: 100,
  },
  {
    title: '枚举值',
    dataIndex: 'enum',
    key: 'enum',
    width: 200,
  },
  {
    title: '精度',
    dataIndex: 'precision',
    key: 'precision',
    width: 80,
  },
  {
    title: '操作',
    key: 'action',
    width: 80,
    fixed: 'right' as const,
  },
];
</script>

<template>
  <div class="properties-editor">
    <div class="mb-4 flex justify-between items-center">
      <span class="font-medium">属性定义</span>
      <Button type="primary" size="small" @click="addProperty">
        <Plus class="size-4" />
        添加属性
      </Button>
    </div>
    <Table
      :columns="columns"
      :data-source="Object.entries(properties).map(([key, prop]) => ({ ...prop, _key: key }))"
      :pagination="false"
      size="small"
      bordered
      :row-key="(record: any) => record._key"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'key'">
          <Input
            :value="record._key || ''"
            size="small"
            placeholder="属性标识"
            @change="(e: any) => handlePropertyNameUpdate((record._key as string | undefined), e.target?.value || '')"
          />
        </template>
        <template v-else-if="column.key === 'type'">
          <Select
            :value="record.type"
            size="small"
            :options="typeOptions"
            style="width: 100%"
            @change="(value) => {
              const key = record._key;
              if (key) {
                updateProperty(key, 'type', value);
              }
            }"
          />
        </template>
        <template v-else-if="column.key === 'unit'">
          <Input
            :value="record.unit"
            size="small"
            placeholder="单位"
            @change="(e) => {
              const key = record._key;
              if (key) {
                updateProperty(key, 'unit', e.target.value);
              }
            }"
          />
        </template>
        <template v-else-if="column.key === 'default'">
          <Input
            v-if="record.type === 'string' || record.type === 'enum'"
            :value="record.default"
            size="small"
            placeholder="默认值"
            @change="(e) => {
              const key = record._key;
              if (key) {
                updateProperty(key, 'default', e.target.value);
              }
            }"
          />
          <InputNumber
            v-else
            :value="record.default"
            size="small"
            style="width: 100%"
            @change="(value) => {
              const key = record._key;
              if (key) {
                updateProperty(key, 'default', value);
              }
            }"
          />
        </template>
        <template v-else-if="column.key === 'min'">
          <InputNumber
            :value="record.min"
            size="small"
            style="width: 100%"
            @change="(value) => {
              const key = record._key;
              if (key) {
                updateProperty(key, 'min', value);
              }
            }"
          />
        </template>
        <template v-else-if="column.key === 'max'">
          <InputNumber
            :value="record.max"
            size="small"
            style="width: 100%"
            @change="(value) => {
              const key = record._key;
              if (key) {
                updateProperty(key, 'max', value);
              }
            }"
          />
        </template>
        <template v-else-if="column.key === 'enum'">
          <Input
            :value="record.enum ? record.enum.join(', ') : ''"
            size="small"
            placeholder="枚举值，用逗号分隔"
            @change="(e: any) => handleEnumUpdate((record._key as string | undefined), e.target?.value || '')"
          />
        </template>
        <template v-else-if="column.key === 'precision'">
          <InputNumber
            v-if="record.type === 'float'"
            :value="record.precision"
            size="small"
            :min="0"
            :max="10"
            style="width: 100%"
            @change="(value) => {
              const key = record._key;
              if (key) {
                updateProperty(key, 'precision', value);
              }
            }"
          />
          <span v-else class="text-gray-400">-</span>
        </template>
        <template v-else-if="column.key === 'action'">
          <Button
            type="link"
            danger
            size="small"
            @click="removeProperty(record._key || '')"
          >
            删除
          </Button>
        </template>
      </template>
    </Table>
  </div>
</template>

