<script lang="ts" setup>
import type { AccountApi } from '#/api/iot/account';

import { computed, nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { createAdmin, updateAdmin } from '#/api/iot/account';

import { useFormSchema } from '../data';

const emits = defineEmits(['success']);

const formData = ref<AccountApi.Admin>();

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
      const payload = { ...values };
      // 移除 confirmPassword，avatar 已经是路径字符串
      delete (payload as any).confirmPassword;
      // avatar 字段已经是选择的头像路径（如 /avatars/avatar1.png）

      await (id.value ? updateAdmin(id.value, payload) : createAdmin(payload));
      emits('success');
      drawerApi.close();
    } catch {
      drawerApi.unlock();
    }
  },

  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<AccountApi.Admin>();
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
        // 直接设置头像路径
        formApi.setValues({
          ...data,
          avatar: data.avatar || undefined,
        });
      }
    }
  },
});

const getDrawerTitle = computed(() => {
  return id.value ? '编辑管理员' : '新增管理员';
});
</script>

<template>
  <Drawer :title="getDrawerTitle">
    <Form />
  </Drawer>
</template>
