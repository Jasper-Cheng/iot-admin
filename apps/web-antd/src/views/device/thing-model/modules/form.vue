<script lang="ts" setup>
import type { ThingModelApi } from '#/api/iot/thing-model';

import { computed, nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { createThingModel, updateThingModel } from '#/api/iot/thing-model';

import { useFormSchema } from '../data';

const emits = defineEmits(['success']);

const formData = ref<ThingModelApi.ThingModel>();

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
});

const id = ref<number>();

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    drawerApi.lock();

    try {
      await (id.value
        ? updateThingModel(id.value, values)
        : createThingModel({
            ...values,
            properties: [],
          }));
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
      } else {
        formData.value = undefined;
        id.value = undefined;
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
  <Drawer :title="getDrawerTitle" class="w-[500px]">
    <Form />
  </Drawer>
</template>
