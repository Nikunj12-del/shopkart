import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams,
    useLocation
} from "react-router-dom";
import api from "../../../client/shopkart-frontend/src/services/api";

const ProductDetails = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const location = useLocation();


    const [product, setProduct] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(false);


    useEffect(() => {

        const fetchProduct = async () => {

            try {

                setLoading(true);
                setError(false);

                const response = await api.get(`/products/${id}`);

                setProduct(response.data.product);

                setLoading(false);

            } catch (error) {

                console.log(error);

                setError(true);

                setLoading(false);

            }

        };

        fetchProduct();

    }, [id]);


    const handleBack = () => {

        if (location.state?.from === "wishlist") {

            navigate("/wishlist");

        } else {

            navigate("/products");

        }

    };


    if (loading) {

        return (

            <div className="min-h-screen bg-slate-950 flex items-center justify-center">

                <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>

            </div>

        );

    }


    if (error || !product) {

        return (

            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center">

                <div className="text-6xl mb-5">
                    😕
                </div>

                <h2 className="text-3xl font-bold">
                    Product Not Found
                </h2>

                <p className="text-slate-400 mt-2">
                    This product doesn't exist or could not be loaded.
                </p>

                <button
                    onClick={handleBack}
                    className="mt-6 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-semibold transition"
                >
                    ← Back
                </button>

            </div>

        );

    }


    const discounts = [
        10,
        15,
        17,
        20,
        25,
        30
    ];


    let total = 0;

    for (let i = 0; i < product._id.length; i++) {

        total += product._id.charCodeAt(i);

    }


    const discount =
        discounts[total % discounts.length];


    const originalPrice = Math.round(
        product.price / (1 - discount / 100)
    );


    let stockText;

    let stockClass;


    if (product.stock === 0) {

        stockText = "Out of Stock";

        stockClass =
            "text-red-400 bg-red-500/10 border-red-500/20";

    } else if (product.stock <= 5) {

        stockText = `Only ${product.stock} left`;

        stockClass =
            "text-orange-400 bg-orange-500/10 border-orange-500/20";

    } else {

        stockText = "In Stock";

        stockClass =
            "text-green-400 bg-green-500/10 border-green-500/20";

    }


    return (

        <div className="min-h-screen bg-slate-950 text-white">


            <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">


                {/* BACK BUTTON */}

                <button
                    onClick={handleBack}
                    className="text-slate-400 hover:text-white mb-8 transition flex items-center gap-2"
                >

                    <span>
                        ←
                    </span>

                    <span>
                        {location.state?.from === "wishlist"
                            ? "Back to Wishlist"
                            : "Back to Products"}
                    </span>

                </button>


                <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">


                    <div className="grid grid-cols-1 lg:grid-cols-2">


                        {/* IMAGE */}

                        <div className="bg-slate-900 min-h-[450px] flex items-center justify-center p-8 overflow-hidden">

                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-[400px] object-contain rounded-2xl transition duration-500 hover:scale-105"
                            />

                        </div>


                        {/* DETAILS */}

                        <div className="p-8 lg:p-12">


                            <div className="flex items-center justify-between">


                                <p className="text-blue-400 font-semibold uppercase tracking-wide">
                                    {product.category}
                                </p>


                                <span
                                    className={`text-sm font-semibold px-3 py-1.5 rounded-full border ${stockClass}`}
                                >
                                    {stockText}
                                </span>

                            </div>


                            <h1 className="text-4xl sm:text-5xl font-bold mt-3">
                                {product.name}
                            </h1>


                            {/* PRICE */}

                            <div className="mt-6">


                                <div className="flex items-center gap-4 flex-wrap">


                                    <span className="text-4xl font-bold">
                                        ₹
                                        {product.price.toLocaleString(
                                            "en-IN"
                                        )}
                                    </span>


                                    <span className="text-xl text-slate-500 line-through">
                                        ₹
                                        {originalPrice.toLocaleString(
                                            "en-IN"
                                        )}
                                    </span>


                                    <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-lg text-sm font-bold">
                                        {discount}% OFF
                                    </span>


                                </div>


                                <p className="text-sm text-slate-500 mt-2">
                                    Inclusive of all applicable taxes
                                </p>

                            </div>


                            <div className="h-px bg-white/10 my-8"></div>


                            {/* DESCRIPTION */}

                            <h2 className="text-lg font-semibold mb-3">
                                Description
                            </h2>


                            <p className="text-slate-400 leading-7">
                                {product.description}
                            </p>


                            {/* AVAILABILITY */}

                            <div className="mt-8 bg-white/5 rounded-2xl p-5">


                                <div className="flex items-center justify-between">


                                    <span className="text-slate-400">
                                        Availability
                                    </span>


                                    <span className="font-semibold">
                                        {product.stock} units available
                                    </span>


                                </div>


                            </div>


                            {/* CART */}

                            <button
                                disabled={product.stock === 0}
                                className={`w-full mt-6 py-4 rounded-2xl font-bold text-lg transition shadow-lg ${
                                    product.stock === 0
                                        ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-500 shadow-blue-600/20"
                                }`}
                            >

                                🛒{" "}

                                {product.stock === 0
                                    ? "Out of Stock"
                                    : "Add to Cart"}

                            </button>


                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default ProductDetails;