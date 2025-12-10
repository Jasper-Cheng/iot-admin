<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

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
  baseProperties?: Record<string, Property>; // 物模型的基础属性（只读）
}>();

const emits = defineEmits<{
  'update:modelValue': [value: string];
}>();

const properties = ref<Record<string, Property>>({});
const newProperties = ref<Record<string, Property>>({}); // 新增的属性

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

// 合并基础属性和新增属性
function mergeProperties() {
  const base = props.baseProperties || {};
  const newProps = newProperties.value;
  properties.value = { ...base, ...newProps };
}

// 初始化
watch(
  () => [props.modelValue, props.baseProperties],
  () => {
    const existing = parseProperties(props.modelValue);
    // 分离基础属性和新增属性
    const base = props.baseProperties || {};
    const baseKeys = Object.keys(base);
    const existingKeys = Object.keys(existing);
    
    // 新增的属性 = 现有属性中不属于基础属性的部分
    const newProps: Record<string, Property> = {};
    existingKeys.forEach((key) => {
      if (!baseKeys.includes(key)) {
        const prop = existing[key];
        if (prop) {
          newProps[key] = prop;
        }
      }
    });
    
    newProperties.value = newProps;
    mergeProperties();
  },
  { immediate: true, deep: true },
);

// 序列化为 JSON 字符串
function serializeProperties() {
  try {
    // 只序列化新增的属性
    const json = JSON.stringify(newProperties.value);
    emits('update:modelValue', json);
  } catch (error) {
    message.error('属性格式错误');
  }
}

// 添加新属性
function addProperty() {
  const key = `property_${Date.now()}`;
  newProperties.value[key] = {
    type: 'string',
  };
  mergeProperties();
  serializeProperties();
}

// 删除新属性
function removeProperty(key: string) {
  delete newProperties.value[key];
  mergeProperties();
  serializeProperties();
}

// 更新属性名
function updatePropertyName(oldKey: string, newKey: string) {
  if (oldKey === newKey) return;
  if (!newKey || newKey.trim() === '') {
    message.warning('属性名不能为空');
    return;
  }
  if (properties.value[newKey]) {
    message.warning('属性名已存在');
    return;
  }
  const prop = newProperties.value[oldKey];
  if (prop) {
    newProperties.value[newKey] = prop;
    delete newProperties.value[oldKey];
  }
  mergeProperties();
  serializeProperties();
}

// 更新属性类型
function updatePropertyType(key: string, type: string) {
  if (!newProperties.value[key]) return;
  newProperties.value[key].type = type;
  // 根据类型清理不相关的字段
  if (type !== 'int' && type !== 'float') {
    delete newProperties.value[key].min;
    delete newProperties.value[key].max;
    delete newProperties.value[key].precision;
  }
  if (type !== 'enum') {
    delete newProperties.value[key].enum;
  }
  serializeProperties();
}

// 更新属性值
function updatePropertyField(key: string, field: string, value: any) {
  const prop = newProperties.value[key];
  if (!prop) return;
  if (value === '' || value === null || value === undefined) {
    delete (prop as any)[field];
  } else {
    (prop as any)[field] = value;
  }
  serializeProperties();
}

// 更新枚举值
function updateEnum(key: string, value: string) {
  if (!newProperties.value[key]) return;
  try {
    const enumArray = value.split(',').map((v) => v.trim()).filter((v) => v);
    if (enumArray.length > 0) {
      newProperties.value[key].enum = enumArray;
    } else {
      delete newProperties.value[key].enum;
    }
    serializeProperties();
  } catch {
    message.error('枚举值格式错误');
  }
}

const columns = [
  {
    dataIndex: 'name',
    title: '属性名',
    width: 150,
  },
  {
    dataIndex: 'type',
    title: '类型',
    width: 120,
  },
  {
    dataIndex: 'unit',
    title: '单位',
    width: 100,
  },
  {
    dataIndex: 'default',
    title: '默认值',
    width: 120,
  },
  {
    dataIndex: 'min',
    title: '最小值',
    width: 100,
  },
  {
    dataIndex: 'max',
    title: '最大值',
    width: 100,
  },
  {
    dataIndex: 'enum',
    title: '枚举值',
    width: 200,
  },
  {
    dataIndex: 'precision',
    title: '精度',
    width: 80,
  },
  {
    dataIndex: 'action',
    title: '操作',
    width: 80,
    fixed: 'right' as const,
  },
];

const tableData = computed(() => {
  const base = props.baseProperties || {};
  const baseKeys = Object.keys(base);
  const newKeys = Object.keys(newProperties.value);
  const allKeys = [...baseKeys, ...newKeys];
  
  return allKeys.map((key) => {
    const prop = properties.value[key];
    const isBase = baseKeys.includes(key);
    if (!prop) {
      return {
        key,
        name: key,
        type: 'string',
        unit: '-',
        default: '-',
        min: '-',
        max: '-',
        enum: '-',
        precision: '-',
        isBase,
      };
    }
    return {
      key,
      name: key,
      type: prop.type,
      unit: prop.unit || '-',
      default: prop.default ?? '-',
      min: prop.min ?? '-',
      max: prop.max ?? '-',
      enum: prop.enum ? prop.enum.join(', ') : '-',
      precision: prop.precision ?? '-',
      isBase,
    };
  });
});
</script>

<template>
  <div class="properties-editor">
    <div class="mb-2 flex items-center justify-between">
      <span class="font-medium">新增属性</span>
      <Button type="primary" size="small" @click="addProperty">
        <template #icon>
          <Plus />
        </template>
        添加属性
      </Button>
    </div>

    <Table :columns="columns" :data-source="tableData" :pagination="false" size="small" bordered>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'name'">
          <Input
            v-if="!record.isBase"
            :value="record.name"
            placeholder="属性名"
            @blur="(e: any) => updatePropertyName(record.key, e.target?.value || '')"
          />
          <span v-else class="text-gray-500">{{ record.name }}</span>
        </template>
        <template v-else-if="column.dataIndex === 'type'">
          <Select
            v-if="!record.isBase"
            :value="record.type"
            style="width: 100%"
            @change="(value: any) => {
              if (typeof value === 'string') {
                updatePropertyType(record.key, value);
              }
            }"
          >
            <Select.Option value="string">string</Select.Option>
            <Select.Option value="int">int</Select.Option>
            <Select.Option value="float">float</Select.Option>
            <Select.Option value="boolean">boolean</Select.Option>
            <Select.Option value="enum">enum</Select.Option>
          </Select>
          <span v-else class="text-gray-500">{{ record.type }}</span>
        </template>
        <template v-else-if="column.dataIndex === 'unit'">
          <Input
            v-if="!record.isBase"
            :value="record.unit === '-' ? '' : record.unit"
            placeholder="单位"
            @blur="(e: any) => updatePropertyField(record.key, 'unit', e.target?.value || '')"
          />
          <span v-else class="text-gray-500">{{ record.unit }}</span>
        </template>
        <template v-else-if="column.dataIndex === 'default'">
          <Input
            v-if="!record.isBase"
            :value="record.default === '-' ? '' : String(record.default)"
            placeholder="默认值"
            @blur="(e: any) => updatePropertyField(record.key, 'default', e.target?.value || '')"
          />
          <span v-else class="text-gray-500">{{ record.default }}</span>
        </template>
        <template v-else-if="column.dataIndex === 'min'">
          <InputNumber
            v-if="!record.isBase && (record.type === 'int' || record.type === 'float')"
            :value="record.min === '-' ? undefined : Number(record.min)"
            placeholder="最小值"
            style="width: 100%"
            @change="(value: number | string | null) => updatePropertyField(record.key, 'min', typeof value === 'number' ? value : undefined)"
          />
          <span v-else class="text-gray-500">{{ record.min }}</span>
        </template>
        <template v-else-if="column.dataIndex === 'max'">
          <InputNumber
            v-if="!record.isBase && (record.type === 'int' || record.type === 'float')"
            :value="record.max === '-' ? undefined : Number(record.max)"
            placeholder="最大值"
            style="width: 100%"
            @change="(value: number | string | null) => updatePropertyField(record.key, 'max', typeof value === 'number' ? value : undefined)"
          />
          <span v-else class="text-gray-500">{{ record.max }}</span>
        </template>
        <template v-else-if="column.dataIndex === 'enum'">
          <Input
            v-if="!record.isBase && record.type === 'enum'"
            :value="record.enum === '-' ? '' : record.enum"
            placeholder="枚举值，用逗号分隔"
            @blur="(e: any) => updateEnum(record.key, e.target?.value || '')"
          />
          <span v-else class="text-gray-500">{{ record.enum }}</span>
        </template>
        <template v-else-if="column.dataIndex === 'precision'">
          <InputNumber
            v-if="!record.isBase && record.type === 'float'"
            :value="record.precision === '-' ? undefined : Number(record.precision)"
            placeholder="精度"
            :min="0"
            :max="10"
            style="width: 100%"
            @change="(value: number | string | null) => updatePropertyField(record.key, 'precision', typeof value === 'number' ? value : undefined)"
          />
          <span v-else class="text-gray-500">{{ record.precision }}</span>
        </template>
        <template v-else-if="column.dataIndex === 'action'">
          <Button
            v-if="!record.isBase"
            type="link"
            danger
            size="small"
            @click="removeProperty(record.key)"
          >
            删除
          </Button>
          <span v-else class="text-gray-400 text-xs">基础属性</span>
        </template>
      </template>
    </Table>
  </div>
</template>

<style scoped>
.properties-editor {
  width: 100%;
}
</style>

