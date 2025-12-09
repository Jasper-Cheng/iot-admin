import { usePageResponseSuccess } from '../../../utils/response';

// Mock 版本管理数据（基于新的 version_info 表结构）
const MOCK_VERSIONS = [
  {
    id: 1,
    versionCode: '2.1.0',
    versionName: 'FastIoT v2.1.0',
    platform: 'app',
    title: '版本 2.1.0 更新',
    description:
      '1. 修复设备离线问题\n2. 优化场景联动功能\n3. 新增设备分享功能',
    downloadUrl: 'https://example.com/app-2.1.0.apk',
    fileSize: 52428800,
    isForceUpdate: false,
    minSupportedVersion: '2.0.0',
    extra: { buildNumber: 210 },
    createdAt: '2024-11-30 14:00:00',
    updatedAt: '2024-12-01 10:00:00',
  },
  {
    id: 2,
    versionCode: '1.0.0',
    platform: 'web',
    versionName: 'FastIoT Web v1.0.0',
    title: 'Web 版本 1.0.0 发布',
    description: '1. 全新 UI 设计\n2. 支持设备管理\n3. 性能优化',
    downloadUrl: null,
    fileSize: null,
    isForceUpdate: false,
    minSupportedVersion: null,
    extra: null,
    createdAt: '2024-10-28 09:00:00',
    updatedAt: '2024-11-01 10:00:00',
  },
  {
    id: 3,
    versionCode: '2.0.0',
    versionName: 'FastIoT v2.0.0',
    platform: 'app',
    title: '版本 2.0.0 重大更新',
    description: '1. 全新 UI 设计\n2. 支持场景联动\n3. 性能优化',
    downloadUrl: 'https://example.com/app-2.0.0.apk',
    fileSize: 51200000,
    isForceUpdate: true,
    minSupportedVersion: '1.5.0',
    extra: { buildNumber: 200 },
    createdAt: '2024-10-28 09:00:00',
    updatedAt: '2024-11-01 10:00:00',
  },
  {
    id: 4,
    versionCode: '2.2.0',
    versionName: 'FastIoT v2.2.0',
    platform: 'app',
    title: '版本 2.2.0 更新',
    description: '1. 新增语音控制\n2. 支持更多设备类型',
    downloadUrl: 'https://example.com/app-2.2.0.apk',
    fileSize: 53657600,
    isForceUpdate: false,
    minSupportedVersion: '2.1.0',
    extra: { buildNumber: 220 },
    createdAt: '2024-12-02 15:00:00',
    updatedAt: '2024-12-02 15:00:00',
  },
];

export default eventHandler(async (event) => {
  const { page = 1, pageSize = 10, versionCode, platform } = getQuery(event);
  
  let filtered = MOCK_VERSIONS;
  
  if (versionCode) {
    filtered = filtered.filter((item) => item.versionCode.includes(versionCode as string));
  }
  if (platform) {
    filtered = filtered.filter((item) => item.platform === platform);
  }
  
  return usePageResponseSuccess(page, pageSize, filtered);
});
