FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS build
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ARG VITE_API_URL
ARG VITE_APP_TITLE="Lock Room"
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_APP_TITLE=${VITE_APP_TITLE}
RUN pnpm run build 2>&1; echo "EXIT CODE: $?"; ls -la /app/ ; ls -la /app/.output 2>/dev/null || echo ".output NOT FOUND"; exit 0

FROM base AS production
COPY --from=build /app/.output ./.output
COPY --from=build /app/package.json ./package.json

ENV PORT=3000
EXPOSE ${PORT}

CMD ["node", ".output/server/index.mjs"]
