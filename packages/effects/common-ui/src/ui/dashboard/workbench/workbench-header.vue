<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

interface Props {
  avatar?: string;
}

defineOptions({
  name: 'WorkbenchHeader',
});

const props = withDefaults(defineProps<Props>(), {
  avatar: '',
});

// 当前显示的头像路径（用于错误处理）
const currentAvatarSrc = ref<string>('');

// 确保头像为空或无效时使用默认头像
const avatarSrc = computed(() => {
  return props.avatar && props.avatar.trim() ? props.avatar : '/avatars/no-avatar.png';
});

// 监听头像路径变化，重置错误状态
watch(
  () => avatarSrc.value,
  (newSrc) => {
    currentAvatarSrc.value = newSrc;
  },
  { immediate: true },
);

// 处理头像加载错误
function handleAvatarError(e: Event) {
  const target = e.target as HTMLImageElement;
  if (target.src && !target.src.includes('/avatars/no-avatar.png')) {
    target.src = '/avatars/no-avatar.png';
  }
}
</script>
<template>
  <div class="card-box p-4 py-6 lg:flex">
    <div class="relative size-20 flex-shrink-0">
      <img
        :src="avatarSrc"
        alt="头像"
        class="size-20 rounded-full object-cover"
        @error="handleAvatarError"
      />
    </div>
    <div
      v-if="$slots.title || $slots.description"
      class="flex flex-col justify-center md:ml-6 md:mt-0"
    >
      <h1 v-if="$slots.title" class="text-md font-semibold md:text-xl">
        <slot name="title"></slot>
      </h1>
      <span v-if="$slots.description" class="text-foreground/80 mt-1">
        <slot name="description"></slot>
      </span>
    </div>
    <div class="mt-4 flex flex-1 justify-end md:mt-0">
      <div class="flex flex-col justify-center text-right">
        <span class="text-foreground/80"> 待办 </span>
        <span class="text-2xl">2/10</span>
      </div>

      <div class="mx-12 flex flex-col justify-center text-right md:mx-16">
        <span class="text-foreground/80"> 项目 </span>
        <span class="text-2xl">8</span>
      </div>
      <div class="mr-4 flex flex-col justify-center text-right md:mr-10">
        <span class="text-foreground/80"> 团队 </span>
        <span class="text-2xl">300</span>
      </div>
    </div>
  </div>
</template>
