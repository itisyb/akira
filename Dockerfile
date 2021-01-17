FROM node:15.0.0 AS base
WORKDIR /usr/src/akira

FROM base as builder
COPY ./locales ./locales
COPY ./prisma ./prisma
COPY ./src ./src
COPY ./entrypoint.sh .
COPY ./package*.json ./
COPY ./tsconfig.json .
RUN npm ci --ignore-scripts
RUN npx --no-install prisma generate
RUN npm run build

FROM builder as migrate
RUN npx --no-install prisma migrate deploy --preview-feature

FROM base AS akira
COPY --from=builder /usr/src/akira/dist ./dist
COPY --from=builder /usr/src/akira/locales ./locales
COPY --from=builder /usr/src/akira/entrypoint.sh .
COPY --from=builder /usr/src/akira/package*.json .
RUN chmod +x ./entrypoint.sh
RUN npm i --only=prod --ignore-scripts
RUN npm i pino-elasticsearch -g
USER node
ENV NODE_ENV=production
EXPOSE 4000
ENTRYPOINT ["./entrypoint.sh"]
