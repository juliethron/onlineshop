
    "use client";

    import { useState } from "react";
    import Link from "next/link";

    type FormData = {
    name: string;
    email: string;
    subject: string;
    message: string;
    };

    type FormErrors = Partial<Record<keyof FormData, string>>;

    export default function ContactPage() {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [submitted, setSubmitted] = useState(false);

    function handleChange(
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

        setSubmitted(false);
    }

    function validateForm(): FormErrors {
        const name = formData.name.trim();
        const email = formData.email.trim();
        const subject = formData.subject.trim();
        const message = formData.message.trim();

        const newErrors: FormErrors = {};

        // Name must contain at least 3 non-space characters.
        if (name.length < 3) {
        newErrors.name = "Your name must be at least 3 characters long.";
        }

        // Require a name, domain, and domain ending with at least 2 letters.
        const emailPattern =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;

        if (!emailPattern.test(email)) {
        newErrors.email =
            "Please enter a valid email address, like name@example.com.";
        }

        if (subject.length < 3) {
        newErrors.subject =
            "Your subject must be at least 3 characters long.";
        }

        if (message.length < 10) {
        newErrors.message =
            "Your message must be at least 10 characters long.";
        }

        return newErrors;
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const validationErrors = validateForm();
        setErrors(validationErrors);

        // Stop submission if any validation errors exist.
        if (Object.keys(validationErrors).length > 0) {
        setSubmitted(false);
        return;
        }

        setSubmitted(true);

        setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        });

        setErrors({});
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
                DAISY<span className="text-red">.</span>DISASTER
            </Link>

            <Link
                href="/cart"
                className="text-sm font-bold transition hover:text-red"
            >
                Cart →
            </Link>
            </nav>
        </header>

        {/* Contact section */}
        <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:py-16 lg:grid-cols-2 lg:gap-16">
            {/* Intro */}
            <div className="flex flex-col justify-center">
            <p className="mb-3 text-xs font-black tracking-widest text-red">
                GOT SOMETHING TO SAY?
            </p>

            <h1 className="text-4xl font-black leading-tight sm:text-6xl">
                Let&apos;s talk.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed">
                Questions, feedback, or just want to tell us about your latest
                questionable decision? We&apos;re all ears.
            </p>

            <div className="mt-8 rounded-2xl border-2 border-ink bg-blue p-6">
                <p className="text-xl font-black">The Daisy Disaster team</p>
                <p className="mt-2 text-sm font-medium">
                We&apos;ll get back to you as soon as we can.
                </p>
            </div>
            </div>

            {/* Contact form */}
            <div className="rounded-3xl border-2 border-ink bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-black">Send us a message.</h2>

            <p className="mt-2 text-sm text-gray-600">
                Fill in the details below and we&apos;ll take it from there.
            </p>

            {submitted && (
                <div
                role="status"
                className="mt-6 rounded-xl border-2 border-ink bg-yellow p-4 font-bold"
                >
                ✓ Thanks for reaching out! Your message has been received.
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                noValidate
                className="mt-6 space-y-5"
            >
                {/* Name */}
                <div>
                <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-bold"
                >
                    Your name
                </label>

                <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    placeholder="What should we call you?"
                    className="w-full rounded-xl border-2 border-ink px-4 py-3 outline-none focus:ring-2 focus:ring-red"
                />

                {errors.name && (
                    <p id="name-error" className="mt-2 text-sm font-bold text-red">
                    {errors.name}
                    </p>
                )}
                </div>

                {/* Email */}
                <div>
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
                    value={formData.email}
                    onChange={handleChange}
                    required
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border-2 border-ink px-4 py-3 outline-none focus:ring-2 focus:ring-red"
                />

                {errors.email && (
                    <p
                    id="email-error"
                    className="mt-2 text-sm font-bold text-red"
                    >
                    {errors.email}
                    </p>
                )}
                </div>

                {/* Subject */}
                <div>
                <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-bold"
                >
                    Subject
                </label>

                <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    aria-invalid={Boolean(errors.subject)}
                    aria-describedby={
                    errors.subject ? "subject-error" : undefined
                    }
                    placeholder="What is this about?"
                    className="w-full rounded-xl border-2 border-ink px-4 py-3 outline-none focus:ring-2 focus:ring-red"
                />

                {errors.subject && (
                    <p
                    id="subject-error"
                    className="mt-2 text-sm font-bold text-red"
                    >
                    {errors.subject}
                    </p>
                )}
                </div>

                {/* Message */}
                <div>
                <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-bold"
                >
                    Message
                </label>

                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={
                    errors.message ? "message-error" : undefined
                    }
                    placeholder="Tell us everything..."
                    className="w-full resize-y rounded-xl border-2 border-ink px-4 py-3 outline-none focus:ring-2 focus:ring-red"
                />

                {errors.message && (
                    <p
                    id="message-error"
                    className="mt-2 text-sm font-bold text-red"
                    >
                    {errors.message}
                    </p>
                )}
                </div>

                <button
                type="submit"
                className="w-full rounded-full border-2 border-ink bg-red px-7 py-4 font-black text-white shadow-[4px_4px_0_var(--ink)] transition hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                >
                SEND MESSAGE →
                </button>

                <p className="text-center text-xs text-gray-500">
                This is a demo contact form. It doesn&apos;t send an actual email.
                </p>
            </form>
            </div>
        </section>

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

