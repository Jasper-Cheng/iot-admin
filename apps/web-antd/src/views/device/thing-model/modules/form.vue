<script lang="ts" setup>
import type { ThingModelApi } from '#/api/iot/thing-model';

import { computed, nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { createThingModel, updateThingModel } from '#/api/iot/thing-model';

import { useFormSchema } from '../data';
import PropertiesEditor from './properties-editor.vue';
import ServicesEditor from './services-editor.vue';
import EventsEditor from './events-editor.vue';

const emits = defineEmits(['success']);

const formData = ref<ThingModelApi.ThingModel>();

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
});

const id = ref<number>();

// 属性、服务、事件的响应式数据
const propertiesValue = ref<string>('');
const servicesValue = ref<string>('');
const eventsValue = ref<string>('');

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    drawerApi.lock();

    try {
      // 解析 JSON 字符串
      let properties: Record<string, any> = {};
      let services: string[] = [];
      let events: string[] = [];

      try {
        properties = propertiesValue.value
          ? JSON.parse(propertiesValue.value)
          : {};
      } catch {
        properties = {};
      }

      try {
        services = servicesValue.value
          ? JSON.parse(servicesValue.value)
          : [];
      } catch {
        services = [];
      }

      try {
        events = eventsValue.value ? JSON.parse(eventsValue.value) : [];
      } catch {
        events = [];
      }

      const payload = {
        ...values,
        properties,
        services,
        events,
      } as ThingModelApi.CreateThingModelParams;

      await (id.value
        ? updateThingModel(id.value, payload)
        : createThingModel(payload));
      emits('success');
      drawerApi.close();
    } catch {
      drawerApi.unlock();
    }
  },

  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<ThingModelApi.ThingModel>();
      formApi.resetForm();

      if (data && data.id) {
        formData.value = data;
        id.value = data.id;

        // 处理属性、服务、事件数据
        if (data.properties) {
          propertiesValue.value =
            typeof data.properties === 'string'
              ? data.properties
              : JSON.stringify(data.properties);
        } else {
          propertiesValue.value = '';
        }

        if (data.services) {
          servicesValue.value =
            typeof data.services === 'string'
              ? data.services
              : Array.isArray(data.services)
                ? JSON.stringify(data.services)
                : JSON.stringify([]);
        } else {
          servicesValue.value = JSON.stringify([]);
        }

        if (data.events) {
          eventsValue.value =
            typeof data.events === 'string'
              ? data.events
              : Array.isArray(data.events)
                ? JSON.stringify(data.events)
                : JSON.stringify([]);
        } else {
          eventsValue.value = JSON.stringify([]);
        }
      } else {
        formData.value = undefined;
        id.value = undefined;
        propertiesValue.value = '';
        servicesValue.value = JSON.stringify([]);
        eventsValue.value = JSON.stringify([]);
      }

      await nextTick();
      if (data && data.id) {
        formApi.setValues(data);
      }
    }
  },
});

const getDrawerTitle = computed(() => {
  return id.value ? '编辑物模型' : '新增物模型';
});
</script>

<template>
  <Drawer :title="getDrawerTitle" class="w-[1200px]">
    <div class="space-y-6">
    <Form />
      <div class="border-t pt-4">
        <PropertiesEditor v-model="propertiesValue" />
      </div>
      <div class="border-t pt-4">
        <ServicesEditor v-model="servicesValue" />
      </div>
      <div class="border-t pt-4">
        <EventsEditor v-model="eventsValue" />
      </div>
    </div>
  </Drawer>
</template>
