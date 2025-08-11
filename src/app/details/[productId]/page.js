import getProductById from "@/app/actions/getProductById";
import getRelatedProducts from "@/app/actions/getRelatedProducts";
import ClientDetails from "@/Components/ClientDetails";

export default async function ProductDetailsPage({ params }) {
  const productId = await params.productId;
  const product = await getProductById(productId);

  if (!product) {
    return (
      <main className="container py-5">
        <h2 className="text-center text-danger">Product not found.</h2>
        <div className="text-center mt-4">
          <Link href="/products" className="btn btn-outline-secondary">
            ← Back to Products
          </Link>
        </div>
      </main>
    );
  }

  const relatedProducts = await getRelatedProducts(product.category, productId);

  return (
    <ClientDetails
      product={product}
      productId={productId}
      relatedProducts={relatedProducts}
    />
  );
}
