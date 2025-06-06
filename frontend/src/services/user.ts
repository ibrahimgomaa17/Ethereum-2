import { Asset, User } from "./admin";
import { useFetchInterceptor } from "./http";

export const useUser = () => {
  const { http } = useFetchInterceptor();

  /**
   * Fetch current and previously owned assets for a user.
   */
  const fetchUserAssets = async (
    userId: string
  ): Promise<{ currentAssets: Asset[]; previouslyOwnedAssets: Asset[] }> => {
    if (!userId) {
      console.warn("No userId provided to fetchUserAssets.");
      return { currentAssets: [], previouslyOwnedAssets: [] };
    }

    try {
      const response = await http(`/user/${userId}/assets`);
      return {
        currentAssets: response.assets.currentAssets || [],
        previouslyOwnedAssets: response.assets.previouslyOwnedAssets || [],
      };
    } catch (error) {
      console.error("❌ Error fetching user assets:", error);
      return { currentAssets: [], previouslyOwnedAssets: [] };
    }
  };

  /**
   * Transfer a property from one address to another.
   */
  const transferAsset = async ({
    uniqueId,
    toAddress,
    privateKey,
  }: {
    uniqueId: string;
    toAddress: string;
    privateKey: string;
  }): Promise<{ message?: string; error?: string } | any> => {
    try {
      const response = await http("/user/property/transfer", {
        method: "POST",
        body: JSON.stringify({
          uniqueId,
          toAddress,
          privateKey,
        }),
      });
      return { response };
    } catch (error: any) {
      return { error: error.message || "Transfer failed" };
    }
  };

  /**
   * Recall previously owned assets back to the original user.
   */
  const recallPreviouslyOwnedAssets = async (
    ownerAddress: string,
    privateKey: string
  ): Promise<{ message?: string; error?: string }> => {
    if (!ownerAddress || !privateKey) {
      console.warn("Missing required data to recall assets.");
      return { error: "Missing address or private key" };
    }

    try {
      const response = await http("/user/property/recall", {
        method: "POST",
        body: JSON.stringify({
          ownerAddress,
          privateKey,
        }),
      });

      return { message: response };
    } catch (error: any) {
      return { error: error.message || "Recall failed" };
    }
  };


  /**
   * Fetch a user by ID.
   */
  const fetchUserById = async (userId: string): Promise<User | null> => {
    if (!userId) {
      console.warn("No userId provided to fetchUserById.");
      return null;
    }

    try {
      const response = await http(`/user/${userId}`);
      return response;
    } catch (error) {
      console.error("❌ Error fetching user by ID:", error);
      return null;
    }
  };

  return {
    fetchUserAssets,
    transferAsset,
    fetchUserById,
    recallPreviouslyOwnedAssets,
  };
};
