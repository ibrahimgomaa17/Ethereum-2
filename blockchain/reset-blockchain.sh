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

echo "🔄 Initializing Geth with Genesis Block..."
geth --datadir "$PROJECT_ROOT/blockchain/data" init "$PROJECT_ROOT/blockchain/genesis.json"
sleep 5  # Wait for initialization to complete

echo "🚀 Starting Geth Blockchain Node (Process 1)..."
geth --syncmode snap --datadir "$PROJECT_ROOT/blockchain/data/" --networkid 1337 --http --http.api "eth,web3,personal,net,txpool,miner,admin" --http.addr "127.0.0.1" --http.port 8545 --unlock "0x6603B5D2a0A6F7D4e1F75Cb83fB9d0AdC4Ca21Ad" --password "$PROJECT_ROOT/blockchain/password.txt" --allow-insecure-unlock --miner.etherbase "0x6603B5D2a0A6F7D4e1F75Cb83fB9d0AdC4Ca21Ad" --miner.gaslimit 40000000 --nodiscover --txlookuplimit 0 &

# Capture the process ID (PID) of the Geth node
NEW_GETH_PID=$!
echo "📌 New Geth PID: $NEW_GETH_PID"

echo "⏳ Waiting for Geth to start..."
sleep 10

#   Open a new terminal and attach to Geth with `--preload`
echo "🔗 Attaching to Geth in a new terminal and loading Auto-Mining Script..."
osascript -e "tell application \"Terminal\" to do script \"geth attach --preload '$PROJECT_ROOT/blockchain/autoMine.js' http://127.0.0.1:8545; exec bash\"" &

#   Deploy Smart Contracts using Hardhat (Process 3)
DEPLOY_DIR="$PROJECT_ROOT/blockchain/hardhat"

if [ ! -d "$DEPLOY_DIR" ]; then
    echo "⚠️ Deployment directory does not exist: $DEPLOY_DIR"
    echo "🔍 Searching for contract deployment directory..."
    
    # Try another directory
    DEPLOY_DIR="$PROJECT_ROOT/blockchain"
    
    if [ ! -d "$DEPLOY_DIR" ]; then
        echo "❌ No valid contract deployment directory found!"
        exit 1
    fi
fi

echo "🚀 Deploying Smart Contracts with Hardhat (Process 3)..."
(
    cd "$DEPLOY_DIR"

    # Ensure package.json exists
    if [ ! -f "package.json" ]; then
        echo "⚠️ package.json missing! Initializing a new project..."
        npm init -y
        npm install --save-dev hardhat
    fi

    # Ensure Hardhat is installed
    if ! npx hardhat --version &>/dev/null; then
        echo "⚠️ Hardhat is not installed! Installing..."
        npm install --save-dev hardhat
    fi

    echo "📦 Installing dependencies..."
    npm install

    # Compile contracts
    echo "🛠️ Compiling contracts..."
    npx hardhat compile

    # Deploy contracts
    echo "📜 Deploying contracts..."
    npx hardhat run scripts/deploy.js --network geth

    echo "  Contracts deployed successfully!"
) &

DEPLOY_PID=$!
echo "📌 Deployment PID: $DEPLOY_PID"

echo "  All processes started successfully!"
echo "📌 Geth PID: $NEW_GETH_PID"
echo "📌 Deploy PID: $DEPLOY_PID"

# 🛑 Trap to handle script termination and clean up processes
trap "echo '⛔ Terminating processes...'; kill -9 $NEW_GETH_PID $DEPLOY_PID; exit" SIGINT SIGTERM

# Keep the script running to prevent termination
wait
