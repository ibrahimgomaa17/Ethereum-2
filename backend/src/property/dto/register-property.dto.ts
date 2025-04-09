import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterPropertyDto {
  @IsNotEmpty()
  @IsString()
  adminPrivateKey: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  propertyType: string;

  @IsNotEmpty()
  @IsString()
  serialNumber: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  imageBase64?: string; // Optional: will be saved as a local image file

  @IsNotEmpty()
  @IsString()
  owner: string;
}
