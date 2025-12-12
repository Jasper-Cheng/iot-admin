<script lang="ts" setup>
import type { FamilyApi } from '#/api/iot/family';

import { computed, nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { createFamily, updateFamily } from '#/api/iot/family';

import { useFormSchema } from '../data';

const emits = defineEmits(['success']);

const formData = ref<FamilyApi.Family>();

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
      // 头像直接使用选择的路径，无需处理文件上传
      const payload = { ...values };

      await (id.value
        ? updateFamily(id.value, payload as FamilyApi.UpdateFamilyParams)
        : createFamily(payload as FamilyApi.CreateFamilyParams));
      emits('success');
      drawerApi.close();
    } catch {
      drawerApi.unlock();
    }
  },

  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<FamilyApi.Family>();
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
        // 直接设置头像路径，无需转换为 fileList
        formApi.setValues({
          ...data,
        });
      }
    }
  },
});

const getDrawerTitle = computed(() => {
  return id.value ? '编辑家庭' : '新增家庭';
});
</script>

<template>
  <Drawer :title="getDrawerTitle">
    <Form />
  </Drawer>
</template>

