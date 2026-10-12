
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../services/Navbar";
import api from "../services/api";
import { useCart } from "../../../client/shopkart-frontend/src/context/CartContext";

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, totalItems, subtotal } = useCart();

    const [shippingAddress, setShippingAddress] = useState({
        fullName: "",
        phone: "",
        addressLine1: "",
        city: "",
        state: "",
        pincode: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setShippingAddress((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        for (const value of Object.values(shippingAddress)) {
            if (!value.trim()) {
                setError("Please fill in all shipping details.");
                return;
            }
        }

        if (!/^\d{10}$/.test(shippingAddress.phone.trim())) {
            setError("Phone number must contain exactly 10 digits.");
            return;
        }

        if (!/^\d{6}$/.test(shippingAddress.pincode.trim())) {
            setError("Pincode must contain exactly 6 digits.");
            return;
        }

        if (cart.length === 0) {
            setError("Your cart is empty. Add products before checkout.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post(
                "/orders/create-payment-order",
                { shippingAddress }
            );

            navigate("/checkout/payment", {
                state: response.data
            });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to create your order. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3.5 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

    const labelClass =
        "mb-2 block text-sm font-semibold text-slate-300";

    if (cart.length === 0 && !loading) {
        return (
            <div className="min-h-screen bg-slate-950 text-white">
                <Navbar />

                <main className="mx-auto flex min-h-[75vh] max-w-3xl items-center justify-center px-5">
                    <div className="w-full rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
                        <div className="mb-5 text-6xl">🛒</div>

                        <h1 className="mb-3 text-3xl font-black">
                            Your cart is empty
                        </h1>

                        <p className="mb-7 text-slate-400">
                            Add something you love before checking out.
                        </p>

                        <button
                            onClick={() => navigate("/products")}
                            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3.5 font-bold transition hover:scale-105"
                        >
                            Explore Products →
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Navbar />

            <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">

                {/* PAGE HEADER */}

                <div className="mb-10">
                    <button
                        onClick={() => navigate("/cart")}
                        className="mb-6 text-sm font-semibold text-slate-400 transition hover:text-white"
                    >
                        ← Back to Cart
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/20 to-indigo-500/10 text-3xl">
                            📦
                        </div>

                        <div>
                            <p className="mb-1 text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
                                Almost there
                            </p>

                            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                                Secure Checkout
                            </h1>

                            <p className="mt-2 text-sm text-slate-400 sm:text-base">
                                Your favourites are just one step away.
                            </p>
                        </div>
                    </div>

                    {/* CHECKOUT STEPS */}

                    <div className="mt-8 flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-blue-400">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/15 ring-1 ring-blue-500/30">
                                1
                            </span>
                            Delivery
                        </div>

                        <div className="h-px flex-1 bg-white/10"></div>

                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
                                2
                            </span>
                            Payment
                        </div>

                        <div className="h-px flex-1 bg-white/10"></div>

                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
                                3
                            </span>
                            Complete
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">

                        {/* SHIPPING FORM */}

                        <section className="space-y-6 lg:col-span-2">
                            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/10 sm:p-8">

                                <div className="mb-8 flex items-start gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                                        📍
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-bold sm:text-2xl">
                                            Shipping Details
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-400">
                                            Where should we deliver your order?
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="fullName"
                                            className={labelClass}
                                        >
                                            Full Name
                                        </label>

                                        <input
                                            id="fullName"
                                            name="fullName"
                                            type="text"
                                            autoComplete="name"
                                            placeholder="Enter your full name"
                                            value={shippingAddress.fullName}
                                            onChange={handleChange}
                                            className={inputClass}
                                            required
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="phone"
                                            className={labelClass}
                                        >
                                            Phone Number
                                        </label>

                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            inputMode="numeric"
                                            maxLength={10}
                                            autoComplete="tel"
                                            placeholder="10-digit mobile number"
                                            value={shippingAddress.phone}
                                            onChange={handleChange}
                                            className={inputClass}
                                            required
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="addressLine1"
                                            className={labelClass}
                                        >
                                            Address
                                        </label>

                                        <input
                                            id="addressLine1"
                                            name="addressLine1"
                                            type="text"
                                            autoComplete="street-address"
                                            placeholder="House number, street, area"
                                            value={shippingAddress.addressLine1}
                                            onChange={handleChange}
                                            className={inputClass}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="city"
                                            className={labelClass}
                                        >
                                            City
                                        </label>

                                        <input
                                            id="city"
                                            name="city"
                                            type="text"
                                            autoComplete="address-level2"
                                            placeholder="Your city"
                                            value={shippingAddress.city}
                                            onChange={handleChange}
                                            className={inputClass}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="state"
                                            className={labelClass}
                                        >
                                            State
                                        </label>

                                        <input
                                            id="state"
                                            name="state"
                                            type="text"
                                            autoComplete="address-level1"
                                            placeholder="Your state"
                                            value={shippingAddress.state}
                                            onChange={handleChange}
                                            className={inputClass}
                                            required
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="pincode"
                                            className={labelClass}
                                        >
                                            PIN Code
                                        </label>

                                        <input
                                            id="pincode"
                                            name="pincode"
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={6}
                                            autoComplete="postal-code"
                                            placeholder="6-digit PIN code"
                                            value={shippingAddress.pincode}
                                            onChange={handleChange}
                                            className={inputClass}
                                            required
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div
                                        role="alert"
                                        className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300"
                                    >
                                        <span className="mr-2">⚠️</span>
                                        {error}
                                    </div>
                                )}

                                <div className="mt-8 flex items-start gap-3 rounded-2xl border border-white/5 bg-slate-900/60 p-4">
                                    <span className="text-xl">🔒</span>

                                    <div>
                                        <p className="text-sm font-semibold text-slate-200">
                                            Your information is protected
                                        </p>

                                        <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                            Your delivery details will be used to process this order.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ORDER SUMMARY */}

                        <aside className="lg:sticky lg:top-28">
                            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20">

                                <div className="border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-6">
                                    <h2 className="text-xl font-black">
                                        Order Summary
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-400">
                                        {totalItems} item{totalItems !== 1 ? "s" : ""} in your bag
                                    </p>
                                </div>

                                <div className="space-y-5 p-6">

                                    {/* PRODUCT PREVIEW */}

                                    <div className="max-h-64 space-y-4 overflow-y-auto">
                                        {cart.map((item) => {
                                            const product = item.product;

                                            if (!product) {
                                                return null;
                                            }

                                            return (
                                                <div
                                                    key={item._id || product._id}
                                                    className="flex items-center gap-3"
                                                >
                                                    <div className="relative h-16 w-16 shrink-0">
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="h-full w-full rounded-xl border border-white/10 bg-slate-900 object-cover"
                                                        />

                                                        <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-bold text-white">
                                                            {item.quantity}
                                                        </span>
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-semibold text-white">
                                                            {product.name}
                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-500">
                                                            ₹{product.price.toLocaleString("en-IN")} each
                                                        </p>
                                                    </div>

                                                    <p className="shrink-0 text-sm font-bold">
                                                        ₹{(
                                                            product.price * item.quantity
                                                        ).toLocaleString("en-IN")}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="border-t border-white/10"></div>

                                    <div className="flex justify-between text-sm text-slate-400">
                                        <span>Subtotal</span>

                                        <span className="font-semibold text-white">
                                            ₹{subtotal.toLocaleString("en-IN")}
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-sm text-slate-400">
                                        <span>Delivery</span>

                                        <span className="font-semibold text-emerald-400">
                                            FREE
                                        </span>
                                    </div>

                                    <div className="border-t border-dashed border-white/10 pt-5">
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="font-bold">
                                                Total
                                            </span>

                                            <span className="text-2xl font-black text-white">
                                                ₹{subtotal.toLocaleString("en-IN")}
                                            </span>
                                        </div>

                                        <p className="mt-2 text-xs text-slate-500">
                                            Final amount is calculated by the server.
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || cart.length === 0}
                                        className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 font-bold text-white shadow-lg shadow-blue-900/20 transition hover:-translate-y-0.5 hover:shadow-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                                    >
                                        {loading ? (
                                            <>
                                                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
                                                Creating Order...
                                            </>
                                        ) : (
                                            <>
                                                Continue to Payment
                                                <span className="transition-transform group-hover:translate-x-1">
                                                    →
                                                </span>
                                            </>
                                        )}
                                    </button>

                                    <p className="text-center text-xs leading-relaxed text-slate-500">
                                        You'll review your payment in the next step.
                                    </p>
                                </div>
                            </div>
                        </aside>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default Checkout;
