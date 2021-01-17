FROM node:15.0.0 AS base
WORKDIR /usr/src/akira

FROM base as builder
COPY ./@types ./@types
COPY ./locales ./locales
COPY ./prisma ./prisma
COPY ./src ./src
COPY ./entrypoint.sh .
COPY ./package*.json ./
COPY ./tsconfig.json .
RUN npm ci --ignore-scripts
RUN npx --no-install prisma generate
RUN npm run build

FROM base AS akira
COPY --from=builder /usr/src/akira/dist ./dist
COPY --from=builder /usr/src/akira/locales ./locales
COPY --from=builder /usr/src/akira/entrypoint.sh .
COPY --from=builder /usr/src/akira/package*.json ./
RUN chmod +x ./entrypoint.sh
RUN npm i --only=prod --ignore-scripts
RUN npx --no-install prisma generate
RUN npm i pino-elasticsearch -g
USER node
ENV NODE_ENV=production
ENTRYPOINT ["./entrypoint.sh"]
