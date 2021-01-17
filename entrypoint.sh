#!/bin/sh
node dist/index.js 2>&1 | pino-elasticsearch --node $SEARCHBOX_URL
