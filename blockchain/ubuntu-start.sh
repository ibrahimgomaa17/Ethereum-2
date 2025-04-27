#!/bin/bash

# Define directories
BLOCKCHAIN_DIR="/home/blockchain"
BACKEND_DIR="/home/backend"
DEPLOY_DIR="$BLOCKCHAIN_DIR/hardhat"

echo "🔍 Using Blockchain Directory: $BLOCKCHAIN_DIR"
echo "🔍 Using Backend Directory: $BACKEND_DIR"

echo "🔍 Checking for running Geth processes..."
GETH_PID=$(pgrep -f "geth --syncmode")

if [ -n "$GETH_PID" ]; then
    echo "❌ Stopping existing Geth process (PID: $GETH_PID)..."
    kill -9 "$GETH_PID"
    sleep 3
fi

echo "🔄 Initializing Geth with Genesis Block..."
geth --datadir "$BLOCKCHAIN_DIR/data" init "$BLOCKCHAIN_DIR/genesis.json"
sleep 2

echo "🚀 Starting Geth Blockchain Node..."
geth --syncmode snap \
     --datadir "$BLOCKCHAIN_DIR/data/" \
     --networkid 1337 \
     --http \
     --http.api "eth,web3,personal,net,txpool,miner,admin" \
     --http.addr "127.0.0.1" \
     --http.port 8545 \
     --unlock "0x6603B5D2a0A6F7D4e1F75Cb83fB9d0AdC4Ca21Ad" \
     --password "$BLOCKCHAIN_DIR/password.txt" \
     --allow-insecure-unlock \
     --miner.etherbase "0x6603B5D2a0A6F7D4e1F75Cb83fB9d0AdC4Ca21Ad" \
     --miner.gaslimit 40000000 \
     --nodiscover \
     --txlookuplimit 0 &
NEW_GETH_PID=$!

echo "📌 New Geth PID: $NEW_GETH_PID"
sleep 10

echo "🔗 Attaching to Geth and loading Auto-Mining Script in a new terminal..."
if command -v gnome-terminal &> /dev/null; then
    gnome-terminal -- bash -c "geth attach --preload '$BLOCKCHAIN_DIR/autoMine.js' http://127.0.0.1:8545; exec bash"
elif command -v x-terminal-emulator &> /dev/null; then
    x-terminal-emulator -e "bash -c 'geth attach --preload \"$BLOCKCHAIN_DIR/autoMine.js\" http://127.0.0.1:8545; exec bash'"
else
    echo "⚠️ No compatible terminal emulator found to open autoMine. Run manually if needed."
fi

echo "🚀 Deploying Smart Contracts with Hardhat..."
(
    cd "$DEPLOY_DIR" || { echo "❌ Deployment directory not found: $DEPLOY_DIR"; exit 1; }

    if [ ! -f "package.json" ]; then
        echo "⚠️ package.json missing! Initializing project..."
        npm init -y
        npm install --save-dev hardhat
    fi

    if ! npx hardhat --version &> /dev/null; then
        echo "⚠️ Installing Hardhat..."
        npm install --save-dev hardhat
    fi

    echo "📦 Installing dependencies..."
    npm install

    echo "🛠️ Compiling contracts..."
    npx hardhat compile

    echo "📜 Deploying contracts..."
    npx hardhat run scripts/ubuntu.js --network geth

    echo "✅ Contracts deployed successfully!"
) &
DEPLOY_PID=$!

echo "📌 Deploy PID: $DEPLOY_PID"

trap "echo '⛔ Terminating processes...'; kill -9 $NEW_GETH_PID $DEPLOY_PID; exit" SIGINT SIGTERM

echo "✅ All processes running. Press Ctrl+C to stop."
wait
