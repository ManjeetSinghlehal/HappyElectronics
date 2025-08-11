"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import updateDeliveryStatus from "@/app/actions/updateDeliveryStatus";
import fetchUserOrders from "@/app/actions/fetchUserOrders";
import getUser from "../actions/getUser";
import submitReview from "../actions/submitReview";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [userId, setUserId] = useState(null);
  const [reviewState, setReviewState] = useState({});
  console.log(selectedOrder);

  useEffect(() => {
    const fetchData = async () => {
      await updateDeliveryStatus();
      if (session?.user?.email) {
        const user = await getUser(session.user.email);
        setUserId(user._id);
        const data = await fetchUserOrders(user._id);
        setOrders(data);
      }
    };
    fetchData();
  }, [session]);

  const handleReviewChange = (productId, stars, text) => {
    setReviewState((prev) => ({
      ...prev,
      [productId]: {
        stars: stars !== null ? stars : prev[productId]?.stars || 5,
        text: text !== null ? text : prev[productId]?.text || "",
      },
    }));
  };

  const handleReviewSubmit = async (productId) => {
    const { stars, text } = reviewState[productId] || {};
    if (!stars) return alert("Please select a rating.");
    try {
      await submitReview({
        productId,
        userId,
        rating: stars,
        message: text,
      });
      alert("Review submitted!");
      setReviewState((prev) => ({
        ...prev,
        [productId]: { stars: 5, text: "" },
      }));
    } catch (err) {
      alert("Error submitting review.");
    }
  };

  if (!session) {
    return (
      <main className="container py-5 text-center">
        <h2 className="text-danger">
          You must be logged in to view your profile.
        </h2>
      </main>
    );
  }

  return (
    <main className="container py-5">
      {/* User Info */}
      <section className="d-flex flex-column align-items-center text-center mb-5">
        <img
          src={session?.user?.image || "/default-profile.png"}
          alt="Profile Image"
          width={100}
          height={100}
          className="rounded-circle shadow"
        />
        <h3 className="mt-3">{session.user.name}</h3>
        <p className="text-muted">{session.user.email}</p>
      </section>

      {/* Orders */}
      <section>
        <h2 className="mb-4">Your Orders</h2>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="row gy-4">
            {orders.map((order) => (
              <div key={order.id} className="col-md-6">
                <div
                  className="card shadow-sm p-3 d-flex flex-row align-items-center gap-4 cursor-pointer"
                  role="button"
                  onClick={() => setSelectedOrder(order)}
                >
                  <Image
                    src={order.items[0].imageUrl || "/no-image.png"}
                    alt={order.items[0].name}
                    width={100}
                    height={80}
                    className="rounded shadow-sm"
                  />
                  <div>
                    <h5 className="mb-1">{order.items[0].name}</h5>
                    <p className="mb-1">
                      Delivery:{" "}
                      {order.isDelivered ? (
                        <span className="text-success">Delivered</span>
                      ) : (
                        <span className="text-warning">Not Delivered</span>
                      )}
                    </p>
                    <small className="text-muted">
                      {new Date(order.deliveryAt).toLocaleString()}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal */}
      {selectedOrder && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Order Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedOrder(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Order ID:</strong> {selectedOrder.id}
                </p>
                <p>
                  <strong>Delivery At:</strong>{" "}
                  {new Date(selectedOrder.deliveryAt).toLocaleString()}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {selectedOrder.isDelivered ? (
                    <span className="text-success">Delivered</span>
                  ) : (
                    <span className="text-warning">Not Delivered</span>
                  )}
                </p>
                <p>
                  <strong>Address:</strong> {selectedOrder.address.street},{" "}
                  {selectedOrder.address.province}
                </p>
                <hr />
                <h6>Items:</h6>

                {selectedOrder.items.map((item, index) => {
                  const review = reviewState[item.productId] || {
                    stars: 5,
                    text: "",
                  };

                  return (
                    <div key={index} className="mb-4 border-bottom pb-3">
                      <div className="d-flex align-items-center gap-3">
                        <Image
                          src={item.imageUrl || "/no-image.png"}
                          alt={item.name}
                          width={80}
                          height={60}
                          className="rounded"
                        />
                        <div>
                          <p className="mb-1 fw-bold">{item.name}</p>
                          <p className="mb-0">
                            ${item.price} × {item.quantity} = $
                            {item.price * item.quantity}
                          </p>
                        </div>
                      </div>

                      {/* Review Section Per Product */}
                      {selectedOrder.isDelivered &&
                      item.review &&
                      Object.keys(item.review).length > 0 ? (
                        <div className="mt-3">
                          <h6 className="mb-1">Your Review</h6>
                          <div className="mb-2 d-flex gap-2">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <span
                                key={n}
                                style={{
                                  fontSize: "1.5rem",
                                  color:
                                    n <= item.review.rating
                                      ? "#ffc107"
                                      : "#e4e5e9",
                                }}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          {item.review.message && (
                            <p className="fst-italic text-secondary">
                              {item.review.message}
                            </p>
                          )}
                        </div>
                      ) : (
                        selectedOrder.isDelivered && (
                          <div className="mt-3">
                            <h6 className="mb-1">Leave a Review</h6>
                            <div className="mb-2 d-flex gap-2">
                              {[1, 2, 3, 4, 5].map((n) => (
                                <span
                                  key={n}
                                  onClick={() =>
                                    handleReviewChange(item.productId, n, null)
                                  }
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "1.5rem",
                                    color:
                                      n <= review.stars ? "#ffc107" : "#e4e5e9",
                                  }}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <textarea
                              className="form-control mb-2"
                              rows={2}
                              placeholder="Write your review (optional)"
                              value={review.text}
                              onChange={(e) =>
                                handleReviewChange(
                                  item.productId,
                                  null,
                                  e.target.value
                                )
                              }
                            ></textarea>
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handleReviewSubmit(item.productId)}
                            >
                              Submit Review
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  );
                })}

                <hr />
                <h5 className="text-end">Total: ${selectedOrder.total}</h5>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
