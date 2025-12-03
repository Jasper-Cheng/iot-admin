import { defineOverridesPreferences } from '@vben/preferences';

/**
 * @description 项目配置文件
 * 只需要覆盖项目中的一部分配置，不需要的配置不用覆盖，会自动使用默认配置
 * !!! 更改配置后请清空缓存，否则可能不生效
 */
export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    name: import.meta.env.VITE_APP_TITLE,
    // 设置默认语言为中文
    locale: 'zh-CN',
  },
  // 物联网风格主题 - 科技蓝
  theme: {
    builtinType: 'deep-blue',
    // 主题色 - 深空蓝
    colorPrimary: 'hsl(211 91% 39%)',
    // 成功色 - 科技绿
    colorSuccess: 'hsl(161 90% 43%)',
    // 默认深色模式
    mode: 'dark',
  },
  // 侧边栏配置
  sidebar: {
    // 侧边栏宽度
    width: 240,
  },
  // 顶部标签栏
  tabbar: {
    enable: true,
    // 标签栏样式
    styleType: 'chrome',
  },
  // 页面过渡动画
  transition: {
    enable: true,
    name: 'fade-slide',
  },
  // 快捷功能
  widget: {
    fullscreen: true,
    globalSearch: true,
    languageToggle: true,
    themeToggle: true,
    notification: true,
  },
});
