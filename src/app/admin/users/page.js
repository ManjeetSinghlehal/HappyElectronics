import fetchUsers from "@/app/actions/fetchUsers";
import AdminUsersClient from "@/Components/AdminUsersClient";

export default async function AdminUsersPage() {
  const users = await fetchUsers();
  return <AdminUsersClient initialUsers={users} />;
}