#!/bin/sh
node dist/index.js 2>&1 | pino-elasticsearch --node $(heroku config:get SEARCHBOX_URL -a akira-bot-discord)
