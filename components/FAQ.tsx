"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import Link from "next/link";
import SectionHeader from "./SectionHeader";
import { buildWhatsAppHref } from "@/components/ui/WhatsAppCTA";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What's included in trips?",
    answer:
      "All our trips include transportation, professional guides, entrance fees to attractions, and meals as specified in the itinerary. Snorkeling trips include equipment (mask, fins, snorkel), life jackets, and refreshments. Hotel pickups and drop-offs are complimentary for most packages.",
  },
  {
    question: "How does pickup & drop-off work?",
    answer:
      "We provide complimentary pickup and drop-off from your hotel in Hurghada. Our driver will contact you via WhatsApp the evening before to confirm the exact pickup time. For airport transfers, we track your flight in real-time to ensure timely pickup regardless of delays.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "Free cancellation up to 24 hours before the scheduled trip for a full refund. Cancellations within 24 hours are subject to a 50% fee. No-shows are non-refundable. Weather-related cancellations decided by us result in a full refund or rescheduling option.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, bank transfers, and cash payments (USD, EUR, or EGP). For online bookings, secure payment is processed through our encrypted payment gateway. You can also pay in person for certain services.",
  },
  {
    question: "What's the difference between private and group trips?",
    answer:
      "Private trips are exclusively for your party with a dedicated guide and vehicle, offering flexibility in timing and itinerary. Group trips are shared with other travelers (maximum 15-20 people) at a lower cost, following a fixed schedule. Both options include the same quality of service and attractions.",
  },
];

interface FAQProps {
  /** When "page", the section header is hidden (e.g. when used on the dedicated FAQ page with PageBanner). */
  variant?: "section" | "page";
}

export default function FAQ({ variant = "section" }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="relative py-6 lg:py-12 bg-linear-to-b from-white to-[#F5EDE4] overflow-hidden">
      <div
        className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_1px_at_1px_1px,#2C3539_1px,transparent_0)] bg-[length:32px_32px] pointer-events-none"
        aria-hidden
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - hidden on dedicated FAQ page */}
        {variant === "section" && (
          <div className="text-center mb-8 lg:mb-10">
            <SectionHeader
              subtitle="Got Questions?"
              title="Frequently Asked Questions"
              description="Find answers to common questions about our trips, transfers, and services"
            />
          </div>
        )}

        {/* FAQ Accordion */}
        <div className="max-w-6xl mx-auto">
          <div className="space-y-3">
            {faqData.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-soft hover:shadow-soft-lg transition-all duration-300 overflow-hidden"
                >
                  {/* Question Button */}
                  <button
                    type="button"
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-5 py-4 lg:px-6 lg:py-5 flex items-center justify-between text-left group hover:bg-[#FFF9F5] transition-colors duration-200"
                    aria-expanded={isOpen}
                  >
                    <span className="text-base lg:text-lg font-bold text-[#2C3539] pr-3 group-hover:text-[#F3722A] transition-colors duration-200">
                      {faq.question}
                    </span>
                    <div className="shrink-0">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isOpen
                            ? "bg-[#F3722A] text-white"
                            : "bg-[#F5EDE4] text-[#F3722A] group-hover:bg-[#F3722A] group-hover:text-white"
                        }`}
                      >
                        {isOpen ? (
                          <Minus className="w-4 h-4" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Answer - show when open */}
                  {isOpen && (
                    <div className="px-5 pb-4 lg:px-6 lg:pb-5 pt-0 border-t border-gray-100">
                      <p className="text-gray-600 text-sm lg:text-base leading-relaxed pt-3">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA - compact */}
        {/* <div className="mt-8 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4 px-5 rounded-xl border border-gray-100 bg-white/60 backdrop-blur-sm shadow-2xl">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-semibold text-[#2C3539]">
                Still have questions?
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                We&apos;re here 24/7
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 shrink-0">
              <a
                href={buildWhatsAppHref("+201010836364", "Hi, I have a question.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary px-5 py-2.5 text-sm font-medium rounded-xl"
              >
                WhatsApp
              </a>
              <Link
                href="/contactus"
                className="btn-secondary px-5 py-2.5 text-sm font-medium rounded-xl inline-block text-center"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div> */}
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
