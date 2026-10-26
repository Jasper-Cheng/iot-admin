/**
 * 环境配置：切换 CURRENT_ENV 即切换 baseUrl
 */
// 切换环境时修改此处：'test' | 'production'
const CURRENT_ENV = 'production' as 'test' | 'production';

const TEST_CONFIG = {
  baseUrl: 'http://212.129.243.155:8001/api',
};

const PRODUCTION_CONFIG = {
  baseUrl: 'http://212.129.243.155:8000/api', // 改为实际生产 API 地址
};

const config = CURRENT_ENV === 'production' ? PRODUCTION_CONFIG : TEST_CONFIG;

// 手动切换：true 使用代理（本地开发），false 直连 API（构建/生产）
export const isDev = true;

const baseUrl = isDev ? '/api' : config.baseUrl;

export default {
  env: CURRENT_ENV,
  baseUrl,
  isDev,
};
