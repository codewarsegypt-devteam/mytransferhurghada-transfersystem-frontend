"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Loader2, Mail } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    window.setTimeout(() => {
      setStatus("done");
      setEmail("");
    }, 900);
  };

  return (
    <section className="border-t border-white/10 bg-[#0D1B2A] py-14 lg:py-16">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A14A]">
            Join our community
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Receive deals &amp; travel tips
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
            Get occasional offers on transfers and trips — and save up to 20% on selected
            bookings when promotions run.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          onSubmit={submit}
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center"
        >
          <label className="sr-only" htmlFor="newsletter-email">
            Email address
          </label>
          <div className="relative flex-1 sm:max-w-md">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
            <input
              id="newsletter-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-white/10 py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/40 outline-none ring-0 transition focus:border-[#C9A14A]/60 focus:bg-white/5"
            />
          </div>
          <button
            type="submit"
            disabled={status === "loading" || status === "done"}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 disabled:opacity-70"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending…
              </>
            ) : status === "done" ? (
              "Subscribed"
            ) : (
              "Subscribe"
            )}
          </button>
        </motion.form>
        {status === "done" && (
          <p className="mt-3 text-sm text-emerald-300/90">
            Thanks — you’re on the list. (Demo: connect your email API here.)
          </p>
        )}
      </div>
    </section>
  );
}
