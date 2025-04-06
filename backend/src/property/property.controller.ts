import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { RegisterPropertyDto } from './dto/register-property.dto';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  // ✅ POST /property/register
  @Post('register')
  async register(@Body() dto: RegisterPropertyDto) {
    try {
      return await this.propertyService.registerProperty(dto);
    } catch (error) {
      console.error('❌ Failed to register property:', error);
      throw new BadRequestException(error.reason || error.message || 'Registration failed');
    }
  }

  // ✅ GET /property/:id
  @Get(':id')
  async getPropertyById(@Param('id') id: string) {
    try {
      return await this.propertyService.getPropertyById(id);
    } catch (error) {
      console.error(`❌ Property not found: ${id}`);
      throw new NotFoundException('Property not found');
    }
  }

  // ✅ GET /property/owner/:address
  @Get('owner/:address')
  async getPropertiesByOwner(@Param('address') address: string) {
    try {
      return await this.propertyService.getPropertiesByOwner(address);
    } catch (error) {
      console.error(`❌ Error fetching properties for owner: ${address}`, error);
      throw new BadRequestException('Failed to fetch owner properties');
    }
  }

  // ✅ GET /property/all
  @Get('all')
  async getAllProperties() {
    try {
      return await this.propertyService.getAllProperties();
    } catch (error) {
      console.error('❌ Error fetching all properties:', error);
      throw new BadRequestException('Failed to fetch properties');
    }
  }

  // ✅ GET /property/history/:id
  @Get('history/:id')
  async getTransferHistory(@Param('id') id: string) {
    try {
      return await this.propertyService.getTransferHistory(id);
    } catch (error) {
      console.error(`❌ Error fetching history for property: ${id}`, error);
      throw new NotFoundException('Transfer history not available');
    }
  }
}
