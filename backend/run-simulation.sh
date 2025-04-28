#!/bin/bash

# File: run-simulation.sh
# Description: Runs the 60-day simulation in the background and logs output

APP="simulate-60days.js"
LOG="simulate.log"
PIDFILE="simulate.pid"

echo "🚀 Starting simulation..."

# Run in background using nohup
nohup node $APP > $LOG 2>&1 &

# Save the process ID so we can kill it later
echo $! > $PIDFILE

echo "  Simulation running in background (PID: $(cat $PIDFILE))"
echo "📄 Logs: $LOG"

