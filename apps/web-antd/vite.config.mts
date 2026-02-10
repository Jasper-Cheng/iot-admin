import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {
      // 禁用 mock 服务器
      nitroMock: false,
    },
    vite: {
      server: { port: 5666 },
    },
  };
});
