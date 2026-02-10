/**
 * 环境配置：切换 CURRENT_ENV 即切换 baseUrl
 */
// 切换环境时修改此处：'test' | 'production'
const CURRENT_ENV = 'production' as 'test' | 'production';

const TEST_CONFIG = {
  baseUrl: 'http://192.168.3.196:8001/api',
};

const PRODUCTION_CONFIG = {
  baseUrl: 'https://192.168.3.196:8000/api', // 改为实际生产 API 地址
};

const config = CURRENT_ENV === 'production' ? PRODUCTION_CONFIG : TEST_CONFIG;

export default {
  env: CURRENT_ENV,
  baseUrl: config.baseUrl,
};
