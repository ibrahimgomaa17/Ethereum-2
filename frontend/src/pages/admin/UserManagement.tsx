import { useEffect, useState } from "react";
import { fetchUsers } from "../../services/admin";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { SearchForm } from "@/components/search-form";

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
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">Admin Section</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Users</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <SearchForm className="w-full sm:ml-auto sm:w-auto" />
      </header>
      <div className="flex flex-col gap-4 p-4">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-4">
          {loading ? (
            <p className="p-4 text-center">Loading users...</p>
          ) : (
            <Table>
              {/* <TableCaption>A list of registered users.</TableCaption> */}
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">User ID</TableHead>
                  <TableHead>Wallet Address</TableHead>
                  <TableHead className="text-center">Admin Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell className="font-medium capitalize">{user.userId}</TableCell>
                    <TableCell>{user.walletAddress}</TableCell>
                    <TableCell className="text-center">{user.isAdmin ? "Yes" : "No"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </>
  );
};

export default UserManagement;
