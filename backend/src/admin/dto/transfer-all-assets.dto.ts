// src/admin/dto/transfer-all-assets.dto.ts

import { IsEthereumAddress, IsNotEmpty, IsString } from 'class-validator';

export class TransferAllAssetsDto {
  @IsEthereumAddress()
  fromAddress: string;

  @IsEthereumAddress()
  toAddress: string;

  @IsString()
  @IsNotEmpty()
  adminPrivateKey: string;
}
