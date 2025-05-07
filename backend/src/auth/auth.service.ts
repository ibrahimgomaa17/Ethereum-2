import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import * as jwt from 'jsonwebtoken';
import userRegistryABI from '../contracts/UserRegistry.json';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private provider: ethers.JsonRpcProvider;
  private userRegistry: ethers.Contract;
  private jwtSecret: string;

  constructor(private readonly configService: ConfigService) {
    const rpcUrl = configService.get<string>('RPC_URL');
    const contractAddress = configService.get<string>('USER_REGISTRY_ADDRESS');

    if (!rpcUrl || !contractAddress) {
      throw new Error('Missing RPC_URL or USER_REGISTRY_ADDRESS in environment');
    }

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.userRegistry = new ethers.Contract(contractAddress, userRegistryABI, this.provider);
    this.jwtSecret = configService.get<string>('JWT_SECRET') || 'default_secret';
  }

  async login({ userId, privateKey }: LoginDto) {
    let userData;

    try {
      // Call the contract to fetch user data
      userData = await this.userRegistry.getUserById(userId);
    } catch (error: any) {
      if (
        error.reason?.includes('User not found') ||
        error.message?.includes('User not found')
      ) {
        throw new Error('❌ User not found in blockchain');
      }
      throw error;
    }

    const [_, registeredAddress, isAdmin] = userData;

    if (!registeredAddress || registeredAddress === ethers.ZeroAddress) {
      throw new Error('❌ User ID is not registered');
    }

    // Validate private key
    const wallet = new ethers.Wallet(privateKey);
    if (wallet.address.toLowerCase() !== registeredAddress.toLowerCase()) {
      throw new Error('❌ Invalid private key');
    }

    // Create JWT
    const token = jwt.sign(
      { userId, address: wallet.address, isAdmin },
      this.jwtSecret,
      { expiresIn: '1h' }
    );

    return {
      message: '  Login successful!',
      token,
      user: {
        userId,
        walletAddress: wallet.address,
        userRole: isAdmin ? 'Admin' : 'User',
      },
    };
  }
}
