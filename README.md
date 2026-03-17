# 物联网管理平台 (IoT Admin Platform)

基于 Vue 3 + Vben Admin 5.x 构建的现代化物联网后台管理系统。

## 📋 项目简介

物联网管理平台是一个功能完善的后台管理系统，提供设备管理、用户管理、数据统计等核心功能。系统采用最新的前端技术栈，具有完善的类型支持、国际化支持和主题定制能力。

## ✨ 核心功能

### 🎯 设备管理

- **物模型管理** - 定义设备属性、事件和服务
- **型号管理** - 管理设备型号信息
- **设备列表** - 设备入库、状态监控、房间绑定
- **设备详情** - 多 Tab 详情页（基础信息、网络、属性、消息、房间）
- **网络信息** - 设备网络连接状态监控
- **设备消息** - 告警、故障、事件消息管理

### 👥 账号管理

- **管理员管理** - 系统管理员账号管理
- **用户管理** - App 用户管理
- **成员管理** - 家庭成员管理
- **操作日志** - 用户操作记录查询

### 💬 意见反馈

- **反馈列表** - 查看用户反馈
- **状态流转** - 待处理 → 处理中 → 已解决
- **回复功能** - 管理员回复用户反馈

### ⚙️ 系统管理

- **房间管理** - 用户房间配置管理
- **系统消息** - 发布系统通知和公告
- **版本管理** - App 版本发布管理

### 📊 数据统计

- **数据概览** - 设备统计、用户统计、告警统计
- **工作台** - 快捷入口、待办事项、最新动态

## 🛠️ 技术栈

| 技术           | 版本   | 说明                   |
| -------------- | ------ | ---------------------- |
| Vue            | 3.5.24 | 渐进式 JavaScript 框架 |
| TypeScript     | 5.9.3  | 类型安全的 JavaScript  |
| Vben Admin     | 5.5.9  | 后台管理系统框架       |
| Ant Design Vue | 4.2.6  | UI 组件库              |
| Vite           | 7.2.2  | 下一代前端构建工具     |
| Pinia          | -      | 状态管理               |
| Vue Router     | -      | 路由管理               |
| Tailwind CSS   | 3.4.18 | 原子化 CSS 框架        |

## 📦 项目结构

```
iot-admin/
├── apps/
│   └── web-antd/          # 主应用（Ant Design Vue）
├── packages/              # 共享包
│   ├── @core/            # 核心功能
│   ├── effects/          # 功能模块
│   └── ...
└── internal/             # 内部工具配置
```

## 🚀 快速开始

### 环境要求

- Node.js >= 20.12.0
- pnpm >= 10.0.0

### 安装依赖

```bash
# 安装 pnpm（如果未安装）
npm i -g pnpm

# 安装项目依赖
pnpm install
```

### 开发运行

```bash
# 启动开发服务器
pnpm dev:antd

# 访问地址
# 前端: http://localhost:5666
```

### 构建生产版本

```bash
# 构建生产版本
pnpm build:antd

# 预览构建结果
pnpm preview:antd
```

## 🔐 默认账号

- **用户名**: `vben`
- **密码**: `123456`

## 📁 目录说明

### 主应用 (`apps/web-antd/src/`)

```
src/
├── api/              # API 接口定义
│   └── iot/         # 物联网业务 API
├── views/            # 页面视图
│   ├── dashboard/   # 仪表盘
│   ├── account/     # 账号管理
│   ├── device/      # 设备管理
│   ├── feedback/    # 意见反馈
│   └── system/      # 系统管理
├── router/          # 路由配置
├── store/           # 状态管理
└── utils/           # 工具函数
```

## 🎨 功能特性

- ✅ **TypeScript** - 完整的类型支持
- ✅ **国际化** - 中英文切换
- ✅ **主题定制** - 深蓝色物联网风格主题
- ✅ **响应式设计** - 适配各种屏幕尺寸
- ✅ **表格组件** - 强大的表格功能（搜索、排序、导出）
- ✅ **表单验证** - 完善的表单验证机制
- ✅ **路由守卫** - 权限控制和登录验证

## 📝 开发规范

### 提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat`: 新功能
- `fix`: 修复问题
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具链相关

### 代码规范

- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 使用 TypeScript 严格模式

## 🔄 数据流

```
用户操作 → Vue 组件 → API 调用 → 后端服务 → 响应数据 → Pinia Store → 组件更新
```

## 📄 许可证

[MIT](./LICENSE)

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

- GitHub: [Jasper-Cheng/iot-admin](https://github.com/Jasper-Cheng/iot-admin)

---

**基于 [Vben Admin](https://github.com/vbenjs/vue-vben-admin) 构建**
