<script lang="ts" setup>
import type { UserApi } from '#/api/iot/user';

import { computed, nextTick, onMounted, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { createUser, updateUser } from '#/api/iot/user';
import { getRsaPublicKey } from '#/api/core/auth';

import { useFormSchema } from '../data';

const emits = defineEmits(['success']);

const formData = ref<UserApi.AppUser>();
const rsaPublicKey = ref<string>('');

// 获取 RSA 公钥
async function loadRsaPublicKey() {
  try {
    const result = await getRsaPublicKey();
    if (result?.public_key) {
      let publicKey = result.public_key.trim();
      publicKey = publicKey.replace(/\r\n/g, '\n');
      rsaPublicKey.value = publicKey;
    }
  } catch {
    // 静默处理错误
  }
}

// 将 PEM 格式的公钥转换为 CryptoKey（用于 Web Crypto API）
async function importRSAPublicKey(pemKey: string): Promise<CryptoKey> {
  const pemHeader = '-----BEGIN PUBLIC KEY-----';
  const pemFooter = '-----END PUBLIC KEY-----';
  const pemContents = pemKey
    .replace(pemHeader, '')
    .replace(pemFooter, '')
    .replace(/\s/g, '');
  
  const binaryDer = base64ToArrayBuffer(pemContents);
  
  return await crypto.subtle.importKey(
    'spki',
    binaryDer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    false,
    ['encrypt'],
  );
}

// Base64 字符串转 ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// ArrayBuffer 转 Base64 字符串
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    const byte = bytes[i];
    if (byte !== undefined) {
      binary += String.fromCharCode(byte);
    }
  }
  return btoa(binary);
}

// RSA 加密密码
async function encryptPassword(password: string): Promise<string> {
  if (!rsaPublicKey.value) {
    await loadRsaPublicKey();
    if (!rsaPublicKey.value) {
      throw new Error('Failed to load RSA public key');
    }
  }

  const publicKey = await importRSAPublicKey(rsaPublicKey.value);
  const passwordBuffer = new TextEncoder().encode(password);
  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: 'RSA-OAEP',
    },
    publicKey,
    passwordBuffer,
  );
  return arrayBufferToBase64(encryptedBuffer);
}

onMounted(() => {
  loadRsaPublicKey();
});

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
      const payload: any = { ...values };
      // 移除 confirmPassword 和 id（id 仅用于前端验证逻辑判断）
      delete payload.confirmPassword;
      delete payload.id;
      
      // 处理密码：如果编辑模式下密码为空，则不发送密码字段
      if (id.value) {
        // 编辑模式
        if (payload.password && payload.password.trim()) {
          // 如果填写了密码，则加密后发送
          payload.password = await encryptPassword(payload.password);
        } else {
          // 如果密码为空，则不发送密码字段
          delete payload.password;
        }
      } else {
        // 新增模式，密码必须加密
        if (payload.password) {
          payload.password = await encryptPassword(payload.password);
        }
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
        // 编辑模式下，不填充密码字段，但需要设置 id 以便验证逻辑判断
        const { password, ...formData } = data;
        // 先单独设置 id 字段，确保验证逻辑能正确判断是编辑模式
        await formApi.setFieldValue('id', data.id);
        // 等待一个 tick，确保 id 字段的验证规则已经更新
        await nextTick();
        // 然后设置其他字段
        await formApi.setValues({
          ...formData,
          avatar: formData.avatar || undefined,
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

