
    "use client";

    import { useState } from "react";
    import Link from "next/link";
    import { useRouter } from "next/navigation";
    import { useCart } from "@/app/context/CartContext";
    import { formatPrice } from "@/lib/formatPrice";

    type CheckoutFormData = {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    postalCode: string;
    city: string;
    country: string;
    };

    type CheckoutErrors = Partial<Record<keyof CheckoutFormData, string>>;

    /* Keep this component OUTSIDE CheckoutPage to avoid the React render error. */
    function ErrorMessage({ message }: { message?: string }) {
    if (!message) return null;

    return (
        <p className="mt-2 text-sm font-bold text-red" role="alert">
        {message}
        </p>
    );
    }

    export default function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCart();
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<CheckoutFormData>({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        postalCode: "",
        city: "",
        country: "Norway",
    });

    const [errors, setErrors] = useState<CheckoutErrors>({});

    function handleChange(
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        const { name, value } = event.target;

        setFormData((previous) => ({
        ...previous,
        [name]: value,
        }));

        setErrors((previous) => ({
        ...previous,
        [name]: "",
        }));
    }

    function validateForm(): CheckoutErrors {
        const firstName = formData.firstName.trim();
        const lastName = formData.lastName.trim();
        const email = formData.email.trim();
        const address = formData.address.trim();
        const postalCode = formData.postalCode.trim();
        const city = formData.city.trim();

        const newErrors: CheckoutErrors = {};

        // Names must contain at least 2 letters, not just spaces or symbols.
        const namePattern = /^[\p{L}][\p{L}' -]*[\p{L}]$/u;

        if (firstName.length < 2 || !namePattern.test(firstName)) {
        newErrors.firstName =
            "Please enter a valid first name with at least 2 letters.";
        }

        if (lastName.length < 2 || !namePattern.test(lastName)) {
        newErrors.lastName =
            "Please enter a valid last name with at least 2 letters.";
        }

        // Requires text before @, a domain, and a domain ending with 2+ letters.
        const emailPattern =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;

        if (!emailPattern.test(email)) {
        newErrors.email =
            "Please enter a valid email address, like name@example.com.";
        }

        // Reject very short addresses and addresses made only of spaces.
        if (address.length < 5 || !/[a-zA-Z0-9]/.test(address)) {
        newErrors.address =
            "Please enter a valid street address with at least 5 characters.";
        }

        // Norwegian postal codes must be exactly 4 digits.
        if (formData.country === "Norway") {
        if (!/^\d{4}$/.test(postalCode)) {
            newErrors.postalCode =
            "Norwegian postal codes must contain exactly 4 digits.";
        }
        } else if (postalCode.length < 3 || !/[a-zA-Z0-9]/.test(postalCode)) {
        newErrors.postalCode =
            "Please enter a valid postal code with at least 3 characters.";
        }

        // City must have at least 2 letters.
        const cityPattern = /^[\p{L}][\p{L}' -]*[\p{L}]$/u;

        if (city.length < 2 || !cityPattern.test(city)) {
        newErrors.city = "Please enter a valid city name.";
        }

        if (!formData.country.trim()) {
        newErrors.country = "Please select a country.";
        }

        return newErrors;
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (cart.length === 0 || isSubmitting) {
        return;
        }

        const validationErrors = validateForm();
        setErrors(validationErrors);

        // Do not place the order if any field is invalid.
        if (Object.keys(validationErrors).length > 0) {
        return;
        }

        setIsSubmitting(true);

        // Save order details for the success page.
        sessionStorage.setItem(
        "daisy-disaster-order",
        JSON.stringify({
            items: cart,
            total: cartTotal,
            customer: {
            ...formData,
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email.trim(),
            address: formData.address.trim(),
            postalCode: formData.postalCode.trim(),
            city: formData.city.trim(),
            },
        })
        );

        clearCart();
        router.push("/checkout-success");
    }

    function inputClassName(hasError: boolean) {
        return `w-full rounded-xl border-2 ${
        hasError ? "border-red" : "border-ink"
        } px-4 py-3 outline-none focus:ring-2 focus:ring-red`;
    }

    if (cart.length === 0) {
        return (
        <main className="min-h-screen bg-cream px-5 py-20 text-center">
            <p className="mb-3 text-xs font-black tracking-widest text-red">
            NOTHING TO CHECK OUT
            </p>

            <h1 className="text-4xl font-black">Your cart is empty.</h1>

            <p className="mt-4">Looks like you need a little more trouble.</p>

            <Link
            href="/"
            className="mt-8 inline-block rounded-full border-2 border-ink bg-red px-7 py-4 font-black text-white shadow-[4px_4px_0_var(--ink)]"
            >
            BACK TO SHOP →
            </Link>
        </main>
        );
    }

    return (
        <main className="min-h-screen bg-cream">
        {/* Header */}
        <header className="border-b-2 border-ink">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
            <Link
                href="/"
                className="text-2xl font-black tracking-tight sm:text-3xl"
            >
                DAISY<span className="text-red">.</span>DISASTER
            </Link>

            <Link href="/cart" className="text-sm font-bold hover:text-red">
                ← Back to cart
            </Link>
            </nav>
        </header>

        {/* Checkout */}
        <section className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
            <p className="mb-3 text-xs font-black tracking-widest text-red">
            ALMOST YOURS
            </p>

            <h1 className="text-4xl font-black sm:text-6xl">
            Let&apos;s check out.
            </h1>

            <p className="mt-4 text-base">
            Just a few details before your questionable decisions arrive.
            </p>

            <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            {/* Customer form */}
            <form
                onSubmit={handleSubmit}
                noValidate
                className="rounded-3xl border-2 border-ink bg-white p-6 sm:p-8"
            >
                <h2 className="text-2xl font-black">Your details.</h2>

                <p className="mt-2 text-sm text-gray-600">
                Where should we send your good stuff?
                </p>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {/* First name */}
                <div>
                    <label
                    htmlFor="firstName"
                    className="mb-2 block text-sm font-bold"
                    >
                    First name
                    </label>

                    <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    autoComplete="given-name"
                    value={formData.firstName}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.firstName)}
                    aria-describedby={
                        errors.firstName ? "firstName-error" : undefined
                    }
                    className={inputClassName(Boolean(errors.firstName))}
                    />

                    <ErrorMessage message={errors.firstName} />
                </div>

                {/* Last name */}
                <div>
                    <label
                    htmlFor="lastName"
                    className="mb-2 block text-sm font-bold"
                    >
                    Last name
                    </label>

                    <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.lastName)}
                    aria-describedby={
                        errors.lastName ? "lastName-error" : undefined
                    }
                    className={inputClassName(Boolean(errors.lastName))}
                    />

                    <ErrorMessage message={errors.lastName} />
                </div>

                {/* Email */}
                <div className="sm:col-span-2">
                    <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold"
                    >
                    Email address
                    </label>

                    <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={inputClassName(Boolean(errors.email))}
                    />

                    <ErrorMessage message={errors.email} />
                </div>

                {/* Street address */}
                <div className="sm:col-span-2">
                    <label
                    htmlFor="address"
                    className="mb-2 block text-sm font-bold"
                    >
                    Street address
                    </label>

                    <input
                    id="address"
                    name="address"
                    type="text"
                    required
                    autoComplete="street-address"
                    value={formData.address}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.address)}
                    aria-describedby={
                        errors.address ? "address-error" : undefined
                    }
                    className={inputClassName(Boolean(errors.address))}
                    />

                    <ErrorMessage message={errors.address} />
                </div>

                {/* Postal code */}
                <div>
                    <label
                    htmlFor="postalCode"
                    className="mb-2 block text-sm font-bold"
                    >
                    Postal code
                    </label>

                    <input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    required
                    autoComplete="postal-code"
                    value={formData.postalCode}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.postalCode)}
                    aria-describedby={
                        errors.postalCode ? "postalCode-error" : undefined
                    }
                    className={inputClassName(Boolean(errors.postalCode))}
                    />

                    <ErrorMessage message={errors.postalCode} />
                </div>

                {/* City */}
                <div>
                    <label
                    htmlFor="city"
                    className="mb-2 block text-sm font-bold"
                    >
                    City
                    </label>

                    <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    autoComplete="address-level2"
                    value={formData.city}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.city)}
                    aria-describedby={errors.city ? "city-error" : undefined}
                    className={inputClassName(Boolean(errors.city))}
                    />

                    <ErrorMessage message={errors.city} />
                </div>

                {/* Country */}
                <div className="sm:col-span-2">
                    <label
                    htmlFor="country"
                    className="mb-2 block text-sm font-bold"
                    >
                    Country
                    </label>

                    <select
                    id="country"
                    name="country"
                    required
                    autoComplete="country-name"
                    value={formData.country}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.country)}
                    aria-describedby={
                        errors.country ? "country-error" : undefined
                    }
                    className={inputClassName(Boolean(errors.country))}
                    >
                    <option value="Norway">Norway</option>
                    <option value="Sweden">Sweden</option>
                    <option value="Denmark">Denmark</option>
                    <option value="Finland">Finland</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Other">Other</option>
                    </select>

                    <ErrorMessage message={errors.country} />
                </div>
                </div>

                <button
                type="submit"
                disabled={isSubmitting}
                className="mt-8 w-full rounded-full border-2 border-ink bg-red px-7 py-4 font-black text-white shadow-[4px_4px_0_var(--ink)] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                {isSubmitting ? "PLACING YOUR ORDER..." : "PLACE YOUR ORDER →"}
                </button>

                <p className="mt-4 text-center text-xs text-gray-500">
                Demo checkout — no real payment will be processed.
                </p>
            </form>

            {/* Order summary */}
            <aside className="h-fit rounded-3xl border-2 border-ink bg-yellow p-6 sm:p-8 lg:sticky lg:top-8">
                <p className="text-xs font-black tracking-widest">THE DAMAGE</p>

                <h2 className="mt-3 text-3xl font-black">Order summary.</h2>

                <div className="mt-6 space-y-5">
                {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 border-ink bg-white">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-contain p-2"
                        />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="font-bold">{item.title}</p>
                        <p className="text-sm">Qty: {item.quantity}</p>
                    </div>

                    <p className="text-sm font-black">
                        {formatPrice(item.price * item.quantity)}
                    </p>
                    </div>
                ))}
                </div>

                <div className="mt-6 border-t-2 border-ink pt-5">
                <div className="flex justify-between gap-4 text-sm">
                    <span>Subtotal</span>
                    <span className="font-bold">{formatPrice(cartTotal)}</span>
                </div>

                <div className="mt-3 flex justify-between gap-4 text-sm">
                    <span>Shipping</span>
                    <span className="text-right font-bold">
                    Calculated at checkout
                    </span>
                </div>

                <div className="mt-5 flex justify-between gap-4 border-t-2 border-ink pt-5">
                    <span className="font-black">Total</span>
                    <span className="text-2xl font-black">
                    {formatPrice(cartTotal)}
                    </span>
                </div>

                <p className="mt-2 text-xs">Shipping calculated at checkout.</p>
                </div>
            </aside>
            </div>
        </section>
        </main>
    );
    }