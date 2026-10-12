import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { status, error, refreshUser } = useAuth();

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
                    <p className="text-white mt-4 font-medium">
                        Checking your session...
                    </p>
                </div>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
                <div className="max-w-md text-center text-white">
                    <p role="alert" className="mb-5 text-red-300">{error}</p>
                    <button
                        type="button"
                        onClick={refreshUser}
                        className="rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
