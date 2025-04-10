import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import userRegistryABI from '../contracts/UserRegistry.json';
import propertyRegistryABI from '../contracts/PropertyRegistry.json';
import { RegisterUserDto } from './dto/register-user.dto';
import { PropertyLockedException } from 'src/common/exceptions/property-locked.exception';

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

    if (!ethers.isAddress(toAddress)) {
      throw new Error('❌ Invalid recipient address');
    }

    if (!ethers.isHexString(fromPrivateKey, 32)) {
      throw new Error('❌ Invalid private key (must be 32-byte hex string)');
    }

    try {
      // 2️⃣ Initialize wallet and contract
      const senderWallet = new ethers.Wallet(fromPrivateKey, this.provider);
      const contractWithSigner = this.propertyRegistry.connect(senderWallet);

      // 3️⃣ Check prerequisites
      const [exists, currentOwner, canTransfer] = await Promise.all([
        this.propertyRegistry.getProperty(uniqueId).then(() => true).catch(() => false),
        this.propertyRegistry.getProperty(uniqueId).then(p => p[6]), // currentOwner field
        this.propertyRegistry.canTransferProperty(uniqueId)
      ]);

      if (!exists) {
        throw new Error('❌ Property does not exist');
      }

      if (currentOwner.toLowerCase() !== senderWallet.address.toLowerCase()) {
        throw new Error('❌ Sender is not the current owner');
      }


      if (!canTransfer) {
        throw new Error('Property is currently locked for transfers');
      }

      // 4️⃣ Estimate gas and check balance
      const gasEstimate = await (contractWithSigner as any).transferProperty.estimateGas(
        uniqueId,
        toAddress,
        false
      );

      const gasPrice = await this.provider.getFeeData().then(data => data.gasPrice || BigInt(0));
      const requiredBalance = gasEstimate * (gasPrice + gasPrice / BigInt(10)); // +10% buffer

      const senderBalance = await this.provider.getBalance(senderWallet.address);

      if (senderBalance < requiredBalance) {
        throw new Error(
          `❌ Insufficient gas funds. Needed ${ethers.formatEther(requiredBalance)} ETH, ` +
          `but only have ${ethers.formatEther(senderBalance)} ETH`
        );
      }

      // 5️⃣ Execute transfer
      const tx = await (contractWithSigner as any).transferProperty(
        uniqueId,
        toAddress,
        false,
        { gasLimit: gasEstimate + BigInt(10000) } // Additional buffer
      );

      const receipt = await tx.wait();
      if (receipt.status !== 1) {
        throw new Error('❌ Transaction failed (receipt status = 0)');
      }

      return {
        message: '✅ Property transferred successfully',
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber
      };

    } catch (error: any) {
      let errorMessage = '❌ Transfer failed';
    
      // Check for known revert reason formats
      if (error.reason) {
        errorMessage += `: ${error.reason.replace('execution reverted: ', '')}`;
      } else if (error.error && error.error.message) {
        errorMessage += `: ${error.error.message.replace('execution reverted: ', '')}`;
      } else if (error.data && typeof error.data === 'string') {
        const revertReason = error.data.match(/revert (.*)/);
        if (revertReason && revertReason[1]) {
          errorMessage += `: ${revertReason[1]}`;
        }
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = '❌ Sender lacks ETH for gas';
      } else if (error.code === 'CALL_EXCEPTION') {
        errorMessage = '❌ Contract call failed (check arguments)';
      } else {
        errorMessage += `: ${error.message || error.code || 'Unknown error'}`;
      }
    
      console.error('Transfer Error:', {
        uniqueId,
        toAddress,
        fromAddress: new ethers.Wallet(fromPrivateKey).address,
        error: error.message,
        full: error,
        stack: error.stack
      });
    
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST); // or HttpStatus.FORBIDDEN, etc.
    }
    
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
