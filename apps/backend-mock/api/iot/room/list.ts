import { usePageResponseSuccess } from '../../../utils/response';

// Mock 房间数据
const MOCK_ROOMS = [
  {
    id: 1,
    name: '客厅',
    icon: 'sofa',
    userId: 1,
    userName: '张三',
    homeId: 1,
    homeName: '我的家',
    deviceCount: 5,
    sort: 1,
    createdAt: '2024-01-10 08:00:00',
  },
  {
    id: 2,
    name: '卧室',
    icon: 'bed',
    userId: 1,
    userName: '张三',
    homeId: 1,
    homeName: '我的家',
    deviceCount: 3,
    sort: 2,
    createdAt: '2024-01-10 08:00:00',
  },
  {
    id: 3,
    name: '书房',
    icon: 'book',
    userId: 1,
    userName: '张三',
    homeId: 1,
    homeName: '我的家',
    deviceCount: 2,
    sort: 3,
    createdAt: '2024-01-10 08:00:00',
  },
  {
    id: 4,
    name: '厨房',
    icon: 'kitchen',
    userId: 2,
    userName: '李四',
    homeId: 2,
    homeName: '李四的家',
    deviceCount: 4,
    sort: 1,
    createdAt: '2024-02-20 14:00:00',
  },
  {
    id: 5,
    name: '阳台',
    icon: 'sun',
    userId: 2,
    userName: '李四',
    homeId: 2,
    homeName: '李四的家',
    deviceCount: 1,
    sort: 2,
    createdAt: '2024-02-20 14:00:00',
  },
];

export default eventHandler(async (event) => {
  const { page = 1, pageSize = 10 } = getQuery(event);
  return usePageResponseSuccess(page, pageSize, MOCK_ROOMS);
});
