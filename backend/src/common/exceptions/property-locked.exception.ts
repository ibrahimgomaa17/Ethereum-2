// src/common/exceptions/property-locked.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class PropertyLockedException extends HttpException {
  constructor() {
    super('Property is currently locked for transfers', HttpStatus.LOCKED);
  }
}