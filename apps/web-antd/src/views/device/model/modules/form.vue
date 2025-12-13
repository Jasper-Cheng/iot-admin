<script lang="ts" setup>
import type { DeviceModelApi } from '#/api/iot/device-model';
import type { ThingModelApi } from '#/api/iot/thing-model';

import { computed, inject, nextTick, ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { createDeviceModel, updateDeviceModel } from '#/api/iot/device-model';
import { getThingModel } from '#/api/iot/thing-model';

import { useFormSchema } from '../data';
import EventsEditor from './events-editor.vue';
import PropertiesEditor from './properties-editor.vue';
import ServicesEditor from './services-editor.vue';

const emits = defineEmits(['success']);

// 从父组件获取物模型选项
const thingModelOptions = inject<ReturnType<typeof ref<Array<{ label: string; value: number }>>>>('thingModelOptions', ref([]));

const formData = ref<DeviceModelApi.DeviceModel>();
const thingModelData = ref<ThingModelApi.ThingModel | null>(null);
const propertiesValue = ref<string>('');
const servicesValue = ref<string>('');
const eventsValue = ref<string>('');

const id = ref<number>();
const thingModelId = ref<number | undefined>();

const isInitializing = ref(false);

const [Form, formApi] = useVbenForm({
  schema: computed(() => useFormSchema(thingModelOptions.value)),
  showDefaultActions: false,
  handleValuesChange: async (values, changedFields) => {
    // 在初始化过程中，不触发 watch
    if (isInitializing.value) {
      return;
    }
    if (changedFields.includes('thingModelId')) {
      const newThingModelId = values.thingModelId as number | undefined;
      if (newThingModelId !== thingModelId.value) {
        thingModelId.value = newThingModelId;
      }
    }
  },
});

// 监听物模型选择（仅在用户手动选择时触发，编辑模式下不触发）
watch(
  thingModelId,
  async (newThingModelId, oldThingModelId) => {
    // 在初始化过程中，不触发 watch（编辑模式下已在 onOpenChange 中加载）
    if (isInitializing.value) {
      return;
    }
    
    if (newThingModelId) {
      try {
        const thingModel = await getThingModel(newThingModelId);
        thingModelData.value = thingModel;
        // 重置属性/服务/事件为空（新增模式或用户切换物模型）
        propertiesValue.value = '';
        servicesValue.value = '[]';
        eventsValue.value = '[]';
      } catch {
        thingModelData.value = null;
      }
    } else {
      thingModelData.value = null;
      propertiesValue.value = '';
      servicesValue.value = '[]';
      eventsValue.value = '[]';
    }
  },
);

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    drawerApi.lock();

    try {
      // 合并物模型的属性/服务/事件和新增的
      let properties: Record<string, any> = {};
      let services: string[] = [];
      let events: string[] = [];

      // 合并属性
      if (thingModelData.value?.properties) {
        properties = { ...thingModelData.value.properties };
      }
      if (propertiesValue.value) {
        try {
          const newProperties = JSON.parse(propertiesValue.value);
          properties = { ...properties, ...newProperties };
        } catch {
          // 忽略解析错误
        }
      }

      // 合并服务
      if (thingModelData.value?.services) {
        const baseServices = Array.isArray(thingModelData.value.services)
          ? thingModelData.value.services
          : [];
        services = [...baseServices];
      }
      if (servicesValue.value) {
        try {
          const newServices = JSON.parse(servicesValue.value);
          if (Array.isArray(newServices)) {
            services = [...services, ...newServices];
          }
        } catch {
          // 忽略解析错误
        }
      }

      // 合并事件
      if (thingModelData.value?.events) {
        const baseEvents = Array.isArray(thingModelData.value.events)
          ? thingModelData.value.events
          : [];
        events = [...baseEvents];
      }
      if (eventsValue.value) {
        try {
          const newEvents = JSON.parse(eventsValue.value);
          if (Array.isArray(newEvents)) {
            events = [...events, ...newEvents];
          }
        } catch {
          // 忽略解析错误
        }
      }

      const payload = {
        ...values,
        properties,
        services,
        events,
      } as DeviceModelApi.CreateDeviceModelParams;

      await (id.value
        ? updateDeviceModel(id.value, payload)
        : createDeviceModel(payload));
      emits('success');
      drawerApi.close();
    } catch {
      drawerApi.unlock();
    }
  },

  async onOpenChange(isOpen) {
    if (isOpen) {
      isInitializing.value = true;
      const data = drawerApi.getData<DeviceModelApi.DeviceModel>();
      formApi.resetForm();
      thingModelData.value = null;
      propertiesValue.value = '';
      servicesValue.value = '[]';
      eventsValue.value = '[]';
      thingModelId.value = undefined;

      if (data && data.id) {
        formData.value = data;
        id.value = data.id;
      } else {
        formData.value = undefined;
        id.value = undefined;
      }

      await nextTick();
      if (data && data.id) {
        // 编辑时，如果有物模型ID，直接加载物模型数据（不通过 watch，避免重复请求）
        if (data.thingModelId) {
          thingModelId.value = data.thingModelId;
          try {
            const thingModel = await getThingModel(data.thingModelId);
            thingModelData.value = thingModel;
            // 解析现有的属性/服务/事件，分离出新增的部分
            if (data.properties) {
              const baseProps = thingModel.properties || {};
              const existingProps = typeof data.properties === 'string'
                ? JSON.parse(data.properties)
                : data.properties;
              const newProps: Record<string, any> = {};
              Object.keys(existingProps).forEach((key) => {
                if (!baseProps[key]) {
                  newProps[key] = existingProps[key];
                }
              });
              propertiesValue.value = JSON.stringify(newProps);
            }
            if (data.services) {
              const baseServices = Array.isArray(thingModel.services)
                ? thingModel.services
                : [];
              const existingServices = Array.isArray(data.services)
                ? data.services
                : (typeof data.services === 'string' ? JSON.parse(data.services) : []);
              const newServices = existingServices.filter(
                (s: string) => !baseServices.includes(s),
              );
              servicesValue.value = JSON.stringify(newServices);
            }
            if (data.events) {
              const baseEvents = Array.isArray(thingModel.events)
                ? thingModel.events
                : [];
              const existingEvents = Array.isArray(data.events)
                ? data.events
                : (typeof data.events === 'string' ? JSON.parse(data.events) : []);
              const newEvents = existingEvents.filter(
                (e: string) => !baseEvents.includes(e),
              );
              eventsValue.value = JSON.stringify(newEvents);
            }
          } catch {
            // 忽略错误
          }
        }
        // 最后设置表单值，此时 thingModelId 已经设置，且 isInitializing 为 true，不会触发 watch
        await formApi.setValues(data);
      }
      await nextTick();
      isInitializing.value = false;
    }
  },
});

const getDrawerTitle = computed(() => {
  return id.value ? '编辑型号' : '新增型号';
});
</script>

<template>
  <Drawer :title="getDrawerTitle" class="w-[1200px]">
    <Form />
    <div v-if="thingModelId" class="mt-4">
      <div class="mb-4">
        <PropertiesEditor
          v-model="propertiesValue"
          :base-properties="thingModelData?.properties"
        />
      </div>
      <div class="mb-4">
        <ServicesEditor
          v-model="servicesValue"
          :base-services="
            Array.isArray(thingModelData?.services)
              ? thingModelData.services
              : []
          "
        />
      </div>
      <div class="mb-4">
        <EventsEditor
          v-model="eventsValue"
          :base-events="
            Array.isArray(thingModelData?.events)
              ? thingModelData.events
              : []
          "
        />
      </div>
    </div>
  </Drawer>
</template>
