import json
from eth_keyfile import decode_keyfile_json

keystore_file = "/Users/ibrahimgomaa/Desktop/Study/Blockchain/Ethereum-2/data/keystore/UTC--2025-02-10T16-32-59.510001000Z--6603b5d2a0a6f7d4e1f75cb83fb9d0adc4ca21ad"
password = "1703"

with open(keystore_file, 'r') as f:
    keystore_data = json.load(f)

private_key = decode_keyfile_json(keystore_data, password.encode())
print("Private Key:", private_key.hex())
