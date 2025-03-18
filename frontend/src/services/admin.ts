import { useFetchInterceptor } from "./http";

export interface User {
  userId: string;
  walletAddress: string;
  isAdmin: boolean;
}
export interface Asset {
  lastTransferTime: string | number | Date;
  transferredByAdmin: any;
  uniqueId: string;
  name: string;
  propertyType: string;
  serialNumber: string;
  location: string;
  currentOwner: string;
}


export const useAdmin = () => {
  const { http } = useFetchInterceptor();

  const fetchUsers = async (): Promise<User[]> => {
    try {
      const response = await http("/admin/users");
      return response.users;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  const fetchAssets = async (): Promise<Asset[]> => {
    try {
      const response = await http("/admin/properties");
      return response.properties;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  return { fetchUsers, fetchAssets };
};