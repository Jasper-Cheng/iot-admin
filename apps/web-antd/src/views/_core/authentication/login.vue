<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { computed, markRaw, onMounted, ref } from 'vue';

import { AuthenticationLogin, SliderCaptcha, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { getRsaPublicKey } from '#/api/core/auth';
import type { AuthApi } from '#/api/core/auth';
import { useAuthStore } from '#/store';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();
const rsaPublicKey = ref<string>('');

// 获取 RSA 公钥
async function loadRsaPublicKey() {
  try {
    const result = await getRsaPublicKey();
    if (result?.public_key) {
      // 确保公钥格式正确（处理换行符）
      let publicKey = result.public_key.trim();
      // 确保换行符是 \n 格式（而不是 \r\n）
      publicKey = publicKey.replace(/\r\n/g, '\n');
      rsaPublicKey.value = publicKey;
    }
  } catch (error) {
    // 静默处理错误，不输出日志
  }
}

// 将 PEM 格式的公钥转换为 CryptoKey（用于 Web Crypto API）
async function importRSAPublicKey(pemKey: string): Promise<CryptoKey> {
  // 移除 PEM 格式的头部和尾部标记，以及换行符
  const pemHeader = '-----BEGIN PUBLIC KEY-----';
  const pemFooter = '-----END PUBLIC KEY-----';
  const pemContents = pemKey
    .replace(pemHeader, '')
    .replace(pemFooter, '')
    .replace(/\s/g, ''); // 移除所有空白字符
  
  // 将 Base64 字符串转换为 ArrayBuffer
  const binaryDer = base64ToArrayBuffer(pemContents);
  
  // 导入公钥（RSA-OAEP 需要指定 hash 算法）
  return await crypto.subtle.importKey(
    'spki', // SubjectPublicKeyInfo 格式
    binaryDer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256', // OAEP 需要指定 hash 算法
    },
    false, // 不可导出
    ['encrypt'], // 只能用于加密
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

onMounted(() => {
  loadRsaPublicKey();
});

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: '请输入手机号',
        maxlength: 11,
      },
      fieldName: 'phone',
      label: '手机号',
      rules: z
        .string()
        .min(1, { message: '请输入手机号' })
        .regex(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.password'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      rules: z.string().min(1, { message: $t('authentication.passwordTip') }),
    },
    {
      component: markRaw(SliderCaptcha),
      fieldName: 'captcha',
      rules: z.boolean().refine((value) => value, {
        message: $t('authentication.verifyRequiredTip'),
      }),
    },
  ];
});

async function handleLogin(values: Recordable<any>) {
  // 确保验证码已通过
  if (!values.captcha) {
    return;
  }

  // 确保已获取 RSA 公钥
  if (!rsaPublicKey.value) {
    try {
      await loadRsaPublicKey();
      if (!rsaPublicKey.value) {
        throw new Error('Failed to load RSA public key');
      }
    } catch (error) {
      return;
    }
  }

  // 使用 RSA-OAEP with SHA256 加密密码
  let encryptedPassword: string;
  try {
    // 将 PEM 格式的公钥转换为 CryptoKey
    const publicKey = await importRSAPublicKey(rsaPublicKey.value);
    
    // 将密码转换为 ArrayBuffer
    const passwordBuffer = new TextEncoder().encode(values.password);
    
    // 使用 OAEP with SHA256 加密（hash 在导入密钥时已指定为 SHA-256）
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP',
      },
      publicKey,
      passwordBuffer,
    );
    
    // 将加密后的 ArrayBuffer 转换为 Base64 字符串
    encryptedPassword = arrayBufferToBase64(encryptedBuffer);
  } catch (error) {
    return;
  }

  // 准备登录数据：只发送 phone 和加密后的 password
  // 过滤掉其他字段（如 username、captcha 等）
  const loginData: AuthApi.LoginParams = {
    phone: String(values.phone || '').trim(),
    password: encryptedPassword, // 发送加密后的字符串
  };

  try {
    await authStore.authLogin(loginData);
  } catch (error) {
    // 错误已由全局错误处理拦截器处理
  }
}
</script>

<template>
  <AuthenticationLogin
    :form-schema="formSchema"
    :loading="authStore.loginLoading"
    :show-code-login="false"
    :show-forget-password="false"
    :show-qrcode-login="false"
    :show-register="false"
    :show-third-party-login="false"
    @submit="handleLogin"
  />
</template>
