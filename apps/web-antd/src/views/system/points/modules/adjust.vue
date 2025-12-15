<script lang="ts" setup>
import { computed, ref } from 'vue';

import { message } from 'ant-design-vue';
import { useVbenDrawer } from '@vben/common-ui';
import { useVbenForm } from '#/adapter/form';
import type { VbenFormSchema } from '#/adapter/form';

import { adjustPoints } from '#/api/iot/points';

const emits = defineEmits(['success']);

const accountId = ref<number>();
const userInfo = ref<{
  accountId: number;
  accountName?: string | null;
  accountPhone?: string;
  currentBalance?: number;
}>();

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    drawerApi.lock();

    try {
      if (!accountId.value) {
        message.error('用户ID不能为空');
        drawerApi.unlock();
        return;
      }

      let extraData = undefined;
      if (values.extra && values.extra.trim()) {
        try {
          extraData = JSON.parse(values.extra);
        } catch (error) {
          message.error('扩展信息格式错误，请输入有效的JSON格式');
          drawerApi.unlock();
          return;
        }
      }

      await adjustPoints(accountId.value, {
        points: values.points,
        type: values.type || 'admin_adjust',
        description: values.description || undefined,
        extra: extraData,
      });

      message.success(values.points > 0 ? '积分奖励成功' : '积分扣除成功');
      emits('success');
      drawerApi.close();
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.detail || '操作失败';
      message.error(errorMsg);
      drawerApi.unlock();
    }
  },

  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<{
        accountId: number;
        accountName?: string | null;
        accountPhone?: string;
        currentBalance?: number;
      }>();
      if (data?.accountId) {
        accountId.value = data.accountId;
        // 直接使用传递过来的用户信息
        userInfo.value = {
          accountId: data.accountId,
          accountName: data.accountName ?? null,
          accountPhone: data.accountPhone ?? '',
          currentBalance: data.currentBalance ?? 0,
        };
        formApi.resetForm();
        formApi.setValues({
          points: undefined,
          type: 'admin_adjust',
          description: '',
          extra: '',
        });
      } else {
        // 即使没有 accountId，也尝试设置 userInfo
        if (data) {
          userInfo.value = {
            accountId: data.accountId ?? 0,
            accountName: data.accountName ?? null,
            accountPhone: data.accountPhone ?? '',
            currentBalance: data.currentBalance ?? 0,
          };
        }
      }
    } else {
      accountId.value = undefined;
      userInfo.value = undefined;
    }
  },
});

function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'InputNumber',
      fieldName: 'points',
      label: '积分变动',
      rules: 'required',
      componentProps: {
        placeholder: '正数为奖励，负数为扣除',
        style: { width: '100%' },
      },
    },
    {
      component: 'Select',
      fieldName: 'type',
      label: '积分类型',
      componentProps: {
        options: [
          { label: '管理员调整', value: 'admin_adjust' },
          { label: '活动奖励', value: 'reward' },
          { label: '违规扣除', value: 'penalty' },
        ],
        style: { width: '100%' },
      },
    },
    {
      component: 'Input',
      fieldName: 'description',
      label: '描述',
      componentProps: {
        placeholder: '请输入积分变动描述（可选）',
      },
    },
    {
      component: 'Textarea',
      fieldName: 'extra',
      label: '扩展信息（JSON格式）',
      componentProps: {
        placeholder: '请输入扩展信息，JSON格式，例如：{"reason": "活动奖励"}',
        rows: 4,
      },
    },
  ];
}


const pointsHint = computed(() => {
  if (!userInfo.value) return '';
  const currentBalance = userInfo.value.currentBalance;
  return `当前余额: ${currentBalance}`;
});
</script>

<template>
  <Drawer title="奖励/扣除积分" class="w-[600px]">
    <div v-if="userInfo" class="mb-4 space-y-2 p-4">
      <div class="flex items-center gap-4">
        <div>
          <span class="text-gray-500">用户ID：</span>
          <span class="font-medium">{{ userInfo?.accountId ?? accountId ?? '-' }}</span>
        </div>
        <div>
          <span class="text-gray-500">用户名称：</span>
          <span class="font-medium">{{ userInfo?.accountName ?? '未知' }}</span>
        </div>
        <div>
          <span class="text-gray-500">手机号：</span>
          <span class="font-medium">{{ userInfo?.accountPhone ?? '-' }}</span>
        </div>
        <div>
          <span class="text-gray-500">当前余额：</span>
          <span class="text-lg font-bold text-blue-600">{{ userInfo?.currentBalance ?? '-' }}</span>
        </div>
      </div>
    </div>
    <Form />
    <div v-if="pointsHint" class="mt-2 text-sm text-gray-500">
      {{ pointsHint }}
    </div>
  </Drawer>
</template>

