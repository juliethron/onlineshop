    "use client";

    import { useEffect, useRef, useState } from "react";
    import Link from "next/link";
    import { useParams } from "next/navigation";
    import { getProduct } from "@/lib/api";
    import { formatPrice } from "@/lib/formatPrice";
    import { useCart } from "@/app/context/CartContext";
    import type { Product } from "@/types/product";

    export default function ProductPage() {
    const params = useParams();
    const id = params.id as string;

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [toast, setToast] = useState("");

    const { addToCart, cartCount } = useCart();
    const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        async function loadProduct() {
        try {
            setLoading(true);
            setError("");

            const foundProduct = await getProduct(id);
            setProduct(foundProduct);
        } catch {
            setError("Oops! We couldn't find this product.");
        } finally {
            setLoading(false);
        }
        }

        if (id) {
        loadProduct();
        }

        return () => {
        if (toastTimer.current) {
            clearTimeout(toastTimer.current);
        }
        };
    }, [id]);

    function handleAddToCart() {
        if (!product) return;

        addToCart({
        id: product.id,
        title: product.title,
        price: product.discountedPrice,
        image: product.image.url,
        });

        setToast(`${product.title} added to your cart!`);

        if (toastTimer.current) {
        clearTimeout(toastTimer.current);
        }

        toastTimer.current = setTimeout(() => {
        setToast("");
        toastTimer.current = null;
        }, 3000);
    }

    if (loading) {
        return (
        <main className="flex min-h-screen items-center justify-center bg-cream">
            <p className="text-lg font-bold">Loading the good stuff...</p>
        </main>
        );
    }

    if (error || !product) {
        return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream">
            <p className="text-lg font-bold text-red">
            {error || "Product not found."}
            </p>

            <Link
            href="/"
            className="rounded-full border-2 border-ink px-6 py-3 font-bold hover:bg-ink hover:text-white"
            >
            Back to shop
            </Link>
        </main>
        );
    }

    const hasDiscount = product.discountedPrice < product.price;

    const discountPercentage =
        hasDiscount && product.price > 0
        ? Math.round(
            ((product.price - product.discountedPrice) / product.price) * 100
            )
        : 0;

    const tags = product.tags ?? [];
    const reviews = product.reviews ?? [];

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
                href="/cart"
                className="rounded-full border-2 border-ink px-4 py-2 text-sm font-bold transition hover:bg-ink hover:text-white"
            >
                Cart ({cartCount})
            </Link>
            </nav>
        </header>

        {/* Product */}
        <section className="mx-auto max-w-7xl px-5 py-10 sm:py-16">
            <Link
            href="/"
            className="mb-8 inline-block text-sm font-bold hover:text-red"
            >
            ← Back to shop
            </Link>

            <div className="grid gap-10 md:grid-cols-2 md:gap-16">
            {/* Product image */}
            <div className="relative aspect-square overflow-hidden rounded-3xl border-2 border-ink bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                src={product.image.url}
                alt={product.image.alt || product.title}
                className="h-full w-full object-contain p-8"
                />

                {hasDiscount && (
                <span className="absolute left-5 top-5 -rotate-6 bg-red px-4 py-3 text-sm font-black text-white">
                    -{discountPercentage}% OFF
                </span>
                )}
            </div>

            {/* Product information */}
            <div className="flex flex-col justify-center">
                <p className="mb-3 text-xs font-black tracking-widest text-red">
                THE GOOD STUFF
                </p>

                <h1 className="text-4xl font-black leading-tight sm:text-5xl">
                {product.title}
                </h1>

                <p className="mt-4 text-lg font-medium">
                ⭐ {product.rating} / 5
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="text-3xl font-black">
                    {formatPrice(product.discountedPrice)}
                </span>

                {hasDiscount && (
                    <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.price)}
                    </span>
                )}
                </div>

                {/* Actual product description */}
                <p className="mt-6 whitespace-pre-line leading-relaxed">
                {product.description}
                </p>

                {/* Product tags */}
                {tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                    <span
                        key={tag}
                        className="rounded-full border-2 border-ink px-3 py-1 text-xs font-bold"
                    >
                        {tag}
                    </span>
                    ))}
                </div>
                )}

                <button
                onClick={handleAddToCart}
                className="mt-8 w-full rounded-full border-2 border-ink bg-red px-8 py-4 font-black text-white shadow-[4px_4px_0_var(--ink)] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none sm:w-fit"
                >
                ADD TO CART →
                </button>

                <p className="mt-5 text-sm font-medium text-gray-600">
                Cute things. Questionable decisions. Always.
                </p>
            </div>
            </div>

            {/* Reviews */}
            <section className="mt-16 border-t-2 border-ink pt-10">
            <h2 className="text-3xl font-black">THE REVIEWS</h2>

            {reviews.length > 0 ? (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {reviews.map((review) => (
                    <article
                    key={review.id}
                    className="rounded-2xl border-2 border-ink bg-white p-5"
                    >
                    <p className="font-black">{review.username}</p>
                    <p className="mt-2">⭐ {review.rating} / 5</p>
                    <p className="mt-3 leading-relaxed">{review.description}</p>
                    </article>
                ))}
                </div>
            ) : (
                <p className="mt-4 font-medium">
                No reviews yet. Be the first to share your thoughts!
                </p>
            )}
            </section>
        </section>

        {/* Add-to-cart toast */}
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
            <p className="font-black tracking-wide">DAISY DISASTER © 2026</p>
            <p className="mt-2 text-white/60">
            Cute things. Questionable decisions.
            </p>
        </footer>
        </main>
    );
    }