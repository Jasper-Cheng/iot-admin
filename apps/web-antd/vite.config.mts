import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  // 固定后端服务器地址
  const API_TARGET = 'http://localhost:8000';
  
  return {
    application: {
      // 禁用 mock 服务器
      nitroMock: false,
    },
    vite: {
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            // baseURL 是 /api/v1/iot，所以所有 /api/v1/* 路径直接转发，不需要重写
            // 前端请求: /api/v1/iot/device/list -> http://localhost:8000/api/v1/iot/device/list
            // 前端请求: /api/v1/web/auth/login -> http://localhost:8000/api/v1/web/auth/login
            rewrite: (path) => path, // 不进行路径重写，直接转发
            // 固定后端服务器地址
            target: API_TARGET,
            ws: true,
          },
        },
      },
    },
  };
});
