import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../../../client/shopkart-frontend/src/context/CartContext";
import api from "../../../client/shopkart-frontend/src/services/api";

const ProductCard = ({ product }) => {

    const navigate = useNavigate();

    const {
        addToCart,
        cart
    } = useCart();

    const [isHovered, setIsHovered] = useState(false);

    const [mousePosition, setMousePosition] = useState({
        x: 50,
        y: 50
    });

    const [tilt, setTilt] = useState({
        x: 0,
        y: 0
    });

    const [isEnteringWormhole, setIsEnteringWormhole] =
        useState(false);

    const [wishlistStatus, setWishlistStatus] =
        useState("checking");

    const [cartStatus, setCartStatus] =
        useState("idle");


    // CHECK IF PRODUCT IS ALREADY IN CART

    const isInCart = cart.some((item) => {

        if (!item.product) {
            return false;
        }

        if (typeof item.product === "string") {
            return item.product === product._id;
        }

        return item.product._id === product._id;

    });


    // CHECK WISHLIST STATUS

    useEffect(() => {

        const checkWishlistStatus = async () => {

            try {

                const response = await api.get("/wishlist");

                const wishlist =
                    response.data.wishlist || [];

                const alreadyAdded = wishlist.some(
                    (wishlistProduct) =>
                        wishlistProduct._id === product._id
                );

                if (alreadyAdded) {
                    setWishlistStatus("added");
                } else {
                    setWishlistStatus("idle");
                }

            } catch (error) {

                console.log(error);

                setWishlistStatus("idle");

            }

        };

        checkWishlistStatus();

    }, [product._id]);


    // KEEP CART STATUS IN SYNC

    useEffect(() => {

        if (isInCart) {

            setCartStatus("added");

        } else if (cartStatus === "added") {

            setCartStatus("idle");

        }

    }, [isInCart]);


    // MOUSE MOVE

    const handleMouseMove = (e) => {

        const rect =
            e.currentTarget.getBoundingClientRect();

        const x =
            ((e.clientX - rect.left) / rect.width) * 100;

        const y =
            ((e.clientY - rect.top) / rect.height) * 100;

        setMousePosition({
            x,
            y
        });


        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const rotateY =
            ((mouseX - centerX) / centerX) * 10;

        const rotateX =
            ((centerY - mouseY) / centerY) * 10;

        setTilt({
            x: rotateX,
            y: rotateY
        });

    };


    // MOUSE LEAVE

    const handleMouseLeave = () => {

        setIsHovered(false);

        setMousePosition({
            x: 50,
            y: 50
        });

        setTilt({
            x: 0,
            y: 0
        });

    };


    // VIEW PRODUCT

    const handleViewProduct = () => {

        setIsEnteringWormhole(true);

        setTimeout(() => {

            navigate(`/products/${product._id}`, {
                state: {
                    from: "products"
                }
            });

        }, 900);

    };


    // ADD TO WISHLIST

    const handleAddToWishlist = async () => {

        if (
            wishlistStatus === "checking" ||
            wishlistStatus === "saving" ||
            wishlistStatus === "added"
        ) {
            return;
        }

        setWishlistStatus("saving");

        try {

            await api.post(`/wishlist/${product._id}`, {});

            setWishlistStatus("added");

        } catch (error) {

            console.log(error);

            if (error.response?.status === 409) {

                setWishlistStatus("added");

            } else {

                setWishlistStatus("error");

            }

        }

    };


    // ADD TO CART

    const handleAddToCart = async () => {

        if (
            isInCart ||
            cartStatus === "adding" ||
            product.stock === 0
        ) {
            return;
        }

        setCartStatus("adding");

        const success =
            await addToCart(product._id);

        if (success) {

            setCartStatus("added");

        } else {

            setCartStatus("error");

            setTimeout(() => {

                setCartStatus("idle");

            }, 2000);

        }

    };


    // DISCOUNT

    const discounts = [
        10,
        15,
        17,
        20,
        25,
        30
    ];

    let total = 0;

    for (
        let i = 0;
        i < product._id.length;
        i++
    ) {

        total +=
            product._id.charCodeAt(i);

    }

    const discount =
        discounts[total % discounts.length];


    // RATING

    const ratings = [
        4.2,
        4.3,
        4.4,
        4.5,
        4.6,
        4.7,
        4.8,
        4.9
    ];

    const rating =
        ratings[total % ratings.length];


    // REVIEWS

    const reviews =
        50 + (total % 450);


    // STOCK

    let stockPercentage = 0;

    if (product.stock > 0) {

        stockPercentage = Math.min(
            product.stock * 5,
            100
        );

    }


    return (
        <>

            {/* WORMHOLE ANIMATION */}

            {isEnteringWormhole && (

                <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden bg-black">

                    <div className="absolute inset-0 bg-black animate-[wormholeFade_0.9s_ease-out_forwards]"></div>

                    <div
                        className="absolute left-1/2 top-1/2"
                        style={{
                            transform:
                                "translate(-50%, -50%)"
                        }}
                    >

                        <div className="absolute -inset-[180px] rounded-full border border-blue-400/20 animate-[wormholeRing_0.9s_ease-in_forwards]"></div>

                        <div className="absolute -inset-[130px] rounded-full border border-cyan-400/30 animate-[wormholeRingReverse_0.9s_ease-in_forwards]"></div>

                        <div className="absolute -inset-[85px] rounded-full border-2 border-indigo-500/40 animate-[wormholeRing_0.9s_ease-in_forwards]"></div>

                        <div className="absolute -inset-[100px] rounded-full bg-blue-600/30 blur-[60px] animate-[wormholeGlow_0.9s_ease-in_forwards]"></div>

                        <div className="relative w-[180px] h-[180px] rounded-full bg-black border-2 border-cyan-400/60 shadow-[0_0_80px_rgba(34,211,238,0.8),0_0_150px_rgba(59,130,246,0.6)] animate-[wormholePortal_0.9s_cubic-bezier(0.22,1,0.36,1)_forwards]">

                            <div className="absolute inset-3 rounded-full border border-blue-400/40 animate-[spin_1.2s_linear_infinite]"></div>

                            <div className="absolute inset-8 rounded-full border border-indigo-400/40 animate-[spinReverse_0.8s_linear_infinite]"></div>

                            <div className="absolute inset-12 rounded-full bg-gradient-to-br from-blue-950 via-black to-cyan-950 shadow-[inset_0_0_50px_rgba(59,130,246,0.8)]"></div>

                        </div>

                        <img
                            src={product.image}
                            alt=""
                            className="absolute left-1/2 top-1/2 w-28 h-28 object-cover rounded-xl animate-[productWormhole_0.9s_cubic-bezier(0.22,1,0.36,1)_forwards]"
                            style={{
                                transform:
                                    "translate(-50%, -50%)"
                            }}
                        />

                    </div>

                    <div className="absolute left-1/2 top-1/2">

                        <span className="absolute w-2 h-2 bg-cyan-300 rounded-full animate-[particle1_0.9s_ease-in_forwards]"></span>

                        <span className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full animate-[particle2_0.9s_ease-in_forwards]"></span>

                        <span className="absolute w-2 h-2 bg-indigo-400 rounded-full animate-[particle3_0.9s_ease-in_forwards]"></span>

                        <span className="absolute w-1 h-1 bg-white rounded-full animate-[particle4_0.9s_ease-in_forwards]"></span>

                    </div>

                </div>

            )}


            {/* MAIN CARD */}

            <div
                className="h-[580px] w-full group relative"
                style={{
                    perspective: "1400px"
                }}
                onMouseEnter={() =>
                    setIsHovered(true)
                }
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
            >

                {/* GLOW */}

                <div
                    className={`absolute -inset-[2px] rounded-[18px] pointer-events-none transition-all duration-500 ${
                        isHovered
                            ? "opacity-100 blur-md"
                            : "opacity-0 blur-sm"
                    }`}
                    style={{
                        background:
                            "linear-gradient(135deg, rgba(59,130,246,0.8), rgba(99,102,241,0.6), rgba(34,211,238,0.8))"
                    }}
                ></div>


                {/* 3D CARD */}

                <div
                    className="relative w-full h-full"
                    style={{
                        transformStyle:
                            "preserve-3d",

                        transform: `
                            rotateX(${tilt.x}deg)
                            rotateY(${isHovered ? 180 + tilt.y : tilt.y}deg)
                        `,

                        transition: isHovered
                            ? "transform 0.12s ease-out"
                            : "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)"
                    }}
                >


                    {/* FRONT */}

                    <div
                        className="absolute inset-0 bg-white rounded-2xl shadow-md overflow-hidden border border-slate-200"
                        style={{
                            backfaceVisibility:
                                "hidden",

                            WebkitBackfaceVisibility:
                                "hidden"
                        }}
                    >

                        <div className="relative h-[480px] bg-slate-100 flex items-center justify-center overflow-hidden">

                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>


                            <div
                                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                                style={{
                                    opacity:
                                        isHovered
                                            ? 1
                                            : 0,

                                    background: `
                                        radial-gradient(
                                            circle 110px at
                                            ${mousePosition.x}%
                                            ${mousePosition.y}%,
                                            rgba(255,255,255,0.38),
                                            rgba(255,255,255,0.12) 35%,
                                            transparent 70%
                                        )
                                    `
                                }}
                            ></div>


                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    opacity:
                                        isHovered
                                            ? 1
                                            : 0,

                                    background: `
                                        linear-gradient(
                                            120deg,
                                            transparent 20%,
                                            rgba(255,255,255,0.28) 45%,
                                            transparent 70%
                                        )
                                    `,

                                    transform:
                                        isHovered
                                            ? "translateX(0%)"
                                            : "translateX(-100%)",

                                    transition:
                                        "transform 0.7s ease"
                                }}
                            ></div>

                        </div>


                        <div className="h-[100px] flex items-center justify-center px-5 text-center">

                            <h2 className="text-xl font-bold text-slate-900">
                                {product.name}
                            </h2>

                        </div>

                    </div>


                    {/* BACK */}

                    <div
                        className="absolute inset-0 rounded-2xl overflow-hidden text-white p-4 flex flex-col border border-blue-500/20 shadow-2xl"
                        style={{
                            backfaceVisibility:
                                "hidden",

                            WebkitBackfaceVisibility:
                                "hidden",

                            transform:
                                "rotateY(180deg)",

                            background:
                                "radial-gradient(circle at top right, rgba(59,130,246,0.25), transparent 35%), linear-gradient(135deg, #020617, #0f172a, #172554)"
                        }}
                    >

                        <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"></div>

                        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"></div>


                        <div className="relative flex-1">

                            {/* HEADER */}

                            <div
                                className="flex justify-between items-center transition-all duration-500"
                                style={{
                                    opacity:
                                        isHovered
                                            ? 1
                                            : 0,

                                    transform:
                                        isHovered
                                            ? "translateY(0)"
                                            : "translateY(15px)"
                                }}
                            >

                                <span className="text-blue-400 font-semibold uppercase tracking-[0.2em] text-xs">
                                    Product Intelligence
                                </span>

                                <span className="text-2xl">
                                    ✨
                                </span>

                            </div>


                            {/* NAME */}

                            <h2
                                className="text-2xl font-black mt-4 transition-all duration-500 delay-100"
                                style={{
                                    opacity:
                                        isHovered
                                            ? 1
                                            : 0,

                                    transform:
                                        isHovered
                                            ? "translateY(0)"
                                            : "translateY(20px)"
                                }}
                            >
                                {product.name}
                            </h2>


                            <div className="h-px bg-white/10 my-4"></div>


                            {/* PRODUCT DETAILS */}

                            <div className="space-y-3">

                                <div
                                    className="flex justify-between items-center transition-all duration-500 delay-150"
                                    style={{
                                        opacity:
                                            isHovered
                                                ? 1
                                                : 0,

                                        transform:
                                            isHovered
                                                ? "translateX(0)"
                                                : "translateX(-25px)"
                                    }}
                                >

                                    <span className="text-slate-400 text-sm">
                                        Category
                                    </span>

                                    <span className="font-semibold text-sm">
                                        {product.category}
                                    </span>

                                </div>


                                <div
                                    className="flex justify-between items-center transition-all duration-500 delay-200"
                                    style={{
                                        opacity:
                                            isHovered
                                                ? 1
                                                : 0,

                                        transform:
                                            isHovered
                                                ? "translateX(0)"
                                                : "translateX(25px)"
                                    }}
                                >

                                    <span className="text-slate-400 text-sm">
                                        Rating
                                    </span>

                                    <span className="text-sm">
                                        ⭐ {rating}
                                    </span>

                                </div>


                                <div
                                    className="flex justify-between items-center transition-all duration-500 delay-300"
                                    style={{
                                        opacity:
                                            isHovered
                                                ? 1
                                                : 0,

                                        transform:
                                            isHovered
                                                ? "translateX(0)"
                                                : "translateX(-25px)"
                                    }}
                                >

                                    <span className="text-slate-400 text-sm">
                                        Reviews
                                    </span>

                                    <span className="text-sm">
                                        {reviews}
                                    </span>

                                </div>


                                <div
                                    className="flex justify-between items-center transition-all duration-500 delay-[350ms]"
                                    style={{
                                        opacity:
                                            isHovered
                                                ? 1
                                                : 0,

                                        transform:
                                            isHovered
                                                ? "translateX(0)"
                                                : "translateX(25px)"
                                    }}
                                >

                                    <span className="text-slate-400 text-sm">
                                        Availability
                                    </span>

                                    <span className="text-green-400 text-sm">
                                        {product.stock} units
                                    </span>

                                </div>


                                <div
                                    className="flex justify-between items-center transition-all duration-500 delay-[400ms]"
                                    style={{
                                        opacity:
                                            isHovered
                                                ? 1
                                                : 0,

                                        transform:
                                            isHovered
                                                ? "translateX(0)"
                                                : "translateX(-25px)"
                                    }}
                                >

                                    <span className="text-slate-400 text-sm">
                                        Delivery
                                    </span>

                                    <span className="text-green-400 text-sm">
                                        FREE
                                    </span>

                                </div>

                            </div>


                            {/* STOCK BAR */}

                            <div
                                className="mt-4 transition-all duration-700 delay-300"
                                style={{
                                    opacity:
                                        isHovered
                                            ? 1
                                            : 0,

                                    transform:
                                        isHovered
                                            ? "translateY(0)"
                                            : "translateY(15px)"
                                }}
                            >

                                <div className="flex justify-between text-xs mb-1.5">

                                    <span className="text-slate-400">
                                        Stock Availability
                                    </span>

                                    <span className="text-green-400">
                                        {stockPercentage}%
                                    </span>

                                </div>


                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">

                                    <div
                                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-1000"
                                        style={{
                                            width:
                                                isHovered
                                                    ? `${stockPercentage}%`
                                                    : "0%"
                                        }}
                                    ></div>

                                </div>

                            </div>

                        </div>


                        {/* BOTTOM SECTION */}

                        <div className="relative mt-2">

                            {/* PRICE */}

                            <div
                                className="bg-white/[0.06] border border-white/10 rounded-xl p-2.5 mb-2 backdrop-blur-xl transition-all duration-500 delay-300"
                                style={{
                                    opacity:
                                        isHovered
                                            ? 1
                                            : 0,

                                    transform:
                                        isHovered
                                            ? "scale(1)"
                                            : "scale(0.95)"
                                }}
                            >

                                <div className="flex items-center justify-between">

                                    <div>

                                        <p className="text-slate-400 text-[10px] uppercase tracking-wider">
                                            Special Price
                                        </p>

                                        <p className="text-2xl font-black">
                                            ₹
                                            {product.price.toLocaleString(
                                                "en-IN"
                                            )}
                                        </p>

                                    </div>


                                    <div className="text-right">

                                        <p className="text-green-400 text-sm font-bold">
                                            SAVE {discount}%
                                        </p>

                                        <p className="text-[10px] text-slate-500">
                                            Limited Deal
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* WISHLIST */}

                            <button
                                onClick={handleAddToWishlist}
                                disabled={
                                    wishlistStatus === "checking" ||
                                    wishlistStatus === "saving" ||
                                    wishlistStatus === "added"
                                }
                                className={`relative w-full py-2.5 rounded-xl font-bold transition-all duration-300 mb-1.5 border overflow-hidden ${
                                    wishlistStatus === "added"
                                        ? "bg-pink-500/15 border-pink-400/30 text-pink-300"
                                        : wishlistStatus === "error"
                                        ? "bg-red-500/15 border-red-400/30 text-red-300"
                                        : wishlistStatus === "checking"
                                        ? "bg-white/[0.04] border-white/10 text-slate-400 cursor-wait"
                                        : "bg-white/[0.06] border-white/10 text-white hover:bg-white/[0.12] hover:border-pink-400/30"
                                }`}
                            >

                                {wishlistStatus === "checking" && (
                                    <span>
                                        ⏳ Checking Wishlist...
                                    </span>
                                )}

                                {wishlistStatus === "saving" && (
                                    <span>
                                        ⏳ Saving...
                                    </span>
                                )}

                                {wishlistStatus === "added" && (
                                    <span>
                                        ♥ Added to Wishlist
                                    </span>
                                )}

                                {wishlistStatus === "error" && (
                                    <span>
                                        ⚠ Failed — Try Again
                                    </span>
                                )}

                                {wishlistStatus === "idle" && (
                                    <span>
                                        ♡ Add to Wishlist
                                    </span>
                                )}

                            </button>


                            {/* ADD TO CART */}

                            <button
                                onClick={handleAddToCart}
                                disabled={
                                    product.stock === 0 ||
                                    cartStatus === "adding" ||
                                    isInCart
                                }
                                className={`relative w-full py-2.5 rounded-xl font-bold transition-all duration-300 mb-1.5 border overflow-hidden ${
                                    product.stock === 0
                                        ? "bg-red-500/10 border-red-500/20 text-red-400 cursor-not-allowed"
                                        : isInCart
                                        ? "bg-green-500/15 border-green-400/30 text-green-300 cursor-not-allowed"
                                        : cartStatus === "error"
                                        ? "bg-red-500/15 border-red-400/30 text-red-300"
                                        : "bg-blue-500/10 border-blue-400/30 text-blue-300 hover:bg-blue-500/20"
                                }`}
                            >

                                {product.stock === 0 && (
                                    <span>
                                        Out of Stock
                                    </span>
                                )}

                                {product.stock > 0 &&
                                    cartStatus === "adding" && (
                                        <span>
                                            ⏳ Adding...
                                        </span>
                                    )}

                                {product.stock > 0 &&
                                    isInCart && (
                                        <span>
                                            ✓ Added to Cart
                                        </span>
                                    )}

                                {product.stock > 0 &&
                                    !isInCart &&
                                    cartStatus === "error" && (
                                        <span>
                                            ⚠ Failed — Try Again
                                        </span>
                                    )}

                                {product.stock > 0 &&
                                    !isInCart &&
                                    cartStatus === "idle" && (
                                        <span>
                                            🛒 Add to Cart
                                        </span>
                                    )}

                            </button>


                            {/* VIEW PRODUCT */}

                            <button
                                onClick={handleViewProduct}
                                className="relative w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-2.5 rounded-xl font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/20 overflow-hidden"
                            >

                                <span className="relative z-10">
                                    View Product →
                                </span>

                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700"></div>

                            </button>

                        </div>

                    </div>

                </div>

            </div>


            {/* ANIMATIONS */}

            <style>
                {`
                    @keyframes spinReverse {
                        from {
                            transform: rotate(360deg);
                        }

                        to {
                            transform: rotate(0deg);
                        }
                    }

                    @keyframes wormholeRing {
                        0% {
                            transform: scale(0.2) rotate(0deg);
                            opacity: 0;
                        }

                        40% {
                            opacity: 1;
                        }

                        100% {
                            transform: scale(4) rotate(720deg);
                            opacity: 0;
                        }
                    }

                    @keyframes wormholeRingReverse {
                        0% {
                            transform: scale(0.4) rotate(360deg);
                            opacity: 0;
                        }

                        40% {
                            opacity: 1;
                        }

                        100% {
                            transform: scale(3.5) rotate(-720deg);
                            opacity: 0;
                        }
                    }

                    @keyframes wormholeGlow {
                        0% {
                            transform: scale(0.3);
                            opacity: 0;
                        }

                        40% {
                            opacity: 1;
                        }

                        100% {
                            transform: scale(5);
                            opacity: 0;
                        }
                    }

                    @keyframes wormholePortal {
                        0% {
                            transform: scale(0.1) rotate(0deg);
                            opacity: 0;
                        }

                        25% {
                            opacity: 1;
                        }

                        100% {
                            transform: scale(8) rotate(180deg);
                            opacity: 0;
                        }
                    }

                    @keyframes productWormhole {
                        0% {
                            transform: translate(-50%, -50%) scale(1) rotate(0deg);
                            opacity: 1;
                        }

                        35% {
                            transform: translate(-50%, -50%) scale(1.4) rotate(10deg);
                            opacity: 1;
                        }

                        100% {
                            transform: translate(-50%, -50%) scale(0.05) rotate(720deg);
                            opacity: 0;
                        }
                    }

                    @keyframes wormholeFade {
                        0% {
                            opacity: 0;
                        }

                        20% {
                            opacity: 1;
                        }

                        100% {
                            opacity: 1;
                        }
                    }

                    @keyframes particle1 {
                        0% {
                            transform: translate(0, 0) scale(1);
                            opacity: 1;
                        }

                        100% {
                            transform: translate(-300px, -250px) scale(0);
                            opacity: 0;
                        }
                    }

                    @keyframes particle2 {
                        0% {
                            transform: translate(0, 0) scale(1);
                            opacity: 1;
                        }

                        100% {
                            transform: translate(300px, -180px) scale(0);
                            opacity: 0;
                        }
                    }

                    @keyframes particle3 {
                        0% {
                            transform: translate(0, 0) scale(1);
                            opacity: 1;
                        }

                        100% {
                            transform: translate(-250px, 250px) scale(0);
                            opacity: 0;
                        }
                    }

                    @keyframes particle4 {
                        0% {
                            transform: translate(0, 0) scale(1);
                            opacity: 1;
                        }

                        100% {
                            transform: translate(280px, 230px) scale(0);
                            opacity: 0;
                        }
                    }
                `}
            </style>

        </>
    );
};

export default ProductCard;