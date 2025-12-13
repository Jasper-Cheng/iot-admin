<script lang="ts" setup>
import type { FamilyApi } from '#/api/iot/family';

import { computed, nextTick, ref } from 'vue';

import { Button, message, Modal, Select, Table } from 'ant-design-vue';
import { useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { useVbenForm } from '#/adapter/form';
import { createFamily, updateFamily, getFamilyMemberList, addFamilyMember, removeFamilyMember } from '#/api/iot/family';
import { getDeviceList } from '#/api/iot/device';
import { getUserList } from '#/api/iot/user';

import { useFormSchema } from '../data';

const emits = defineEmits(['success']);

const formData = ref<FamilyApi.Family>();
const members = ref<Array<{ id: number; accountId: number; accountName: string }>>([]);
const devices = ref<Array<{ id: number; name: string }>>([]);
const userOptions = ref<Array<{ id: number; label: string }>>([]);
const deviceOptions = ref<Array<{ id: number; label: string }>>([]);
const selectedUserId = ref<number | undefined>();
const selectedDeviceId = ref<number | undefined>();
const loadingDevices = ref(false);

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

      return allItems.map((item) => ({
        label: item[labelField] || item.phone || item.name,
        value: item[valueField],
        id: item[valueField],
      }));
    } catch (error) {
      console.error('Failed to load options:', error);
      return allItems.map((item) => ({
        label: item[labelField] || item.phone || item.name,
        value: item[valueField],
        id: item[valueField],
      }));
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
    return allItems.map((item) => ({
      label: item[labelField] || item.phone || item.name,
      value: item[valueField],
      id: item[valueField],
    }));
  };

  return { loadMore, reset, getOptions };
}

// 创建用户和设备滚动加载器
const userLoader = createScrollLoader(
  async (params) => await getUserList(params),
  'nickname',
  'id',
);

const deviceLoader = createScrollLoader(
  async (params) => await getDeviceList(params),
  'name',
  'id',
);

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
});

const id = ref<number>();

// 加载成员列表（从家庭数据中直接获取，只需调用一次 API 获取 memberId）
async function loadMembers() {
  if (!formData.value?.memberIds || !id.value) {
    members.value = [];
    return;
  }
  
  const memberIds = formData.value.memberIds || [];
  const memberNames = formData.value.memberNames || [];
  
  if (memberIds.length === 0) {
    members.value = [];
    return;
  }
  
  // 需要获取 memberId（家庭成员关系ID）用于删除操作
  // 只调用一次 API，使用 pageSize: 10，支持滚动加载
  try {
    const result = await getFamilyMemberList({ familyId: id.value, page: 1, pageSize: 10 });
    
    // 如果第一页没有全部成员，需要继续加载
    let allMembers = [...(result.items || [])];
    let currentPage = 2;
    let hasMore = allMembers.length < (result.total || 0);
    
    while (hasMore) {
      try {
        const nextResult = await getFamilyMemberList({ familyId: id.value, page: currentPage, pageSize: 10 });
        allMembers.push(...(nextResult.items || []));
        currentPage += 1;
        hasMore = allMembers.length < (result.total || 0);
      } catch (error) {
        break;
      }
    }
    
    const finalMemberMap = new Map(
      allMembers.map((member) => [member.accountId, member]),
    );
    
    members.value = memberIds.map((accountId, index) => {
      const member = finalMemberMap.get(accountId);
      return {
        id: member?.id || 0, // 使用家庭成员关系ID
        accountId: accountId,
        accountName: memberNames[index] || member?.accountName || `用户${accountId}`,
      };
    });
  } catch (error) {
    console.error('Failed to load member details:', error);
    // 如果 API 失败，至少显示名称
    members.value = memberIds.map((accountId, index) => ({
      id: 0,
      accountId: accountId,
      accountName: memberNames[index] || `用户${accountId}`,
    }));
  }
}

// 加载设备列表（从家庭数据中直接获取）
function loadDevices() {
  if (!formData.value?.deviceIds) {
    devices.value = [];
    return;
  }
  
  const deviceIds = formData.value.deviceIds || [];
  const deviceNames = formData.value.deviceNames || [];
  
  if (deviceIds.length === 0) {
    devices.value = [];
    return;
  }
  
  // 直接使用返回的数据，不需要调用 API
  devices.value = deviceIds.map((deviceId, index) => ({
    id: deviceId,
    name: deviceNames[index] || `设备${deviceId}`,
  }));
}

// 初始化用户选项（延迟加载，只在需要时调用）
async function initUserOptions() {
  // 如果已经加载过，不重复加载（但允许滚动加载更多）
  if (userOptions.value.length > 0) {
    return;
  }
  
  // 重置加载器并加载第一页
  userLoader.reset();
  await userLoader.loadMore();
  userOptions.value = userLoader.getOptions().map((item) => ({
    id: item.id,
    label: `${item.id}_${item.label}`,
  }));
}

// 初始化设备选项（延迟加载，只在需要时调用）
async function initDeviceOptions() {
  if (deviceOptions.value.length > 0) return; // 已经加载过
  
  deviceLoader.reset();
  await deviceLoader.loadMore();
  deviceOptions.value = deviceLoader.getOptions().map((item) => ({
    id: item.id,
    label: `${item.id}_${item.label}`,
  }));
}

// 处理用户下拉框滚动加载
function handleUserScroll(e: Event) {
  const target = e.target as HTMLElement;
  const { scrollTop, scrollHeight, clientHeight } = target;
  if (scrollHeight - scrollTop - clientHeight < 50) {
    userLoader.loadMore().then(() => {
      userOptions.value = userLoader.getOptions().map((item) => ({
        id: item.id,
        label: `${item.id}_${item.label}`,
      }));
    });
  }
}

// 处理设备下拉框滚动加载
function handleDeviceScroll(e: Event) {
  const target = e.target as HTMLElement;
  const { scrollTop, scrollHeight, clientHeight } = target;
  if (scrollHeight - scrollTop - clientHeight < 50) {
    deviceLoader.loadMore().then(() => {
      deviceOptions.value = deviceLoader.getOptions().map((item) => ({
        id: item.id,
        label: `${item.id}_${item.label}`,
      }));
    });
  }
}

// 添加成员
async function handleAddMember() {
  if (!selectedUserId.value || !id.value) return;
  
  // 检查是否已存在
  if (members.value.some((m) => m.accountId === selectedUserId.value)) {
    message.warning('该用户已经是家庭成员');
    return;
  }

  try {
    await addFamilyMember({
      familyId: id.value,
      accountId: selectedUserId.value,
    });
    message.success('添加成员成功');
    selectedUserId.value = undefined;
    await loadMembers();
  } catch (error) {
    message.error('添加成员失败');
  }
}

// 删除成员
async function handleRemoveMember(memberId: number) {
  if (!id.value) return;
  
  Modal.confirm({
    title: '确认删除',
    content: '确定要移除该成员吗？',
    onOk: async () => {
      try {
        await removeFamilyMember(id.value!, memberId);
        message.success('移除成员成功');
        await loadMembers();
      } catch (error) {
        message.error('移除成员失败');
      }
    },
  });
}

// 添加设备
async function handleAddDevice() {
  if (!selectedDeviceId.value || !id.value) return;
  
  // 检查是否已存在
  if (devices.value.some((d) => d.id === selectedDeviceId.value)) {
    message.warning('该设备已经在家庭中');
    return;
  }

  try {
    // 更新设备的家庭关联
    const { updateDevice } = await import('#/api/iot/device');
    const currentDevice = deviceOptions.value.find((d: { id: number }) => d.id === selectedDeviceId.value);
    if (currentDevice) {
      // 获取设备当前的家庭列表（需要加载所有设备）
      let device: any = null;
      let currentPage = 1;
      const pageSize = 10;
      let hasMore = true;
      
      while (hasMore && !device) {
        const deviceResult = await getDeviceList({ page: currentPage, pageSize });
        device = deviceResult.items.find((d) => d.id === selectedDeviceId.value);
        hasMore = deviceResult.items.length === pageSize && deviceResult.total > currentPage * pageSize;
        currentPage += 1;
      }
      const currentFamilyIds = device?.familyIds || [];
      
      // 添加当前家庭ID
      const newFamilyIds = [...currentFamilyIds, id.value];
      await updateDevice(selectedDeviceId.value, {
        familyIds: newFamilyIds,
      });
      
      message.success('添加设备成功');
      selectedDeviceId.value = undefined;
      await loadDevices();
      // 重新加载表单数据以更新deviceIds
      if (formData.value) {
        const familyData = await import('#/api/iot/family').then((m) => m.getFamily(id.value!));
        formData.value = familyData;
        // 重新加载设备列表
        await loadDevices();
      }
    }
  } catch (error) {
    message.error('添加设备失败');
  }
}

// 删除设备
async function handleRemoveDevice(deviceId: number) {
  if (!id.value) return;
  
  Modal.confirm({
    title: '确认删除',
    content: '确定要从家庭中移除该设备吗？',
    onOk: async () => {
      try {
        const { updateDevice } = await import('#/api/iot/device');
        const deviceResult = await getDeviceList({ pageSize: 1000 });
        const device = deviceResult.items.find((d) => d.id === deviceId);
        const currentFamilyIds = device?.familyIds || [];
        
        // 移除当前家庭ID
        const newFamilyIds = currentFamilyIds.filter((fid) => fid !== id.value);
        await updateDevice(deviceId, {
          familyIds: newFamilyIds,
        });
        
        message.success('移除设备成功');
        await loadDevices();
        // 重新加载表单数据以更新deviceIds
        if (formData.value) {
          const familyData = await import('#/api/iot/family').then((m) => m.getFamily(id.value!));
          formData.value = familyData;
          await loadDevices();
        }
      } catch (error) {
        message.error('移除设备失败');
      }
    },
  });
}

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    drawerApi.lock();

    try {
      // 头像直接使用选择的路径，无需处理文件上传
      const payload = { ...values };

      await (id.value
        ? updateFamily(id.value, payload as FamilyApi.UpdateFamilyParams)
        : createFamily(payload as FamilyApi.CreateFamilyParams));
      emits('success');
      drawerApi.close();
    } catch {
      drawerApi.unlock();
    }
  },

  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<FamilyApi.Family>();
      formApi.resetForm();
      members.value = [];
      devices.value = [];
      selectedUserId.value = undefined;
      selectedDeviceId.value = undefined;
      loadingDevices.value = false;

      if (data && data.id) {
        formData.value = data;
        id.value = data.id;
        // 直接使用返回的数据，不需要调用 API
        loadMembers();
        loadDevices();
        // 用户选项延迟加载，只在打开下拉框时加载
      } else {
        formData.value = undefined;
        id.value = undefined;
      }

      await nextTick();
      if (data && data.id) {
        // 直接设置头像路径，无需转换为 fileList
        formApi.setValues({
          ...data,
        });
      }
    } else {
      // 关闭时重置状态
      loadingDevices.value = false;
    }
  },
});

const getDrawerTitle = computed(() => {
  return id.value ? '编辑家庭' : '新增家庭';
});

// 获取可选的用户（排除已在家庭中的）
const availableUsers = computed(() => {
  const memberAccountIds = new Set(members.value.map((m) => m.accountId));
  return userOptions.value.filter((user) => !memberAccountIds.has(user.id));
});

// 获取可选的设备（排除已在家庭中的）
const availableDevices = computed(() => {
  const deviceIds = new Set(devices.value.map((d) => d.id));
  return deviceOptions.value.filter((device) => !deviceIds.has(device.id));
});
</script>

<template>
  <Drawer :title="getDrawerTitle" class="w-[800px]">
    <Form />
    
    <div v-if="id" class="mt-6 space-y-6">
      <!-- 成员管理 -->
      <div>
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-medium">成员管理</h3>
          <div class="flex items-center gap-2">
            <Select
              v-model:value="selectedUserId"
              placeholder="选择用户"
              style="width: 200px"
              :options="availableUsers"
              show-search
              @dropdownVisibleChange="(visible) => { if (visible) initUserOptions(); }"
              @popupScroll="handleUserScroll"
              :filter-option="(input, option) => option?.label?.toLowerCase().includes(input.toLowerCase()) ?? false"
            />
            <Button type="primary" @click="handleAddMember">
              <template #icon>
                <Plus />
              </template>
              添加成员
            </Button>
          </div>
        </div>
        <Table
          :columns="[
            { title: '成员ID', dataIndex: 'accountId', key: 'accountId', width: 100 },
            { title: '成员名称', dataIndex: 'accountName', key: 'accountName' },
            {
              title: '操作',
              key: 'action',
              width: 100,
              align: 'center',
            },
          ]"
          :data-source="members"
          :pagination="false"
          size="small"
          bordered
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <Button
                type="link"
                danger
                size="small"
                @click="handleRemoveMember(record.id)"
              >
                删除
              </Button>
            </template>
          </template>
        </Table>
      </div>

      <!-- 设备管理 -->
      <div>
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-medium">设备管理</h3>
          <div class="flex items-center gap-2">
            <Select
              v-model:value="selectedDeviceId"
              placeholder="选择设备"
              style="width: 200px"
              :options="availableDevices"
              show-search
              @dropdownVisibleChange="(visible) => { if (visible) initDeviceOptions(); }"
              @popupScroll="handleDeviceScroll"
              :filter-option="(input, option) => option?.label?.toLowerCase().includes(input.toLowerCase()) ?? false"
            />
            <Button type="primary" @click="handleAddDevice">
              <template #icon>
                <Plus />
              </template>
              添加设备
            </Button>
          </div>
        </div>
        <Table
          :columns="[
            { title: '设备ID', dataIndex: 'id', key: 'id', width: 100 },
            { title: '设备名称', dataIndex: 'name', key: 'name' },
            {
              title: '操作',
              key: 'action',
              width: 100,
              align: 'center',
            },
          ]"
          :data-source="devices"
          :pagination="false"
          size="small"
          bordered
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <Button
                type="link"
                danger
                size="small"
                @click="handleRemoveDevice(record.id)"
              >
                删除
              </Button>
            </template>
          </template>
        </Table>
      </div>
    </div>
  </Drawer>
</template>

