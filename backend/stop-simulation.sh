#!/bin/bash

# File: stop-simulation.sh
# Description: Stops the background simulation process

PIDFILE="simulate.pid"

if [ -f "$PIDFILE" ]; then
  PID=$(cat $PIDFILE)
  echo "🛑 Stopping simulation (PID: $PID)..."
  kill $PID
  rm $PIDFILE
  echo "✅ Simulation stopped."
else
  echo "❌ No PID file found. Is the simulation running?"
fi
