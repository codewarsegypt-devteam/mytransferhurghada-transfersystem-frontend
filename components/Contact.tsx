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
    transition: { staggerChildren: 0.12 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
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
  if (!email || !emailRegex.test(email)) errs.email = "Enter a valid email address";
  if (!phone || phone.replace("+", "").length < 8) errs.phone = "Enter a valid phone number";
  if (message.length < 10) errs.message = "Please add a bit more detail";

  return errs;
}

const Contact = () => {
  const whatsappNumber = "+201027241392";

  const whatsappLink = useMemo(() => {
    const digits = whatsappNumber.replace(/[^\d]/g, "");
    return `https://wa.me/${digits}`;
  }, []);

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
    setErrors(validate(formData));
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
        setErrorMessage(data.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Network error. Please check your connection and try again.");
      console.error("Contact form error:", error);
    }
  };

  const fieldClass =
    "w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400";
  const normalClass = "border-slate-200 focus:border-main focus:ring-4 focus:ring-main/10";
  const errorClass = "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10";

  return (
    <motion.section
      className="relative overflow-hidden bg-[#F8FAFC] py-16 lg:py-20 border-t border-[#E2E8F0]"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-[-120px] h-[280px] w-[280px] rounded-full bg-[#C9A14A]/10 blur-3xl" />
        <div className="absolute bottom-[-120px] left-[-120px] h-[280px] w-[280px] rounded-full bg-main/5 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Left side */}
            <motion.div variants={fadeUp} className="lg:col-span-5">
              <div className="max-w-xl">
                <span className="inline-flex rounded-full border border-[#C9A14A]/20 bg-[#C9A14A]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#C9A14A]">
                  Contact Us
                </span>

                <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                  Let’s plan your next trip.
                </h2>

                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  Send us your travel details and our team will get back to you with
                  the best options for trips, transfers, and private experiences.
                </p>
              </div>

              {/* Contact strip */}
              <div className="mt-8 space-y-3">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#25D366]/15 text-[#25D366]">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900">WhatsApp</p>
                    <p className="text-sm text-slate-500">{whatsappNumber}</p>
                  </div>
                </a>

                <a
                  href="mailto:info@foxtravelegypt.com"
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-main/10 text-main">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900">Email</p>
                    <p className="text-sm text-slate-500">info@gmail.com</p>
                  </div>
                </a>

                <a
                  href={`tel:${whatsappNumber}`}
                  className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C9A14A]/15 text-[#C9A14A]">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900">Call Us</p>
                    <p className="text-sm text-slate-500">{whatsappNumber}</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900">Location</p>
                    <p className="text-sm text-slate-500">Hurghada, Red Sea — Egypt</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Form side */}
            <motion.div variants={fadeUp} className="lg:col-span-7">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] sm:p-8">
                <div className="mb-6">
                  <h3 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                    Send a message
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Share your dates, destination, or preferred activity and we’ll reply soon.
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {status === "success" && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="mb-5 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                      <div>
                        <p className="text-sm font-bold text-green-800">
                          Message sent successfully
                        </p>
                        <p className="mt-1 text-xs text-green-700">
                          We’ll get back to you as soon as possible.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {status === "error" && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4"
                    >
                      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                      <div>
                        <p className="text-sm font-bold text-red-800">
                          Couldn’t send your message
                        </p>
                        <p className="mt-1 text-xs text-red-700">{errorMessage}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.form
                  variants={sectionVariants}
                  onSubmit={handleSubmit}
                  className="space-y-5"
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

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <motion.div variants={fadeUp}>
                      <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-800">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => setField("name", e.target.value)}
                          onBlur={() => markTouched("name")}
                          autoComplete="name"
                          placeholder="John Doe"
                          className={`pl-11 ${fieldClass} ${uiErrors.name || errors.name ? errorClass : normalClass}`}
                        />
                      </div>
                      {(uiErrors.name || errors.name) && (
                        <p className="mt-1 text-xs text-red-600">{uiErrors.name || errors.name}</p>
                      )}
                    </motion.div>

                    <motion.div variants={fadeUp}>
                      <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-800">
                        Email Address
                      </label>
                      <div className="relative">
                        <AtSign className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setField("email", e.target.value)}
                          onBlur={() => markTouched("email")}
                          autoComplete="email"
                          inputMode="email"
                          placeholder="john@example.com"
                          className={`pl-11 ${fieldClass} ${uiErrors.email || errors.email ? errorClass : normalClass}`}
                        />
                      </div>
                      {(uiErrors.email || errors.email) && (
                        <p className="mt-1 text-xs text-red-600">{uiErrors.email || errors.email}</p>
                      )}
                    </motion.div>
                  </div>

                  <motion.div variants={fadeUp}>
                    <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-slate-800">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Smartphone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setField("phone", e.target.value)}
                        onBlur={() => markTouched("phone")}
                        autoComplete="tel"
                        inputMode="tel"
                        placeholder="+20 101 083 6364"
                        className={`pl-11 ${fieldClass} ${uiErrors.phone || errors.phone ? errorClass : normalClass}`}
                      />
                    </div>
                    {(uiErrors.phone || errors.phone) && (
                      <p className="mt-1 text-xs text-red-600">{uiErrors.phone || errors.phone}</p>
                    )}
                  </motion.div>

                  <motion.div variants={fadeUp}>
                    <div className="mb-2 flex items-center justify-between">
                      <label htmlFor="message" className="block text-sm font-semibold text-slate-800">
                        Message
                      </label>
                      <span className="text-xs text-slate-400">
                        {formData.message.trim().length} chars
                      </span>
                    </div>

                    <div className="relative">
                      <PenLine className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-400" />
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setField("message", e.target.value)}
                        onBlur={() => markTouched("message")}
                        placeholder="Example: 2 adults, interested in a private transfer and island trip next week..."
                        className={`resize-none pl-11 pt-4 ${fieldClass} ${uiErrors.message || errors.message ? errorClass : normalClass}`}
                      />
                    </div>

                    {(uiErrors.message || errors.message) && (
                      <p className="mt-1 text-xs text-red-600">{uiErrors.message || errors.message}</p>
                    )}
                  </motion.div>

                  <motion.div variants={fadeUp} className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={status === "loading" || !isValid}
                      className="flex w-full flex-1 items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {status === "loading" ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>

                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-full flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                    >
                      <MessageCircle className="h-4 w-4 text-[#25D366]" />
                      WhatsApp Instead
                    </a>
                  </motion.div>

                  <motion.p variants={fadeUp} className="text-xs text-slate-400">
                    By submitting, you agree to be contacted about your inquiry.
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