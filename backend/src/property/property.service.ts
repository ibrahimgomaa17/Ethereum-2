import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
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

  private saveImageLocally(base64: string): string {
    const matches = base64.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
    if (!matches) {
      throw new Error('Invalid base64 image format');
    }

    const mimeType = matches[1];
    const extension = mimeType.split('/')[1];
    const buffer = Buffer.from(matches[2], 'base64');

    const filename = `${crypto.randomUUID()}.${extension}`;
    const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads');
    const filePath = path.join(uploadDir, filename);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    fs.writeFileSync(filePath, buffer);

    return `/uploads/${filename}`; // This will be served statically
  }

  async registerProperty(dto: RegisterPropertyDto) {
    const {
      adminPrivateKey,
      name,
      propertyType,
      serialNumber,
      location,
      imageBase64,
      owner,
    } = dto;

    const imageUrl = imageBase64 ? this.saveImageLocally(imageBase64) : '';

    const wallet = new ethers.Wallet(adminPrivateKey, this.provider);
    const contractWithSigner = this.contract.connect(wallet);

    const tx = await (contractWithSigner as any).registerProperty(
      name,
      propertyType,
      serialNumber,
      location,
      imageUrl,
      owner
    );

    await tx.wait();
    return { message: '  Property registered successfully!' };
  }

  async getPropertyById(uniqueId: string) {
    const data = await this.contract.getProperty(uniqueId);
    return {
      uniqueId: data[0],
      name: data[1],
      propertyType: data[2],
      serialNumber: data[3],
      location: data[4],
      imageUrl: data[5], // Renamed
      currentOwner: data[6],
      transferredByAdmin: data[7],
      lastTransferTime: Number(data[8]) * 1000,
    };
  }

  async getPropertiesByOwner(ownerAddress: string) {
    const ids: string[] = await this.contract.getPropertiesByOwner(ownerAddress);
    const props = await Promise.all(ids.map((id) => this.getPropertyById(id)));
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
      imageUrl: prop.imageUrl, // Renamed
      currentOwner: prop.currentOwner,
      transferredByAdmin: prop.transferredByAdmin,
      lastTransferTime: Number(prop.lastTransferTime) * 1000,
    }));
  }

  async getTransferHistory(uniqueId: string) {
    const history = await this.contract.getTransferHistory(uniqueId);
    return history.map((h: any) => ({
      previousOwner: h.previousOwner,
      newOwner: h.newOwner,
      transferTime: Number(h.transferTime) * 1000,
      transferredByAdmin: h.transferredByAdmin,
      recalled: h.recalled,
    }));
  }
}
