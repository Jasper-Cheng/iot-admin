<script lang="ts" setup>
import type { DeviceModelApi } from '#/api/iot/device-model';

import { computed, nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { createDeviceModel, updateDeviceModel } from '#/api/iot/device-model';

import { useFormSchema } from '../data';

const emits = defineEmits(['success']);

const formData = ref<DeviceModelApi.DeviceModel>();

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
        ? updateDeviceModel(id.value, values)
        : createDeviceModel(values));
      emits('success');
      drawerApi.close();
    } catch {
      drawerApi.unlock();
    }
  },

  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<DeviceModelApi.DeviceModel>();
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
  return id.value ? '编辑型号' : '新增型号';
});
</script>

<template>
  <Drawer :title="getDrawerTitle" class="w-[500px]">
    <Form />
  </Drawer>
</template>
