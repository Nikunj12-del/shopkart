
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../services/Navbar";
import { useCart } from "../../../client/shopkart-frontend/src/context/CartContext";

const Cart = () => {
    const navigate = useNavigate();

    const {
        cart,
        loading,
        error,
        fetchCart,
        updateQuantity,
        removeFromCart,
        totalItems,
        subtotal
    } = useCart();

    useEffect(() => {
        fetchCart();
    }, []);

    const handleIncrease = async (productId, quantity, stock) => {
        if (quantity >= stock) {
            return;
        }

        const success = await updateQuantity(
            productId,
            quantity + 1
        );

        if (success) {
            await fetchCart();
        }
    };

    const handleDecrease = async (productId, quantity) => {
        if (quantity <= 1) {
            return;
        }

        const success = await updateQuantity(
            productId,
            quantity - 1
        );

        if (success) {
            await fetchCart();
        }
    };

    const handleRemove = async (productId) => {
        const success = await removeFromCart(productId);

        if (success) {
            await fetchCart();
        }
    };

    if (loading && cart.length === 0) {
        return (
            <div className="min-h-screen bg-slate-950 text-white">
                <Navbar />

                <div className="min-h-[70vh] flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin mx-auto mb-5"></div>

                        <p className="text-slate-400">
                            Loading your cart...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error && cart.length === 0) {
        return (
            <div className="min-h-screen bg-slate-950 text-white">
                <Navbar />

                <div className="min-h-[70vh] flex items-center justify-center px-5">
                    <div className="text-center">
                        <div className="text-6xl mb-5">
                            ⚠️
                        </div>

                        <h2 className="text-2xl font-bold mb-2">
                            Something went wrong
                        </h2>

                        <p className="text-slate-400 mb-6">
                            {error}
                        </p>

                        <button
                            onClick={fetchCart}
                            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Navbar />

            <main className="max-w-7xl mx-auto px-5 sm:px-8 py-12">

                {/* HEADER */}

                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-2xl">
                            🛒
                        </div>

                        <div>
                            <h1 className="text-4xl font-black tracking-tight">
                                My Cart
                            </h1>

                            <p className="text-slate-400 mt-1">
                                Review your items before checkout
                            </p>
                        </div>
                    </div>

                    {cart.length > 0 && (
                        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10">
                            <span className="w-2 h-2 rounded-full bg-blue-400"></span>

                            <span className="text-sm text-slate-300">
                                {totalItems} item{totalItems !== 1 ? "s" : ""} in cart
                            </span>
                        </div>
                    )}
                </div>

                {/* EMPTY CART */}

                {cart.length === 0 ? (
                    <div className="min-h-[450px] flex items-center justify-center">
                        <div className="text-center max-w-md">
                            <div className="relative mx-auto w-28 h-28 mb-7">
                                <div className="absolute inset-0 bg-blue-500/20 blur-3xl"></div>

                                <div className="relative w-full h-full rounded-3xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-6xl">
                                    🛒
                                </div>
                            </div>

                            <h2 className="text-3xl font-black mb-3">
                                Your cart is empty
                            </h2>

                            <p className="text-slate-400 leading-relaxed mb-7">
                                Looks like you haven't added anything to your cart yet.
                                Browse our products and find something you love.
                            </p>

                            <button
                                onClick={() => navigate("/products")}
                                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-bold hover:scale-105 transition-transform shadow-lg shadow-blue-500/20"
                            >
                                Explore Products →
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* CART ITEMS */}

                        <div className="lg:col-span-2 space-y-5">
                            {cart.map((item) => {
                                const product = item.product;

                                if (!product) {
                                    return null;
                                }

                                return (
                                    <div
                                        key={item._id || product._id}
                                        className="bg-white/[0.04] border border-white/10 rounded-3xl p-5 backdrop-blur-xl"
                                    >
                                        <div className="flex flex-col sm:flex-row gap-5">

                                            {/* IMAGE */}

                                            <div className="w-full sm:w-36 h-36 rounded-2xl overflow-hidden bg-slate-900 shrink-0">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* DETAILS */}

                                            <div className="flex-1">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider mb-2">
                                                            {product.category}
                                                        </p>

                                                        <h2 className="text-xl font-bold text-white">
                                                            {product.name}
                                                        </h2>

                                                        <p className="text-lg font-black text-white mt-2">
                                                            ₹{product.price.toLocaleString("en-IN")}
                                                        </p>
                                                    </div>

                                                    {/* REMOVE */}

                                                    <button
                                                        onClick={() => handleRemove(product._id)}
                                                        disabled={loading}
                                                        className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 disabled:opacity-50 transition"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>

                                                {/* QUANTITY */}

                                                <div className="flex items-center justify-between mt-6">
                                                    <div>
                                                        <p className="text-xs text-slate-500 mb-2">
                                                            Quantity
                                                        </p>

                                                        <div className="flex items-center border border-white/10 rounded-xl overflow-hidden">
                                                            <button
                                                                onClick={() =>
                                                                    handleDecrease(
                                                                        product._id,
                                                                        item.quantity
                                                                    )
                                                                }
                                                                disabled={
                                                                    loading ||
                                                                    item.quantity <= 1
                                                                }
                                                                className="w-10 h-10 bg-white/[0.04] hover:bg-white/10 disabled:opacity-40 text-lg font-bold"
                                                            >
                                                                −
                                                            </button>

                                                            <div className="w-12 h-10 flex items-center justify-center bg-white/[0.02] font-bold">
                                                                {item.quantity}
                                                            </div>

                                                            <button
                                                                onClick={() =>
                                                                    handleIncrease(
                                                                        product._id,
                                                                        item.quantity,
                                                                        product.stock
                                                                    )
                                                                }
                                                                disabled={
                                                                    loading ||
                                                                    item.quantity >= product.stock
                                                                }
                                                                className="w-10 h-10 bg-white/[0.04] hover:bg-white/10 disabled:opacity-40 text-lg font-bold"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* ITEM TOTAL */}

                                                    <div className="text-right">
                                                        <p className="text-xs text-slate-500 mb-2">
                                                            Item Total
                                                        </p>

                                                        <p className="text-xl font-black text-white">
                                                            ₹{(
                                                                product.price *
                                                                item.quantity
                                                            ).toLocaleString("en-IN")}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* ORDER SUMMARY */}

                        <div>
                            <div className="sticky top-28 bg-white/[0.04] border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                                <h2 className="text-2xl font-black mb-6">
                                    Order Summary
                                </h2>

                                <div className="space-y-4">
                                    <div className="flex justify-between text-slate-400">
                                        <span>Items</span>

                                        <span>
                                            {totalItems}
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-slate-400">
                                        <span>Subtotal</span>

                                        <span className="text-white font-semibold">
                                            ₹{subtotal.toLocaleString("en-IN")}
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-slate-400">
                                        <span>Delivery</span>

                                        <span className="text-green-400 font-semibold">
                                            FREE
                                        </span>
                                    </div>

                                    <div className="border-t border-white/10 pt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold">
                                                Total
                                            </span>

                                            <span className="text-2xl font-black text-white">
                                                ₹{subtotal.toLocaleString("en-IN")}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* CHECKOUT BUTTON */}

                                <button
                                    onClick={() => navigate("/checkout")}
                                    disabled={loading || cart.length === 0}
                                    className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:scale-[1.02] transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    Proceed to Checkout
                                </button>

                                {/* CONTINUE SHOPPING */}

                                <button
                                    onClick={() => navigate("/products")}
                                    className="w-full mt-3 py-3 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/10 text-slate-300 font-semibold transition"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Cart;
