import fetchProducts from "@/app/actions/fetchProducts";
import AdminProductsClient from "@/Components/AdminProductsClient";

export default async function AdminProductsPage() {
  const products = await fetchProducts();
  return <AdminProductsClient initialProducts={products} />;
}