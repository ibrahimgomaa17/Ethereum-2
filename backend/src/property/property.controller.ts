import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { PropertyService } from './property.service';
import { RegisterPropertyDto } from './dto/register-property.dto';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post('register')
  async register(@Body() dto: RegisterPropertyDto) {
    try {
      return await this.propertyService.registerProperty(dto);
    } catch (error) {
      console.error('Error registering property:', error);
      throw new HttpException(
        { error: error.reason || error.message || 'Internal Server Error' },
        error.code === 'CALL_EXCEPTION' ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
