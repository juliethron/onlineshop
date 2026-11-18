
    "use client";

    import {
    createContext,
    useContext,
    useSyncExternalStore,
    type ReactNode,
    } from "react";

    export interface CartItem {
    id: string;
    title: string;
    price: number;
    image: string;
    quantity: number;
    }

    interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Omit<CartItem, "quantity">) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
    }

    const CartContext = createContext<CartContextType | undefined>(
    undefined
    );

    const STORAGE_KEY = "daisy-disaster-cart";

    // Get the saved cart as a string
    function getCartSnapshot(): string {
    if (typeof window === "undefined") {
        return "[]";
    }

    return localStorage.getItem(STORAGE_KEY) ?? "[]";
    }

    // Snapshot used during server-side rendering
    function getServerCartSnapshot(): string {
    return "[]";
    }

    // Listen for cart changes
    function subscribeToCart(callback: () => void) {
    window.addEventListener("storage", callback);
    window.addEventListener("cart-updated", callback);

    return () => {
        window.removeEventListener("storage", callback);
        window.removeEventListener("cart-updated", callback);
    };
    }

    // Parse the saved cart safely
    function parseCart(snapshot: string): CartItem[] {
    try {
        const parsed = JSON.parse(snapshot);

        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
    }

    // Save cart and notify subscribers
    function saveCart(cart: CartItem[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));

    window.dispatchEvent(new Event("cart-updated"));
    }

    export function CartProvider({
    children,
    }: {
    children: ReactNode;
    }) {
    const cartSnapshot = useSyncExternalStore(
        subscribeToCart,
        getCartSnapshot,
        getServerCartSnapshot
    );

    const cart = parseCart(cartSnapshot);

    // Add a product or increase its quantity
    function addToCart(product: Omit<CartItem, "quantity">) {
        const currentCart = parseCart(getCartSnapshot());

        const existingItem = currentCart.find(
        (item) => item.id === product.id
        );

        let updatedCart: CartItem[];

        if (existingItem) {
        updatedCart = currentCart.map((item) =>
            item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        } else {
        updatedCart = [
            ...currentCart,
            { ...product, quantity: 1 },
        ];
        }

        saveCart(updatedCart);
    }

    // Remove a product completely
    function removeFromCart(id: string) {
        const currentCart = parseCart(getCartSnapshot());

        const updatedCart = currentCart.filter(
        (item) => item.id !== id
        );

        saveCart(updatedCart);
    }

    // Update a product's quantity
    function updateQuantity(id: string, quantity: number) {
        if (quantity < 1) return;

        const currentCart = parseCart(getCartSnapshot());

        const updatedCart = currentCart.map((item) =>
        item.id === id ? { ...item, quantity } : item
        );

        saveCart(updatedCart);
    }

    // Empty the cart
    function clearCart() {
        saveCart([]);
    }

    // Calculate the total number of items
    const cartCount = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    // Calculate the total price
    const cartTotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider
        value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            cartTotal,
        }}
        >
        {children}
        </CartContext.Provider>
    );
    }

    // Custom hook for accessing the cart
    export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error(
        "useCart must be used within a CartProvider"
        );
    }

    return context;
    }
