<script lang="ts" setup>
import type { UserApi } from '#/api/iot/user';

import { computed, nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { createUser, updateUser } from '#/api/iot/user';

import { useFormSchema } from '../data';

const emits = defineEmits(['success']);

const formData = ref<UserApi.AppUser>();

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

      await (id.value ? updateUser(id.value, payload) : createUser(payload));
      emits('success');
      drawerApi.close();
    } catch {
      drawerApi.unlock();
    }
  },

  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<UserApi.AppUser>();
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
  return id.value ? '编辑用户' : '新增用户';
});
</script>

<template>
  <Drawer :title="getDrawerTitle">
    <Form />
  </Drawer>
</template>

