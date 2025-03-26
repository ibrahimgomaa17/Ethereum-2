import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import  userRegistryABI from '../contracts/UserRegistry.json';
import propertyRegistryABI from '../contracts/PropertyRegistry.json';
import { AddAdminDto } from './dto/add-admin.dto';
import { RemoveAdminDto } from './dto/remove-admin.dto';
import { MakePoaAdminDto } from './dto/make-poa-admin.dto';
import { getKeystoreWallets, getLocalUsers } from 'src/utils/file-storage.util';

@Injectable()
export class AdminService {
  private provider: ethers.JsonRpcProvider;
  private userRegistry: ethers.Contract;
  private propertyRegistry: ethers.Contract;

  constructor(private config: ConfigService) {
    this.provider = new ethers.JsonRpcProvider(this.config.get('RPC_URL'));
    this.userRegistry = new ethers.Contract(
      this.config.get<string>('USER_REGISTRY_ADDRESS')!,
      userRegistryABI,
      this.provider,
    );
    this.propertyRegistry = new ethers.Contract(
      this.config.get<string>('PROPERTY_REGISTRY_ADDRESS')!,
      propertyRegistryABI,
      this.provider,
    );
  }

  async makePoaAdmin({ privateKey }: MakePoaAdminDto) {
    const wallet = new ethers.Wallet(privateKey, this.provider);
    const contractWithSigner = this.userRegistry.connect(wallet);
    const tx = await (contractWithSigner as any).registerUser('admin', wallet.address, true);
    await tx.wait();
    return { message: '✅ PoA Admin registered successfully!' };
  }

  async addAdmin({ adminPrivateKey, newAdminAddress }: AddAdminDto) {
    const wallet = new ethers.Wallet(adminPrivateKey, this.provider);
    const contractWithSigner = this.userRegistry.connect(wallet);
    const tx = await (contractWithSigner as any).registerUser(`admin-${newAdminAddress.slice(-6)}`, newAdminAddress, true);
    await tx.wait();
    return { message: '✅ New admin added successfully!' };
  }

  async removeAdmin({ poaAdminPrivateKey, adminToRemoveId }: RemoveAdminDto) {
    const wallet = new ethers.Wallet(poaAdminPrivateKey, this.provider);
    const contractWithSigner = this.userRegistry.connect(wallet);
    const tx = await (contractWithSigner as any).removeAdmin(adminToRemoveId);
    await tx.wait();
    return { message: '✅ Admin removed successfully!' };
  }

  async getAllProperties() {
    const propertiesRaw = await this.propertyRegistry.getAllProperties();
    return {
      properties: propertiesRaw.map(prop => ({
        uniqueId: prop.uniqueId,
        name: prop.name,
        propertyType: prop.propertyType,
        serialNumber: prop.serialNumber,
        location: prop.location,
        currentOwner: prop.currentOwner,
        transferredByAdmin: prop.transferredByAdmin,
        lastTransferTime: Number(prop.lastTransferTime) * 1000,
      })),
    };
  }


  async getAllUsers() {
    try {
      const [userIds, walletAddresses, isAdmins] = await this.userRegistry.getAllUsers();
  
      const localUsers = getLocalUsers();
      const keystoreWallets = getKeystoreWallets();
  
      const users = userIds.map((userId, index) => {
        const walletAddress = walletAddresses[index].toLowerCase();
        const localUser = localUsers.find(u => u.walletAddress.toLowerCase() === walletAddress);
        const keystore = keystoreWallets.find(k => k.address === walletAddress);
  
        return {
          userId,
          walletAddress,
          isAdmin: isAdmins[index],
        };
      });
  
      return { users };
    } catch (error) {
      console.error('❌ Failed to fetch users:', error);
      return { users: [] };
    }
  }
  
}
