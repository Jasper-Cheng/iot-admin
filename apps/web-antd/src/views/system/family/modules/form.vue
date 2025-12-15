<script lang="ts" setup>
import type { FamilyApi } from '#/api/iot/family';

import { computed, nextTick, ref } from 'vue';

import { Button, Input, message, Modal, Select, Table } from 'ant-design-vue';
import { useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { useVbenForm } from '#/adapter/form';
import { createFamily, updateFamily, getFamily, getFamilyMemberList, addFamilyMember, removeFamilyMember, addFamilyDevice, removeFamilyDevice, updateFamilyMember } from '#/api/iot/family';
import { getDeviceList } from '#/api/iot/device';
import { getUserList } from '#/api/iot/user';

import { useFormSchema } from '../data';

const emits = defineEmits(['success']);

const formData = ref<FamilyApi.Family>();
const members = ref<Array<{ id: number; accountId: number; accountName: string; nickname?: string; originalNickname?: string }>>([]);
const devices = ref<Array<{ id: number; name: string }>>([]);
const userOptions = ref<Array<{ id: number; label: string }>>([]);
const deviceOptions = ref<Array<{ id: number; label: string }>>([]);
const selectedUserId = ref<number | undefined>();
const selectedDeviceId = ref<number | undefined>();
const loadingDevices = ref(false);
const editingNicknameId = ref<number | null>(null); // 正在编辑昵称的成员ID
const editingNicknameValue = ref<string>(''); // 编辑中的昵称值

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
        // 对于用户选项，使用特殊格式：用户名_手机号
        if (labelField === 'nickname' && item.phone) {
          return {
            label: `${item.nickname || '未知'}_${item.phone}`,
            value: item[valueField],
            id: item[valueField],
          };
        }
        return {
          label: item[labelField] || item.phone || item.name,
          value: item[valueField],
          id: item[valueField],
        };
      });
    } catch (error) {
      console.error('Failed to load options:', error);
      return allItems.map((item) => {
        // 对于用户选项，使用特殊格式：用户名_手机号
        if (labelField === 'nickname' && item.phone) {
          return {
            label: `${item.nickname || '未知'}_${item.phone}`,
            value: item[valueField],
            id: item[valueField],
          };
        }
        return {
          label: item[labelField] || item.phone || item.name,
          value: item[valueField],
          id: item[valueField],
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
      // 对于用户选项，使用特殊格式：用户名_手机号
      if (labelField === 'nickname' && item.phone) {
        return {
          label: `${item.nickname || '未知'}_${item.phone}`,
          value: item[valueField],
          id: item[valueField],
        };
      }
      return {
        label: item[labelField] || item.phone || item.name,
        value: item[valueField],
        id: item[valueField],
      };
    });
  };

  const getItemById = (id: number) => {
    return allItems.find((item) => item[valueField] === id);
  };

  return { loadMore, reset, getOptions, getItemById };
}

// 创建用户和设备滚动加载器
const userLoader = createScrollLoader(
  async (params) => await getUserList(params),
  'nickname',
  'id',
);

// 加载家庭成员的设备
let familyDeviceLoading = false;

async function loadFamilyMemberDevices() {
  if (!id.value || !formData.value?.memberIds || formData.value.memberIds.length === 0) {
    return [];
  }

  if (familyDeviceLoading) return [];

  familyDeviceLoading = true;
  try {
    const memberIds = formData.value.memberIds;
    const pageSize = 10;
    const allDevices: any[] = [];

    // 为每个成员获取设备
    for (const memberId of memberIds) {
      let currentPage = 1;
      let hasMore = true;

      while (hasMore) {
        const result = await getDeviceList({
          accountId: memberId,
          page: currentPage,
          pageSize,
        });

        if (result.items && result.items.length > 0) {
          allDevices.push(...result.items);
        }

        hasMore = result.items.length === pageSize && (currentPage * pageSize) < (result.total || 0);
        currentPage += 1;
      }
    }

    // 去重（按设备ID）
    const deviceMap = new Map();
    allDevices.forEach((device) => {
      if (!deviceMap.has(device.id)) {
        deviceMap.set(device.id, device);
      }
    });

    return Array.from(deviceMap.values());
  } catch (error) {
    console.error('Failed to load family member devices:', error);
    return [];
  } finally {
    familyDeviceLoading = false;
  }
}

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
      // 确保昵称值正确显示，处理 null、undefined 和空字符串
      const nickname = member?.nickname ? String(member.nickname) : '';
      return {
        id: member?.id || 0, // 使用家庭成员关系ID
        accountId: accountId,
        accountName: memberNames[index] || member?.accountName || `用户${accountId}`,
        nickname: nickname,
        originalNickname: nickname, // 保存原始昵称，用于比较是否有变化
      };
    });
  } catch (error) {
    console.error('Failed to load member details:', error);
    // 如果 API 失败，至少显示名称
    members.value = memberIds.map((accountId, index) => ({
      id: 0,
      accountId: accountId,
      accountName: memberNames[index] || `用户${accountId}`,
      nickname: undefined,
      originalNickname: undefined,
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
    value: item.id,
    label: item.label, // 已经在 getOptions 中格式化为 用户名_手机号
  }));
}

// 初始化设备选项（延迟加载，只在需要时调用）
async function initDeviceOptions() {
  if (!id.value || !formData.value?.memberIds || formData.value.memberIds.length === 0) {
    deviceOptions.value = [];
    return;
  }

  // 加载家庭成员的设备
  const allDevices = await loadFamilyMemberDevices();
  
  // 过滤掉已经添加到该家庭的设备
  const familyDeviceIds = new Set(formData.value.deviceIds || []);
  const availableDevices = allDevices.filter((device) => !familyDeviceIds.has(device.id));

  deviceOptions.value = availableDevices.map((device) => ({
    id: device.id,
    value: device.id,
    label: `${device.id}_${device.name || device.sn || `设备${device.id}`}`,
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
        value: item.id,
        label: item.label, // 已经在 getOptions 中格式化为 用户名_手机号
      }));
    });
  }
}

// 处理设备下拉框滚动加载
// 注意：由于设备选项是基于家庭成员设备一次性加载的，这里不需要滚动加载
// 但如果设备很多，可以考虑实现分页加载
function handleDeviceScroll(_e: Event) {
  // 设备选项已经一次性加载完成，不需要滚动加载
  // 如果需要支持大量设备的分页加载，可以在这里实现
}

// 添加成员
async function handleAddMember() {
  if (!selectedUserId.value || !id.value) {
    message.warning('请选择要添加的用户');
    return;
  }
  
  // 检查是否已存在
  if (members.value.some((m) => m.accountId === selectedUserId.value)) {
    message.warning('该用户已经是家庭成员');
    return;
  }

  try {
    // 获取用户信息，使用用户的nickname作为默认昵称
    let defaultNickname: string | undefined;
    const user = userLoader.getItemById(selectedUserId.value);
    if (user) {
      defaultNickname = user.nickname || undefined;
    } else {
      // 如果用户信息未加载，尝试从API搜索获取
      try {
        // 通过分页搜索找到用户（最多搜索前100个用户）
        let foundUser = null;
        let currentPage = 1;
        const pageSize = 20;
        while (currentPage <= 5 && !foundUser) {
          const userResult = await getUserList({ page: currentPage, pageSize });
          foundUser = userResult.items.find((u) => u.id === selectedUserId.value);
          if (foundUser || userResult.items.length < pageSize) {
            break;
          }
          currentPage += 1;
        }
        if (foundUser) {
          defaultNickname = foundUser.nickname || undefined;
        }
      } catch (error) {
        // 如果获取失败，使用undefined（后端会处理）
        console.warn('获取用户信息失败，将不设置默认昵称:', error);
      }
    }

    await addFamilyMember({
      familyId: id.value,
      accountId: selectedUserId.value,
      nickname: defaultNickname,
    });
    message.success('添加成员成功');
    selectedUserId.value = undefined;
    // 重新加载家庭数据以更新 memberIds 和 memberNames
    if (id.value) {
      const familyData = await getFamily(id.value);
      formData.value = familyData;
      await loadMembers();
      // 重新加载设备列表，确保设备数据同步
      loadDevices();
      // 重置设备选项，以便重新加载新成员的设备
      deviceOptions.value = [];
    }
    // 触发成功事件，刷新家庭列表
    emits('success');
  } catch (error: any) {
    console.error('添加成员失败:', error);
    message.error(error?.response?.data?.message || '添加成员失败');
  }
}

// 开始编辑昵称
function handleStartEditNickname(memberId: number, currentNickname?: string) {
  editingNicknameId.value = memberId;
  editingNicknameValue.value = currentNickname || '';
}

// 保存昵称
async function handleSaveNickname(memberId: number) {
  if (!id.value) return;

  const member = members.value.find((m) => m.id === memberId);
  if (!member) return;

  // 处理昵称：空字符串转为 null，否则使用 trim 后的值
  const trimmedNickname = editingNicknameValue.value.trim();
  const newNickname: string | null = trimmedNickname === '' ? null : trimmedNickname;
  
  try {
    await updateFamilyMember(id.value, memberId, {
      nickname: newNickname,
    });
    
    // 更新本地数据
    member.nickname = newNickname || undefined;
    member.originalNickname = newNickname || undefined;
    
    // 清除编辑状态
    editingNicknameId.value = null;
    editingNicknameValue.value = '';
    
    message.success('昵称更新成功');
    // 触发成功事件，刷新家庭列表
    emits('success');
  } catch (error: any) {
    console.error('更新昵称失败:', error);
    const errorMsg = error?.response?.data?.detail || error?.response?.data?.message || '更新昵称失败';
    message.error(errorMsg);
  }
}

// 取消编辑昵称
function handleCancelEditNickname() {
  editingNicknameId.value = null;
  editingNicknameValue.value = '';
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
        // 重新加载家庭数据以更新 memberIds 和 memberNames
        if (id.value) {
          const familyData = await getFamily(id.value);
          formData.value = familyData;
          await loadMembers();
          // 重新加载设备列表，确保设备数据同步
          loadDevices();
          // 重置设备选项，以便重新加载剩余成员的设备
          deviceOptions.value = [];
        }
        // 触发成功事件，刷新家庭列表
        emits('success');
      } catch (error: any) {
        console.error('移除成员失败:', error);
        message.error(error?.response?.data?.message || '移除成员失败');
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
    await addFamilyDevice(id.value, selectedDeviceId.value);
    
    message.success('添加设备成功');
    selectedDeviceId.value = undefined;
    
    // 重新加载家庭数据以更新 deviceIds 和 deviceNames
    if (id.value) {
      const familyData = await getFamily(id.value);
      formData.value = familyData;
      // 重新加载设备列表
      await loadDevices();
      // 重置设备选项，以便重新加载可用设备（排除新添加的设备）
      deviceOptions.value = [];
    }
    // 触发成功事件，刷新家庭列表
    emits('success');
  } catch (error: any) {
    console.error('添加设备失败:', error);
    const errorMsg = error?.response?.data?.detail || error?.response?.data?.message || '添加设备失败';
    message.error(errorMsg);
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
        await removeFamilyDevice(id.value!, deviceId);
        
        message.success('移除设备成功');
        // 重新加载家庭数据以更新 deviceIds 和 deviceNames
        if (id.value) {
          const familyData = await getFamily(id.value);
          formData.value = familyData;
          await loadDevices();
          // 重置设备选项，以便重新加载可用设备（包含刚移除的设备）
          deviceOptions.value = [];
        }
        // 触发成功事件，刷新家庭列表
        emits('success');
      } catch (error: any) {
        console.error('移除设备失败:', error);
        const errorMsg = error?.response?.data?.detail || error?.response?.data?.message || '移除设备失败';
        message.error(errorMsg);
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
            { title: '家庭中的昵称', dataIndex: 'nickname', key: 'nickname' },
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
            <template v-if="column.key === 'nickname'">
              <div v-if="editingNicknameId === record.id" class="flex items-center gap-1">
                <Input
                  v-model:value="editingNicknameValue"
                  size="small"
                  placeholder="请输入家庭中的昵称"
                  style="width: 150px"
                  @pressEnter="handleSaveNickname(record.id)"
                />
                <Button
                  type="link"
                  size="small"
                  @click="handleSaveNickname(record.id)"
                >
                  保存
                </Button>
                <Button
                  type="link"
                  size="small"
                  @click="handleCancelEditNickname"
                >
                  取消
                </Button>
              </div>
              <div v-else class="flex items-center gap-1">
                <span v-if="record.nickname" class="text-gray-700">{{ record.nickname }}</span>
                <span v-else class="text-gray-400">-</span>
                <Button
                  type="link"
                  size="small"
                  @click="handleStartEditNickname(record.id, record.nickname)"
                >
                  修改
                </Button>
              </div>
            </template>
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

