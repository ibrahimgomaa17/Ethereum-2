#!/bin/bash

# File: stop-app.sh
# Description: Stops the Node.js app started by start-app.sh

PID_FILE="app.pid"

if [ -f "$PID_FILE" ]; then
  PID=$(cat $PID_FILE)
  echo "Stopping app with PID $PID..."
  sudo kill $PID
  rm $PID_FILE
  echo "App stopped."
else
  echo "No PID file found. Is the app running?"
fi
