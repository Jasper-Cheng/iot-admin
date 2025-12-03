import { usePageResponseSuccess } from '../../../utils/response';

// Mock 版本管理数据
const MOCK_VERSIONS = [
  {
    id: 1,
    version: '2.1.0',
    platform: 'android',
    downloadUrl: 'https://example.com/app-2.1.0.apk',
    description:
      '1. 修复设备离线问题\n2. 优化场景联动功能\n3. 新增设备分享功能',
    forceUpdate: false,
    status: 'published',
    publishTime: '2024-12-01 10:00:00',
    createdAt: '2024-11-30 14:00:00',
  },
  {
    id: 2,
    version: '2.1.0',
    platform: 'ios',
    downloadUrl: 'https://apps.apple.com/app/iot-app',
    description:
      '1. 修复设备离线问题\n2. 优化场景联动功能\n3. 新增设备分享功能',
    forceUpdate: false,
    status: 'published',
    publishTime: '2024-12-01 10:00:00',
    createdAt: '2024-11-30 14:00:00',
  },
  {
    id: 3,
    version: '2.0.0',
    platform: 'android',
    downloadUrl: 'https://example.com/app-2.0.0.apk',
    description: '1. 全新 UI 设计\n2. 支持场景联动\n3. 性能优化',
    forceUpdate: true,
    status: 'published',
    publishTime: '2024-11-01 10:00:00',
    createdAt: '2024-10-28 09:00:00',
  },
  {
    id: 4,
    version: '2.0.0',
    platform: 'ios',
    downloadUrl: 'https://apps.apple.com/app/iot-app',
    description: '1. 全新 UI 设计\n2. 支持场景联动\n3. 性能优化',
    forceUpdate: true,
    status: 'published',
    publishTime: '2024-11-01 10:00:00',
    createdAt: '2024-10-28 09:00:00',
  },
  {
    id: 5,
    version: '2.2.0',
    platform: 'android',
    downloadUrl: 'https://example.com/app-2.2.0.apk',
    description: '1. 新增语音控制\n2. 支持更多设备类型',
    forceUpdate: false,
    status: 'draft',
    publishTime: null,
    createdAt: '2024-12-02 15:00:00',
  },
];

export default eventHandler(async (event) => {
  const { page = 1, pageSize = 10 } = getQuery(event);
  return usePageResponseSuccess(page, pageSize, MOCK_VERSIONS);
});
