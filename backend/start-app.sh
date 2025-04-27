#!/bin/bash

# File: start-app.sh
# Description: Builds and starts the Node.js app in the background using nohup

APP_PATH="dist/main.js"
LOG_FILE="output.log"
PID_FILE="app.pid"

echo "📦 Building NestJS app..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed. Aborting startup."
  exit 1
fi

echo "🚀 Starting app in background..."

sudo nohup node $APP_PATH > $LOG_FILE 2>&1 &

# Save the PID so we can stop it later
echo $! > $PID_FILE

echo "✅ App started with PID $(cat $PID_FILE). Logs: $LOG_FILE"
