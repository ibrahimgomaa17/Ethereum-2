import { Controller, Post, Get, Body, HttpException, HttpStatus, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AddAdminDto } from './dto/add-admin.dto';
import { RemoveAdminDto } from './dto/remove-admin.dto';
import { MakePoaAdminDto } from './dto/make-poa-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('make-poa-admin')
  async makePoaAdmin(@Body() dto: MakePoaAdminDto) {
    return this.adminService.makePoaAdmin(dto);
  }

  @Post('add')
  async addAdmin(@Body() dto: AddAdminDto) {
    return this.adminService.addAdmin(dto);
  }

  @Post('remove')
  async removeAdmin(@Body() dto: RemoveAdminDto) {
    return this.adminService.removeAdmin(dto);
  }

  @Get('properties')
  async getAllProperties() {
    return this.adminService.getAllProperties();
  }

  @Get('users')
  async getAllUsers() {
    return this.adminService.getAllUsers();
  }
  @Get('lookup/:id')
  async searchById(@Param('id') id: string) {
    return await this.adminService.searchEntityById(id);
  }
}
