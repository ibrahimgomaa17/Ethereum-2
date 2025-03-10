import { useEffect, useState } from "react";
import { Table } from "@mui/joy";
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
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <Table aria-label="user table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Wallet Address</th>
              <th>Admin Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.userId}</td>
                <td>{user.walletAddress}</td>
                <td>{user.isAdmin ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default UserManagement;
