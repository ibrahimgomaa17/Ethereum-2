import { useFetchInterceptor } from "./http";

export interface User {
  userId: string;
  walletAddress: string;
  userRole: string;
}

export interface Asset {
  lastTransferTime: string | number | Date;
  transferredByAdmin: boolean;
  uniqueId: string;
  name: string;
  propertyType: string;
  serialNumber: string;
  location: string;
  imageUrl: string; // ✅ New: loaded from server after base64 upload
  currentOwner: string;
}

export interface CreateAsset {
  adminPrivateKey: string;
  name: string;
  propertyType: string;
  serialNumber: string;
  location: string;
  owner: string;
  imageBase64?: string; // ✅ Optional base64 input for image upload
}

export interface TransferAssetPayload {
  propertyId: string;
  newOwnerAddress: string;
  senderPrivateKey: string;
  byAdmin: boolean;
}

export interface TransferAllAssetsPayload {
  fromAddress: string;
  toAddress: string;
  adminPrivateKey: string;
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
      console.error("Error fetching assets:", error);
      return [];
    }
  };

  const registerAsset = async (
    asset: CreateAsset
  ): Promise<{ message?: string; error?: string }> => {
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

  const transferProperty = async (
    transfer: TransferAssetPayload
  ): Promise<{ message?: string; error?: string }> => {
    try {
      const response = await http("/admin/transfer-property", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transfer),
      });

      if (response.message) {
        console.log("Property transferred successfully:", response.message);
      }

      return response;
    } catch (error: any) {
      console.error("Error transferring property:", error);
      return { error: error.message || "Unexpected error occurred" };
    }
  };

  const transferAllAssets = async (
    payload: TransferAllAssetsPayload
  ): Promise<{ message?: string; error?: string }> => {
    try {
      const response = await http("/admin/transfer-all-assets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.message) {
        console.log("All assets transferred successfully:", response.message);
      }

      return response;
    } catch (error: any) {
      console.error("Error transferring all assets:", error);
      return { error: error.message || "Unexpected error occurred" };
    }
  };

  const lookupEntityById = async (
    id: string
  ): Promise<{ user: User | null; assets: Asset[] }> => {
    try {
      const response = await http(`/admin/lookup/${id}`);
      return {
        user: response.user,
        assets: response.assets || [],
      };
    } catch (error) {
      console.error("Error looking up entity by ID:", error);
      return { user: null, assets: [] };
    }
  };

  return {
    fetchUsers,
    fetchAssets,  
    registerAsset,
    transferProperty,
    transferAllAssets,
    lookupEntityById,
  };
};
