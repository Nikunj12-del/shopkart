
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../client/shopkart-frontend/src/services/api";
import Navbar from "../../../client/shopkart-frontend/src/components/Navbar";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState("");
    const navigate = useNavigate();

    const fetchOrders = async () => {
        try {
            setError("");
            const response = await api.get("/orders");
            setOrders(response.data.orders || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load orders.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const isPending = (order) =>
        order.paymentStatus === "PENDING" &&
        order.status === "PENDING_PAYMENT";

    const deleteOrder = async (order) => {
        const confirmed = window.confirm(
            `Delete pending order #${String(order._id).slice(-8)}? This cannot be undone.`
        );

        if (!confirmed) return;

        try {
            setDeletingId(order._id);
            await api.delete(`/orders/${order._id}`);
            setOrders((current) =>
                current.filter((item) => item._id !== order._id)
            );
        } catch (err) {
            window.alert(
                err.response?.data?.message ||
                "Unable to delete this order. Refresh and check its status."
            );
        } finally {
            setDeletingId("");
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

            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -left-40 top-40 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />
                <div className="absolute -right-40 top-96 h-96 w-96 rounded-full bg-indigo-600/10 blur-[120px]" />
            </div>

            <main className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
                <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                    <div>
                        <p className="mb-4 inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-300">
                            Your shopping journey
                        </p>
                        <h1 className="text-3xl font-black sm:text-5xl">
                            My <span className="text-blue-400">Orders</span>
                        </h1>
                        <p className="mt-3 text-sm text-slate-400 sm:text-base">
                            Track purchases, complete payments and manage pending orders.
                        </p>
                    </div>

                    <Link
                        to="/products"
                        className="w-fit rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 hover:bg-white/10"
                    >
                        ← Continue Shopping
                    </Link>
                </div>

                {loading && (
                    <div className="py-24 text-center text-slate-400">
                        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-400" />
                        <p className="mt-5">Loading your orders...</p>
                    </div>
                )}

                {!loading && error && (
                    <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">
                        <p className="text-red-300">{error}</p>
                        <button
                            onClick={fetchOrders}
                            className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-bold"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {!loading && !error && orders.length === 0 && (
                    <div className="rounded-3xl border border-white/10 bg-slate-900/60 px-6 py-16 text-center">
                        <div className="text-5xl">📦</div>
                        <h2 className="mt-6 text-2xl font-black">No orders yet</h2>
                        <p className="mt-3 text-slate-400">
                            Your purchases will appear here.
                        </p>
                        <Link
                            to="/products"
                            className="mt-7 inline-flex rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-bold"
                        >
                            Explore Products →
                        </Link>
                    </div>
                )}

                {!loading && !error && orders.length > 0 && (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <article
                                key={order._id}
                                className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 transition hover:border-blue-500/25"
                            >
                                <div className="flex flex-col justify-between gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:p-6">
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-slate-500">
                                            Order reference
                                        </p>
                                        <h2 className="mt-2 text-xl font-black">
                                            <span className="text-blue-400">#</span>
                                            {String(order._id).slice(-8).toUpperCase()}
                                        </h2>
                                        <p className="mt-2 text-sm text-slate-400">
                                            {order.createdAt
                                                ? new Date(order.createdAt).toLocaleDateString("en-IN")
                                                : "Date unavailable"}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <span className={`rounded-full border px-3 py-1.5 text-xs font-bold ${badge(order.paymentStatus)}`}>
                                            Payment: {order.paymentStatus || "PENDING"}
                                        </span>
                                        <span className={`rounded-full border px-3 py-1.5 text-xs font-bold ${badge(order.status)}`}>
                                            {order.status || "PROCESSING"}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4 p-5 sm:p-6">
                                    {(order.items || []).map((item, index) => (
                                        <div
                                            key={item._id || `${order._id}-${index}`}
                                            className="flex items-center gap-4 rounded-2xl border border-white/5 bg-slate-950/50 p-3"
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
                                                <p className="break-words font-bold">
                                                    {item.name || "Product"}
                                                </p>
                                                <p className="mt-2 text-sm text-slate-400">
                                                    ₹{formatPrice(item.price)} × {item.quantity}
                                                </p>
                                            </div>
                                            <p className="shrink-0 font-bold text-blue-300">
                                                ₹{formatPrice(Number(item.price || 0) * Number(item.quantity || 0))}
                                            </p>
                                        </div>
                                    ))}

                                    <div className="flex flex-col justify-between gap-5 border-t border-white/10 pt-5 sm:flex-row sm:items-center">
                                        <div>
                                            <p className="text-xs uppercase tracking-widest text-slate-500">
                                                Order total
                                            </p>
                                            <p className="mt-1 text-3xl font-black">
                                                ₹{formatPrice(order.totalAmount)}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-3">
                                            <Link
                                                to={`/orders/${order._id}`}
                                                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold hover:bg-white/10"
                                            >
                                                View Details
                                            </Link>

                                            {isPending(order) && (
                                                <>
                                                    <button
                                                        onClick={() => navigate(`/checkout/payment/${order._id}`)}
                                                        className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-bold hover:brightness-110"
                                                    >
                                                        Pay Now →
                                                    </button>

                                                    <button
                                                        disabled={deletingId === order._id}
                                                        onClick={() => deleteOrder(order)}
                                                        className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-300 hover:bg-red-500/20 disabled:opacity-50"
                                                    >
                                                        {deletingId === order._id ? "Deleting..." : "Delete Order"}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Orders;
