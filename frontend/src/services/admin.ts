import { useFetchInterceptor } from "./http";

export interface User {
  userId: string;
  walletAddress: string;
  isAdmin: boolean;
}

export const useUsers = () => {
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

  return { fetchUsers };
};