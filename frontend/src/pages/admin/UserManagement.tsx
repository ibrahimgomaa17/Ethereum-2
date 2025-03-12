import { useEffect, useState } from "react";
import { fetchUsers } from "../../services/admin";

const UserManagement = () => {
  interface User {
    userId: string;
    walletAddress: string;
    isAdmin: boolean;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      const userList = await fetchUsers();
      setUsers(userList);
      setLoading(false);
    };

    loadUsers();
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold mb-10">Manage Users</h1>

    </>
  );
};

export default UserManagement;
