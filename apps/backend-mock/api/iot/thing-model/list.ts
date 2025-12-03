import { usePageResponseSuccess } from '../../../utils/response';

// Mock 物模型数据
const MOCK_THING_MODELS = [
  {
    id: 1,
    name: '温控器物模型',
    code: 'thing_thermostat',
    description: '用于温控器设备的物模型定义',
    status: 'published',
    version: '1.0.0',
    deviceCount: 156,
    properties: [
      { id: 'temperature', name: '当前温度', type: 'float', unit: '°C' },
      { id: 'humidity', name: '当前湿度', type: 'float', unit: '%' },
      { id: 'targetTemperature', name: '目标温度', type: 'float', unit: '°C' },
      {
        id: 'mode',
        name: '工作模式',
        type: 'enum',
        values: ['auto', 'cool', 'heat'],
      },
    ],
    createdAt: '2024-01-01 00:00:00',
    updatedAt: '2024-06-15 10:00:00',
  },
  {
    id: 2,
    name: '灯泡物模型',
    code: 'thing_light',
    description: '用于智能灯泡的物模型定义',
    status: 'published',
    version: '1.1.0',
    deviceCount: 328,
    properties: [
      { id: 'power', name: '开关状态', type: 'boolean' },
      {
        id: 'brightness',
        name: '亮度',
        type: 'int',
        unit: '%',
        min: 0,
        max: 100,
      },
      {
        id: 'colorTemp',
        name: '色温',
        type: 'int',
        unit: 'K',
        min: 2700,
        max: 6500,
      },
    ],
    createdAt: '2024-01-15 00:00:00',
    updatedAt: '2024-07-20 14:30:00',
  },
  {
    id: 3,
    name: '插座物模型',
    code: 'thing_socket',
    description: '用于智能插座的物模型定义',
    status: 'published',
    version: '1.0.0',
    deviceCount: 245,
    properties: [
      { id: 'power', name: '开关状态', type: 'boolean' },
      { id: 'voltage', name: '电压', type: 'float', unit: 'V' },
      { id: 'current', name: '电流', type: 'float', unit: 'A' },
      { id: 'energy', name: '用电量', type: 'float', unit: 'kWh' },
    ],
    createdAt: '2024-02-01 00:00:00',
    updatedAt: '2024-05-10 09:00:00',
  },
  {
    id: 4,
    name: '门锁物模型',
    code: 'thing_lock',
    description: '用于智能门锁的物模型定义',
    status: 'draft',
    version: '0.9.0',
    deviceCount: 89,
    properties: [
      { id: 'locked', name: '锁定状态', type: 'boolean' },
      { id: 'battery', name: '电池电量', type: 'int', unit: '%' },
      { id: 'lastUnlockTime', name: '上次开锁时间', type: 'datetime' },
      {
        id: 'unlockMethod',
        name: '开锁方式',
        type: 'enum',
        values: ['fingerprint', 'password', 'card', 'app'],
      },
    ],
    createdAt: '2024-03-01 00:00:00',
    updatedAt: '2024-08-05 16:00:00',
  },
  {
    id: 5,
    name: '空调物模型',
    code: 'thing_ac',
    description: '用于智能空调的物模型定义',
    status: 'published',
    version: '2.0.0',
    deviceCount: 67,
    properties: [
      { id: 'power', name: '开关状态', type: 'boolean' },
      {
        id: 'temperature',
        name: '设定温度',
        type: 'int',
        unit: '°C',
        min: 16,
        max: 30,
      },
      {
        id: 'mode',
        name: '工作模式',
        type: 'enum',
        values: ['auto', 'cool', 'heat', 'fan', 'dry'],
      },
      {
        id: 'windSpeed',
        name: '风速',
        type: 'enum',
        values: ['auto', 'low', 'medium', 'high'],
      },
    ],
    createdAt: '2024-04-01 00:00:00',
    updatedAt: '2024-09-01 11:00:00',
  },
];

export default eventHandler(async (event) => {
  const { page = 1, pageSize = 10 } = getQuery(event);
  return usePageResponseSuccess(page, pageSize, MOCK_THING_MODELS);
});
