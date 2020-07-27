FROM node:14.0.0 AS base
WORKDIR /usr/src/app

FROM base as builder
COPY ./lerna.json .
COPY ./package.json .
COPY ./tsconfig.json .
COPY ./yarn.lock .
COPY ./packages/akira/prisma ./packages/akira/prisma
COPY ./packages/akira/src ./packages/akira/src
COPY ./packages/akira/types ./packages/akira/types
COPY ./packages/akira/package*.json ./packages/akira/
COPY ./packages/akira/tsconfig.json ./packages/akira
RUN yarn install --frozen-lockfile
RUN yarn build

FROM builder as migrate
RUN yarn workspace akira prisma migrate up --experimental

FROM base AS app
COPY --from=builder /usr/src/app/yarn.lock .
COPY --from=builder /usr/src/app/packages/akira/dist ./dist
COPY --from=builder /usr/src/app/packages/akira/prisma ./prisma
COPY --from=builder /usr/src/app/packages/akira/package.json .
RUN yarn install --production
USER node
ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "dist/index.js"]
