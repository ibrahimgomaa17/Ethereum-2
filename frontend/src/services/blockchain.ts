

import { useFetchInterceptor } from "./http";


export interface BlockchainBlockInfo {
    blockNumber: number;
    hash: string;
    parentHash: string;
    miner: string;
    transactions: number;
    timestamp: Date;
    gasUsed?: string;
    gasLimit?: string;
}

export const useBlockchain = () => {
    const { http } = useFetchInterceptor();


    const getBlocks = async (): Promise<BlockchainBlockInfo[] | null> => {
        try {
            const data =  await http(`/blockchain/blocks`);
            return data?.blocks;
        } catch (error) {
            console.error("❌ Failed to fetch blocks:", error);
            return null;
        }
    };

    const getTransactionsNumber = async (): Promise<number | null> => {
        try {
            const blocks = await getBlocks();
            const transactions = blocks?.map(x => x.transactions).reduce((a, b) => a + b);
            return transactions || 0;
        } catch (error) {
            console.error("❌ Failed to fetch blocks:", error);
            return null;
        }
    };




    return {
        getBlocks,
        getTransactionsNumber
    };
};

