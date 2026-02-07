FROM node:22-slim AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_OPTIONS=--max-old-space-size=8192
ENV TZ=Asia/Shanghai

RUN corepack enable && corepack prepare pnpm@10.22.0 --activate

WORKDIR /app

COPY . /app

# 安装依赖
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# 构建 web-antd 应用
RUN pnpm run build:antd

FROM nginx:stable-alpine AS production

# 配置 nginx 支持 mjs
RUN echo "types { application/javascript js mjs; }" > /etc/nginx/conf.d/mjs.conf \
    && rm -rf /etc/nginx/conf.d/default.conf

# 复制构建产物 (web-antd 输出到 apps/web-antd/dist)
COPY --from=builder /app/apps/web-antd/dist /usr/share/nginx/html

# 复制 nginx 配置 (监听 80 以配合 docker-compose 的 8080:80 端口映射)
COPY scripts/deploy/nginx.conf /etc/nginx/nginx.conf
RUN sed -i 's/listen 8080/listen 80/' /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
