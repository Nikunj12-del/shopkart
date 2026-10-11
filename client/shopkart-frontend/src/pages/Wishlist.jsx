import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import WishlistCard from "../components/WishlistCard";
import api from "../services/api";

const Wishlist = () => {

    const navigate = useNavigate();

    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchWishlist = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("/wishlist");

            setWishlist(response.data.wishlist);

        } catch (error) {

            console.log(error);

            setError(
                error.response?.data?.message ||
                "Failed to load wishlist"
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const handleRemove = async (productId) => {

        try {

            await api.delete(`/wishlist/${productId}`);

            setWishlist((currentWishlist) =>
                currentWishlist.filter(
                    product => product._id !== productId
                )
            );

        } catch (error) {

            console.log(error);

            throw error;

        }

    };

    if (loading) {

        return (
            <>
                <Navbar />

                <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">

                    <div className="text-center">

                        <div className="w-12 h-12 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin mx-auto mb-5"></div>

                        <p className="text-slate-400">
                            Loading your wishlist...
                        </p>

                    </div>

                </div>
            </>
        );

    }

    if (error) {

        return (
            <>
                <Navbar />

                <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-5">

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
                            onClick={fetchWishlist}
                            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition"
                        >
                            Try Again
                        </button>

                    </div>

                </div>
            </>
        );

    }

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            <Navbar />

            <main className="max-w-7xl mx-auto px-5 sm:px-8 py-12">

                {/* HEADER */}

                <div className="mb-10">

                    <div className="flex items-center gap-3 mb-3">

                        <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-2xl">
                            ♥
                        </div>

                        <div>

                            <h1 className="text-4xl font-black tracking-tight">
                                My Wishlist
                            </h1>

                            <p className="text-slate-400 mt-1">
                                Products you've saved for later
                            </p>

                        </div>

                    </div>

                    <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10">

                        <span className="w-2 h-2 rounded-full bg-pink-400"></span>

                        <span className="text-sm text-slate-300">
                            {wishlist.length} saved product
                            {wishlist.length !== 1 ? "s" : ""}
                        </span>

                    </div>

                </div>


                {/* EMPTY STATE */}

                {wishlist.length === 0 ? (

                    <div className="min-h-[450px] flex items-center justify-center">

                        <div className="text-center max-w-md">

                            <div className="relative mx-auto w-28 h-28 mb-7">

                                <div className="absolute inset-0 bg-pink-500/20 blur-3xl"></div>

                                <div className="relative w-full h-full rounded-3xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-6xl">
                                    ♡
                                </div>

                            </div>

                            <h2 className="text-3xl font-black mb-3">
                                Nothing saved yet
                            </h2>

                            <p className="text-slate-400 leading-relaxed mb-7">
                                Your wishlist is waiting for something special.
                                Browse the store and save products you love.
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

                    /* WISHLIST GRID */

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                        {wishlist.map((product) => (

                            <WishlistCard
                                key={product._id}
                                product={product}
                                onRemove={handleRemove}
                            />

                        ))}

                    </div>

                )}

            </main>

        </div>
    );
};

export default Wishlist;