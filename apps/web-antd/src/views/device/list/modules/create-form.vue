<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { z } from '#/adapter/form';
import { createDevice } from '#/api/iot/device';
import { getDeviceModelList } from '#/api/iot/device-model';

const emits = defineEmits(['success']);

// 生成6位时间字符串（YYMMDD）
function getTimePrefix(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}${month}${day}`;
}

// 生成SN前缀
function generateSnPrefix(modelCode: string): string {
  const timePrefix = getTimePrefix();
  return `${modelCode}-${timePrefix}-`;
}

// 当前选中的型号代码和前缀
const selectedModelCode = ref<string>('');
const snPrefix = ref<string>('');
const snSuffix = ref<string>('');

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

  const getItemById = (id: number) => {
    return allItems.find((item) => item[valueField] === id);
  };

  return { loadMore, reset, getOptions, getItemById, allItems };
}

// 创建滚动加载器
const modelLoader = createScrollLoader(
  async (params) => await getDeviceModelList(params),
  'name',
  'id',
);

// 初始化选项
const modelOptions = ref<Array<{ label: string; value: number }>>([]);

// 加载初始数据
async function loadInitialOptions() {
  modelLoader.reset();
  await modelLoader.loadMore();
  modelOptions.value = modelLoader.getOptions();
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
      label: '设备型号',
      rules: 'selectRequired',
      componentProps: {
        placeholder: '请选择设备型号',
        showSearch: true,
        options: modelOptions,
        onPopupScroll: handleModelScroll,
        filterOption: (input: string, option: any) => {
          return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
        },
        dropdownMatchSelectWidth: false,
        dropdownStyle: {
          minWidth: '300px',
        },
        onChange: async (value: number) => {
          if (value) {
            // 获取型号信息
            const modelItem = modelLoader.getItemById(value);
            if (modelItem && modelItem.code) {
              selectedModelCode.value = modelItem.code;
              const prefix = generateSnPrefix(modelItem.code);
              snPrefix.value = prefix;
              
              // 获取当前SN后缀部分
              const currentValues = await formApi.getValues();
              const currentSn = currentValues.sn || '';
              
              if (currentSn) {
                // 如果已有SN值，提取后缀部分
                const oldModelId = currentValues.modelId;
                if (oldModelId && oldModelId !== value) {
                  const oldModelItem = modelLoader.getItemById(oldModelId);
                  if (oldModelItem && oldModelItem.code) {
                    const oldPrefix = generateSnPrefix(oldModelItem.code);
                    if (currentSn.startsWith(oldPrefix)) {
                      // 提取旧后缀
                      snSuffix.value = currentSn.slice(oldPrefix.length);
                    } else {
                      snSuffix.value = '';
                    }
                  } else {
                    snSuffix.value = '';
                  }
                } else {
                  // 如果没有旧型号，清空后缀
                  snSuffix.value = '';
                }
              } else {
                snSuffix.value = '';
              }
              
              // 更新SN字段
              await formApi.setFieldValue('sn', prefix + snSuffix.value);
            } else {
              selectedModelCode.value = '';
              snPrefix.value = '';
              snSuffix.value = '';
              await formApi.setFieldValue('sn', '');
            }
          } else {
            selectedModelCode.value = '';
            snPrefix.value = '';
            snSuffix.value = '';
            await formApi.setFieldValue('sn', '');
          }
        },
      },
    },
    {
      component: 'Input',
      fieldName: 'sn',
      label: '设备序列号',
      rules: z.string().min(1, '设备序列号不能为空').refine(
        (value) => {
          // 如果还没有选择型号，不验证
          if (!snPrefix.value) {
            return true;
          }
          // 提取后缀部分
          const suffix = value.startsWith(snPrefix.value) 
            ? value.slice(snPrefix.value.length) 
            : value;
          // 检查后缀是否为空
          if (!suffix || suffix.trim() === '') {
            return false;
          }
          // 检查后缀是否只包含数字且最多8位
          return /^\d{1,8}$/.test(suffix);
        },
        {
          message: '序列号后缀部分不能为空，只能输入1-8位数字',
        },
      ),
      dependencies: {
        triggerFields: ['modelId'],
        componentProps: (formValues) => {
          const modelId = formValues.modelId;
          const isDisabled = !modelId;
          
          // 根据 modelId 获取前缀
          let prefix = '';
          if (modelId) {
            const modelItem = modelLoader.getItemById(modelId);
            if (modelItem && modelItem.code) {
              prefix = generateSnPrefix(modelItem.code);
            }
          }
          
          return {
            placeholder: isDisabled ? '请先选择设备型号' : '请输入序列号后缀部分',
            disabled: isDisabled,
            addonBefore: prefix,
          };
        },
      },
      componentProps: {
        onInput: async (e: Event) => {
          const target = e.target as HTMLInputElement;
          const inputValue = target.value;
          
          // 如果用户尝试修改前缀部分，阻止并恢复
          if (snPrefix.value && !inputValue.startsWith(snPrefix.value)) {
            // 恢复为前缀+当前后缀
            const newValue = snPrefix.value + snSuffix.value;
            await formApi.setFieldValue('sn', newValue);
            // 更新输入框值
            await nextTick();
            target.value = newValue;
            // 设置光标位置到后缀开始处
            const cursorPos = snPrefix.value.length;
            target.setSelectionRange(cursorPos, cursorPos);
          } else if (snPrefix.value && inputValue.startsWith(snPrefix.value)) {
            // 提取后缀部分
            const suffix = inputValue.slice(snPrefix.value.length);
            // 只允许数字，且最多8位
            const numericSuffix = suffix.replace(/[^\d]/g, '').slice(0, 8);
            // 更新后缀
            snSuffix.value = numericSuffix;
            // 如果输入了非数字字符，更新输入框值
            if (suffix !== numericSuffix) {
              const newValue = snPrefix.value + numericSuffix;
              await formApi.setFieldValue('sn', newValue);
              await nextTick();
              target.value = newValue;
              // 设置光标位置
              const cursorPos = snPrefix.value.length + numericSuffix.length;
              target.setSelectionRange(cursorPos, cursorPos);
            }
          }
        },
        onFocus: async (e: Event) => {
          const target = e.target as HTMLInputElement;
          // 如果输入框有值且包含前缀，将光标设置到后缀开始处
          if (snPrefix.value && target.value.startsWith(snPrefix.value)) {
            await nextTick();
            const cursorPos = snPrefix.value.length;
            target.setSelectionRange(cursorPos, cursorPos);
          }
        },
      },
    },
    {
      component: 'Input',
      fieldName: 'ble_name',
      label: '蓝牙名称',
      rules: 'required',
      componentProps: {
        placeholder: '请输入蓝牙名称',
      },
    },
    {
      component: 'Input',
      fieldName: 'ble_mac',
      label: '蓝牙MAC',
      componentProps: {
        placeholder: '请输入蓝牙MAC地址（选填）',
      },
    },
  ],
  showDefaultActions: false,
});

// 监听 snPrefix 变化，确保SN字段值正确
watch(
  () => snPrefix.value,
  (newPrefix) => {
    if (newPrefix) {
      formApi.getValues().then((values) => {
        const currentSn = values.sn || '';
        if (currentSn && !currentSn.startsWith(newPrefix)) {
          // 如果当前SN不包含新前缀，更新为前缀+后缀
          formApi.setFieldValue('sn', newPrefix + snSuffix.value);
        }
      });
    }
  },
);

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    drawerApi.lock();

    try {
      // 确保SN包含前缀
      let finalSn = values.sn || '';
      if (snPrefix.value && !finalSn.startsWith(snPrefix.value)) {
        finalSn = snPrefix.value + snSuffix.value;
      }
      
      // 验证序列号后缀部分不为空
      if (snPrefix.value) {
        const suffix = finalSn.startsWith(snPrefix.value) 
          ? finalSn.slice(snPrefix.value.length) 
          : '';
        if (!suffix || suffix.trim() === '') {
          message.error('序列号后缀部分不能为空');
          drawerApi.unlock();
          return;
        }
      }
      
      const payload = {
        name: values.name,
        sn: finalSn,
        modelId: values.modelId,
        accountId: null,
        status: 'unbound' as const,
        ble_name: values.ble_name,
        ble_mac: values.ble_mac || undefined,
      };
      await createDevice(payload);
      message.success('设备入库成功');
      emits('success');
      drawerApi.close();
    } catch (error: any) {
      const errorMsg = error?.response?.data?.detail || '设备入库失败';
      message.error(errorMsg);
      drawerApi.unlock();
    }
  },

  async onOpenChange(isOpen) {
    if (isOpen) {
      await loadInitialOptions();
      formApi.resetForm();
      selectedModelCode.value = '';
      snPrefix.value = '';
      snSuffix.value = '';
    } else {
      selectedModelCode.value = '';
      snPrefix.value = '';
      snSuffix.value = '';
    }
  },
});
</script>

<template>
  <Drawer title="设备入库" class="w-[600px]">
    <Form />
  </Drawer>
</template>

