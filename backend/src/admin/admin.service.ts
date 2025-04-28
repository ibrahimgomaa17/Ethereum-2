import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import userRegistryABI from '../contracts/UserRegistry.json';
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
    return { message: '  PoA Admin registered successfully!' };
  }

  async addAdmin({ adminPrivateKey, newAdminAddress }: AddAdminDto) {
    const wallet = new ethers.Wallet(adminPrivateKey, this.provider);
    const contractWithSigner = this.userRegistry.connect(wallet);
    const tx = await (contractWithSigner as any).registerUser(`admin-${newAdminAddress.slice(-6)}`, newAdminAddress, true);
    await tx.wait();
    return { message: '  New admin added successfully!' };
  }

  async removeAdmin({ poaAdminPrivateKey, adminToRemoveId }: RemoveAdminDto) {
    const wallet = new ethers.Wallet(poaAdminPrivateKey, this.provider);
    const contractWithSigner = this.userRegistry.connect(wallet);
    const tx = await (contractWithSigner as any).removeAdmin(adminToRemoveId);
    await tx.wait();
    return { message: '  Admin removed successfully!' };
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
        imageUrl: prop.imageUrl,
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

  async searchEntityById(idOrAddress: string): Promise<{ user: any | null; assets: any[] }> {
    try {
      const [userId, walletAddress, isAdmin] = await this.userRegistry.getUserById(idOrAddress);
      return this.buildUserAndAssets(userId, walletAddress, isAdmin);
    } catch {
      try {
        const userId = await this.userRegistry.getUserIdByAddress(idOrAddress);
        const [uid, walletAddress, isAdmin] = await this.userRegistry.getUserById(userId);
        return this.buildUserAndAssets(uid, walletAddress, isAdmin);
      } catch {
        try {
          const prop = await this.propertyRegistry.getProperty(idOrAddress);
          return {
            user: null,
            assets: [
              {
                uniqueId: prop[0],
                name: prop[1],
                propertyType: prop[2],
                serialNumber: prop[3],
                location: prop[4],
                imageUrl: prop[5],
                currentOwner: prop[6],
                transferredByAdmin: prop[7],
                lastTransferTime: Number(prop[8]) * 1000,
              },
            ],
          };
        } catch {
          return { user: null, assets: [] };
        }
      }
    }
  }

  private async buildUserAndAssets(userId: string, walletAddress: string, isAdmin: boolean) {
    const user = {
      userId,
      walletAddress,
      isAdmin,
      userRole: isAdmin ? 'Admin' : 'User',
    };

    const propertyIds = await this.propertyRegistry.getPropertiesByOwner(walletAddress);
    const assets = await Promise.all(
      propertyIds.map(async (propId: string) => {
        const prop = await this.propertyRegistry.getProperty(propId);
        return {
          uniqueId: prop[0],
          name: prop[1],
          propertyType: prop[2],
          serialNumber: prop[3],
          location: prop[4],
          imageUrl: prop[5],
          currentOwner: prop[6],
          transferredByAdmin: prop[7],
          lastTransferTime: Number(prop[8]) * 1000,
        };
      })
    );

    return { user, assets };
  }


  async getDashboardMetrics() {
    const allPropertiesRaw = await this.propertyRegistry.getAllProperties();
  
    const uniqueUsersSet = new Set<string>();
    const propertyRegistrations: Record<string, number> = {};
    const transactions: Record<string, number> = {};
    const assetTypes: Record<string, number> = {};
  
    for (const prop of allPropertiesRaw) {
      const owner = prop.currentOwner.toLowerCase();
      uniqueUsersSet.add(owner);
  
      const timestampMs = Number(prop.lastTransferTime) * 1000;
      const date = new Date(timestampMs);
  
       // Use day-based key instead of month-based
      const dayKey = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`; // e.g. "2025-04-21"
  
      // Count asset types
      assetTypes[prop.propertyType] = (assetTypes[prop.propertyType] || 0) + 1;
  
      // Count property registration (by day)
      propertyRegistrations[dayKey] = (propertyRegistrations[dayKey] || 0) + 1;
  
      // Count transactions if not admin transfer (by day)
      if (!prop.transferredByAdmin) {
        transactions[dayKey] = (transactions[dayKey] || 0) + 1;
      }
    }
  
    const totalUsers = uniqueUsersSet.size;
    const totalAssets = allPropertiesRaw.length;
    const totalTransactions = Object.values(transactions).reduce((a, b) => a + b, 0);
  
    const formatChartData = (data: Record<string, number>) =>
      Object.entries(data)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([name, value]) => ({ name, value }));
  
    return {
      metrics: {
        totalUsers,
        totalAssets,
        totalTransactions,
      },
      charts: {
        assetDistribution: Object.entries(assetTypes).map(([name, value]) => ({ name, value })),
        registrationsByTime: formatChartData(propertyRegistrations),
        transactionsByTime: formatChartData(transactions),
      },
    };
  }
  

  
  async transferPropertyToUser(
    propertyId: string,
    newOwnerAddress: string,
    senderPrivateKey: string,
    byAdmin: boolean = false,
  ) {
    try {
      const wallet = new ethers.Wallet(senderPrivateKey, this.provider);
      const contractWithSigner = this.propertyRegistry.connect(wallet);

      const tx = await (contractWithSigner as any).transferProperty(propertyId, newOwnerAddress, byAdmin);
      await tx.wait();

      return {
        message: `  Property ${propertyId} successfully transferred to ${newOwnerAddress}`,
      };
    } catch (error) {
      console.error(`❌ Error transferring property ${propertyId}:`, error);
      throw new Error('Failed to transfer property');
    }
  }

  async transferAllAssetsFromUser(
    fromAddress: string,
    toAddress: string,
    adminPrivateKey: string,
  ) {
    try {
      const wallet = new ethers.Wallet(adminPrivateKey, this.provider);
      const contractWithSigner = this.propertyRegistry.connect(wallet);

      const tx = await (contractWithSigner as any).transferAllPropertiesOfUser(fromAddress, toAddress);
      await tx.wait();

      return {
        message: `  All assets transferred from ${fromAddress} to ${toAddress}`,
      };
    } catch (error) {
      console.error(`❌ Error transferring all assets from ${fromAddress} to ${toAddress}:`, error);
      throw new Error('Failed to transfer all assets');
    }
  }
}
