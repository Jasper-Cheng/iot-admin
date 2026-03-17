import { defineConfig } from '@vben/vite-config';

import { isDev } from './src/config/env';

export default defineConfig(async () => {
  return {
    application: {
      // 禁用 mock 服务器
      nitroMock: false,
    },
    vite: {
      server: {
        port: 5666,
        // 仅开发环境使用代理，解决 CORS 问题；构建环境不使用代理
        ...(isDev && {
          proxy: {
            '/api': {
              target: 'http://192.168.3.214:8000',
              changeOrigin: true,
            },
          },
        }),
      },
    },
  };
});
