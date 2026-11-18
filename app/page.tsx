
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProducts } from "@/lib/api";
import { formatPrice } from "@/lib/formatPrice";
import { useCart } from "@/app/context/CartContext";
import type { Product } from "@/types/product";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { cartCount } = useCart();

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch {
        setError("Oops! We couldn't load the products.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = products
    .filter((product) =>
      product.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "price-low") {
        return a.discountedPrice - b.discountedPrice;
      }

      if (sort === "price-high") {
        return b.discountedPrice - a.discountedPrice;
      }

      if (sort === "rating") {
        return b.rating - a.rating;
      }

      return 0;
    });

  return (
    <main className="min-h-screen">
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
            <br className="sm:hidden" />
            DISASTER
          </Link>

          <div className="hidden items-center gap-8 text-sm font-bold uppercase sm:flex">
            <a href="#shop" className="hover:text-red">
              Shop all
            </a>

            <Link href="/contact" className="hover:text-red">
              Contact
            </Link>
          </div>

          <Link
            href="/cart"
            className="rounded-full border-2 border-ink px-4 py-2 text-sm font-bold transition hover:bg-ink hover:text-white"
          >
            Cart ({cartCount})
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:py-16">
        <div className="relative flex flex-col overflow-hidden rounded-3xl border-2 border-ink bg-blue p-7 sm:p-14 md:block">
          {/* Hero text */}
          <div className="relative z-10 max-w-2xl md:max-w-[58%]">
            <span className="inline-block -rotate-2 bg-yellow px-3 py-1 text-xs font-black tracking-widest">
              WELCOME TO THE DISASTER
            </span>

            <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
              GOOD
              <br />
              TASTE.
              <br />
              <span className="text-red">BAD</span> IDEAS.
            </h1>

            <p className="mt-6 max-w-md text-base font-medium sm:text-lg">
              Your next favourite thing is just a questionable decision
              away. Come find your new obsession.
            </p>

            <a
              href="#shop"
              className="mt-8 inline-flex items-center gap-3 rounded-full border-2 border-ink bg-red px-7 py-4 font-black text-white shadow-[4px_4px_0_var(--ink)] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              SHOP THE GOOD STUFF →
            </a>
          </div>

          {/* Daisy mascot */}
          <div
            aria-hidden="true"
            className="relative mx-auto mt-8 w-56 max-w-full sm:w-72 md:absolute md:right-4 md:top-1/2 md:mt-0 md:w-[38%] md:-translate-y-1/2 lg:right-10 lg:w-[40%]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/daisy-mascot.png"
              alt=""
              className="h-auto w-full object-contain drop-shadow-[5px_5px_0_var(--ink)] transition duration-300 hover:-rotate-3 hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="shop" className="mx-auto max-w-7xl px-5 pb-20">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-black tracking-widest text-red">
              THE GOOD STUFF
            </p>

            <h2 className="text-3xl font-black sm:text-5xl">
              Freshly dropped.
            </h2>
          </div>

          {/* Search and sorting */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              placeholder="Find your next obsession..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-full border-2 border-ink bg-white px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-red sm:w-64"
              aria-label="Search products"
            />

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="rounded-full border-2 border-ink bg-cream px-4 py-3 text-sm font-bold"
              aria-label="Sort products"
            >
              <option value="default">Sort by: Default</option>
              <option value="price-low">Price: Low to high</option>
              <option value="price-high">Price: High to low</option>
              <option value="rating">Highest rated</option>
            </select>
          </div>
        </div>

        {loading && (
          <p className="py-10 text-center font-bold">
            Loading the good stuff...
          </p>
        )}

        {error && (
          <p className="py-10 text-center font-bold text-red">{error}</p>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <p className="py-10 text-center font-bold">
            No products found. Try another search!
          </p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
            {filteredProducts.map((product) => {
              const hasDiscount =
                product.discountedPrice < product.price;

              const discountPercentage =
                product.price > 0
                  ? Math.round(
                      ((product.price - product.discountedPrice) /
                        product.price) *
                        100
                    )
                  : 0;

              return (
                <Link
                  href={`/product/${product.id}`}
                  key={product.id}
                  className="group"
                >
                  <div className="relative aspect-square overflow-hidden rounded-2xl border-2 border-ink bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image.url}
                      alt={product.image.alt || product.title}
                      className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-105"
                    />

                    {hasDiscount && (
                      <span className="absolute left-3 top-3 rotate-[-5deg] bg-red px-3 py-2 text-xs font-black text-white">
                        -{discountPercentage}%
                      </span>
                    )}
                  </div>

                  <div className="mt-3">
                    <h3 className="text-sm font-bold sm:text-base">
                      {product.title}
                    </h3>

                    <p className="mt-1 text-sm">⭐ {product.rating}</p>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="font-black">
                        {formatPrice(product.discountedPrice)}
                      </span>

                      {hasDiscount && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* About */}
      <section
        id="about"
        className="border-t-2 border-ink bg-yellow px-5 py-12 text-center sm:py-16"
      >
        <p className="text-xs font-black tracking-widest">OUR MOTTO</p>

        <h2 className="mt-4 text-3xl font-black sm:text-5xl">
          Stay sweet.
          <br />
          Cause trouble.
        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm font-medium sm:text-base">
          Life is too short for boring stuff. We&apos;re here for the fun
          finds, the unexpected favourites, and everything in between.
        </p>
      </section>

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