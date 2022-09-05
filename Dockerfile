FROM node:16-alpine3.16

WORKDIR /app

ENV USER=appuser \
    GROUP=appgroup

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN addgroup -S ${GROUP} && \
    adduser -S ${USER} ${GROUP} && \
    chown ${USER}:${GROUP} /app && \
    npx next telemetry disable && \
    npm run build

USER ${USER}

EXPOSE 3000

CMD ["npm", "run", "start"]