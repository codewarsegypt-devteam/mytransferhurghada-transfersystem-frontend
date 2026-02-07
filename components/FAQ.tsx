'use client';

import { useState } from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What's included in trips?",
    answer: "All our trips include transportation, professional guides, entrance fees to attractions, and meals as specified in the itinerary. Snorkeling trips include equipment (mask, fins, snorkel), life jackets, and refreshments. Hotel pickups and drop-offs are complimentary for most packages."
  },
  {
    question: "How does pickup & drop-off work?",
    answer: "We provide complimentary pickup and drop-off from your hotel in Hurghada. Our driver will contact you via WhatsApp the evening before to confirm the exact pickup time. For airport transfers, we track your flight in real-time to ensure timely pickup regardless of delays."
  },
  {
    question: "What is your cancellation policy?",
    answer: "Free cancellation up to 24 hours before the scheduled trip for a full refund. Cancellations within 24 hours are subject to a 50% fee. No-shows are non-refundable. Weather-related cancellations decided by us result in a full refund or rescheduling option."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, bank transfers, and cash payments (USD, EUR, or EGP). For online bookings, secure payment is processed through our encrypted payment gateway. You can also pay in person for certain services."
  },
  {
    question: "What's the difference between private and group trips?",
    answer: "Private trips are exclusively for your party with a dedicated guide and vehicle, offering flexibility in timing and itinerary. Group trips are shared with other travelers (maximum 15-20 people) at a lower cost, following a fixed schedule. Both options include the same quality of service and attractions."
  },
  {
    question: "How long do you wait for airport transfers?",
    answer: "For airport pickups, we monitor your flight in real-time and wait up to 60 minutes after your scheduled landing time at no extra charge. For hotel pickups, we allow a 10-minute grace period. Please contact us via WhatsApp if you anticipate any delays."
  },
  {
    question: "What should I bring on trips?",
    answer: "We recommend bringing sunscreen (reef-safe for sea trips), comfortable clothing, swimwear, towel, hat, sunglasses, and a camera. For desert trips, bring closed-toe shoes. For diving/snorkeling, we provide all equipment, but you're welcome to bring your own. Don't forget your ID/passport for certain attractions."
  },
  {
    question: "What happens if there's bad weather?",
    answer: "Safety is our top priority. If weather conditions are deemed unsafe by our team or local authorities, we'll contact you to reschedule or offer a full refund. For minor weather changes, trips proceed with appropriate modifications. We monitor forecasts closely and notify you 24 hours in advance if needed."
  },
  {
    question: "Do you offer group discounts?",
    answer: "Yes! We offer special rates for groups of 6 or more people. Family packages are also available with discounted rates for children under 12. Contact us via WhatsApp or email with your group size and preferred trips for a customized quote with the best possible pricing."
  },
  {
    question: "What safety measures do you take?",
    answer: "All our vehicles are regularly maintained and insured. Our guides are certified and trained in first aid. Life jackets are mandatory on all sea trips, and we provide high-quality snorkeling/diving equipment. We follow all Egyptian tourism safety regulations and have comprehensive insurance coverage for all activities."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-20 lg:py-32 bg-linear-to-b from-[#F5EDE4] to-white overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-[8%] opacity-20 animate-bounce-slow">
        <HelpCircle className="w-12 h-12 text-[#F3722A]" />
      </div>

      <div className="absolute bottom-32 left-[5%] opacity-15">
        <svg width="40" height="40" viewBox="0 0 40 40" className="text-[#F3722A]">
          <path d="M20 5 L24 17 L37 17 L27 25 L31 37 L20 29 L9 37 L13 25 L3 17 L16 17 Z" fill="currentColor" />
        </svg>
      </div>

      {/* Curved dashed line decoration */}
      <svg className="absolute top-1/4 left-[10%] opacity-20" width="200" height="200" viewBox="0 0 200 200">
        <path d="M10 100 Q 100 10, 190 100" stroke="#F3722A" strokeWidth="2" fill="none" strokeDasharray="8,8" strokeLinecap="round" />
      </svg>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-[#F3722A] font-medium text-lg lg:text-xl mb-3 handwriting-style">
            Got Questions?
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#2C3539] leading-tight mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Find answers to common questions about our trips, transfers, and services
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-300 overflow-hidden"
              >
                {/* Question Button */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-6 lg:px-8 lg:py-7 flex items-center justify-between text-left group hover:bg-[#FFF9F5] transition-colors duration-200"
                  aria-expanded={openIndex === index}
                >
                  <span className="text-lg lg:text-xl font-bold text-[#2C3539] pr-4 group-hover:text-[#F3722A] transition-colors duration-200">
                    {faq.question}
                  </span>
                  <div className="shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${openIndex === index
                        ? 'bg-[#F3722A] text-white rotate-180'
                        : 'bg-[#F5EDE4] text-[#F3722A] group-hover:bg-[#F3722A] group-hover:text-white'
                      }`}>
                      {openIndex === index ? (
                        <Minus className="w-5 h-5" />
                      ) : (
                        <Plus className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Answer Content */}
                <div
                  className={`transition-all duration-300 ease-in-out ${openIndex === index
                      ? 'max-h-96 opacity-100'
                      : 'max-h-0 opacity-0'
                    }`}
                >
                  <div className="px-6 pb-6 lg:px-8 lg:pb-7 pt-0">
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-gray-600 text-base lg:text-lg leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA - compact */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-6 px-6 rounded-2xl border border-gray-100 bg-white/60 backdrop-blur-sm shadow-2xl">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-semibold text-[#2C3539]">
                Still have questions?
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                We&apos;re here 24/7
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 shrink-0">
              <button className="btn-primary px-5 py-2.5 text-sm font-medium rounded-xl">
                WhatsApp
              </button>
              <button className="btn-secondary px-5 py-2.5 text-sm font-medium rounded-xl">
                Email
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
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
