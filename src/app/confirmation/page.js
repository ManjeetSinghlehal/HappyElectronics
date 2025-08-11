import getLatestOrder from "../actions/getLatestOrder";
import Image from "next/image";
import Link from "next/link";

export default async function ConfirmationPage() {
  const order = await getLatestOrder();

  if (!order) {
    return (
      <main className="container py-5 text-center">
        <h2 className="text-danger mb-4">No recent order found.</h2>
        <Link href="/products" className="btn btn-primary">Shop Now</Link>
      </main>
    );
  }

  return (
    <main className="container py-5">
      <h2 className="text-success mb-4 text-center">Payment Successful 🎉</h2>
      <p className="text-center mb-4">Order placed on <strong>{new Date(order.createdAt).toLocaleDateString()}</strong></p>
      <p className="text-center mb-4 text-muted">
        Estimated delivery by: <strong>{new Date(order.deliveryAt).toLocaleDateString()}</strong>
      </p>

      <div className="vstack gap-3 mb-5">
        {order.items.map((item, i) => (
          <div key={i} className="d-flex align-items-center gap-3 p-3 border rounded shadow-sm flex-column flex-md-row">
            <Image
              src={item.imageUrl}
              alt={item.name}
              width={80}
              height={80}
              className="rounded object-fit-cover"
            />
            <div className="flex-grow-1">
              <h5 className="mb-1">{item.name}</h5>
              <p className="mb-1 text-muted">${item.price} × {item.quantity}</p>
              <p className="fw-bold mb-0">Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      <h4 className="fw-bold text-end mb-5">Total Paid: ${order.total.toFixed(2)}</h4>

      <div className="d-flex justify-content-center gap-3">
        <Link href="/" className="btn btn-outline-primary">← Home</Link>
        <Link href="/products" className="btn btn-primary">Continue Shopping</Link>
      </div>
    </main>
  );
}
