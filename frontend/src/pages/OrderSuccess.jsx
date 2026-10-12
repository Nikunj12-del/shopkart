
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../../client/shopkart-frontend/src/components/Navbar";

function OrderSuccess() {
    const { id } = useParams();
    const [copied, setCopied] = useState(false);

    const copyOrderId = async () => {
        try {
            await navigator.clipboard.writeText(id);
            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            console.error("Failed to copy order ID:", error);
        }
    };

    return (
        <div className="min-h-screen bg-[#070B16] text-white">
            <Navbar />

            <div className="relative isolate overflow-hidden px-4 py-12 sm:py-20">
                <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />

                <div className="pointer-events-none absolute bottom-0 left-0 -z-10 h-72 w-72 rounded-full bg-blue-600/10 blur-[100px]" />

                <div className="mx-auto max-w-3xl">
                    <div className="mb-8 text-center">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-300">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                            PAYMENT VERIFIED
                        </div>

                        <div className="relative mx-auto mb-7 flex h-28 w-28 items-center justify-center">
                            <div className="absolute inset-0 animate-ping rounded-full border border-emerald-400/20" />

                            <div className="absolute inset-2 rounded-full bg-emerald-400/10 blur-xl" />

                            <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-emerald-400/30 bg-gradient-to-br from-emerald-400/20 to-teal-500/10 shadow-[0_0_60px_rgba(52,211,153,0.12)]">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="h-12 w-12 text-emerald-400"
                                >
                                    <path
                                        d="M5 12.5L9.5 17L19 7"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
                            Order placed
                            <span className="mt-2 block bg-gradient-to-r from-indigo-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent">
                                successfully!
                            </span>
                        </h1>

                        <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-slate-400 sm:text-base">
                            Thank you for shopping with ShopKart. Your payment
                            verification is complete. Sit back and relax while
                            we take care of your order.
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-3xl border border-white/[0.09] bg-white/[0.035] shadow-2xl shadow-black/30 backdrop-blur-xl">
                        <div className="border-b border-white/[0.08] bg-gradient-to-r from-indigo-500/10 via-blue-500/5 to-transparent px-6 py-6 sm:px-8">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-400/10">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        className="h-6 w-6 text-indigo-300"
                                    >
                                        <path
                                            d="M3 7.5L12 3L21 7.5L12 12L3 7.5Z"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M3 12L12 16.5L21 12M3 16.5L12 21L21 16.5"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>

                                <div className="min-w-0 flex-1">
                                    <h2 className="text-lg font-semibold">
                                        Order confirmation
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-400">
                                        Your order has been submitted
                                    </p>
                                </div>

                                <span className="shrink-0 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                                    SUCCESS
                                </span>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                Your order ID
                            </p>

                            <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-[#080D1A]/80 p-4">
                                <div className="min-w-0 flex-1">
                                    <p className="break-all font-mono text-sm text-indigo-200 sm:text-base">
                                        {id}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={copyOrderId}
                                    className="flex shrink-0 items-center gap-2 rounded-xl border border-indigo-400/20 bg-indigo-400/10 px-3 py-2.5 text-sm font-medium text-indigo-200 transition hover:border-indigo-300/40 hover:bg-indigo-400/20"
                                >
                                    {copied ? (
                                        <>
                                            <span>✓</span>
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                className="h-4 w-4"
                                            >
                                                <rect
                                                    x="8"
                                                    y="8"
                                                    width="12"
                                                    height="12"
                                                    rx="2"
                                                    stroke="currentColor"
                                                    strokeWidth="1.7"
                                                />
                                                <path
                                                    d="M16 8V5C16 3.9 15.1 3 14 3H5C3.9 3 3 3.9 3 5V14C3 15.1 3.9 16 5 16H8"
                                                    stroke="currentColor"
                                                    strokeWidth="1.7"
                                                />
                                            </svg>
                                            Copy
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                className="h-5 w-5"
                                            >
                                                <path
                                                    d="M4 10H20M6 4H18C19.1 4 20 4.9 20 6V18C20 19.1 19.1 20 18 20H6C4.9 20 4 19.1 4 18V6C4 4.9 4.9 4 6 4Z"
                                                    stroke="currentColor"
                                                    strokeWidth="1.7"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M8 15L10 17L16 11"
                                                    stroke="currentColor"
                                                    strokeWidth="1.7"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium">
                                                Payment
                                            </p>
                                            <p className="mt-1 text-xs text-emerald-300">
                                                Verified
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-400/10 text-indigo-300">
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                className="h-5 w-5"
                                            >
                                                <path
                                                    d="M3 7H21V20H3V7Z"
                                                    stroke="currentColor"
                                                    strokeWidth="1.7"
                                                    strokeLinejoin="round"
                                                />
                                                <path
                                                    d="M3 7L5 4H19L21 7M8 12H12"
                                                    stroke="currentColor"
                                                    strokeWidth="1.7"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium">
                                                Order status
                                            </p>
                                            <p className="mt-1 text-xs text-indigo-300">
                                                Placed
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    to="/orders"
                                    className="group inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-950/30 transition hover:-translate-y-0.5 hover:from-indigo-500 hover:to-blue-500 hover:shadow-indigo-900/40"
                                >
                                    View my orders
                                    <span className="transition group-hover:translate-x-1">
                                        →
                                    </span>
                                </Link>

                                <Link
                                    to="/products"
                                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm font-semibold text-slate-200 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.08]"
                                >
                                    <span>←</span>
                                    Continue shopping
                                </Link>
                            </div>
                        </div>
                    </div>

                    <p className="mt-6 text-center text-xs text-slate-500">
                        Thank you for choosing ShopKart · Happy shopping!
                    </p>
                </div>
            </div>
        </div>
    );
}

export default OrderSuccess;
