
    "use client";

    import Link from "next/link";
    import { useEffect } from "react";
    import { useCart } from "../context/CartContext";

    export default function CheckoutSuccess() {
    const { clearCart } = useCart();

    useEffect(() => {
        clearCart();
    }, [clearCart]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-cream px-5 py-16">
        <div className="w-full max-w-2xl rounded-3xl border-2 border-ink bg-white p-8 text-center shadow-[8px_8px_0_var(--ink)] sm:p-14">
            <span className="inline-block rotate-[-3deg] bg-yellow px-4 py-2 text-xs font-black tracking-widest">
            DISASTER AVERTED
            </span>

            <div className="mt-8 text-7xl" aria-hidden="true">
            ✿
            </div>

            <h1 className="mt-6 text-4xl font-black sm:text-6xl">
            Order placed!
            </h1>

            <p className="mx-auto mt-5 max-w-md text-base font-medium sm:text-lg">
            Your questionable decisions have officially been confirmed.
            Thanks for shopping with Daisy Disaster!
            </p>

            <Link
            href="/"
            className="mt-8 inline-flex items-center gap-3 rounded-full border-2 border-ink bg-red px-7 py-4 font-black text-white shadow-[4px_4px_0_var(--ink)] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
            BACK TO SHOP →
            </Link>
        </div>
        </main>
    );
    }
