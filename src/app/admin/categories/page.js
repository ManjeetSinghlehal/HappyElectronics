import fetchCategories from "@/app/actions/fetchCategories";
import AdminCategoriesClient from "@/Components/AdminCategoriesClient";

export default async function AdminCategoriesPage() {
  const categories = await fetchCategories();
  return <AdminCategoriesClient initialCategories={categories} />;
}