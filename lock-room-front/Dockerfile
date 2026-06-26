FROM node:22-alpine AS base
RUN npm install -g pnpm@11.7.0
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile --dangerously-allow-all-builds

FROM base AS build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile --dangerously-allow-all-builds
COPY . .
ARG VITE_API_URL
ARG VITE_APP_TITLE="Lock Room"
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_APP_TITLE=${VITE_APP_TITLE}
RUN pnpm run build

FROM base AS production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY node-server.mjs ./node-server.mjs

ENV PORT=3000
EXPOSE ${PORT}

CMD ["node", "node-server.mjs"]
