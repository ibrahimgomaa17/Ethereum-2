import { useFetchInterceptor } from "./http";

export const useAuth = () => {
    const { http } = useFetchInterceptor();

    const loginUser = async (userId: string, privateKey: string) => {
        try {
            const response = await http("/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, privateKey }),
                credentials: "include",
            });
            const data = response;

            if (!response.token) {
                throw new Error(data.error || "Invalid login credentials");
            }

            return data;
        } catch (error) {
            throw new Error("Failed to connect to the server.");
        }
    };

    const registerUser = async (userId: string): Promise<{ userId: string; walletAddress: string; privateKey: string; message?: string; error?: string } | any> => {
        try {
          const response = await http("/user/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          });
      
          if (response.error) {
            throw new Error(response.error);
          }
      
          console.log("Registration successful:", response.message);
          return response;
        } catch (error: any) {
          console.error("Registration failed:", error);
          return { error: error.message };
        }
      };
      

    return { loginUser, registerUser };
};