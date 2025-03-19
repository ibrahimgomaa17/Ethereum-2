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
  adminPrivateKey:string
}
export interface CreateAsset {
  adminPrivateKey: string;
  name: string;
  propertyType: string;
  serialNumber: string;
  location: string;
  owner: string;
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
  const registerAsset = async (asset: CreateAsset): Promise<{ message?: string; error?: string }> => {
    try {
      const response = await http("/property/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(asset),
      });
  
      if (response.message) {
        console.log("Asset registered successfully:", response.message);
      }
  
      return response;
    } catch (error: any) {
      console.error("Error creating asset:", error);
      return { error: error.message || "Unexpected error occurred" };
    }
  };
  
  

  return { fetchUsers, fetchAssets, registerAsset };
};