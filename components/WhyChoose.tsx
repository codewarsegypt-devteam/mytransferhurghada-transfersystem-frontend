'use client';

import { Shield, Users, Car, DollarSign, Lock, MessageCircle } from 'lucide-react';
import SectionHeader from './SectionHeader';

export default function WhyChoose() {
  const features = [
    {
      title: 'Licensed Travel Agency',
      description: 'Fully licensed and certified by Egyptian tourism authorities',
      icon: Shield,
    },
    {
      title: 'Trusted Local Experts',
      description: 'Professional guides with deep knowledge of Egypt\'s treasures',
      icon: Users,
    },
    {
      title: 'Modern Vehicles',
      description: 'Comfortable, air-conditioned vehicles for all transfers',
      icon: Car,
    },
    // {
    //   title: 'Clear Pricing',
    //   description: 'No hidden fees - what you see is what you pay',
    //   icon: DollarSign,
    // },
    // {
    //   title: 'Secure Booking & Payment',
    //   description: 'Safe and encrypted payment processing for your peace of mind',
    //   icon: Lock,
    // },
    // {
    //   title: '24/7 WhatsApp Support',
    //   description: 'Always available to assist you throughout your journey',
    //   icon: MessageCircle,
    // },
  ];

  return (
    <section className=" relative py-14 lg:py-20 bg-linear-to-b from-[#F5E6D8] via-white to-[#F5E6D8] overflow-hidden">
      {/* Subtle background pattern */}
      {/* <div
        className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_1px_at_1px_1px,#2C3539_1px,transparent_0)] bg-[length:32px_32px]"
        aria-hidden
      /> */}

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - tighter */}
        {/* <div className="text-center mb-10 lg:mb-12 max-w-3xl mx-auto">
          <p className="text-main font-semibold text-sm uppercase tracking-widest mb-2">
            Why Choose Us
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#2C3539] leading-tight mb-4">
            Why Choose Fox Travel Egypt
          </h2>
          <p className="text-gray-600 text-base lg:text-lg">
            Trusted service, clear advantages, and a commitment to excellence
          </p>
        </div> */}
        <SectionHeader
          subtitle="Why Choose Us"
          title="Why Choose Fox Travel Egypt"
          description="Trusted service, clear advantages, and a commitment to excellence"
        />

        {/* Feature Cards Grid - more compact, modern cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-main/20 transition-all duration-300 cursor-pointer hover:-translate-y-1"
              >
                {/* Soft glow on hover */}
                <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-main/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" aria-hidden />

                {/* Icon - slightly smaller, modern pill */}
                <div className="relative mb-4">
                  <div className="w-14 h-14 bg-main rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-md group-hover:shadow-main/30 group-hover:shadow-lg">
                    <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                  </div>
                </div>

                {/* Content - tighter typography */}
                <div className="relative">
                  <h3 className="text-lg font-bold text-[#2C3539] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-snug">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Badge - compact */}
        <div className="text-center mt-8 lg:mt-10">
          <div className="inline-flex items-center gap-2.5 bg-white/90 backdrop-blur-sm border border-gray-100 px-6 py-3 rounded-full shadow-sm">
            <Shield className="w-5 h-5 text-main shrink-0" />
            <p className="text-gray-800 font-semibold text-sm">
              Trusted by over <span className="text-main">10,000+</span> happy travelers
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
