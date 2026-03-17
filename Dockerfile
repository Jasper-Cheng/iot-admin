FROM node:22-slim AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_OPTIONS=--max-old-space-size=8192
ENV TZ=Asia/Shanghai

RUN corepack enable && corepack prepare pnpm@10.22.0 --activate

WORKDIR /app

# 1. 仅复制依赖清单文件（lockfile/package.json 未变更时可复用后续层）
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./

# 复制各 workspace 的 package.json（保持目录结构，供 pnpm install 解析 workspace:*）
COPY apps/web-antd/package.json ./apps/web-antd/
COPY internal/node-utils/package.json ./internal/node-utils/
COPY internal/vite-config/package.json ./internal/vite-config/
COPY internal/tailwind-config/package.json ./internal/tailwind-config/
COPY internal/tsconfig/package.json ./internal/tsconfig/
COPY internal/lint-configs/commitlint-config/package.json ./internal/lint-configs/commitlint-config/
COPY internal/lint-configs/eslint-config/package.json ./internal/lint-configs/eslint-config/
COPY internal/lint-configs/prettier-config/package.json ./internal/lint-configs/prettier-config/
COPY internal/lint-configs/stylelint-config/package.json ./internal/lint-configs/stylelint-config/
COPY packages/constants/package.json ./packages/constants/
COPY packages/icons/package.json ./packages/icons/
COPY packages/locales/package.json ./packages/locales/
COPY packages/preferences/package.json ./packages/preferences/
COPY packages/stores/package.json ./packages/stores/
COPY packages/styles/package.json ./packages/styles/
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY packages/@core/base/design/package.json ./packages/@core/base/design/
COPY packages/@core/base/icons/package.json ./packages/@core/base/icons/
COPY packages/@core/base/shared/package.json ./packages/@core/base/shared/
COPY packages/@core/base/typings/package.json ./packages/@core/base/typings/
COPY packages/@core/composables/package.json ./packages/@core/composables/
COPY packages/@core/preferences/package.json ./packages/@core/preferences/
COPY packages/@core/ui-kit/form-ui/package.json ./packages/@core/ui-kit/form-ui/
COPY packages/@core/ui-kit/layout-ui/package.json ./packages/@core/ui-kit/layout-ui/
COPY packages/@core/ui-kit/menu-ui/package.json ./packages/@core/ui-kit/menu-ui/
COPY packages/@core/ui-kit/popup-ui/package.json ./packages/@core/ui-kit/popup-ui/
COPY packages/@core/ui-kit/shadcn-ui/package.json ./packages/@core/ui-kit/shadcn-ui/
COPY packages/@core/ui-kit/tabs-ui/package.json ./packages/@core/ui-kit/tabs-ui/
COPY packages/effects/access/package.json ./packages/effects/access/
COPY packages/effects/common-ui/package.json ./packages/effects/common-ui/
COPY packages/effects/hooks/package.json ./packages/effects/hooks/
COPY packages/effects/layouts/package.json ./packages/effects/layouts/
COPY packages/effects/plugins/package.json ./packages/effects/plugins/
COPY packages/effects/request/package.json ./packages/effects/request/
COPY scripts/turbo-run/package.json ./scripts/turbo-run/
COPY scripts/vsh/package.json ./scripts/vsh/

# 2. 安装依赖（依赖清单未变时此层可被缓存）
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# 3. 复制源码（仅源码变更时从此层开始重建）
COPY . /app

# 4. 为 internal 包生成 stub（@vben/vite-config 等依赖 dist/，仅提供 stub 脚本）
RUN pnpm -F @vben/node-utils run stub && \
    pnpm -F @vben/vite-config run stub && \
    pnpm -F @vben/tailwind-config run stub

# 5. 构建 web-antd 应用（使用 .env.production 中的配置）
RUN pnpm run build:antd

FROM nginx:stable-alpine AS production

# 删除默认配置
RUN rm -rf /etc/nginx/conf.d/default.conf

# 复制构建产物 (web-antd 输出到 apps/web-antd/dist)
COPY --from=builder /app/apps/web-antd/dist /usr/share/nginx/html

# 复制 nginx 配置 (监听 90 端口)
COPY scripts/deploy/nginx.conf /etc/nginx/nginx.conf
RUN sed -i 's/listen 8080/listen 90/' /etc/nginx/nginx.conf

EXPOSE 90

CMD ["nginx", "-g", "daemon off;"]
