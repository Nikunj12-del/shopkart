import { useNavigate } from "react-router-dom";
import { useState } from "react";

const WishlistCard = ({ product, onRemove }) => {

    const navigate = useNavigate();

    const [removing, setRemoving] = useState(false);
    const [removeError, setRemoveError] = useState("");

    const handleRemove = async () => {

        if (removing) {
            return;
        }

        try {

            setRemoving(true);
            setRemoveError("");

            await onRemove(product._id);

        } catch (error) {

            console.log(error);

            setRemoveError(
                error.response?.data?.message ||
                "Failed to remove product"
            );

            setRemoving(false);

        }

    };


    const handleViewDetails = () => {

        navigate(`/products/${product._id}`, {
            state: {
                from: "wishlist"
            }
        });

    };


    let stockText;
    let stockClass;

    if (product.stock === 0) {

        stockText = "Out of Stock";

        stockClass =
            "bg-red-500/10 text-red-400 border-red-500/20";

    } else if (product.stock <= 5) {

        stockText = `Only ${product.stock} left`;

        stockClass =
            "bg-orange-500/10 text-orange-400 border-orange-500/20";

    } else {

        stockText = "In Stock";

        stockClass =
            "bg-green-500/10 text-green-400 border-green-500/20";

    }


    return (

        <div className="group relative bg-white/[0.04] border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl hover:border-pink-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-pink-500/10">


            {/* IMAGE */}

            <div className="relative h-64 bg-slate-900 overflow-hidden">

                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />


                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>


                {/* WISHLIST ICON */}

                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-pink-400 text-xl">
                    ♥
                </div>


                {/* STOCK */}

                <div
                    className={`absolute bottom-4 left-4 px-3 py-1.5 rounded-full border text-xs font-semibold ${stockClass}`}
                >
                    {stockText}
                </div>

            </div>


            {/* CONTENT */}

            <div className="p-5">


                {/* CATEGORY */}

                <p className="text-xs text-blue-400 font-semibold uppercase tracking-[0.18em] mb-2">
                    {product.category}
                </p>


                {/* NAME */}

                <h2 className="text-xl font-bold text-white line-clamp-2 min-h-[56px]">
                    {product.name}
                </h2>


                {/* PRICE */}

                <div className="mt-4 flex items-center justify-between">

                    <div>

                        <p className="text-xs text-slate-500 uppercase tracking-wider">
                            Price
                        </p>

                        <p className="text-2xl font-black text-white">
                            ₹{product.price.toLocaleString("en-IN")}
                        </p>

                    </div>


                    <div className="text-right">

                        <p className="text-xs text-slate-500">
                            Stock
                        </p>

                        <p className="text-sm font-semibold text-slate-300">
                            {product.stock} units
                        </p>

                    </div>

                </div>


                {/* ERROR */}

                {removeError && (

                    <div className="mt-3 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                        {removeError}
                    </div>

                )}


                {/* BUTTONS */}

                <div className="grid grid-cols-2 gap-3 mt-5">


                    {/* VIEW DETAILS */}

                    <button
                        onClick={handleViewDetails}
                        disabled={removing}
                        className="py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold transition-all hover:scale-[1.02]"
                    >
                        View Details
                    </button>


                    {/* REMOVE */}

                    <button
                        onClick={handleRemove}
                        disabled={removing}
                        className="py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 font-semibold transition-all disabled:opacity-50"
                    >

                        {removing ? (
                            "Removing..."
                        ) : (
                            "Remove"
                        )}

                    </button>

                </div>

            </div>

        </div>

    );

};

export default WishlistCard;