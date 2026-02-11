'use client';

import Link from 'next/link';
import {
  Car,
  MapPin,
  ShieldCheck,
  Clock,
  CreditCard,
  ArrowRight,
} from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import { WhatsAppCTA } from '@/components/ui/WhatsAppCTA';

const benefits = [
  {
    icon: MapPin,
    title: 'Door-to-door',
    description: 'Airport, hotel, or any address in Hurghada and the Red Sea.',
  },
  {
    icon: ShieldCheck,
    title: 'Fixed prices',
    description: 'No surprises. See the total before you book.',
  },
  {
    icon: Clock,
    title: 'On time',
    description: 'We track flights and confirm pick-up so you travel stress-free.',
  },
  {
    icon: CreditCard,
    title: 'Pay your way',
    description: 'Card online or pay cash to the driver.',
  },
];

export default function TransferPage() {
  return (
    <div className="min-h-screen bg-[#F5F6F6]">
      {/* Hero Section - matches trips page structure */}
      <section className="relative bg-linear-to-br from-[#F3722A] via-[#F15A22] to-[#F36F24] text-white py-20 md:py-28 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 border-2 border-white rounded-full" />
          <div className="absolute bottom-20 right-20 w-96 h-96 border-2 border-white rounded-full" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="handwriting-style text-2xl md:text-3xl mb-4 text-white/90">
              Comfortable Rides
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Book Your Transfer
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10">
              Reliable airport and hotel transfers in Hurghada. Fixed prices, modern vehicles, and a smooth ride every time.
            </p>

            <Link
              href="/transfer/book"
              className="inline-flex items-center gap-2 bg-white text-(--accent-orange) px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <Car className="w-6 h-6" />
              <span>Start your transfer</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <SectionHeader
            subtitle="Why book with us"
            title="Simple, reliable transfers"
            description="From airport pickups to hotel drop-offs, we make getting around the Red Sea easy and stress-free."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {benefits.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="card rounded-brand-lg p-6 hover:shadow-soft-lg transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-(--accent-orange)/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-(--accent-orange)" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#2C3539] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-12 md:mt-16 text-center">
            <Link href="/transfer/book" className="btn-primary inline-flex items-center gap-2">
              <Car className="w-5 h-5" />
              <span>Book your transfer now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <WhatsAppCTA
        title="Need a custom route or group transfer?"
        description="Chat with us on WhatsApp and we'll arrange the perfect ride for you"
        buttonLabel="Chat on WhatsApp"
        variant="gradient"
      />
    </div>
  );
}
