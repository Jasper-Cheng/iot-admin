<script lang="ts" setup>
import { computed } from 'vue';

import { Check } from '@vben/icons';

interface Props {
  value?: string;
  modelValue?: string;
  avatars?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  avatars: () => Array.from({ length: 20 }, (_, i) => `/avatars/family/avatar${i + 1}.png`),
});

const emit = defineEmits<{
  'update:value': [value: string | undefined];
  'update:modelValue': [value: string | undefined];
}>();

// 支持 value 和 modelValue 两种绑定方式
const selectedAvatar = computed({
  get: () => props.value ?? props.modelValue,
  set: (value) => {
    emit('update:value', value);
    emit('update:modelValue', value);
  },
});

function handleSelect(avatar: string) {
  if (selectedAvatar.value === avatar) {
    // 如果点击已选中的头像，则取消选择
    selectedAvatar.value = undefined;
  } else {
    selectedAvatar.value = avatar;
  }
}
</script>

<template>
  <div class="avatar-selector">
    <div class="avatar-grid">
      <div
        v-for="(avatar, index) in avatars"
        :key="index"
        :class="{ 'avatar-item-selected': selectedAvatar === avatar }"
        class="avatar-item"
        @click="handleSelect(avatar)"
      >
        <img
          :src="avatar"
          :alt="`头像 ${index + 1}`"
          class="avatar-image"
          @error="(e) => ((e.target as HTMLImageElement).src = '/avatars/no-avatar.png')"
        />
        <div v-if="selectedAvatar === avatar" class="avatar-check">
          <Check class="check-icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.avatar-selector {
  width: 100%;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 6px;
  padding: 8px 0;
}

.avatar-item {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border: 2px solid #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
}

.avatar-item:hover {
  border-color: #40a9ff;
  transform: scale(1.05);
}

.avatar-item-selected {
  border-color: #1890ff;
  border-width: 3px;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.avatar-check {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 20px;
  height: 20px;
  background: #1890ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.check-icon {
  width: 12px;
  height: 12px;
  stroke-width: 3;
}
</style>

