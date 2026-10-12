
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function OrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(`/orders/${id}`);
            setOrder(response.data.order);
        } catch (err) {
            setError(err.response?.data?.message || "Unable to load order.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const isPending = order?.paymentStatus === "PENDING" &&
        order?.status === "PENDING_PAYMENT";

    const deleteOrder = async () => {
        if (!window.confirm("Delete this pending order? This cannot be undone.")) {
            return;
        }

        try {
            setDeleting(true);
            await api.delete(`/orders/${id}`);
            navigate("/orders", { replace: true });
        } catch (err) {
            window.alert(
                err.response?.data?.message || "Unable to delete this order."
            );
        } finally {
            setDeleting(false);
        }
    };

    const formatPrice = (amount) =>
        Number(amount || 0).toLocaleString("en-IN");

    const badge = (status) => {
        const value = String(status || "").toUpperCase();

        if (["PAID", "PLACED", "DELIVERED"].includes(value)) {
            return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
        }

        if (["FAILED", "CANCELLED"].includes(value)) {
            return "border-red-500/20 bg-red-500/10 text-red-400";
        }

        return "border-amber-500/20 bg-amber-500/10 text-amber-400";
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Navbar />

            <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
                <Link to="/orders" className="text-sm font-semibold text-slate-400 hover:text-blue-300">
                    ← Back to My Orders
                </Link>

                {loading && (
                    <div className="py-24 text-center text-slate-400">
                        Loading order details...
                    </div>
                )}

                {!loading && error && (
                    <div className="mt-8 rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">
                        <p className="text-red-300">{error}</p>
                        <button
                            onClick={fetchOrder}
                            className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-bold"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {!loading && !error && order && (
                    <>
                        <section className="mt-7 rounded-3xl border border-white/10 bg-slate-900/70 p-6 sm:p-8">
                            <p className="text-xs font-bold uppercase tracking-widest text-blue-400">
                                Order details
                            </p>

                            <h1 className="mt-3 break-all text-2xl font-black sm:text-3xl">
                                Order #{String(order._id).slice(-8).toUpperCase()}
                            </h1>

                            <p className="mt-3 text-sm text-slate-400">
                                Placed on {order.createdAt
                                    ? new Date(order.createdAt).toLocaleString("en-IN")
                                    : "Date unavailable"}
                            </p>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <span className={`rounded-full border px-3 py-1.5 text-xs font-bold ${badge(order.paymentStatus)}`}>
                                    Payment: {order.paymentStatus || "PENDING"}
                                </span>
                                <span className={`rounded-full border px-3 py-1.5 text-xs font-bold ${badge(order.status)}`}>
                                    Order: {order.status || "PROCESSING"}
                                </span>
                            </div>

                            {isPending && (
                                <div className="mt-7 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
                                    <h2 className="font-bold text-amber-300">
                                        Payment pending
                                    </h2>
                                    <p className="mt-2 text-sm text-slate-400">
                                        Complete payment to confirm this order, or delete it if you no longer want to proceed.
                                    </p>

                                    <div className="mt-5 flex flex-wrap gap-3">
                                        <button
                                            onClick={() => navigate(`/checkout/payment/${order._id}`)}
                                            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-bold"
                                        >
                                            Pay Now →
                                        </button>

                                        <button
                                            onClick={deleteOrder}
                                            disabled={deleting}
                                            className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-bold text-red-300 disabled:opacity-50"
                                        >
                                            {deleting ? "Deleting..." : "Delete Order"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </section>

                        <section className="mt-6 rounded-3xl border border-white/10 bg-slate-900/70 p-5 sm:p-8">
                            <h2 className="text-xl font-black">Items Purchased</h2>

                            <div className="mt-6 space-y-4">
                                {(order.items || []).map((item, index) => (
                                    <div
                                        key={item._id || `${order._id}-${index}`}
                                        className="flex items-center gap-4 rounded-2xl border border-white/5 bg-slate-950/50 p-3 sm:p-4"
                                    >
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name || "Product"}
                                                className="h-20 w-20 rounded-xl bg-slate-800 object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-slate-800 text-3xl">
                                                📦
                                            </div>
                                        )}

                                        <div className="min-w-0 flex-1">
                                            <h3 className="break-words font-bold">
                                                {item.name || "Product"}
                                            </h3>
                                            <p className="mt-2 text-sm text-slate-400">
                                                ₹{formatPrice(item.price)} × {item.quantity}
                                            </p>
                                        </div>

                                        <p className="shrink-0 font-bold text-blue-300">
                                            ₹{formatPrice(Number(item.price || 0) * Number(item.quantity || 0))}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-7 border-t border-white/10 pt-6">
                                <p className="text-sm text-slate-400">Order Total</p>
                                <p className="mt-1 text-3xl font-black">
                                    ₹{formatPrice(order.totalAmount)}
                                </p>
                            </div>
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}

export default OrderDetails;
