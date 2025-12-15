<script lang="ts" setup>
import type { DeviceApi } from '#/api/iot/device';

import { nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { updateDevice } from '#/api/iot/device';
import { getDeviceModelList } from '#/api/iot/device-model';
import { getUserList } from '#/api/iot/user';

const emits = defineEmits(['success']);

const formData = ref<DeviceApi.Device>();

// 创建支持滚动加载的选项加载器
function createScrollLoader(
  apiFn: (params: { page: number; pageSize: number }) => Promise<{ items: any[]; total: number }>,
  labelField: string,
  valueField: string,
) {
  let currentPage = 1;
  const pageSize = 10;
  let allItems: any[] = [];
  let total = 0;
  let loading = false;
  let hasMore = true;

  const loadMore = async () => {
    if (loading || !hasMore) {
      return;
    }

    loading = true;
    try {
      const result = await apiFn({ page: currentPage, pageSize });
      const items = result.items || [];
      total = result.total || 0;

      allItems.push(...items);
      currentPage += 1;
      hasMore = allItems.length < total;

      return allItems.map((item) => {
        // 对于用户选项，使用特殊格式：用户名->手机号
        if (labelField === 'nickname' && item.phone) {
          return {
            label: `${item.nickname || '未知'}->${item.phone}`,
            value: item[valueField],
          };
        }
        return {
          label: item[labelField] || item.phone || item.name,
          value: item[valueField],
        };
      });
    } catch (error) {
      console.error('Failed to load options:', error);
      return allItems.map((item) => {
        // 对于用户选项，使用特殊格式：用户名->手机号
        if (labelField === 'nickname' && item.phone) {
          return {
            label: `${item.nickname || '未知'}->${item.phone}`,
            value: item[valueField],
          };
        }
        return {
          label: item[labelField] || item.phone || item.name,
          value: item[valueField],
        };
      });
    } finally {
      loading = false;
    }
  };

  const reset = () => {
    currentPage = 1;
    allItems = [];
    hasMore = true;
    loading = false;
  };

  const getOptions = () => {
    return allItems.map((item) => {
      // 对于用户选项，使用特殊格式：用户名->手机号
      if (labelField === 'nickname' && item.phone) {
        return {
          label: `${item.nickname || '未知'}->${item.phone}`,
          value: item[valueField],
        };
      }
      return {
        label: item[labelField] || item.phone || item.name,
        value: item[valueField],
      };
    });
  };

  return { loadMore, reset, getOptions };
}

// 创建三个滚动加载器
const modelLoader = createScrollLoader(
  async (params) => await getDeviceModelList(params),
  'name',
  'id',
);

const userLoader = createScrollLoader(
  async (params) => await getUserList(params),
  'nickname',
  'id',
);

// 初始化选项
const modelOptions = ref<Array<{ label: string; value: number }>>([]);
const accountOptions = ref<Array<{ label: string; value: number }>>([]);

// 加载初始数据
async function loadInitialOptions() {
  modelLoader.reset();
  userLoader.reset();

  await Promise.all([
    modelLoader.loadMore(),
    userLoader.loadMore(),
  ]);

  modelOptions.value = modelLoader.getOptions();
  accountOptions.value = userLoader.getOptions();
}

// 处理滚动加载
function handleModelScroll(e: Event) {
  const target = e.target as HTMLElement;
  const { scrollTop, scrollHeight, clientHeight } = target;
  if (scrollHeight - scrollTop - clientHeight < 50) {
    modelLoader.loadMore().then(() => {
      modelOptions.value = modelLoader.getOptions();
    });
  }
}

function handleUserScroll(e: Event) {
  const target = e.target as HTMLElement;
  const { scrollTop, scrollHeight, clientHeight } = target;
  if (scrollHeight - scrollTop - clientHeight < 50) {
    userLoader.loadMore().then(() => {
      accountOptions.value = userLoader.getOptions();
    });
  }
}


const [Form, formApi] = useVbenForm({
  schema: [
    {
      component: 'Input',
      fieldName: 'name',
      label: '设备名称',
      rules: 'required',
      componentProps: {
        placeholder: '请输入设备名称',
      },
    },
    {
      component: 'Select',
      fieldName: 'modelId',
      label: '型号名称',
      rules: 'selectRequired',
      componentProps: {
        placeholder: '请选择型号名称',
        showSearch: true,
        options: modelOptions,
        onPopupScroll: handleModelScroll,
        filterOption: (input: string, option: any) => {
          return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        },
      },
    },
    {
      component: 'Select',
      fieldName: 'accountId',
      label: '所属账号',
      componentProps: {
        placeholder: '请选择所属账号',
        allowClear: true,
        showSearch: true,
        options: accountOptions,
        onPopupScroll: handleUserScroll,
        filterOption: (input: string, option: any) => {
          return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        },
        dropdownMatchSelectWidth: false,
        dropdownStyle: {
          minWidth: '300px',
        },
        optionLabelProp: 'label',
      },
    },
  ],
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
      const payload: Partial<DeviceApi.Device> = {
        name: values.name,
        modelId: values.modelId,
        // 如果 accountId 为空（清空选择），传递 null；否则传递实际值
        accountId: values.accountId === undefined || values.accountId === null ? null : values.accountId,
      };
      await updateDevice(id.value!, payload);
      emits('success');
      drawerApi.close();
    } catch {
      drawerApi.unlock();
    }
  },

  async onOpenChange(isOpen) {
    if (isOpen) {
      await loadInitialOptions();
      const data = drawerApi.getData<DeviceApi.Device>();
      formApi.resetForm();

      if (data && data.id) {
        formData.value = data;
        id.value = data.id;

        await nextTick();
        formApi.setValues({
          name: data.name,
          modelId: data.modelId,
          accountId: data.accountId,
        });
      } else {
        formData.value = undefined;
        id.value = undefined;
      }
    }
  },
});
</script>

<template>
  <Drawer title="编辑设备" class="w-[600px]">
    <Form />
  </Drawer>
</template>

