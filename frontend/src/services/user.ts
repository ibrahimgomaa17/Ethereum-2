import { Asset } from "./admin";
import { useFetchInterceptor } from "./http";

export const useUser = () => {
    const { http } = useFetchInterceptor();

    const fetchUserAssets = async (userId: string): Promise<Asset[]> => {
        if (!userId) {
            console.warn("No userId provided to fetchUserAssets.");
            return [];
        }

        try {
            const response = await http(`/user/${userId}/assets`);
            return response.assets;
        } catch (error) {
            console.error("❌ Error fetching user assets:", error);
            return [];
        }
    };
    const transferAsset = async ({
        uniqueId,
        toAddress,
        privateKey,
    }: {
        uniqueId: string;
        toAddress: string;
        privateKey: string;
    }): Promise<{ message?: string; error?: string }> => {
        try {
            const response = await http("/user/property/transfer", {
                method: "POST",
                body: JSON.stringify({
                    uniqueId,
                    toAddress,
                    privateKey,
                }),
            });

            return { message: response.message };
        } catch (error: any) {
            return { error: error.message || "Transfer failed" };
        }
    };

    return {
        fetchUserAssets,
        transferAsset,
    };
};
