FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base AS dev
ENV NODE_ENV develop
COPY --from=deps /app/node_modules /app/node_modules
CMD ["pnpm", "run", "dev"]

FROM base AS test
ENV NODE_ENV test
COPY --from=deps /app/node_modules /app/node_modules
CMD ["pnpm", "run", "test"]
