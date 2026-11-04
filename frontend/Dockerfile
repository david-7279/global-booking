ARG NODE_VERSION=22-alpine

# ---------- Build ----------
FROM node:${NODE_VERSION} AS build
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile
COPY . .
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}
RUN pnpm run build

# ---------- Final Image: Static Files Only ----------
FROM alpine:3.20
COPY --from=build /app/dist /dist
CMD ["sh", "-c", "rm -rf /target/* && cp -r /dist/. /target/"]