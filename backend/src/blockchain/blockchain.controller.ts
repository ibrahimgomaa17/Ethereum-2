import { Controller, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';

@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Get('latest-block')
  async getLatestBlock() {
    try {
      return await this.blockchainService.getLatestBlock();
    } catch (err) {
      throw new HttpException({ error: err.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('blocks')
  async getAllBlocks() {
    try {
      return await this.blockchainService.getAllBlocks();
    } catch (err) {
      throw new HttpException({ error: err.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('transactions/:userAddress')
  async getTransactions(@Param('userAddress') userAddress: string) {
    try {
      return await this.blockchainService.getTransactionsForAddress(userAddress);
    } catch (err) {
      throw new HttpException({ error: err.message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
