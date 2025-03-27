import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import userRegistryABI from '../contracts/UserRegistry.json';
import propertyRegistryABI from '../contracts/PropertyRegistry.json';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UserService {
  private provider: ethers.JsonRpcProvider;
  private userRegistry: ethers.Contract;
  private propertyRegistry: ethers.Contract;

  constructor(private readonly config: ConfigService) {
    const rpcUrl = config.get<string>('RPC_URL');
    const userRegistryAddress = config.get<string>('USER_REGISTRY_ADDRESS');
    const propertyRegistryAddress = config.get<string>('PROPERTY_REGISTRY_ADDRESS');

    if (!rpcUrl || !userRegistryAddress || !propertyRegistryAddress) {
      throw new Error('Missing environment configuration.');
    }

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.userRegistry = new ethers.Contract(userRegistryAddress, userRegistryABI, this.provider);
    this.propertyRegistry = new ethers.Contract(propertyRegistryAddress, propertyRegistryABI, this.provider);
  }

  async registerUser({ userId }: RegisterUserDto) {
    if (!userId || !userId.trim()) {
      throw new Error('❌ User ID is required.');
    }

    try {
      const userData = await this.userRegistry.getUserById(userId);
      const walletAddress = userData[1];
      if (walletAddress && walletAddress !== ethers.ZeroAddress) {
        throw new Error('❌ User ID already exists.');
      }
    } catch (error: any) {
      const err = error.reason || error.message || '';
      if (!err.includes('User not found')) {
        throw new Error(`❌ Failed to check user: ${err}`);
      }
    }

    const wallet = ethers.Wallet.createRandom();
    const walletAddress = wallet.address;
    const privateKey = wallet.privateKey;

    const poaKey = this.config.get<string>('POA_ADMIN_PRIVATE_KEY')!;
    const funder = new ethers.Wallet(poaKey, this.provider);
    await (await funder.sendTransaction({
      to: walletAddress,
      value: ethers.parseEther('0.01'),
    })).wait();

    const contractWithUser = this.userRegistry.connect(wallet.connect(this.provider));
    await (await (contractWithUser as any).registerUser(userId)).wait();

    return {
      message: '✅ User registered successfully. Save this wallet info!',
      userId,
      walletAddress,
      privateKey,
    };
  }

  async getUserById(userId: string) {
    const [id, address, isAdmin] = await this.userRegistry.getUserById(userId);
    return { userId: id, walletAddress: address, isAdmin };
  }

  async getUserIdByAddress(address: string) {
    return this.userRegistry.getUserIdByAddress(address);
  }

  async userExists(userId: string): Promise<boolean> {
    return this.userRegistry.userExists(userId);
  }

  async getUserAssets(walletAddress: string) {
    const propertyIds: string[] = await this.propertyRegistry.getPropertiesByOwner(walletAddress);

    const properties = await Promise.all(
      propertyIds.map(async (id: string) => {
        const prop = await this.propertyRegistry.getProperty(id);
        return {
          uniqueId: prop[0],
          name: prop[1],
          propertyType: prop[2],
          serialNumber: prop[3],
          location: prop[4],
          currentOwner: prop[5],
          transferredByAdmin: prop[6],
          lastTransferTime: Number(prop[7]) * 1000,
        };
      })
    );

    return properties;
  }

  async getProperty(uniqueId: string) {
    const prop = await this.propertyRegistry.getProperty(uniqueId);
    return {
      uniqueId: prop[0],
      name: prop[1],
      propertyType: prop[2],
      serialNumber: prop[3],
      location: prop[4],
      currentOwner: prop[5],
      transferredByAdmin: prop[6],
      lastTransferTime: Number(prop[7]) * 1000,
    };
  }

  async canTransferProperty(uniqueId: string): Promise<boolean> {
    return this.propertyRegistry.canTransferProperty(uniqueId);
  }

  async transferProperty(
    uniqueId: string,
    toAddress: string,
    fromPrivateKey: string
  ) {
    const senderWallet = new ethers.Wallet(fromPrivateKey, this.provider);
    const contractWithSigner = this.propertyRegistry.connect(senderWallet);
    console.log("uniqueId:", uniqueId);
    console.log("toAddress:", toAddress);
    console.log("fromPrivateKey:", fromPrivateKey);

    const property = await this.propertyRegistry.getProperty(uniqueId);
    console.log("Current Owner:", property.currentOwner);
    console.log("Transferred By Admin:", property.transferredByAdmin);
    console.log("Last Transfer:", new Date(Number(property.lastTransferTime) * 1000));


    const tx = await (contractWithSigner as any).transferProperty(uniqueId, toAddress, false);
    await tx.wait();

    return { message: '✅ Property transferred successfully.' };
  }

  async getOwnershipHistory(uniqueId: string): Promise<string[]> {
    return await this.propertyRegistry.getOwnershipHistory(uniqueId);
  }
}
