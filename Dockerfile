FROM node:14.4.0 AS builder
WORKDIR /akira
COPY ./lerna.json .
COPY ./package.json .
COPY ./tsconfig.json .
COPY ./yarn.lock .
COPY ./packages/akira/package.json ./packages/akira/
RUN yarn install --frozen-lockfile
COPY ./packages/akira/src ./packages/akira/src
COPY ./packages/akira/types ./packages/akira/types
COPY ./packages/akira/tsconfig.json ./packages/akira/
RUN yarn build

FROM node:14.4.0
WORKDIR /akira
COPY --from=builder /akira/packages/akira/dist ./packages/akira/dist
WORKDIR /akira/packages/akira
COPY ./packages/akira/ormconfig.js .
COPY ./packages/akira/package.json .
RUN yarn install --production
ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "dist/index.js"]
