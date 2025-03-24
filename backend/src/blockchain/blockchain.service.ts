import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class BlockchainService {
    private provider: ethers.JsonRpcProvider;

    constructor(private readonly config: ConfigService) {
        const rpcUrl = config.get<string>('RPC_URL');
        if (!rpcUrl) throw new Error('RPC_URL not defined in .env');

        this.provider = new ethers.JsonRpcProvider(rpcUrl);
    }

    async getLatestBlock() {
        const block = await this.provider.getBlock('latest');
        return block;
    }

    async getAllBlocks() {
        const latestBlockNumber = await this.provider.getBlockNumber();
        const blocks: any = [];

        for (let i = 0; i <= latestBlockNumber; i++) {
            const block = await this.provider.getBlock(i, true);
            if (block)
                blocks.push({
                    blockNumber: block.number,
                    hash: block.hash,
                    parentHash: block.parentHash,
                    miner: block.miner,
                    transactions: block.transactions.length,
                    timestamp: new Date(Number(block.timestamp) * 1000),
                    gasUsed: block.gasUsed?.toString(),
                    gasLimit: block.gasLimit?.toString(),
                });
        }

        return { blocks };
    }

    async getTransactionsForAddress(address: string) {
        const latestBlock = await this.provider.getBlockNumber();
        const transactions:any = [];

        for (let i = Math.max(0, latestBlock - 100); i <= latestBlock; i++) {
            const block = await (this.provider as any).getBlockWithTransactions(i);
            block.transactions.forEach((tx:any) => {
                if (
                    tx.from?.toLowerCase() === address.toLowerCase() ||
                    tx.to?.toLowerCase() === address.toLowerCase()
                ) {
                    transactions.push(tx);
                }
            });
        }

        return { transactions };
    }
}
