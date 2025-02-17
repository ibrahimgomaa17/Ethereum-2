
Init genesis block:
geth --datadir data init genesis.json

Run Blockchain:
geth --syncmode snap --datadir data/ --networkid 1337 --http --http.api "eth,web3,personal,net,txpool,miner,admin" --http.addr "127.0.0.1" --http.port 8545 --unlock "0x6603B5D2a0A6F7D4e1F75Cb83fB9d0AdC4Ca21Ad" --password password.txt --allow-insecure-unlock --miner.etherbase "0x6603B5D2a0A6F7D4e1F75Cb83fB9d0AdC4Ca21Ad" --miner.gaslimit 40000000 --nodiscover --txlookuplimit 0

Run Blockchain with Explorer:
geth --syncmode snap --datadir data/ --networkid 1337 \
--http --http.api "eth,web3,personal,net,txpool,miner,admin" \
--http.addr "127.0.0.1" --http.port 8545 \
--ws --ws.addr "127.0.0.1" --ws.port 8546 --ws.api "eth,web3,net" --ws.origins "*" \
--unlock "0x6603B5D2a0A6F7D4e1F75Cb83fB9d0AdC4Ca21Ad" --password password.txt --allow-insecure-unlock \
--miner.etherbase "0x6603B5D2a0A6F7D4e1F75Cb83fB9d0AdC4Ca21Ad" --miner.gaslimit 40000000 --nodiscover --txlookuplimit 0 \
--ethstats "explorer:1234567890abcdef@127.0.0.1:3000"

Terminate Geth:
pkill geth

Init genesis block:
geth --datadir data init genesis.json

Access Geth Instance:
geth attach http://127.0.0.1:8545
 
Load AutoMine Script:
loadScript("/Users/ibrahimmohamed/Desktop/Learning/Ethereum-2/blockchain/autoMine.js")
<!-- loadScript("/Users/ibrahimgomaa/Desktop/Study/Blockchain/Ethereum-2/autoMine.js") -->
loadScript("autoMine.js")


Compile Contracts:
npx hardhat compile

Deploy Contracts:
npx hardhat run scripts/deploy.js --network geth
