import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import api from "../services/api";

const Products = () => {
    const [products, setProducts] = useState([]);

    const [search, setSearch] = useState(
        localStorage.getItem("productSearch") || ""
    );

    const [category, setCategory] = useState(
        localStorage.getItem("productCategory") || ""
    );

    const [sort, setSort] = useState(
        localStorage.getItem("productSort") || "featured"
    );

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [mysteryUnlocked, setMysteryUnlocked] = useState(false);

    const [scrollY, setScrollY] = useState(0);
    const [categoryChanging, setCategoryChanging] = useState(false);

    const [dnaScanner, setDnaScanner] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [scannedProduct, setScannedProduct] = useState(null);

    useEffect(() => {
        localStorage.setItem("productSearch", search);
    }, [search]);

    useEffect(() => {
        localStorage.setItem("productCategory", category);
    }, [category]);

    useEffect(() => {
        localStorage.setItem("productSort", sort);
    }, [sort]);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(false);

                const response = await api.get("/products", {
                    params: {
                        search: search,
                        category: category
                    }
                });

                setProducts(response.data.products);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setError(true);
                setLoading(false);
            }
        };

        fetchProducts();
    }, [search, category]);

    let sortedProducts = [...products];

    if (sort === "low") {
        sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
        sortedProducts.sort((a, b) => b.price - a.price);
    } else if (sort === "newest") {
        sortedProducts.reverse();
    }

    const handleCategoryChange = (newCategory) => {
        setCategoryChanging(true);
        setCategory(newCategory);

        setTimeout(() => {
            setCategoryChanging(false);
        }, 700);
    };

    const clearFilters = () => {
        setSearch("");
        handleCategoryChange("");
    };

    const openDNAScanner = () => {
        setScannedProduct(null);
        setScanning(false);
        setDnaScanner(true);
    };

    const scanProductDNA = (product) => {
        setScannedProduct(product);
        setScanning(true);

        setTimeout(() => {
            setScanning(false);
        }, 2200);
    };

    const closeScanner = () => {
        setDnaScanner(false);
        setScanning(false);
        setScannedProduct(null);
    };

    const backToProductSelection = () => {
        setScannedProduct(null);
        setScanning(false);
    };

    const getBaseValue = (product) => {
        return (
            product._id
                ?.split("")
                .reduce(
                    (sum, char) => sum + char.charCodeAt(0),
                    0
                ) || 20
        );
    };

    const getRating = (product) => {
        const value = getBaseValue(product);

        return (4 + (value % 10) / 10).toFixed(1);
    };

    const getReviews = (product) => {
        const value = getBaseValue(product);

        return 100 + (value % 1900);
    };

    const getStock = (product) => {
        if (typeof product.stock === "number") {
            return product.stock;
        }

        const value = getBaseValue(product);

        return 5 + (value % 46);
    };

    const getDiscount = (product) => {
        const value = getBaseValue(product);

        return 10 + (value % 31);
    };

    const getValueScore = (product) => {
        const rating = Number(getRating(product));
        const discount = getDiscount(product);

        return Math.min(
            99,
            Math.round(rating * 12 + discount * 0.9)
        );
    };

    const getPriceScore = (product) => {
        const price = Number(product.price) || 0;

        if (price <= 500) {
            return 95;
        }

        if (price <= 1000) {
            return 85;
        }

        if (price <= 2500) {
            return 75;
        }

        if (price <= 5000) {
            return 65;
        }

        return 55;
    };

    const getStockPercentage = (product) => {
        return Math.min(
            100,
            Math.max(10, getStock(product) * 2)
        );
    };

    const getQualityScore = (product) => {
        const rating = Number(getRating(product));

        return Math.min(
            99,
            Math.round(rating * 19)
        );
    };

    const getPopularityScore = (product) => {
        const reviews = getReviews(product);

        return Math.min(
            99,
            Math.round(50 + reviews / 40)
        );
    };

    const getGeneticTraits = (product) => {
        const value = getBaseValue(product);

        const traits = [
            {
                label: "Premium",
                icon: "💎"
            },
            {
                label: "Trending",
                icon: "🔥"
            },
            {
                label: "Practical",
                icon: "⚡"
            },
            {
                label: "Popular",
                icon: "👑"
            },
            {
                label: "Value Pick",
                icon: "💰"
            },
            {
                label: "Fast Moving",
                icon: "🚀"
            }
        ];

        const first = traits[value % traits.length];
        const second =
            traits[(value + 2) % traits.length];
        const third =
            traits[(value + 4) % traits.length];

        return [first, second, third];
    };

    const getGeneticType = (product) => {
        const score = getValueScore(product);

        if (score >= 90) {
            return "Elite Performer";
        }

        if (score >= 80) {
            return "High Value Species";
        }

        if (score >= 70) {
            return "Balanced Performer";
        }

        return "Everyday Essential";
    };

    const backgroundImages = {
        default:
            "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=2400&q=90",

        Electronics:
            "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2400&q=90",

        Clothing:
            "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=2400&q=90",

        Books:
            "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=2400&q=90",

        Home:
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2400&q=90",

        Other:
            "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=2400&q=90"
    };

    const backgroundImage =
        backgroundImages[category] ||
        backgroundImages.default;

    const categoryTitles = {
        "": "Everything You Love",
        Electronics: "Smart Electronics",
        Clothing: "Fashion & Style",
        Books: "Books & Knowledge",
        Home: "Home & Living",
        Other: "Something Different"
    };

    const categoryTitle =
        categoryTitles[category] ||
        "Everything You Love";

    return (
        <div className="min-h-screen bg-slate-950 text-white relative overflow-x-hidden">

            {/* BACKGROUND */}

            <div
                key={category}
                className={`fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-out ${
                    categoryChanging
                        ? "opacity-0 scale-110"
                        : "opacity-100 scale-[1.03]"
                }`}
                style={{
                    backgroundImage: `url("${backgroundImage}")`,
                    backgroundPosition: `center ${scrollY * 0.18}px`,
                    transitionProperty:
                        "opacity, transform, background-position"
                }}
            />

            <div className="fixed inset-0 z-0 pointer-events-none">

                <div className="absolute inset-0 bg-slate-950/75" />

                <div className="absolute inset-0 bg-blue-950/20" />

            </div>

            <div
                className="fixed inset-0 z-0 pointer-events-none"
                style={{
                    transform: `translateY(${scrollY * 0.04}px)`
                }}
            >
                <div className="absolute inset-0 bg-blue-900/10" />
            </div>

            <div
                className={`fixed inset-0 z-50 pointer-events-none bg-white transition-opacity duration-700 ${
                    categoryChanging
                        ? "opacity-[0.04]"
                        : "opacity-0"
                }`}
            />

            <div className="relative z-10">

                <Navbar />

                <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">

                    {/* HERO */}

                    <div
                        className={`relative overflow-hidden rounded-[2rem] p-8 sm:p-12 mb-10 border border-white/10 bg-black/30 backdrop-blur-xl transition-all duration-700 ${
                            categoryChanging
                                ? "opacity-0 translate-y-5 scale-[0.98]"
                                : "opacity-100 translate-y-0 scale-100"
                        }`}
                    >

                        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />

                        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />

                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10" />

                        <div className="relative max-w-4xl">

                            <p className="text-cyan-300 font-semibold mb-3 uppercase tracking-[0.25em] text-sm">
                                ShopKart Store
                            </p>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
                                {categoryTitle}
                            </h1>

                            <p className="text-slate-300 text-base sm:text-lg mt-5 max-w-2xl leading-7">
                                Discover products curated for your everyday
                                life. Search, explore and find something
                                worth taking home.
                            </p>

                            <div className="flex flex-wrap gap-3 mt-8">

                                <button
                                    onClick={() => {
                                        document
                                            .getElementById(
                                                "product-section"
                                            )
                                            ?.scrollIntoView({
                                                behavior: "smooth"
                                            });
                                    }}
                                    className="px-7 py-3.5 rounded-full bg-white text-slate-950 font-bold hover:scale-105 transition-all duration-300 shadow-xl"
                                >
                                    Explore Products ↓
                                </button>

                                <button
                                    onClick={openDNAScanner}
                                    disabled={
                                        sortedProducts.length === 0
                                    }
                                    className="group relative overflow-hidden px-7 py-3.5 rounded-full bg-black/40 border border-cyan-400/30 backdrop-blur-xl text-white font-semibold transition-all duration-300 hover:border-cyan-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(34,211,238,0.25)] disabled:opacity-40 disabled:hover:scale-100"
                                >

                                    <span className="relative z-10 flex items-center gap-2">

                                        <span className="text-xl group-hover:animate-pulse">
                                            🧬
                                        </span>

                                        Scan Product DNA

                                    </span>

                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                                </button>

                                {!mysteryUnlocked ? (

                                    <button
                                        onClick={() =>
                                            setMysteryUnlocked(true)
                                        }
                                        className="px-6 py-3.5 rounded-full bg-black/30 border border-white/10 backdrop-blur-xl font-bold hover:bg-black/50 transition"
                                    >
                                        🔐 Mystery Deal
                                    </button>

                                ) : (

                                    <div className="px-5 py-3 rounded-full bg-white/10 border border-white/10 backdrop-blur-xl">

                                        <p className="text-yellow-300 font-bold text-sm">
                                            🎉 MYSTERY DEAL
                                        </p>

                                        <p className="font-black">
                                            Extra 30% OFF
                                        </p>

                                    </div>

                                )}

                            </div>

                        </div>

                    </div>

                    {/* PRODUCT HEADER */}

                    <div
                        id="product-section"
                        className="mb-8 scroll-mt-24"
                    >

                        <p className="text-cyan-400 font-semibold mb-2 uppercase tracking-wider text-sm">
                            Our Collection
                        </p>

                        <h2 className="text-3xl sm:text-4xl font-black">
                            Explore Products
                        </h2>

                        <p className="text-slate-400 mt-3">
                            Find the perfect products for you.
                        </p>

                    </div>

                    {/* SEARCH */}

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-8 backdrop-blur-xl">

                        <SearchBar
                            search={search}
                            setSearch={setSearch}
                            category={category}
                            setCategory={handleCategoryChange}
                            sort={sort}
                            setSort={setSort}
                            products={products}
                        />

                    </div>

                    {/* ACTIVE FILTERS */}

                    {(search || category) && (

                        <div className="flex flex-wrap items-center gap-2 mb-6">

                            <span className="text-slate-400 text-sm">
                                Active filters:
                            </span>

                            {search && (

                                <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1.5 rounded-full text-sm">
                                    🔍 {search}
                                </span>

                            )}

                            {category && (

                                <span className="bg-violet-500/10 border border-violet-500/20 text-violet-400 px-3 py-1.5 rounded-full text-sm">
                                    📁 {category}
                                </span>

                            )}

                            <button
                                onClick={clearFilters}
                                className="text-sm text-red-400 hover:text-red-300 ml-2 transition"
                            >
                                Clear All
                            </button>

                        </div>

                    )}

                    {/* LOADING */}

                    {loading && (

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                            {Array.from({
                                length: 8
                            }).map((_, index) => (

                                <div
                                    key={index}
                                    className="bg-white/10 rounded-2xl overflow-hidden border border-white/10 animate-pulse"
                                >

                                    <div className="h-56 bg-white/10" />

                                    <div className="p-5">

                                        <div className="h-4 w-24 bg-white/10 rounded mb-4" />

                                        <div className="h-6 w-4/5 bg-white/10 rounded" />

                                        <div className="h-5 w-32 bg-white/10 rounded mt-4" />

                                        <div className="h-12 w-full bg-white/10 rounded-xl mt-6" />

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                    {/* ERROR */}

                    {error && (

                        <div className="py-20 text-center">

                            <div className="text-6xl mb-5">
                                ⚠️
                            </div>

                            <p className="text-red-400 text-lg font-semibold">
                                Something went wrong.
                            </p>

                            <p className="text-slate-500 mt-2">
                                Unable to load products.
                            </p>

                        </div>

                    )}

                    {/* EMPTY */}

                    {!loading &&
                        !error &&
                        sortedProducts.length === 0 && (

                            <div className="relative min-h-[430px] flex items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">

                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10" />

                                <div className="relative text-center px-6">

                                    <div className="text-6xl mb-6">
                                        🔍
                                    </div>

                                    <p className="text-xs uppercase tracking-[0.3em] text-blue-400 font-semibold mb-3">
                                        Search complete
                                    </p>

                                    <h2 className="text-3xl sm:text-4xl font-black">
                                        Nothing Found
                                    </h2>

                                    <p className="text-slate-400 mt-4 max-w-md mx-auto">
                                        We couldn't find products matching
                                        your current filters.
                                    </p>

                                    <button
                                        onClick={clearFilters}
                                        className="mt-7 px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-bold hover:scale-105 transition-all"
                                    >
                                        ↻ Clear Filters
                                    </button>

                                </div>

                            </div>

                        )}

                    {/* PRODUCTS */}

                    {!loading &&
                        !error &&
                        sortedProducts.length > 0 && (

                            <>

                                <div className="flex items-center justify-between mb-5">

                                    <p className="text-slate-400">

                                        Showing{" "}

                                        <span className="text-white font-semibold">
                                            {sortedProducts.length}
                                        </span>{" "}

                                        products

                                    </p>

                                    <p className="text-xs text-slate-500 hidden sm:block">
                                        Hover a card to flip it ✨
                                    </p>

                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                                    {sortedProducts.map(
                                        (product, index) => (

                                            <div
                                                key={product._id}
                                                className="animate-[fadeInUp_0.6s_ease-out_both]"
                                                style={{
                                                    animationDelay:
                                                        `${index * 70}ms`
                                                }}
                                            >

                                                <ProductCard
                                                    product={product}
                                                />

                                            </div>

                                        )
                                    )}

                                </div>

                            </>

                        )}

                </div>

            </div>

            {/* ================================================= */}
            {/* PRODUCT GENETIC PROFILE */}
            {/* ================================================= */}

            {dnaScanner && (

                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6">

                    {/* BACKDROP */}

                    <div
                        className="absolute inset-0 bg-slate-950/95 backdrop-blur-2xl"
                        onClick={closeScanner}
                    />

                    {/* AMBIENT GLOW */}

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />

                    <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

                    {/* GRID */}

                    <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
                        <div
                            className="w-full h-full"
                            style={{
                                backgroundImage:
                                    "linear-gradient(rgba(34,211,238,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.7) 1px, transparent 1px)",
                                backgroundSize: "45px 45px"
                            }}
                        />
                    </div>

                    {/* MODAL */}

                    <div className="relative w-full max-w-6xl max-h-[92vh] overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-slate-950/95 shadow-[0_0_120px_rgba(34,211,238,0.15)]">

                        {/* HEADER */}

                        <div className="relative flex items-center justify-between px-6 py-5 border-b border-white/10">

                            <div>

                                <p className="text-cyan-400 text-[10px] sm:text-xs uppercase tracking-[0.35em] font-bold">
                                    ShopKart Intelligence System
                                </p>

                                <h2 className="text-xl sm:text-2xl font-black mt-1">
                                    🧬 Product Genetic Profile
                                </h2>

                            </div>

                            <button
                                onClick={closeScanner}
                                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-400/30 transition-all"
                            >
                                ✕
                            </button>

                        </div>

                        {/* ================================================= */}
                        {/* PRODUCT SELECTION */}
                        {/* ================================================= */}

                        {!scannedProduct && (

                            <div className="p-6 md:p-10">

                                <p className="text-cyan-400 text-xs uppercase tracking-[0.3em] font-bold">
                                    Genetic Database
                                </p>

                                <h2 className="text-3xl md:text-4xl font-black mt-2">
                                    Select a Product
                                </h2>

                                <p className="text-slate-400 mt-2 mb-8">
                                    Choose any product to decode its unique
                                    genetic profile.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-h-[62vh] overflow-y-auto pr-2">

                                    {sortedProducts.map((product) => (

                                        <button
                                            key={product._id}
                                            onClick={() =>
                                                scanProductDNA(product)
                                            }
                                            className="group text-left p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-400/[0.04] transition-all duration-300 hover:-translate-y-1"
                                        >

                                            <div className="h-40 rounded-xl bg-white flex items-center justify-center overflow-hidden mb-4">

                                                {product.image ? (

                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                                    />

                                                ) : (

                                                    <span className="text-5xl">
                                                        📦
                                                    </span>

                                                )}

                                            </div>

                                            <p className="text-white font-bold truncate">
                                                {product.name}
                                            </p>

                                            <p className="text-slate-500 text-sm mt-1">
                                                {product.category}
                                            </p>

                                            <div className="flex items-center justify-between mt-3">

                                                <span className="font-black">
                                                    ₹
                                                    {product.price?.toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </span>

                                                <span className="text-cyan-400 text-sm font-semibold group-hover:translate-x-1 transition-transform">
                                                    Decode DNA →
                                                </span>

                                            </div>

                                        </button>

                                    ))}

                                </div>

                            </div>

                        )}

                        {/* ================================================= */}
                        {/* SCANNING */}
                        {/* ================================================= */}

                        {scannedProduct && scanning && (

                            <div className="min-h-[650px] flex flex-col items-center justify-center p-8 relative overflow-hidden">

                                {/* DNA RINGS */}

                                <div className="absolute w-[420px] h-[420px] rounded-full border border-cyan-400/10 animate-[spin_15s_linear_infinite]" />

                                <div className="absolute w-[350px] h-[350px] rounded-full border border-purple-400/10 animate-[spin_10s_linear_infinite_reverse]" />

                                <div className="absolute w-[280px] h-[280px] rounded-full border border-cyan-300/10" />

                                {/* DNA HELIX */}

                                <div className="relative w-48 h-64 mb-8">

                                    <div className="absolute left-1/2 top-0 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-cyan-400 via-purple-400 to-cyan-400 blur-sm opacity-50" />

                                    <div className="absolute inset-0 flex items-center justify-center">

                                        <div className="w-24 h-56 relative animate-[dnaFloat_2s_ease-in-out_infinite]">

                                            <div className="absolute inset-0 border-l-4 border-cyan-400 rounded-[50%] rotate-[15deg] shadow-[0_0_20px_rgba(34,211,238,0.7)]" />

                                            <div className="absolute inset-0 border-r-4 border-purple-400 rounded-[50%] -rotate-[15deg] shadow-[0_0_20px_rgba(168,85,247,0.7)]" />

                                            {[0, 1, 2, 3, 4, 5, 6].map(
                                                (item) => (
                                                    <div
                                                        key={item}
                                                        className="absolute left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-cyan-400 via-white to-purple-400 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.8)]"
                                                        style={{
                                                            top: `${item * 16}%`,
                                                            transform: `translateX(-50%) rotate(${item % 2 === 0 ? "-8deg" : "8deg"})`
                                                        }}
                                                    />
                                                )
                                            )}

                                        </div>

                                    </div>

                                </div>

                                <p className="text-cyan-400 text-xs uppercase tracking-[0.4em] font-bold animate-pulse">
                                    Sequencing Product DNA
                                </p>

                                <h3 className="text-2xl font-black mt-3 text-center">
                                    {scannedProduct.name}
                                </h3>

                                <div className="w-full max-w-md h-2 bg-white/10 rounded-full mt-8 overflow-hidden">

                                    <div className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full animate-[dnaProgress_2.2s_ease-out_forwards]" />

                                </div>

                                <div className="flex gap-5 mt-6 text-[10px] uppercase tracking-widest text-slate-500">

                                    <span className="animate-pulse">
                                        Price
                                    </span>

                                    <span className="animate-pulse">
                                        Quality
                                    </span>

                                    <span className="animate-pulse">
                                        Popularity
                                    </span>

                                    <span className="animate-pulse">
                                        Value
                                    </span>

                                </div>

                            </div>

                        )}

                        {/* ================================================= */}
                        {/* GENETIC PROFILE RESULT */}
                        {/* ================================================= */}

                        {scannedProduct && !scanning && (

                            <div className="max-h-[78vh] overflow-y-auto">

                                <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 p-6 md:p-10">

                                    {/* LEFT DNA VISUAL */}

                                    <div className="relative min-h-[520px] flex items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500/[0.04] via-transparent to-purple-500/[0.05] border border-white/5">

                                        {/* ORBIT RINGS */}

                                        <div className="absolute w-[390px] h-[390px] rounded-full border border-cyan-400/10 animate-[spin_18s_linear_infinite]" />

                                        <div className="absolute w-[320px] h-[320px] rounded-full border border-purple-400/10 animate-[spin_12s_linear_infinite_reverse]" />

                                        <div className="absolute w-[250px] h-[250px] rounded-full border border-cyan-400/10" />

                                        {/* GLOW */}

                                        <div className="absolute w-56 h-56 rounded-full bg-cyan-400/10 blur-[70px]" />

                                        {/* DNA HELIX */}

                                        <div className="relative w-52 h-72 animate-[dnaFloat_3s_ease-in-out_infinite]">

                                            <div className="absolute inset-0 border-l-[5px] border-cyan-400 rounded-[50%] rotate-[16deg] shadow-[0_0_30px_rgba(34,211,238,0.5)]" />

                                            <div className="absolute inset-0 border-r-[5px] border-purple-400 rounded-[50%] -rotate-[16deg] shadow-[0_0_30px_rgba(168,85,247,0.5)]" />

                                            {Array.from({
                                                length: 9
                                            }).map((_, index) => (

                                                <div
                                                    key={index}
                                                    className="absolute left-1/2 -translate-x-1/2 w-28 h-1.5 rounded-full bg-gradient-to-r from-cyan-400 via-white to-purple-400 shadow-[0_0_15px_rgba(34,211,238,0.7)]"
                                                    style={{
                                                        top: `${index * 11}%`,
                                                        transform: `translateX(-50%) rotate(${index % 2 === 0 ? "-10deg" : "10deg"})`
                                                    }}
                                                />

                                            ))}

                                        </div>

                                        {/* PRODUCT IMAGE */}

                                        <div className="absolute z-20">

                                            <div className="w-36 h-36 rounded-3xl bg-white flex items-center justify-center shadow-[0_0_60px_rgba(34,211,238,0.25)] border-4 border-cyan-300/30">

                                                {scannedProduct.image ? (

                                                    <img
                                                        src={
                                                            scannedProduct.image
                                                        }
                                                        alt={
                                                            scannedProduct.name
                                                        }
                                                        className="w-full h-full object-contain p-4 rounded-3xl"
                                                    />

                                                ) : (

                                                    <span className="text-5xl">
                                                        📦
                                                    </span>

                                                )}

                                            </div>

                                        </div>

                                        {/* TOP LABEL */}

                                        <div className="absolute top-6 left-6">

                                            <p className="text-cyan-400 text-[10px] uppercase tracking-[0.3em] font-bold">
                                                Genetic Sequence
                                            </p>

                                            <p className="text-slate-500 text-xs mt-1">
                                                VERIFIED ✓
                                            </p>

                                        </div>

                                        {/* DNA ID */}

                                        <div className="absolute bottom-6 left-6 right-6">

                                            <div className="flex items-end justify-between">

                                                <div>

                                                    <p className="text-slate-500 text-[10px] uppercase tracking-widest">
                                                        Classification
                                                    </p>

                                                    <p className="text-white font-black mt-1">
                                                        {getGeneticType(
                                                            scannedProduct
                                                        )}
                                                    </p>

                                                </div>

                                                <div className="text-right">

                                                    <p className="text-slate-500 text-[10px] uppercase tracking-widest">
                                                        DNA ID
                                                    </p>

                                                    <p className="text-cyan-400 font-mono text-xs mt-1">
                                                        SK-
                                                        {String(
                                                            getBaseValue(
                                                                scannedProduct
                                                            )
                                                        ).slice(-6)}
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                    {/* RIGHT PROFILE */}

                                    <div>

                                        <p className="text-cyan-400 text-xs uppercase tracking-[0.3em] font-bold">
                                            Genetic Profile Decoded
                                        </p>

                                        <h3 className="text-3xl sm:text-4xl font-black mt-2 leading-tight">
                                            {scannedProduct.name}
                                        </h3>

                                        <div className="flex items-center gap-2 mt-3">

                                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400">
                                                {scannedProduct.category}
                                            </span>

                                            <span className="px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-xs text-cyan-400">
                                                DNA MATCH
                                            </span>

                                        </div>

                                        {/* TRAITS */}

                                        <div className="mt-6">

                                            <p className="text-slate-500 text-[10px] uppercase tracking-[0.25em] font-bold mb-3">
                                                Product Traits
                                            </p>

                                            <div className="flex flex-wrap gap-2">

                                                {getGeneticTraits(
                                                    scannedProduct
                                                ).map(
                                                    (trait, index) => (

                                                        <span
                                                            key={index}
                                                            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold animate-[traitReveal_0.5s_ease-out_both]"
                                                            style={{
                                                                animationDelay: `${index * 150}ms`
                                                            }}
                                                        >
                                                            {
                                                                trait.icon
                                                            }{" "}
                                                            {
                                                                trait.label
                                                            }
                                                        </span>

                                                    )
                                                )}

                                            </div>

                                        </div>

                                        {/* DNA STATS */}

                                        <div className="mt-7 space-y-5">

                                            <GeneticStat
                                                icon="💰"
                                                label="PRICE DNA"
                                                value={`₹${Number(
                                                    scannedProduct.price || 0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}`}
                                                percentage={getPriceScore(
                                                    scannedProduct
                                                )}
                                            />

                                            <GeneticStat
                                                icon="💎"
                                                label="QUALITY DNA"
                                                value={`${getQualityScore(
                                                    scannedProduct
                                                )}%`}
                                                percentage={getQualityScore(
                                                    scannedProduct
                                                )}
                                            />

                                            <GeneticStat
                                                icon="🔥"
                                                label="POPULARITY DNA"
                                                value={`${getPopularityScore(
                                                    scannedProduct
                                                )}%`}
                                                percentage={getPopularityScore(
                                                    scannedProduct
                                                )}
                                            />

                                            <GeneticStat
                                                icon="🧠"
                                                label="VALUE DNA"
                                                value={`${getValueScore(
                                                    scannedProduct
                                                )}/100`}
                                                percentage={getValueScore(
                                                    scannedProduct
                                                )}
                                            />

                                            <GeneticStat
                                                icon="📦"
                                                label="STOCK DNA"
                                                value={`${getStock(
                                                    scannedProduct
                                                )} units`}
                                                percentage={getStockPercentage(
                                                    scannedProduct
                                                )}
                                            />

                                        </div>

                                        {/* INFO GRID */}

                                        <div className="grid grid-cols-2 gap-3 mt-7">

                                            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">

                                                <p className="text-slate-500 text-[10px] uppercase tracking-widest">
                                                    Rating
                                                </p>

                                                <p className="text-2xl font-black mt-1">
                                                    ⭐{" "}
                                                    {getRating(
                                                        scannedProduct
                                                    )}
                                                </p>

                                            </div>

                                            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">

                                                <p className="text-slate-500 text-[10px] uppercase tracking-widest">
                                                    Reviews
                                                </p>

                                                <p className="text-2xl font-black mt-1">
                                                    {getReviews(
                                                        scannedProduct
                                                    ).toLocaleString()}
                                                </p>

                                            </div>

                                        </div>

                                        {/* DELIVERY */}

                                        <div className="mt-3 p-4 rounded-2xl bg-green-400/[0.05] border border-green-400/10 flex items-center justify-between">

                                            <div className="flex items-center gap-3">

                                                <div className="w-10 h-10 rounded-full bg-green-400/10 flex items-center justify-center">
                                                    🚚
                                                </div>

                                                <div>

                                                    <p className="font-bold text-sm">
                                                        Fast Delivery
                                                    </p>

                                                    <p className="text-xs text-slate-500">
                                                        Ready for dispatch
                                                    </p>

                                                </div>

                                            </div>

                                            <span className="text-green-400 text-xs font-bold">
                                                AVAILABLE
                                            </span>

                                        </div>

                                        {/* ACTIONS */}

                                        <div className="flex gap-3 mt-6">

                                            <button
                                                onClick={
                                                    backToProductSelection
                                                }
                                                className="flex-1 px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-400/20 transition font-semibold"
                                            >
                                                ← Scan Another
                                            </button>

                                            <button
                                                onClick={closeScanner}
                                                className="flex-1 px-5 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:scale-[1.02] transition font-black shadow-[0_0_25px_rgba(34,211,238,0.2)]"
                                            >
                                                Profile Complete ✓
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        )}

                    </div>

                </div>

            )}

            {/* ANIMATIONS */}

            <style>
                {`
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(25px);
                        }

                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    @keyframes dnaProgress {
                        from {
                            width: 0%;
                        }

                        to {
                            width: 100%;
                        }
                    }

                    @keyframes dnaFloat {
                        0% {
                            transform: translateY(0px);
                        }

                        50% {
                            transform: translateY(-12px);
                        }

                        100% {
                            transform: translateY(0px);
                        }
                    }

                    @keyframes traitReveal {
                        from {
                            opacity: 0;
                            transform: translateY(10px) scale(0.95);
                        }

                        to {
                            opacity: 1;
                            transform: translateY(0) scale(1);
                        }
                    }
                `}
            </style>

        </div>
    );
};

const GeneticStat = ({
    icon,
    label,
    value,
    percentage
}) => {

    return (
        <div>

            <div className="flex items-center justify-between mb-2">

                <div className="flex items-center gap-2">

                    <span className="text-lg">
                        {icon}
                    </span>

                    <span className="text-xs font-bold tracking-widest text-slate-400">
                        {label}
                    </span>

                </div>

                <span className="text-sm font-black text-white">
                    {value}
                </span>

            </div>

            <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">

                <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full transition-all duration-1000"
                    style={{
                        width: `${Math.max(
                            5,
                            Math.min(
                                100,
                                percentage || 5
                            )
                        )}%`
                    }}
                />

                <div
                    className="absolute inset-y-0 left-0 bg-white/30 rounded-full blur-sm"
                    style={{
                        width: `${Math.max(
                            5,
                            Math.min(
                                100,
                                percentage || 5
                            )
                        )}%`
                    }}
                />

            </div>

        </div>
    );
};

export default Products;    