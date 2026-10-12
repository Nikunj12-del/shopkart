
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);

        document.body.appendChild(script);
    });
};

export default function Payment() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const startedRef = useRef(false);

    const [paymentOrder, setPaymentOrder] = useState(
        location.state || null
    );
    const [loading, setLoading] = useState(Boolean(id));
    const [paying, setPaying] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        const preparePayment = async () => {
            if (!id) {
                if (!location.state?.orderId ||
                    !location.state?.razorpayOrderId) {
                    setError("Payment details are missing. Open My Orders and retry payment.");
                }

                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const response = await api.post(
                    `/orders/${id}/retry-payment`
                );

                if (!cancelled) {
                    setPaymentOrder(response.data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.response?.data?.message ||
                        "Unable to prepare this payment."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        preparePayment();

        return () => {
            cancelled = true;
        };
    }, [id, location.state]);

    const startPayment = async () => {
        if (paying || startedRef.current) return;

        if (
            !paymentOrder?.orderId ||
            !paymentOrder?.razorpayOrderId ||
            !paymentOrder?.keyId
        ) {
            setError("Payment details are incomplete. Please try again.");
            return;
        }

        setPaying(true);
        setError("");

        try {
            const loaded = await loadRazorpayScript();

            if (!loaded) {
                throw new Error("Unable to load Razorpay. Check your internet connection.");
            }

            const options = {
                key: paymentOrder.keyId,
                amount: paymentOrder.amount,
                currency: paymentOrder.currency || "INR",
                name: "ShopKart",
                description: "Order payment",
                order_id: paymentOrder.razorpayOrderId,

                handler: async (response) => {
                    try {
                        const verification = await api.post(
                            "/orders/verify-payment",
                            {
                                orderId: paymentOrder.orderId,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            }
                        );

                        if (verification.data.success) {
                            navigate(
                                `/order-success/${paymentOrder.orderId}`,
                                { replace: true }
                            );
                        } else {
                            setError(
                                verification.data.message ||
                                "Payment verification failed."
                            );
                            startedRef.current = false;
                            setPaying(false);
                        }
                    } catch (err) {
                        setError(
                            err.response?.data?.message ||
                            "Payment was submitted, but verification failed. Check My Orders before retrying."
                        );
                        startedRef.current = false;
                        setPaying(false);
                    }
                },

                modal: {
                    ondismiss: () => {
                        startedRef.current = false;
                        setPaying(false);
                    }
                },

                theme: {
                    color: "#2563eb"
                }
            };

            const checkout = new window.Razorpay(options);

            checkout.on("payment.failed", (response) => {
                setError(
                    response.error?.description ||
                    "Payment failed. You can try again."
                );
                startedRef.current = false;
                setPaying(false);
            });

            startedRef.current = true;
            checkout.open();
        } catch (err) {
            setError(err.message || "Unable to start payment.");
            startedRef.current = false;
            setPaying(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                <p className="text-slate-300">Preparing your payment...</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white px-4 py-16">
            <div className="max-w-xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl">
                <div className="text-center">
                    <div className="text-4xl mb-4">🔒</div>

                    <h1 className="text-2xl font-bold">
                        Secure Payment
                    </h1>

                    <p className="mt-3 text-slate-400">
                        Complete your order using Razorpay.
                    </p>
                </div>

                {error && (
                    <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                        {error}
                    </div>
                )}

                {paymentOrder && (
                    <div className="mt-8 rounded-xl bg-slate-800/70 p-5">
                        <div className="flex justify-between gap-4">
                            <span className="text-slate-400">
                                Order ID
                            </span>
                            <span className="text-right text-sm break-all">
                                {paymentOrder.orderId}
                            </span>
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                            <span className="text-slate-400">
                                Amount
                            </span>
                            <span className="text-2xl font-bold">
                                ₹{(
                                    Number(paymentOrder.amount || 0) / 100
                                ).toLocaleString("en-IN", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                            </span>
                        </div>
                    </div>
                )}

                <button
                    type="button"
                    onClick={startPayment}
                    disabled={paying || !paymentOrder}
                    className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-4 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {paying ? "Opening Razorpay..." : "Pay Now"}
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/orders")}
                    className="mt-3 w-full rounded-xl border border-slate-700 px-5 py-3 font-medium text-slate-300 transition hover:bg-slate-800"
                >
                    Back to My Orders
                </button>

                <p className="mt-5 text-center text-xs text-slate-500">
                    Your payment is verified by the ShopKart server.
                </p>
            </div>
        </main>
    );
}
