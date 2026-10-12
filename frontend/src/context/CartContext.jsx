import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import api from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { status: authStatus } = useAuth();

    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // GET CART

    const fetchCart = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("/cart");

            setCart(response.data.cart || []);

        } catch (error) {

            console.log(error);

            setError(
                error.response?.data?.message ||
                "Failed to fetch cart"
            );

        } finally {

            setLoading(false);

        }

    };


    // FETCH CART WHEN APP LOADS

    useEffect(() => {
        if (authStatus === "authenticated") {
            fetchCart();
        } else {
            setCart([]);
            setError("");
        }
    }, [authStatus]);


    // ADD PRODUCT TO CART

    const addToCart = async (productId) => {

        try {

            setLoading(true);
            setError("");

            await api.post(`/cart/${productId}`);

            await fetchCart();

            return true;

        } catch (error) {

            console.log(error);

            setError(
                error.response?.data?.message ||
                "Failed to add product to cart"
            );

            return false;

        } finally {

            setLoading(false);

        }

    };


    // UPDATE QUANTITY

    const updateQuantity = async (
        productId,
        quantity
    ) => {

        try {

            setLoading(true);
            setError("");

            await api.patch(
                `/cart/${productId}`,
                {
                    quantity
                }
            );

            await fetchCart();

            return true;

        } catch (error) {

            console.log(error);

            setError(
                error.response?.data?.message ||
                "Failed to update quantity"
            );

            return false;

        } finally {

            setLoading(false);

        }

    };


    // REMOVE PRODUCT

    const removeFromCart = async (productId) => {

        try {

            setLoading(true);
            setError("");

            await api.delete(
                `/cart/${productId}`
            );

            await fetchCart();

            return true;

        } catch (error) {

            console.log(error);

            setError(
                error.response?.data?.message ||
                "Failed to remove product from cart"
            );

            return false;

        } finally {

            setLoading(false);

        }

    };


    // TOTAL NUMBER OF ITEMS

    const totalItems = cart.reduce(
        (total, item) => {
            return total + item.quantity;
        },
        0
    );


    // SUBTOTAL

    const subtotal = cart.reduce(
        (total, item) => {

            if (!item.product) {
                return total;
            }

            return (
                total +
                item.product.price * item.quantity
            );

        },
        0
    );


    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                error,
                fetchCart,
                addToCart,
                updateQuantity,
                removeFromCart,
                totalItems,
                subtotal
            }}
        >
            {children}
        </CartContext.Provider>
    );

};


export const useCart = () => {

    return useContext(CartContext);

};