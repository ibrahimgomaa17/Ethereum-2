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

    const registerUser = async (userId: string) => {
        const response = await http("/user/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to register user');
        }

        return response.json();
    };

    return { loginUser, registerUser };
};