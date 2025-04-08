// register-property.dto.ts
export class RegisterPropertyDto {
  adminPrivateKey: string;
  name: string;
  propertyType: string;
  serialNumber: string;
  location: string;
  imageBase64: string;
  owner: string;
}
