<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import { computed, markRaw, onMounted, ref } from 'vue';

import { AuthenticationLogin, SliderCaptcha, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message } from 'ant-design-vue';
import forge from 'node-forge';

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
      let publicKey = result.public_key.trim();
      publicKey = publicKey.replace(/\r\n/g, '\n');
      rsaPublicKey.value = publicKey;
    }
  } catch (error) {
    console.error('[Login] 获取 RSA 公钥失败:', error);
  }
}

// 使用 node-forge 进行 RSA-OAEP (SHA256) 加密（与后端 Python cryptography 一致）
function rsaEncrypt(publicKey: string, plainText: string): string | false {
  try {
    // 将 PEM 格式公钥解析为 forge 公钥对象
    const publicKeyObj = forge.pki.publicKeyFromPem(publicKey);
    // 使用 RSA-OAEP + SHA256 加密（与后端 padding.OAEP + SHA256 匹配）
    const encrypted = publicKeyObj.encrypt(
      forge.util.encodeUtf8(plainText),
      'RSA-OAEP',
      {
        md: forge.md.sha256.create(),
        mgf1: { md: forge.md.sha256.create() },
      },
    );
    // 转为 Base64 编码
    return forge.util.encode64(encrypted);
  } catch (error) {
    console.error('[Login] RSA 加密失败:', error);
    return false;
  }
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
        throw new Error('获取公钥失败');
      }
    } catch {
      message.error('获取加密公钥失败，请检查网络或后端服务是否正常');
      return;
    }
  }

  // 使用 node-forge 进行 RSA-OAEP 加密（兼容 HTTP 环境）
  const encryptedPassword = rsaEncrypt(rsaPublicKey.value, values.password);
  if (!encryptedPassword) {
    message.error('密码加密失败，请刷新页面重试');
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
