<script lang="ts" setup>
import type { VersionApi } from '#/api/iot/version';

import { computed, nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { createVersion, updateVersion } from '#/api/iot/version';

import { useFormSchema } from '../data';

const emits = defineEmits(['success']);

const formData = ref<VersionApi.AppVersion>();

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
        ? updateVersion(id.value, values)
        : createVersion(values));
      emits('success');
      drawerApi.close();
    } catch {
      drawerApi.unlock();
    }
  },

  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<VersionApi.AppVersion>();
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
  return id.value ? '编辑版本' : '新增版本';
});
</script>

<template>
  <Drawer :title="getDrawerTitle" class="w-[500px]">
    <Form />
  </Drawer>
</template>
