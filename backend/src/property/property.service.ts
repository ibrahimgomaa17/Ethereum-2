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

  async getPropertyById(uniqueId: string) {
    const data = await this.contract.getProperty(uniqueId);
    return {
      uniqueId: data[0],
      name: data[1],
      propertyType: data[2],
      serialNumber: data[3],
      location: data[4],
      currentOwner: data[5],
      transferredByAdmin: data[6],
      lastTransferTime: Number(data[7]) * 1000,
    };
  }

  async getPropertiesByOwner(ownerAddress: string) {
    const ids: string[] = await this.contract.getPropertiesByOwner(ownerAddress);
    const props = await Promise.all(
      ids.map(async (id) => await this.getPropertyById(id))
    );
    return props;
  }

  async getAllProperties() {
    const rawProperties = await this.contract.getAllProperties();
    return rawProperties.map((prop: any) => ({
      uniqueId: prop.uniqueId,
      name: prop.name,
      propertyType: prop.propertyType,
      serialNumber: prop.serialNumber,
      location: prop.location,
      currentOwner: prop.currentOwner,
      transferredByAdmin: prop.transferredByAdmin,
      lastTransferTime: Number(prop.lastTransferTime) * 1000,
    }));
  }

  async getTransferHistory(uniqueId: string) {
    const history = await this.contract.getTransferHistory(uniqueId);
    console.log(history);
    
    return history.map((h: any) => ({
      previousOwner: h.previousOwner,
      newOwner: h.newOwner,
      transferTime: Number(h.transferTime) * 1000,
      transferredByAdmin: h.transferredByAdmin,
    }));
  }
}
