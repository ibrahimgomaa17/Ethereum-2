import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import * as jwt from 'jsonwebtoken';
import * as userRegistryABI from '../contracts/UserRegistry.json';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private provider: ethers.JsonRpcProvider;
  private userRegistry: ethers.Contract;
  private jwtSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.provider = new ethers.JsonRpcProvider(configService.get('RPC_URL'));
    this.userRegistry = new ethers.Contract(
      configService.get('USER_REGISTRY_ADDRESS'),
      userRegistryABI,
      this.provider,
    );
    this.jwtSecret = configService.get('JWT_SECRET');
  }

  async login({ userId, privateKey }: LoginDto) {
    const userData = await this.userRegistry.getUserById(userId);

    if (!userData || userData[1] === ethers.ZeroAddress) {
      throw new Error('❌ User not found in blockchain');
    }

    const registeredAddress = userData[1];
    const wallet = new ethers.Wallet(privateKey);

    if (wallet.address.toLowerCase() !== registeredAddress.toLowerCase()) {
      throw new Error('❌ Invalid private key');
    }

    const userRole = userData[2] ? 'Admin' : 'User';
    const token = jwt.sign({ userId, address: wallet.address }, this.jwtSecret, {
      expiresIn: '1h',
    });

    return {
      message: '✅ Login successful!',
      token,
      user: {
        userId,
        walletAddress: wallet.address,
        userRole,
      },
    };
  }
}
