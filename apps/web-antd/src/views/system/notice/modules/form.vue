<script lang="ts" setup>
import type { NoticeApi } from '#/api/iot/notice';
import type { VersionApi } from '#/api/iot/version';

import { computed, nextTick, ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { createNotice, updateNotice } from '#/api/iot/notice';
import { getVersionList } from '#/api/iot/version';

import { useFormSchema } from '../data';

const emits = defineEmits(['success']);

const formData = ref<NoticeApi.Notice>();
const versionList = ref<VersionApi.AppVersion[]>([]);

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
  handleValuesChange: async (values, changedFields) => {
    // 监听类型变化
    if (changedFields.includes('type')) {
      // 如果类型不是"更新"，清空版本选择
      if (values.type !== 'update') {
        await formApi.setFieldValue('versionId', undefined);
      }
    }
    
    // 监听版本选择变化
    if (changedFields.includes('versionId') && values.versionId) {
      await handleVersionChange(values.versionId);
    }
  },
});

const id = ref<number>();

// 处理版本选择变化
async function handleVersionChange(versionId: number) {
  try {
    // 从版本列表中查找选中的版本
    let version = versionList.value.find((v) => v.id === versionId);
    
    // 如果列表中没有，尝试从API获取并更新列表
    if (!version) {
      const res = await getVersionList({ pageSize: 100 });
      versionList.value = res.items;
      version = res.items.find((v) => v.id === versionId);
    }
    
    if (version) {
      await fillVersionData(version);
    }
  } catch (error) {
    console.error('获取版本信息失败:', error);
  }
}

// 填充版本数据
async function fillVersionData(version: VersionApi.AppVersion) {
  // 填充目标平台
  await formApi.setFieldValue('platforms', [version.platform]);

  // 构建内容：版本号+版本标题+版本描述+大小+强制更新+最小支持版本
  const contentParts: string[] = [];
  
  // 版本号
  if (version.versionCode) {
    contentParts.push(`版本号：${version.versionCode}`);
  }
  
  // 版本标题
  if (version.title) {
    contentParts.push(`版本标题：${version.title}`);
  }
  
  // 版本描述
  if (version.description) {
    contentParts.push(`版本描述：${version.description}`);
  }
  
  // 大小
  if (version.fileSize) {
    const sizeMB = (version.fileSize / 1024 / 1024).toFixed(2);
    contentParts.push(`大小：${sizeMB} MB`);
  }
  
  // 强制更新
  contentParts.push(`强制更新：${version.isForceUpdate ? '是' : '否'}`);
  
  // 最小支持版本
  if (version.minSupportedVersion) {
    contentParts.push(`最小支持版本：${version.minSupportedVersion}`);
  }
  
  // 填充内容
  await formApi.setFieldValue('content', contentParts.join('\n'));
}

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    
    // 如果类型不是"更新"，移除 versionId 字段
    if (values.type !== 'update') {
      delete values.versionId;
    }
    
    drawerApi.lock();

    try {
      await (id.value ? updateNotice(id.value, values) : createNotice(values));
      emits('success');
      drawerApi.close();
    } catch {
      drawerApi.unlock();
    }
  },

  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<NoticeApi.Notice>();
      formApi.resetForm();

      // 加载版本列表
      try {
        const res = await getVersionList({ pageSize: 100 });
        versionList.value = res.items;
      } catch (error) {
        console.error('加载版本列表失败:', error);
        versionList.value = [];
      }

      if (data && data.id) {
        formData.value = data;
        id.value = data.id;
      } else {
        formData.value = undefined;
        id.value = undefined;
      }

      await nextTick();
      if (data && data.id) {
        formApi.setValues(data);
      }
    }
  },
});

const getDrawerTitle = computed(() => {
  return id.value ? '编辑消息' : '新增消息';
});
</script>

<template>
  <Drawer :title="getDrawerTitle" class="w-[500px]">
    <Form />
  </Drawer>
</template>
