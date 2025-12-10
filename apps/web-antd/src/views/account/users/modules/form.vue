<script lang="ts" setup>
import type { UserApi } from '#/api/iot/user';
import type { UploadFile } from 'ant-design-vue';

import { computed, nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { createUser, updateUser } from '#/api/iot/user';

import { useFormSchema } from '../data';

const emits = defineEmits(['success']);

const formData = ref<UserApi.AppUser>();

// 将文件转换为 base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

// 从 fileList 中提取头像 URL
async function getAvatarFromFileList(fileList?: UploadFile[]): Promise<string | undefined> {
  if (!fileList || fileList.length === 0) {
    return undefined;
  }

  const file = fileList[0];
  // 如果文件已经有 URL（编辑时已有的头像）
  if (file.url) {
    return file.url;
  }
  // 如果是新上传的文件，转换为 base64
  if (file.originFileObj) {
    return await fileToBase64(file.originFileObj);
  }
  return undefined;
}

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
      // 处理头像上传
      const avatar = await getAvatarFromFileList(values.avatar);
      const payload = { ...values };
      // 移除 fileList 和 confirmPassword，只保留 avatar URL
      delete (payload as any).avatar;
      delete (payload as any).confirmPassword;
      if (avatar) {
        (payload as any).avatar = avatar;
      }

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
        // 如果有头像 URL，转换为 fileList 格式
        const fileList = data.avatar
          ? [
              {
                uid: '-1',
                name: 'avatar',
                status: 'done',
                url: data.avatar,
              } as UploadFile,
            ]
          : [];
        formApi.setValues({
          ...data,
          avatar: fileList,
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

