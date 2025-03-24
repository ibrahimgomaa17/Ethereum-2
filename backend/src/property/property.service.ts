import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import propertyRegistryABI from '../contracts/PropertyRegistry.json';
import { RegisterPropertyDto } from './dto/register-property.dto';

@Injectable()
export class PropertyService {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;

  constructor(private readonly config: ConfigService) {
    const rpcUrl = config.get<string>('RPC_URL');
    const address = config.get<string>('PROPERTY_REGISTRY_ADDRESS');

    if (!rpcUrl || !address) {
      throw new Error('Missing RPC_URL or PROPERTY_REGISTRY_ADDRESS in environment');
    }

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.contract = new ethers.Contract(address, propertyRegistryABI, this.provider);
  }

  async registerProperty(dto: RegisterPropertyDto) {
    const { adminPrivateKey, name, propertyType, serialNumber, location, owner } = dto;

    const wallet = new ethers.Wallet(adminPrivateKey, this.provider);
    const contractWithSigner = this.contract.connect(wallet);

    const tx = await (contractWithSigner as any).registerProperty(name, propertyType, serialNumber, location, owner);
    await tx.wait();

    return { message: '✅ Property registered successfully!' };
  }
}
