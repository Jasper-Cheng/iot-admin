import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  // 从环境变量获取真实后端 API 地址，默认为 mock 服务器地址
  // 生产环境应该设置 VITE_GLOB_API_URL 环境变量指向真实后端
  const API_TARGET = process.env.VITE_API_TARGET || 'http://localhost:5320/api';
  
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // 真实后端 API 地址，通过环境变量 VITE_API_TARGET 配置
            // 示例：VITE_API_TARGET=http://localhost:8080/api/v1/iot
            target: API_TARGET,
            ws: true,
          },
        },
      },
    },
  };
});
