import fetchContacts from "@/app/actions/fetchContacts";
import AdminContactsClient from "@/Components/AdminContactsClient";

export default async function AdminContactsPage() {
  const contacts = await fetchContacts();
  return <AdminContactsClient initialContacts={contacts} />;
}