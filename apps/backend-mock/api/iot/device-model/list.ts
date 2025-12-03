import { usePageResponseSuccess } from '../../../utils/response';

// Mock 设备型号数据
const MOCK_DEVICE_MODELS = [
  {
    id: 1,
    name: '温控器 T100',
    code: 'T100',
    thingModelId: 1,
    thingModelName: '温控器物模型',
    manufacturer: '智能科技',
    description: '高精度智能温控器',
    status: 'active',
    deviceCount: 156,
    createdAt: '2024-01-01 00:00:00',
  },
  {
    id: 2,
    name: '智能灯泡 L200',
    code: 'L200',
    thingModelId: 2,
    thingModelName: '灯泡物模型',
    manufacturer: '智能科技',
    description: '可调光调色智能灯泡',
    status: 'active',
    deviceCount: 328,
    createdAt: '2024-01-15 00:00:00',
  },
  {
    id: 3,
    name: '智能插座 S300',
    code: 'S300',
    thingModelId: 3,
    thingModelName: '插座物模型',
    manufacturer: '智能科技',
    description: '带电量统计的智能插座',
    status: 'active',
    deviceCount: 245,
    createdAt: '2024-02-01 00:00:00',
  },
  {
    id: 4,
    name: '智能门锁 K400',
    code: 'K400',
    thingModelId: 4,
    thingModelName: '门锁物模型',
    manufacturer: '安全科技',
    description: '指纹密码智能门锁',
    status: 'active',
    deviceCount: 89,
    createdAt: '2024-03-01 00:00:00',
  },
  {
    id: 5,
    name: '智能空调 A500',
    code: 'A500',
    thingModelId: 5,
    thingModelName: '空调物模型',
    manufacturer: '智能家电',
    description: '变频智能空调',
    status: 'inactive',
    deviceCount: 67,
    createdAt: '2024-04-01 00:00:00',
  },
];

export default eventHandler(async (event) => {
  const { page = 1, pageSize = 10 } = getQuery(event);
  return usePageResponseSuccess(page, pageSize, MOCK_DEVICE_MODELS);
});
