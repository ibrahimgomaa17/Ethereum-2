const BASE_URL = import.meta.env.VITE_BASE_URL;
// service/admin.ts
export interface User {
    userId: string;
    walletAddress: string;
    isAdmin: boolean;
  }
  
  export const fetchUsers = async (): Promise<User[]> => {
    try {
      const response = await fetch(BASE_URL + "/admin/users");
      const data = await response.json();
      return data.users;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };
  