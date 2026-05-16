FROM node:24-alpine

WORKDIR /app

ENV USER=appuser \
    GROUP=appgroup

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN addgroup -S ${GROUP} && \
    adduser -S ${USER} ${GROUP} && \
    chown ${USER}:${GROUP} /app && \
    pnpm exec next telemetry disable && \
    pnpm build

USER ${USER}

EXPOSE 3000

CMD ["pnpm", "start"]