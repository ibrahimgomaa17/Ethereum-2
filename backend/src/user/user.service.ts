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
  
    // 🔐 Create a new wallet for the user
    const wallet = ethers.Wallet.createRandom();
    const walletAddress = wallet.address;
    const privateKey = wallet.privateKey;
  
    // 🏦 Fund new user with 1000 coins from admin
    const poaKey = this.config.get<string>('POA_ADMIN_PRIVATE_KEY')!;
    const funder = new ethers.Wallet(poaKey, this.provider);
  
    await (
      await funder.sendTransaction({
        to: walletAddress,
        value: ethers.parseEther('1000'), // 💸 1000 coins
      })
    ).wait();
  
    // 📝 Register user on-chain
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
    return {
      userId: id,
      walletAddress: address,
      userRole: isAdmin ? 'Admin' : 'User',
    };
  }

  async getUserIdByAddress(address: string) {
    return this.userRegistry.getUserIdByAddress(address);
  }

  async userExists(userId: string): Promise<boolean> {
    return this.userRegistry.userExists(userId);
  }

  async getUserAssets(walletAddress: string) {
    const propertyIds: string[] = await this.propertyRegistry.getPropertiesByOwner(walletAddress);

    const currentAssets = await Promise.all(
      propertyIds.map(async (id: string) => {
        const prop = await this.propertyRegistry.getProperty(id);
        return {
          uniqueId: prop[0],
          name: prop[1],
          propertyType: prop[2],
          serialNumber: prop[3],
          location: prop[4],
          imageUrl: prop[5],              // ✅ Correct mapping
          currentOwner: prop[6],
          transferredByAdmin: prop[7],
          lastTransferTime: Number(prop[8]) * 1000,
        };
      })
    );

    const allProperties = await this.propertyRegistry.getAllProperties();

    const previouslyOwnedAssets = allProperties
      .filter((prop: any) => {
        const history = prop.transferHistory;
        const currentOwner = prop.currentOwner;
        if (history.length < 2) return false;

        const lastTransfer = history[history.length - 1];
        return (
          lastTransfer.transferredByAdmin &&
          lastTransfer.previousOwner.toLowerCase() === walletAddress.toLowerCase() &&
          currentOwner.toLowerCase() !== walletAddress.toLowerCase()
        );
      })
      .map((prop: any) => ({
        uniqueId: prop.uniqueId,
        name: prop.name,
        propertyType: prop.propertyType,
        serialNumber: prop.serialNumber,
        location: prop.location,
        imageUrl: prop.imageUrl, // ✅ Correct mapping
        currentOwner: prop.currentOwner,
        transferredByAdmin: prop.transferredByAdmin,
        lastTransferTime: Number(prop.lastTransferTime) * 1000,
      }));

    return {
      currentAssets,
      previouslyOwnedAssets,
    };
  }

  async getProperty(uniqueId: string) {
    const prop = await this.propertyRegistry.getProperty(uniqueId);
    return {
      uniqueId: prop[0],
      name: prop[1],
      propertyType: prop[2],
      serialNumber: prop[3],
      location: prop[4],
      imageUrl: prop[5],              // ✅ Correct mapping
      currentOwner: prop[6],
      transferredByAdmin: prop[7],
      lastTransferTime: Number(prop[8]) * 1000,
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

    const tx = await (contractWithSigner as any).transferProperty(uniqueId, toAddress, false);
    await tx.wait();

    return { message: '✅ Property transferred successfully.' };
  }

  async getOwnershipHistory(uniqueId: string): Promise<string[]> {
    return this.propertyRegistry.getOwnershipHistory(uniqueId);
  }
  async recallPreviouslyOwnedAssets(
    fromAddress: string, // current owner (Bob)
    toAddress: string,   // recalling user (Alice)
    userPrivateKey: string
  ) {
    const userWallet = new ethers.Wallet(userPrivateKey, this.provider);
    const contractWithSigner = this.propertyRegistry.connect(userWallet);
  
    // Optional: customizable minimum balance to cover gas
    const requiredBalance = ethers.parseEther("0.01");
    const userBalance = await this.provider.getBalance(userWallet.address);
  
    if (userBalance < requiredBalance) {
      const funder = new ethers.Wallet(
        this.config.get<string>('POA_ADMIN_PRIVATE_KEY')!,
        this.provider
      );
  
      const fundAmount = requiredBalance - userBalance;
      const tx = await funder.sendTransaction({
        to: userWallet.address,
        value: fundAmount,
      });
      await tx.wait();
    }
  
    // Proceed with recall
    const tx = await (contractWithSigner as any).reverseAdminTransferAll(fromAddress, toAddress);
    await tx.wait();
  
    return `✅ Assets recalled from ${fromAddress} to ${toAddress}`;
  }
  
  
}
