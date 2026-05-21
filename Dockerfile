FROM node:22-bookworm-slim AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches
RUN pnpm install --frozen-lockfile
COPY . .
# NODE_ENV=production est requis pour que Vite minifie le JS et CSS correctement
ENV NODE_ENV=production
# Clé DeepL — traduction automatique des locales pendant le build (optionnelle :
# si absente, le build se poursuit et les pages non traduites retombent sur le FR)
ARG DEEPL_API_KEY
ENV DEEPL_API_KEY=${DEEPL_API_KEY}
RUN pnpm build

FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
CMD ["node", "dist/index.js"]
# cache bust mer. 29 avr. 2026 00:49:37 CST
