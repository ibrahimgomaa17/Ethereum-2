import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    try {
      return await this.userService.registerUser(dto);
    } catch (error) {
      console.error('❌ Error during registration:', error);
      throw new HttpException(
        { error: error.reason || error.message || 'Internal Server Error' },
        error.code === 'CALL_EXCEPTION'
          ? HttpStatus.BAD_REQUEST
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':userId')
  async getUser(@Param('userId') userId: string) {
    return this.userService.getUserById(userId);
  }

  @Get('exists/:userId')
  async userExists(@Param('userId') userId: string) {
    const exists = await this.userService.userExists(userId);
    return { exists };
  }

  @Get('resolve/:walletAddress')
  async getUserIdByAddress(@Param('walletAddress') walletAddress: string) {
    return {
      userId: await this.userService.getUserIdByAddress(walletAddress),
    };
  }

  @Get(':userId/assets')
  async getUserAssets(@Param('userId') userId: string) {
    return {
      assets: await this.userService.getUserAssets(userId),
    };
  }

  @Get('property/:uniqueId')
  async getProperty(@Param('uniqueId') uniqueId: string) {
    return this.userService.getProperty(uniqueId);
  }

  @Get('property/:uniqueId/transferable')
  async canTransfer(@Param('uniqueId') uniqueId: string) {
    const transferable = await this.userService.canTransferProperty(uniqueId);
    return { transferable };
  }

  @Post('property/transfer')
  async transferProperty(
    @Body()
    body: {
      uniqueId: string;
      toAddress: string;
      privateKey: string;
    },
  ) {
    return this.userService.transferProperty(
      body.uniqueId,
      body.toAddress,
      body.privateKey,
    );
  }

  @Get('property/:uniqueId/history')
  async getOwnershipHistory(@Param('uniqueId') uniqueId: string) {
    return {
      history: await this.userService.getOwnershipHistory(uniqueId),
    };
  }
}
