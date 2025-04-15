import { useFetchInterceptor } from "./http";

export interface Property {
  uniqueId: string;
  name: string;
  propertyType: string;
  serialNumber: string;
  location: string;
  currentOwner: string;
  transferredByAdmin: boolean;
  lastTransferTime: string | number;
}

export interface TransferRecord {
  previousOwner: string;
  newOwner: string;
  transferTime: number;
  transferredByAdmin: boolean;
  recalled: boolean
}

export interface RegisterPropertyInput {
  adminPrivateKey: string;
  name: string;
  propertyType: string;
  serialNumber: string;
  location: string;
  owner: string;
}

export const useProperty = () => {
  const { http } = useFetchInterceptor();

  const registerProperty = async (payload: RegisterPropertyInput): Promise<{ message?: string; error?: string }> => {
    try {
      const response = await http("/property/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return { message: response.message };
    } catch (error: any) {
      return { error: error.message || "Property registration failed" };
    }
  };

  const getPropertyById = async (id: string): Promise<Property | null> => {
    try {
      return await http(`/property/${id}`);
    } catch (error) {
      console.error("❌ Failed to fetch property:", error);
      return null;
    }
  };

  const getAllProperties = async (): Promise<Property[]> => {
    try {
      return await http("/property/all");
    } catch (error) {
      console.error("❌ Failed to fetch properties:", error);
      return [];
    }
  };

  const getPropertiesByOwner = async (address: string): Promise<Property[]> => {
    try {
      return await http(`/property/owner/${address}`);
    } catch (error) {
      console.error("❌ Failed to fetch owner's properties:", error);
      return [];
    }
  };

  const getTransferHistory = async (uniqueId: string): Promise<TransferRecord[]> => {
    try {
      return await http(`/property/history/${uniqueId}`);
    } catch (error) {
      console.error("❌ Failed to fetch transfer history:", error);
      return [];
    }
  };

  return {
    registerProperty,
    getPropertyById,
    getAllProperties,
    getPropertiesByOwner,
    getTransferHistory,
  };
};
