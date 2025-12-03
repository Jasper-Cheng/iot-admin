<script lang="ts" setup>
import type { FeedbackApi } from '#/api/iot/feedback';

import { computed, nextTick, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import {
  Descriptions,
  DescriptionsItem,
  Image,
  Space,
  Tag,
} from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { replyFeedback } from '#/api/iot/feedback';

import { useReplyFormSchema } from '../data';

const emits = defineEmits(['success']);

const feedback = ref<FeedbackApi.Feedback>();

const typeMap: Record<string, { color: string; text: string }> = {
  bug: { text: 'Bug反馈', color: 'red' },
  suggestion: { text: '功能建议', color: 'blue' },
  complaint: { text: '投诉', color: 'orange' },
  other: { text: '其他', color: 'default' },
};

const statusMap: Record<string, { color: string; text: string }> = {
  pending: { text: '待处理', color: 'default' },
  processing: { text: '处理中', color: 'processing' },
  resolved: { text: '已解决', color: 'success' },
};

const [Form, formApi] = useVbenForm({
  schema: useReplyFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    if (!feedback.value) return;

    const { valid } = await formApi.validate();
    if (!valid) return;

    const values = await formApi.getValues();
    modalApi.lock();

    try {
      await replyFeedback(feedback.value.id, values);
      emits('success');
      modalApi.close();
    } catch {
      modalApi.unlock();
    }
  },

  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<FeedbackApi.Feedback>();
      formApi.resetForm();

      if (data) {
        feedback.value = data;
        await nextTick();
        if (data.reply) {
          formApi.setValues({
            status: data.status,
            reply: data.reply,
          });
        }
      }
    }
  },
});

const getModalTitle = computed(() => {
  return feedback.value?.status === 'pending' ? '处理反馈' : '查看/修改回复';
});

const isResolved = computed(() => feedback.value?.status === 'resolved');
</script>

<template>
  <Modal :title="getModalTitle" class="w-[600px]">
    <template v-if="feedback">
      <Descriptions :column="2" bordered size="small" class="mb-4">
        <DescriptionsItem label="用户">
          {{ feedback.userName }}
        </DescriptionsItem>
        <DescriptionsItem label="类型">
          <Tag :color="typeMap[feedback.type]?.color">
            {{ typeMap[feedback.type]?.text }}
          </Tag>
        </DescriptionsItem>
        <DescriptionsItem label="状态">
          <Tag :color="statusMap[feedback.status]?.color">
            {{ statusMap[feedback.status]?.text }}
          </Tag>
        </DescriptionsItem>
        <DescriptionsItem label="提交时间">
          {{ feedback.createdAt }}
        </DescriptionsItem>
        <DescriptionsItem label="标题" :span="2">
          {{ feedback.title }}
        </DescriptionsItem>
        <DescriptionsItem label="内容" :span="2">
          {{ feedback.content }}
        </DescriptionsItem>
        <DescriptionsItem v-if="feedback.images?.length" label="图片" :span="2">
          <Space>
            <Image
              v-for="(img, idx) in feedback.images"
              :key="idx"
              :src="img"
              :width="80"
              :height="80"
            />
          </Space>
        </DescriptionsItem>
      </Descriptions>

      <div class="border-t pt-4">
        <h4 class="mb-3 font-medium">回复</h4>
        <Form />
      </div>
    </template>
  </Modal>
</template>
