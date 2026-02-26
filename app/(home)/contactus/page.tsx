"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  MessageCircle,
  User,
  AtSign,
  Smartphone,
  PenLine,
} from "lucide-react";
import Button from "@/components/ui/Button";
import PageBanner from "@/components/pageBanner";

type Status = "idle" | "loading" | "success" | "error";
type FormData = { name: string; email: string; phone: string; message: string };

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizePhone(v: string) {
  // keep + and digits only
  return v.replace(/[^\d+]/g, "");
}

function validate(data: FormData) {
  const errs: Record<string, string> = {};
  const name = data.name.trim();
  const email = data.email.trim();
  const phone = normalizePhone(data.phone);
  const message = data.message.trim();

  if (name.length < 2) errs.name = "Please enter your full name";
  if (!email || !emailRegex.test(email)) errs.email = "Enter a valid email address";
  if (!phone || phone.replace("+", "").length < 8) errs.phone = "Enter a valid phone number";
  if (message.length < 10) errs.message = "Please add a bit more detail (min 10 characters)";

  return errs;
}

export default function ContactUsPage() {
  const whatsappNumber = "+201010836364";
  const whatsappLink = useMemo(() => {
    const digits = whatsappNumber.replace(/[^\d]/g, "");
    return `https://wa.me/${digits}`;
  }, [whatsappNumber]);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // anti-spam honeypot (keep hidden)
  const [company, setCompany] = useState("");

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const messageCount = formData.message.trim().length;

  const uiErrors = useMemo(() => {
    // show errors only for touched fields
    const all = validate(formData);
    const filtered: Record<string, string> = {};
    Object.keys(all).forEach((k) => {
      if (touched[k]) filtered[k] = all[k];
    });
    return filtered;
  }, [formData, touched]);

  const isValid = useMemo(() => Object.keys(validate(formData)).length === 0, [formData]);

  const setField = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const markTouched = (name: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const next = validate(formData);
    setErrors(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If bot filled honeypot, silently "succeed"
    if (company.trim()) {
      setStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
      setTouched({});
      setErrors({});
      setTimeout(() => setStatus("idle"), 3500);
      return;
    }

    const nextErrors = validate(formData);
    setErrors(nextErrors);
    setTouched({ name: true, email: true, phone: true, message: true });

    if (Object.keys(nextErrors).length) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          phone: normalizePhone(formData.phone),
          source: "contact",
        }),
      });

      const data = await response.json();

      if (data.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", phone: "", message: "" });
        setTouched({});
        setErrors({});
        setTimeout(() => setStatus("idle"), 4500);
      } else {
        setStatus("error");
        setErrorMessage(data.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Network error. Please check your connection and try again.");
      console.error("Contact form error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F6]">
      <PageBanner
        subtitle="Contact Us"
        title="Let’s Plan Your Next Adventure"
        description="Send us a message, or reach out instantly via WhatsApp. We usually reply within 24 hours."
        searchQuery=""
        setSearchQuery={() => {}}
        placeholder="Search for a trip"
        searchBar={false}
        bgImageUrl="/assets/contact.avif"
        bgImageAlt="Contact Image"
        bgOverlay={true}
      />

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            {/* LEFT: Contact + Quick Actions */}
            <motion.aside
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-5"
            >
              <div className="bg-white rounded-brand-lg shadow-soft-lg p-5 sm:p-6 md:p-8 lg:sticky lg:top-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#000000]">
                      Contact Information
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 mt-2">
                      Choose the fastest way to reach us.
                    </p>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
                    <Shield className="w-4 h-4" />
                    Trusted since 2010
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-3 rounded-xl border border-gray-200 p-4 hover:bg-[#F5F6F6] transition-colors"
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">WhatsApp</p>
                      <p className="text-sm text-gray-600 truncate">{whatsappNumber}</p>
                    </div>
                  </a>

                  <a
                    href="mailto:info@foxtravelegypt.com"
                    className="group flex items-center gap-3 rounded-xl border border-gray-200 p-4 hover:bg-[#F5F6F6] transition-colors"
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#F3722A] to-[#F15A22] flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">Email</p>
                      <p className="text-sm text-gray-600 truncate">info@foxtravelegypt.com</p>
                    </div>
                  </a>

                  <a
                    href={`tel:${whatsappNumber}`}
                    className="group flex items-center gap-3 rounded-xl border border-gray-200 p-4 hover:bg-[#F5F6F6] transition-colors"
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#111827] to-[#374151] flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">Call</p>
                      <p className="text-sm text-gray-600 truncate">{whatsappNumber}</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#2563EB] flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">Location</p>
                      <p className="text-sm text-gray-600 truncate">Hurghada, Red Sea — Egypt</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-xl bg-[#F5F6F6] p-4 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-700 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Response time</p>
                    <p className="text-sm text-gray-600">
                      Usually within 24 hours. For urgent requests, WhatsApp is fastest.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Button
                    href="/trips"
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto justify-center"
                  >
                    View Trips
                  </Button>

                  <a
                    href="/about"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 text-base bg-white text-[#F3722A] border-2 border-[#F3722A] rounded-lg font-semibold hover:bg-[#F5F6F6] transition-all duration-300"
                  >
                    About Fox Travel
                  </a>
                </div>
              </div>
            </motion.aside>

            {/* RIGHT: Form */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="lg:col-span-7"
            >
              <div className="bg-white rounded-brand-lg shadow-soft-lg p-5 sm:p-6 md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#000000]">
                      Send Us a Message
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 mt-2">
                      Tell us what you’re looking for (date, number of people, and preferred trip).
                    </p>
                  </div>

                  <div className="hidden md:flex items-center gap-2 text-xs text-gray-500">
                    <Shield className="w-4 h-4" />
                    Secure contact form
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {status === "success" && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3"
                      role="status"
                      aria-live="polite"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-green-800 font-semibold">Message sent successfully!</p>
                        <p className="text-green-700 text-sm">We’ll get back to you soon.</p>
                      </div>
                    </motion.div>
                  )}

                  {status === "error" && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
                      role="alert"
                    >
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-800 font-semibold">Failed to send message</p>
                        <p className="text-red-700 text-sm">{errorMessage}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  {/* Honeypot */}
                  <div className="hidden">
                    <label htmlFor="company">Company</label>
                    <input
                      id="company"
                      name="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      autoComplete="off"
                      tabIndex={-1}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div
                        className={`flex items-center gap-2 rounded-xl border px-4 py-3 focus-within:ring-2 transition-all ${
                          (uiErrors.name || errors.name)
                            ? "border-red-300 focus-within:ring-red-500"
                            : "border-gray-200 focus-within:ring-[#F3722A]"
                        }`}
                      >
                        <User className="w-4 h-4 text-gray-500 shrink-0" />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={(e) => setField("name", e.target.value)}
                          onBlur={() => markTouched("name")}
                          className="w-full outline-none bg-transparent text-gray-900 placeholder:text-gray-400"
                          placeholder="John Doe"
                          autoComplete="name"
                        />
                      </div>
                      {(uiErrors.name || errors.name) && (
                        <p className="mt-1 text-sm text-red-600">{uiErrors.name || errors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div
                        className={`flex items-center gap-2 rounded-xl border px-4 py-3 focus-within:ring-2 transition-all ${
                          (uiErrors.email || errors.email)
                            ? "border-red-300 focus-within:ring-red-500"
                            : "border-gray-200 focus-within:ring-[#F3722A]"
                        }`}
                      >
                        <AtSign className="w-4 h-4 text-gray-500 shrink-0" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={(e) => setField("email", e.target.value)}
                          onBlur={() => markTouched("email")}
                          className="w-full outline-none bg-transparent text-gray-900 placeholder:text-gray-400"
                          placeholder="john@example.com"
                          autoComplete="email"
                          inputMode="email"
                        />
                      </div>
                      {(uiErrors.email || errors.email) && (
                        <p className="mt-1 text-sm text-red-600">{uiErrors.email || errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-800 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div
                      className={`flex items-center gap-2 rounded-xl border px-4 py-3 focus-within:ring-2 transition-all ${
                        (uiErrors.phone || errors.phone)
                          ? "border-red-300 focus-within:ring-red-500"
                          : "border-gray-200 focus-within:ring-[#F3722A]"
                      }`}
                    >
                      <Smartphone className="w-4 h-4 text-gray-500 shrink-0" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => setField("phone", e.target.value)}
                        onBlur={() => markTouched("phone")}
                        className="w-full outline-none bg-transparent text-gray-900 placeholder:text-gray-400"
                        placeholder="+20 101 083 6364"
                        autoComplete="tel"
                        inputMode="tel"
                      />
                    </div>
                    {(uiErrors.phone || errors.phone) && (
                      <p className="mt-1 text-sm text-red-600">{uiErrors.phone || errors.phone}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Tip: include your country code (e.g. +20).
                    </p>
                  </div>

                  {/* Message */}
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <label htmlFor="message" className="block text-sm font-semibold text-gray-800">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <span className={`text-xs ${messageCount < 10 ? "text-gray-400" : "text-gray-500"}`}>
                        {messageCount} chars
                      </span>
                    </div>

                    <div
                      className={`rounded-xl border px-4 py-3 focus-within:ring-2 transition-all ${
                        (uiErrors.message || errors.message)
                          ? "border-red-300 focus-within:ring-red-500"
                          : "border-gray-200 focus-within:ring-[#F3722A]"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <PenLine className="w-4 h-4 text-gray-500 shrink-0 mt-1" />
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={(e) => setField("message", e.target.value)}
                          onBlur={() => markTouched("message")}
                          rows={6}
                          className="w-full outline-none bg-transparent text-gray-900 placeholder:text-gray-400 resize-none"
                          placeholder="Example: 2 adults, next week, interested in snorkeling & island trip..."
                        />
                      </div>
                    </div>

                    {(uiErrors.message || errors.message) && (
                      <p className="mt-1 text-sm text-red-600">
                        {uiErrors.message || errors.message}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={status === "loading" || !isValid}
                      className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {status === "loading" ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </Button>

                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 text-base bg-white text-[#111827] border-2 border-gray-200 rounded-lg font-semibold hover:bg-[#F5F6F6] transition-all duration-300"
                    >
                      <MessageCircle className="w-5 h-5" />
                      WhatsApp Instead
                    </a>
                  </div>

                  <p className="text-xs text-gray-500">
                    By submitting, you agree to be contacted back about your inquiry. We never sell your data.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}