import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    try {
      return await this.userService.registerUser(dto);
    } catch (error) {
      console.error('❌ Error during registration:', error);

      throw new HttpException(
        { error: error.reason || error.message || 'Internal Server Error' },
        error.code === 'CALL_EXCEPTION' ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
