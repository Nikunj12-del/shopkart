
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../../../client/shopkart-frontend/src/context/CartContext";
import api from "./api";

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { totalItems } = useCart();

    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [yesPosition, setYesPosition] = useState({
        top: "50%",
        left: "58%",
    });

    const timerRef = useRef(null);

    const navigationLinks = [
        {
            label: "Home",
            path: "/home",
            icon: "⌂",
        },
        {
            label: "Products",
            path: "/products",
            icon: "▦",
        },
        {
            label: "Wishlist",
            path: "/wishlist",
            icon: "♡",
        },
        {
            label: "My Orders",
            path: "/orders",
            icon: "▤",
        },
    ];

    const isActive = (path) => {
        if (path === "/home") {
            return location.pathname === "/home";
        }

        return location.pathname.startsWith(path);
    };

    const handleNavigation = (path) => {
        navigate(path);
        setIsMobileMenuOpen(false);
    };

    const logout = async () => {
        try {
            await api.post("/customers/logout", {});

            closeModal();
            setIsMobileMenuOpen(false);
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const resetYesPosition = () => {
        setYesPosition({
            top: "50%",
            left: "58%",
        });
    };

    const closeModal = () => {
        setShowLogoutModal(false);
        setIsRunning(false);

        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        resetYesPosition();
    };

    const startRunning = () => {
        if (timerRef.current) {
            return;
        }

        setIsRunning(true);

        timerRef.current = setTimeout(() => {
            setIsRunning(false);
            resetYesPosition();
            timerRef.current = null;
        }, 15000);
    };

    const handleYesMouseEnter = (event) => {
        startRunning();

        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();

        const buttonCenterX = rect.left + rect.width / 2;
        const buttonCenterY = rect.top + rect.height / 2;

        let directionX = buttonCenterX - event.clientX;
        let directionY = buttonCenterY - event.clientY;

        const distance = Math.sqrt(
            directionX * directionX + directionY * directionY
        );

        if (distance === 0) {
            directionX = 1;
            directionY = 1;
        } else {
            directionX /= distance;
            directionY /= distance;
        }

        const moveDistance = 220;

        let newX = buttonCenterX + directionX * moveDistance;
        let newY = buttonCenterY + directionY * moveDistance;

        const padding = 30;

        const minX = padding + rect.width / 2;
        const maxX = window.innerWidth - padding - rect.width / 2;

        const minY = padding + rect.height / 2;
        const maxY = window.innerHeight - padding - rect.height / 2;

        newX = Math.max(minX, Math.min(maxX, newX));
        newY = Math.max(minY, Math.min(maxY, newY));

        setYesPosition({
            left: `${newX}px`,
            top: `${newY}px`,
        });
    };

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (showLogoutModal && isRunning) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showLogoutModal, isRunning]);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    return (
        <>
            <nav className="sticky top-0 z-50">
                <div className="absolute inset-0 border-b border-white/10 bg-slate-950/90 backdrop-blur-2xl" />

                <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-8">

                    {/* LOGO */}

                    <button
                        onClick={() => handleNavigation("/home")}
                        className="group flex items-center gap-3"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 rounded-2xl bg-blue-500 opacity-40 blur-xl transition group-hover:opacity-70" />

                            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl shadow-lg">
                                🛍️
                            </div>
                        </div>

                        <div className="text-left">
                            <h1 className="text-xl font-black tracking-tight text-white">
                                Shop<span className="text-blue-400">Kart</span>
                            </h1>

                            <p className="text-[9px] uppercase tracking-[0.25em] text-slate-500">
                                Premium Shopping
                            </p>
                        </div>
                    </button>

                    {/* DESKTOP NAVIGATION */}

                    <div className="hidden items-center gap-1 xl:flex">
                        {navigationLinks.map((link) => (
                            <button
                                key={link.path}
                                onClick={() => handleNavigation(link.path)}
                                className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
                                    isActive(link.path)
                                        ? "border-blue-500/20 bg-blue-500/10 text-blue-300"
                                        : "border-transparent text-slate-400 hover:bg-white/5 hover:text-white"
                                }`}
                            >
                                <span className="mr-1.5">
                                    {link.icon}
                                </span>
                                {link.label}
                            </button>
                        ))}
                    </div>

                    {/* RIGHT SIDE */}

                    <div className="flex items-center gap-2 sm:gap-3">

                        {/* CART */}

                        <button
                            onClick={() => handleNavigation("/cart")}
                            className={`relative flex items-center gap-2 rounded-xl border px-3 py-2.5 transition-all sm:px-4 ${
                                location.pathname === "/cart"
                                    ? "border-blue-500/40 bg-blue-500/10 text-blue-300"
                                    : "border-blue-500/20 bg-blue-500/5 text-blue-400 hover:border-blue-500/40 hover:bg-blue-500/10"
                            }`}
                        >
                            <span className="text-lg">🛒</span>

                            <span className="hidden text-sm font-semibold sm:block">
                                Cart
                            </span>

                            {totalItems > 0 && (
                                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1 text-xs font-bold text-white">
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        {/* ONLINE STATUS */}

                        <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 sm:flex">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />

                            <span className="text-xs text-slate-400">
                                Online
                            </span>
                        </div>

                        {/* LOGOUT */}

                        <button
                            onClick={() => setShowLogoutModal(true)}
                            className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-red-400 transition-all hover:border-red-500/40 hover:bg-red-500/10 sm:px-4"
                        >
                            <span>↪</span>

                            <span className="hidden text-sm font-semibold sm:block">
                                Logout
                            </span>
                        </button>

                        {/* MOBILE MENU BUTTON */}

                        <button
                            onClick={() =>
                                setIsMobileMenuOpen((previous) => !previous)
                            }
                            aria-label="Toggle navigation menu"
                            aria-expanded={isMobileMenuOpen}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xl text-white transition hover:bg-white/10 xl:hidden"
                        >
                            {isMobileMenuOpen ? "✕" : "☰"}
                        </button>
                    </div>
                </div>

                {/* MOBILE AND TABLET MENU */}

                {isMobileMenuOpen && (
                    <div className="relative border-t border-white/10 bg-slate-950/95 px-4 py-4 backdrop-blur-2xl xl:hidden">
                        <div className="mx-auto flex max-w-7xl flex-col gap-2">
                            {navigationLinks.map((link) => (
                                <button
                                    key={link.path}
                                    onClick={() =>
                                        handleNavigation(link.path)
                                    }
                                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-all ${
                                        isActive(link.path)
                                            ? "border-blue-500/20 bg-blue-500/10 text-blue-300"
                                            : "border-transparent text-slate-300 hover:bg-white/5 hover:text-white"
                                    }`}
                                >
                                    <span className="w-6 text-center text-lg">
                                        {link.icon}
                                    </span>

                                    <span>{link.label}</span>

                                    {isActive(link.path) && (
                                        <span className="ml-auto text-blue-400">
                                            ●
                                        </span>
                                    )}
                                </button>
                            ))}

                            <button
                                onClick={() => handleNavigation("/cart")}
                                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-all ${
                                    location.pathname === "/cart"
                                        ? "border-blue-500/20 bg-blue-500/10 text-blue-300"
                                        : "border-transparent text-slate-300 hover:bg-white/5 hover:text-white"
                                }`}
                            >
                                <span className="w-6 text-center text-lg">
                                    🛒
                                </span>

                                <span>Cart</span>

                                {totalItems > 0 && (
                                    <span className="ml-auto rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">
                                        {totalItems}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* LOGOUT CONFIRMATION MODAL */}

            {showLogoutModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
                    <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-7 text-center shadow-2xl">

                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-3xl">
                            🚪
                        </div>

                        <h2 className="text-2xl font-bold text-white">
                            Are you sure?
                        </h2>

                        <p className="mt-2 text-sm text-slate-400">
                            Do you really want to logout from ShopKart?
                        </p>

                        <div className="mt-7 flex items-center justify-center gap-4">

                            {/* NO BUTTON */}

                            <button
                                onClick={closeModal}
                                className="rounded-xl bg-slate-700 px-7 py-3 font-semibold text-white transition-all hover:bg-slate-600"
                            >
                                No
                            </button>

                            {/* YES BUTTON */}

                            {!isRunning && (
                                <button
                                    onMouseEnter={handleYesMouseEnter}
                                    onClick={logout}
                                    className="rounded-xl bg-red-600 px-7 py-3 font-semibold text-white transition-all hover:bg-red-500"
                                >
                                    Yes 😈
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* RUNNING YES BUTTON */}

            {showLogoutModal && isRunning && (
                <button
                    onMouseEnter={handleYesMouseEnter}
                    onClick={logout}
                    style={{
                        position: "fixed",
                        top: yesPosition.top,
                        left: yesPosition.left,
                        transform: "translate(-50%, -50%)",
                        zIndex: 9999,
                        transition: "left 0.18s ease, top 0.18s ease",
                    }}
                    className="rounded-xl bg-red-600 px-7 py-3 font-semibold text-white shadow-2xl shadow-red-500/30 hover:bg-red-500"
                >
                    Yes 😈
                </button>
            )}
        </>
    );
};

export default Navbar;
