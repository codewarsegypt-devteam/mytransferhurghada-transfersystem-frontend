"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
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

type Status = "idle" | "loading" | "success" | "error";
type FormData = { name: string; email: string; phone: string; message: string };

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.14 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" },
  },
};

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: "easeOut" },
  },
};

const fadeRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: "easeOut" },
  },
};

function normalizePhone(v: string) {
  return v.replace(/[^\d+]/g, "");
}

function validate(data: FormData) {
  const errs: Record<string, string> = {};
  const name = data.name.trim();
  const email = data.email.trim();
  const phone = normalizePhone(data.phone);
  const message = data.message.trim();

  if (name.length < 2) errs.name = "Please enter your full name";
  if (!email || !emailRegex.test(email))
    errs.email = "Enter a valid email address";
  if (!phone || phone.replace("+", "").length < 8)
    errs.phone = "Enter a valid phone number";
  if (message.length < 10)
    errs.message = "Please add a bit more detail (min 10 characters)";

  return errs;
}

const Contact = () => {
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

  const [company, setCompany] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const messageCount = formData.message.trim().length;

  const uiErrors = useMemo(() => {
    const all = validate(formData);
    const filtered: Record<string, string> = {};
    Object.keys(all).forEach((k) => {
      if (touched[k]) filtered[k] = all[k];
    });
    return filtered;
  }, [formData, touched]);

  const isValid = useMemo(
    () => Object.keys(validate(formData)).length === 0,
    [formData]
  );

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
        setErrorMessage(
          data.message || "Failed to send message. Please try again."
        );
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        "Network error. Please check your connection and try again."
      );
      console.error("Contact form error:", error);
    }
  };

  const inputBase =
    "flex items-center gap-2 rounded-md border px-4 py-3 focus-within:ring-2 transition-all bg-white";
  const inputValid = "border-[#E2E8F0] focus-within:ring-[#1B3565]/30 focus-within:border-[#1B3565]";
  const inputError = "border-red-300 focus-within:ring-red-500/30";

  return (
    <motion.section
      className="bg-[#F8FAFC] border-t border-[#E2E8F0]"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            {/* LEFT */}
            <motion.aside variants={fadeLeft} className="lg:col-span-5">
              <div className="bg-[#0D1B2A] rounded-md shadow-[0_8px_40px_rgba(13,27,42,0.25)] p-6 sm:p-7 lg:sticky lg:top-6 border border-white/5">
                {/* Gold accent */}
                <div className="w-10 h-[3px] bg-[#C9A14A] mb-6" />

                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      Contact Information
                    </h3>
                    <p className="text-sm text-white/50 mt-1.5">
                      Choose the fastest way to reach us.
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-white/40">
                    <Shield className="w-3.5 h-3.5" />
                    Trusted since 2010
                  </div>
                </div>

                <motion.div
                  variants={sectionVariants}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  <motion.a
                    variants={fadeUp}
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-3 rounded-md border border-white/8 p-4 hover:bg-white/6 hover:border-[#C9A14A]/20 transition-all"
                  >
                    <div className="w-10 h-10 rounded-sm bg-linear-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center shrink-0">
                      <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">WhatsApp</p>
                      <p className="text-xs text-white/50 truncate">{whatsappNumber}</p>
                    </div>
                  </motion.a>

                  <motion.a
                    variants={fadeUp}
                    href="mailto:info@foxtravelegypt.com"
                    className="group flex items-center gap-3 rounded-md border border-white/8 p-4 hover:bg-white/6 hover:border-[#C9A14A]/20 transition-all"
                  >
                    <div className="w-10 h-10 rounded-sm bg-[#C9A14A] flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">Email</p>
                      <p className="text-xs text-white/50 truncate">info@foxtravelegypt.com</p>
                    </div>
                  </motion.a>

                  <motion.a
                    variants={fadeUp}
                    href={`tel:${whatsappNumber}`}
                    className="group flex items-center gap-3 rounded-md border border-white/8 p-4 hover:bg-white/6 hover:border-[#C9A14A]/20 transition-all"
                  >
                    <div className="w-10 h-10 rounded-sm bg-main flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">Call</p>
                      <p className="text-xs text-white/50 truncate">{whatsappNumber}</p>
                    </div>
                  </motion.a>

                  <motion.div
                    variants={fadeUp}
                    className="flex items-center gap-3 rounded-md border border-white/8 p-4"
                  >
                    <div className="w-10 h-10 rounded-sm bg-secondary flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">Location</p>
                      <p className="text-xs text-white/50 truncate">Hurghada, Red Sea — Egypt</p>
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  className="mt-5 rounded-md bg-white/5 border border-white/8 p-4 flex items-start gap-3"
                >
                  <Clock className="w-4 h-4 text-[#C9A14A] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-white">Response time</p>
                    <p className="text-sm text-white/50 mt-0.5">
                      Usually within 24 hours. For urgent requests, WhatsApp is fastest.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  className="mt-5 flex flex-col sm:flex-row gap-3"
                >
                  <button
                    onClick={() => (window.location.href = "/trips")}
                    className="w-full sm:w-auto justify-center bg-[#C9A14A] text-white rounded-md cursor-pointer font-semibold shadow-md hover:bg-[#DDB96A] transition-all duration-200 px-6 py-3 text-sm"
                  >
                    View Trips
                  </button>
                  <a
                    href="/about"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-sm bg-transparent text-white border border-white/15 rounded-md font-semibold hover:bg-white/8 transition-all duration-200"
                  >
                    About Fox Travel
                  </a>
                </motion.div>
              </div>
            </motion.aside>

            {/* RIGHT */}
            <motion.div variants={fadeRight} className="lg:col-span-7">
              <div className="bg-white rounded-md shadow-soft-lg border border-[#E2E8F0] p-6 sm:p-7">
                {/* Gold accent */}
                <div className="w-10 h-[3px] bg-[#C9A14A] mb-6" />

                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
                      Send Us a Message
                    </h2>
                    <p className="text-sm text-slate-500 mt-1.5">
                      Tell us what you're looking for — date, number of people, and preferred trip.
                    </p>
                  </div>
                  <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400">
                    <Shield className="w-3.5 h-3.5" />
                    Secure form
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {status === "success" && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-5 p-4 bg-green-50 border border-green-200 rounded-md flex items-start gap-3"
                      role="status"
                      aria-live="polite"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-green-800 font-semibold text-sm">Message sent successfully!</p>
                        <p className="text-green-700 text-xs mt-0.5">We'll get back to you soon.</p>
                      </div>
                    </motion.div>
                  )}
                  {status === "error" && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-5 p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-3"
                      role="alert"
                    >
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-800 font-semibold text-sm">Failed to send message</p>
                        <p className="text-red-700 text-xs mt-0.5">{errorMessage}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.form
                  variants={sectionVariants}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
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

                  <motion.div
                    variants={fadeUp}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-[#0F172A] mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className={`${inputBase} ${uiErrors.name || errors.name ? inputError : inputValid}`}>
                        <User className="w-4 h-4 text-slate-400 shrink-0" />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={(e) => setField("name", e.target.value)}
                          onBlur={() => markTouched("name")}
                          className="w-full outline-none bg-transparent text-[#0F172A] placeholder:text-slate-400 text-sm"
                          placeholder="John Doe"
                          autoComplete="name"
                        />
                      </div>
                      {(uiErrors.name || errors.name) && (
                        <p className="mt-1 text-xs text-red-600">{uiErrors.name || errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-[#0F172A] mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className={`${inputBase} ${uiErrors.email || errors.email ? inputError : inputValid}`}>
                        <AtSign className="w-4 h-4 text-slate-400 shrink-0" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={(e) => setField("email", e.target.value)}
                          onBlur={() => markTouched("email")}
                          className="w-full outline-none bg-transparent text-[#0F172A] placeholder:text-slate-400 text-sm"
                          placeholder="john@example.com"
                          autoComplete="email"
                          inputMode="email"
                        />
                      </div>
                      {(uiErrors.email || errors.email) && (
                        <p className="mt-1 text-xs text-red-600">{uiErrors.email || errors.email}</p>
                      )}
                    </div>
                  </motion.div>

                  <motion.div variants={fadeUp}>
                    <label htmlFor="phone" className="block text-sm font-semibold text-[#0F172A] mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className={`${inputBase} ${uiErrors.phone || errors.phone ? inputError : inputValid}`}>
                      <Smartphone className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => setField("phone", e.target.value)}
                        onBlur={() => markTouched("phone")}
                        className="w-full outline-none bg-transparent text-[#0F172A] placeholder:text-slate-400 text-sm"
                        placeholder="+20 101 083 6364"
                        autoComplete="tel"
                        inputMode="tel"
                      />
                    </div>
                    {(uiErrors.phone || errors.phone) && (
                      <p className="mt-1 text-xs text-red-600">{uiErrors.phone || errors.phone}</p>
                    )}
                    <p className="mt-1 text-xs text-slate-400">Include your country code (e.g. +20).</p>
                  </motion.div>

                  <motion.div variants={fadeUp}>
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <label htmlFor="message" className="block text-sm font-semibold text-[#0F172A]">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <span className={`text-xs ${messageCount < 10 ? "text-slate-300" : "text-slate-400"}`}>
                        {messageCount} chars
                      </span>
                    </div>
                    <div className={`rounded-md border px-4 py-3 focus-within:ring-2 transition-all bg-white ${uiErrors.message || errors.message ? inputError : inputValid}`}>
                      <div className="flex items-start gap-2">
                        <PenLine className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={(e) => setField("message", e.target.value)}
                          onBlur={() => markTouched("message")}
                          rows={5}
                          className="w-full outline-none bg-transparent text-[#0F172A] placeholder:text-slate-400 resize-none text-sm"
                          placeholder="Example: 2 adults, next week, interested in snorkeling & island trip..."
                        />
                      </div>
                    </div>
                    {(uiErrors.message || errors.message) && (
                      <p className="mt-1 text-xs text-red-600">{uiErrors.message || errors.message}</p>
                    )}
                  </motion.div>

                  <motion.div
                    variants={fadeUp}
                    className="flex flex-col sm:flex-row gap-3 pt-1"
                  >
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={status === "loading" || !isValid}
                      className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {status === "loading" ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </Button>

                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 text-sm bg-white text-[#0F172A] border border-[#E2E8F0] rounded-md font-semibold hover:bg-[#F8FAFC] hover:border-main/20 transition-all duration-200"
                    >
                      <MessageCircle className="w-4 h-4 text-[#25D366]" />
                      WhatsApp Instead
                    </a>
                  </motion.div>

                  <motion.p variants={fadeUp} className="text-xs text-slate-400 pt-1">
                    By submitting, you agree to be contacted back about your inquiry. We never sell your data.
                  </motion.p>
                </motion.form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Contact;
