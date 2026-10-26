/**
 * 环境配置：根据构建模式自动切换 baseUrl
 * - 生产构建（main / CI / Docker）：固定使用正式环境
 * - 本地开发（dev）：使用测试环境
 */
// 使用可选链：该文件也会被 vite.config 在 Node 环境加载，此时 import.meta.env 不存在
const CURRENT_ENV: 'test' | 'production' = import.meta.env?.PROD
  ? 'production'
  : 'test';

const TEST_CONFIG = {
  baseUrl: 'http://212.129.243.155:8001/api',
};

const PRODUCTION_CONFIG = {
  baseUrl: 'http://212.129.243.155:8000/api', // 改为实际生产 API 地址
};

const config = CURRENT_ENV === 'production' ? PRODUCTION_CONFIG : TEST_CONFIG;

export default {
  env: CURRENT_ENV,
  baseUrl: config.baseUrl,
};
