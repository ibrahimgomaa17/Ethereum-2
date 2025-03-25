#!/bin/bash

# Get the absolute path of the script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Get the project root directory (assumes script is inside the project folder)
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "🔍 Project Root Directory: $PROJECT_ROOT"

echo "🔍 Checking for running Geth processes..."
GETH_PID=$(pgrep -f "geth --syncmode")

if [ -n "$GETH_PID" ]; then
    echo "❌ Stopping existing Geth process (PID: $GETH_PID)..."
    kill -9 $GETH_PID
    sleep 5  # Wait for process to stop
fi

echo "🚀 Starting Geth Blockchain Node..."
geth --syncmode snap --datadir "$PROJECT_ROOT/blockchain/data/" --networkid 1337 --http --http.api "eth,web3,personal,net,txpool,miner,admin" --http.addr "127.0.0.1" --http.port 8545 --unlock "0x6603B5D2a0A6F7D4e1F75Cb83fB9d0AdC4Ca21Ad" --password "$PROJECT_ROOT/blockchain/password.txt" --allow-insecure-unlock --miner.etherbase "0x6603B5D2a0A6F7D4e1F75Cb83fB9d0AdC4Ca21Ad" --miner.gaslimit 40000000 --nodiscover --txlookuplimit 0 &

# Capture the new process ID
NEW_GETH_PID=$!
echo "📌 New Geth PID: $NEW_GETH_PID"

echo "⏳ Waiting for Geth to start..."
sleep 10

# ✅ Open a new terminal and attach to Geth with `--preload`
echo "🔗 Attaching to Geth in a new terminal and loading Auto-Mining Script..."
osascript -e "tell application \"Terminal\" to do script \"geth attach --preload '$PROJECT_ROOT/blockchain/autoMine.js' http://127.0.0.1:8545; exec bash\"" &

# ✅ Start backend server with Nodemon
echo "🚀 Starting backend server with Nodemon..."
(
    cd "$PROJECT_ROOT/backend" || exit
    nest start &
)

BACKEND_PID=$!
echo "📌 Backend PID: $BACKEND_PID"

# 🛑 Trap to handle script termination
trap "echo '⛔ Terminating processes...'; kill -9 $NEW_GETH_PID $BACKEND_PID; exit" SIGINT SIGTERM

# Keep the script running
wait
