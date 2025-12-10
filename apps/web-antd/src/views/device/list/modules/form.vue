<script lang="ts" setup>
import type { DeviceApi } from '#/api/iot/device';

import { nextTick, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { updateDevice } from '#/api/iot/device';
import { getDeviceModelList } from '#/api/iot/device-model';
import { getFamilyList } from '#/api/iot/family';
import { getUserList } from '#/api/iot/user';

const emits = defineEmits(['success']);

const formData = ref<DeviceApi.Device>();

const modelOptions = ref<Array<{ label: string; value: number }>>([]);
const accountOptions = ref<Array<{ label: string; value: number }>>([]);
const familyOptions = ref<Array<{ label: string; value: number }>>([]);

// 加载选项数据
async function loadOptions() {
  try {
    const [modelsResult, users, families] = await Promise.all([
      getDeviceModelList({ page: 1, pageSize: 1000 }),
      getUserList({ page: 1, pageSize: 1000 }),
      getFamilyList({ page: 1, pageSize: 1000 }),
    ]);

    modelOptions.value = modelsResult.items.map((model) => ({
      label: model.name,
      value: model.id,
    }));

    accountOptions.value = users.items.map((user) => ({
      label: user.nickname || user.phone,
      value: user.id,
    }));

    familyOptions.value = families.items.map((family) => ({
      label: family.name,
      value: family.id,
    }));
  } catch (error) {
    console.error('Failed to load options:', error);
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
      label: '型号',
      rules: 'selectRequired',
      componentProps: {
        placeholder: '请选择型号',
        showSearch: true,
        options: modelOptions,
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
        filterOption: (input: string, option: any) => {
          return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        },
      },
    },
    {
      component: 'Select',
      fieldName: 'familyIds',
      label: '所属家庭',
      componentProps: {
        placeholder: '请选择所属家庭',
        allowClear: true,
        mode: 'multiple',
        showSearch: true,
        options: familyOptions,
        filterOption: (input: string, option: any) => {
          return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        },
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
        accountId: values.accountId || undefined,
        familyIds: values.familyIds || undefined,
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
      await loadOptions();
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
          familyIds: data.familyIds || [],
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

