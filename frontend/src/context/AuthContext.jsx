import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState
} from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [status, setStatus] = useState("loading");
    const [error, setError] = useState("");
    const requestId = useRef(0);

    const refreshUser = useCallback(async () => {
        const currentRequestId = ++requestId.current;
        setStatus("loading");
        setError("");

        try {
            const response = await api.get("/customers/me");

            if (currentRequestId === requestId.current) {
                setUser(response.data);
                setStatus("authenticated");
            }

            return response.data;
        } catch (requestError) {
            if (currentRequestId === requestId.current) {
                setUser(null);

                if (requestError.response?.status === 401) {
                    setStatus("unauthenticated");
                    setError("");
                } else {
                    setStatus("error");
                    setError(
                        requestError.response?.data?.message ||
                        "Unable to verify your session. Check your connection and retry."
                    );
                }
            }

            return null;
        }
    }, []);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    const logout = useCallback(async () => {
        await api.post("/customers/logout", {});
        requestId.current += 1;
        setUser(null);
        setStatus("unauthenticated");
        setError("");
    }, []);

    return (
        <AuthContext.Provider
            value={{ user, status, error, refreshUser, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
};
