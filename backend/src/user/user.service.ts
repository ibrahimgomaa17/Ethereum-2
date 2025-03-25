import { Body, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers, ZeroAddress } from 'ethers';
import userRegistryABI from '../contracts/UserRegistry.json';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UserService {
  private provider: ethers.JsonRpcProvider;
  private userRegistry: ethers.Contract;

  constructor(private readonly config: ConfigService) {
    const rpcUrl = config.get<string>('RPC_URL');
    const contractAddress = config.get<string>('USER_REGISTRY_ADDRESS');

    if (!rpcUrl || !contractAddress) {
      throw new Error('Missing RPC_URL or USER_REGISTRY_ADDRESS in environment');
    }

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.userRegistry = new ethers.Contract(contractAddress, userRegistryABI, this.provider);
  }


  async registerUser({ userId }: RegisterUserDto) {
    if (!userId || !userId.trim()) {
      throw new Error('User ID is required.');
    }

    const exists = await this.userRegistry.userExists(userId);
    if (exists) {
      throw new Error('User ID already exists.');
    }

    // 🔐 Generate new wallet
    const wallet = ethers.Wallet.createRandom();
    const walletAddress = wallet.address;
    const privateKey = wallet.privateKey;

    // 💰 Fund new wallet from PoA admin
    const poaKey = this.config.get<string>('POA_ADMIN_PRIVATE_KEY')!;
    const funder = new ethers.Wallet(poaKey, this.provider);
    const fundTx = await funder.sendTransaction({
      to: walletAddress,
      value: ethers.parseEther('0.01'),
    });
    await fundTx.wait();

    // 📝 Register user on-chain
    const walletWithProvider = wallet.connect(this.provider);
    const contractWithUser = this.userRegistry.connect(walletWithProvider);
    const tx = await (contractWithUser as any).registerUser(userId);
    await tx.wait();

    return {
      message: '✅ User registered successfully. Save this wallet info!',
      userId,
      walletAddress,
      privateKey,
    };
  }


}
