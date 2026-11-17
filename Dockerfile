FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
# Runtime preparation uses source scripts; install without running scripts yet.
RUN npm ci --ignore-scripts
COPY . .
# The sitemap, canonical URLs and share images are generated at build time, so these must be set here.
ARG SITE_URL
ARG APP_ORIGIN
ARG SITE_INDEXING_ENABLED
ENV SITE_URL=$SITE_URL APP_ORIGIN=$APP_ORIGIN SITE_INDEXING_ENABLED=$SITE_INDEXING_ENABLED
RUN npm run prepare:runtimes && npm run build

FROM node:24-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
RUN groupadd --system --gid 1001 sukoaa && useradd --system --uid 1001 --gid sukoaa sukoaa
COPY --from=build --chown=sukoaa:sukoaa /app/.next/standalone ./
COPY --from=build --chown=sukoaa:sukoaa /app/.next/static ./.next/static
COPY --from=build --chown=sukoaa:sukoaa /app/public ./public
USER sukoaa
EXPOSE 3000
CMD ["node", "server.js"]
