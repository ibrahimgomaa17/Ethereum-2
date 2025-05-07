// src/admin/dto/transfer-property.dto.ts

import { IsBoolean, IsEthereumAddress, IsNotEmpty, IsString } from 'class-validator';

export class TransferPropertyDto {
  @IsString()
  @IsNotEmpty()
  propertyId: string;

  @IsEthereumAddress()
  newOwnerAddress: string;

  @IsString()
  @IsNotEmpty()
  senderPrivateKey: string;

  @IsBoolean()
  byAdmin: boolean;
}
