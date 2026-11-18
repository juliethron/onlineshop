
    "use client";

    import { useState } from "react";
    import Link from "next/link";
    import { useCart } from "@/app/context/CartContext";
    import { formatPrice } from "@/lib/formatPrice";

    export default function CartPage() {
    const {
        cart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
    } = useCart();

    const [toast, setToast] = useState("");

    function showToast(message: string) {
        setToast(message);

        window.setTimeout(() => {
        setToast("");
        }, 3000);
    }

    function handleRemoveItem(id: string, title: string) {
        removeFromCart(id);
        showToast(`${title} removed from your cart.`);
    }

    function handleClearCart() {
        clearCart();
        showToast("Your cart has been cleared.");
    }

    return (
        <main className="min-h-screen bg-cream">
        {/* Announcement bar */}
        <div className="bg-ink px-4 py-2 text-center text-xs font-bold tracking-widest text-white">
            CUTE THINGS. QUESTIONABLE DECISIONS.
        </div>

        {/* Navigation */}
        <header className="border-b-2 border-ink">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
            <Link
                href="/"
                className="text-2xl font-black tracking-tight sm:text-3xl"
            >
                DAISY<span className="text-red">.</span>
                DISASTER
            </Link>

            <Link
                href="/"
                className="text-sm font-bold hover:text-red"
            >
                Continue shopping →
            </Link>
            </nav>
        </header>

        {/* Cart content */}
        <section className="mx-auto max-w-7xl px-5 py-10 sm:py-16">
            {/* Heading */}
            <div className="mb-10">
            <p className="mb-2 text-xs font-black tracking-widest text-red">
                YOUR GOOD STUFF
            </p>

            <h1 className="text-4xl font-black sm:text-6xl">
                Shopping cart.
            </h1>

            <p className="mt-3 font-medium">
                {cartCount === 0
                ? "Your cart is looking a little lonely."
                : `${cartCount} ${
                    cartCount === 1 ? "item" : "items"
                    } causing trouble.`}
            </p>
            </div>

            {/* Empty cart */}
            {cart.length === 0 ? (
            <div className="rounded-3xl border-2 border-ink bg-blue px-6 py-16 text-center sm:py-20">
                <span className="text-6xl">✿</span>

                <h2 className="mt-6 text-3xl font-black">
                Nothing here. Yet.
                </h2>

                <p className="mx-auto mt-3 max-w-md font-medium">
                Your next questionable decision is waiting to be made.
                </p>

                <Link
                href="/"
                className="mt-8 inline-flex rounded-full border-2 border-ink bg-red px-8 py-4 font-black text-white shadow-[4px_4px_0_var(--ink)] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                >
                FIND THE GOOD STUFF →
                </Link>
            </div>
            ) : (
            <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
                {/* Product list */}
                <div className="space-y-5">
                {cart.map((item) => (
                    <article
                    key={item.id}
                    className="flex flex-col gap-5 rounded-2xl border-2 border-ink bg-white p-4 sm:flex-row sm:items-center sm:p-5"
                    >
                    {/* Product image */}
                    <Link
                        href={`/product/${item.id}`}
                        className="relative aspect-square w-full shrink-0 overflow-hidden rounded-xl bg-cream sm:w-32"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-contain p-3 transition duration-300 hover:scale-105"
                        />
                    </Link>

                    {/* Product information */}
                    <div className="flex flex-1 flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                        <Link
                            href={`/product/${item.id}`}
                            className="text-lg font-black hover:text-red"
                        >
                            {item.title}
                        </Link>

                        <p className="mt-2 font-bold">
                            {formatPrice(item.price)}
                        </p>

                        {/* Quantity controls */}
                        <div className="mt-4 flex items-center gap-3">
                            <span className="text-xs font-bold uppercase tracking-wide">
                            Qty
                            </span>

                            <div className="flex items-center rounded-full border-2 border-ink">
                            <button
                                type="button"
                                onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                                }
                                disabled={item.quantity <= 1}
                                className="px-3 py-1.5 font-black transition hover:text-red disabled:cursor-not-allowed disabled:opacity-30"
                                aria-label={`Decrease quantity of ${item.title}`}
                            >
                                −
                            </button>

                            <span className="min-w-8 text-center text-sm font-bold">
                                {item.quantity}
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                                }
                                className="px-3 py-1.5 font-black transition hover:text-red"
                                aria-label={`Increase quantity of ${item.title}`}
                            >
                                +
                            </button>
                            </div>
                        </div>
                        </div>

                        {/* Item total and remove */}
                        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                        <p className="text-lg font-black">
                            {formatPrice(item.price * item.quantity)}
                        </p>

                        <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id, item.title)}
                            className="text-sm font-bold text-red underline underline-offset-4 transition hover:text-ink"
                        >
                            Remove
                        </button>
                        </div>
                    </div>
                    </article>
                ))}

                {/* Clear cart */}
                <div className="flex justify-end pt-2">
                    <button
                    type="button"
                    onClick={handleClearCart}
                    className="text-sm font-bold text-gray-500 underline underline-offset-4 transition hover:text-red"
                    >
                    Clear entire cart
                    </button>
                </div>
                </div>

                {/* Order summary */}
                <aside className="rounded-3xl border-2 border-ink bg-yellow p-6 sm:p-8 lg:sticky lg:top-6">
                <p className="text-xs font-black tracking-widest">
                    THE DAMAGE
                </p>

                <h2 className="mt-3 text-3xl font-black">
                    Order summary.
                </h2>

                {/* Summary details */}
                <div className="mt-8 space-y-4">
                    <div className="flex justify-between gap-4">
                    <span className="font-medium">
                        Subtotal ({cartCount}{" "}
                        {cartCount === 1 ? "item" : "items"})
                    </span>

                    <span className="font-bold">
                        {formatPrice(cartTotal)}
                    </span>
                    </div>

                    <div className="flex justify-between gap-4">
                    <span className="font-medium">Shipping</span>

                    <span className="text-right text-sm font-bold">
                        Calculated at checkout
                    </span>
                    </div>

                    <div className="border-t-2 border-ink pt-4">
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-lg font-black">Total</span>

                        <span className="text-2xl font-black">
                        {formatPrice(cartTotal)}
                        </span>
                    </div>

                    <p className="mt-2 text-xs font-medium">
                        Shipping calculated at checkout.
                    </p>
                    </div>
                </div>

                {/* Checkout button */}
                <Link
                    href="/checkout"
                    className="mt-8 flex w-full items-center justify-center rounded-full border-2 border-ink bg-red px-6 py-4 text-center font-black text-white shadow-[4px_4px_0_var(--ink)] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                >
                    LET&apos;S CHECK OUT →
                </Link>

                <p className="mt-5 text-center text-xs font-bold">
                    Cute things. Questionable decisions.
                </p>
                </aside>
            </div>
            )}
        </section>

        {/* Remove / clear cart toast */}
        {toast && (
            <div
            role="status"
            className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full border-2 border-ink bg-yellow px-6 py-4 text-center font-black shadow-[4px_4px_0_var(--ink)]"
            >
            ✓ {toast}
            </div>
        )}

        {/* Footer */}
        <footer className="bg-ink px-5 py-8 text-center text-sm text-white">
            <p className="font-black tracking-wide">
            DAISY DISASTER © 2026
            </p>

            <p className="mt-2 text-white/60">
            Cute things. Questionable decisions.
            </p>
        </footer>
        </main>
    );
    }