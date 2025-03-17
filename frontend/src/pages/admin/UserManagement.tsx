import { useEffect, useState } from "react";
import { useUsers } from "../../services/admin";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { SearchForm } from "@/components/search-form";
interface User {
  userId: string;
  walletAddress: string;
  isAdmin: boolean;
}

const UserManagement = () => {
  const { fetchUsers } = useUsers();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const searchQuery = (term: string) => {
    setSearch(term)
  };

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      const userList = await fetchUsers();
      setUsers(userList.filter(x => JSON.stringify(x).includes(search)));
      setLoading(false);
    };

    loadUsers();
  }, [search]);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex flex-row w-full">
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
        </div>
        <div className="flex flex-row w-full justify-end">
          <SearchForm searchQuery={searchQuery} className="sm:ml-auto sm:w-auto" />
        </div>
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
