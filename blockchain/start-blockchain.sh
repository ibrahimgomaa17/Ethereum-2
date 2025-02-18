#!/bin/bash

echo "🔍 Checking for existing Geth data directory..."
if [ -d "data/geth" ]; then
    echo "🗑️ Deleting old blockchain data (data/geth)..."
    rm -rf data/geth
    echo "⏳ Waiting 5 seconds after deletion..."
    sleep 5
fi

echo "🔍 Checking for running Geth processes..."
GETH_PID=$(pgrep -f "geth --syncmode")

if [ -n "$GETH_PID" ]; then
    echo "❌ Stopping existing Geth process (PID: $GETH_PID)..."
    kill -9 $GETH_PID
    sleep 5  # Wait for process to stop
fi

# ✅ Initialize Blockchain with Genesis Block
echo "🔗 Initializing blockchain with genesis.json..."
geth --datadir data init genesis.json

# ✅ Start Geth Node (Process 1)
echo "🚀 Starting Geth Blockchain Node (Process 1)..."
geth --syncmode snap --datadir data/ --networkid 1337 --http --http.api "eth,web3,personal,net,txpool,miner,admin" --http.addr "127.0.0.1" --http.port 8545 --unlock "0x6603B5D2a0A6F7D4e1F75Cb83fB9d0AdC4Ca21Ad" --password password.txt --allow-insecure-unlock --miner.etherbase "0x6603B5D2a0A6F7D4e1F75Cb83fB9d0AdC4Ca21Ad" --miner.gaslimit 40000000 --nodiscover --txlookuplimit 0 &

# Capture the process ID (PID) of the Geth node
NEW_GETH_PID=$!
echo "📌 New Geth PID: $NEW_GETH_PID"

echo "⏳ Waiting for Geth to start..."
sleep 10

# ✅ Load Auto-Mining Script (Process 2)
echo "🔗 Attaching to Geth and Loading Auto-Mining Script (Process 2)..."
(
    sleep 5
    geth attach http://127.0.0.1:8545 <<EOF
loadScript("/Users/ibrahimmohamed/Desktop/Learning/Ethereum-2/blockchain/autoMine.js")
EOF
) & disown

# Capture the process ID (PID) of the Geth attachment
ATTACH_PID=$!
echo "📌 Attach PID: $ATTACH_PID"

# ✅ Wait 5 seconds before deploying with Hardhat
echo "⏳ Waiting 5 seconds before Hardhat deployment..."
sleep 5

# ✅ Deploy Smart Contracts using Hardhat (Process 3)
echo "🚀 Deploying Smart Contracts with Hardhat (Process 3)..."
(
    cd /Users/ibrahimmohamed/Desktop/Learning/Ethereum-2/blockchain/hardhat || exit

    # Ensure dependencies are installed
    echo "📦 Installing dependencies..."
    npm install

    # Compile contracts
    echo "🛠️ Compiling contracts..."
    npx hardhat compile

    # Deploy contracts
    echo "📜 Deploying contracts..."
    npx hardhat run scripts/deploy.js --network geth

    echo "✅ Contracts deployed successfully!"
) & disown

DEPLOY_PID=$!
echo "📌 Deployment PID: $DEPLOY_PID"

echo "✅ All processes started successfully!"
echo "📌 Geth PID: $NEW_GETH_PID"
echo "📌 Attach PID: $ATTACH_PID"
echo "📌 Deploy PID: $DEPLOY_PID"

# Keep the script running to prevent termination
wait $NEW_GETH_PID
