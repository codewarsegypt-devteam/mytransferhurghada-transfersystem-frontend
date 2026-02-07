'use client';

import { Shield, Users, Car, DollarSign, Lock, MessageCircle } from 'lucide-react';

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
    {
      title: 'Clear Pricing',
      description: 'No hidden fees - what you see is what you pay',
      icon: DollarSign,
    },
    {
      title: 'Secure Booking & Payment',
      description: 'Safe and encrypted payment processing for your peace of mind',
      icon: Lock,
    },
    {
      title: '24/7 WhatsApp Support',
      description: 'Always available to assist you throughout your journey',
      icon: MessageCircle,
    },
  ];

  return (
    <section className="relative py-20 lg:py-32 bg-linear-to-b from-white to-[#F5EDE4] overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-[8%] opacity-20 animate-bounce-slow">
        <svg width="40" height="40" viewBox="0 0 40 40" className="text-[#F3722A]">
          <path d="M20 5 L24 17 L37 17 L27 25 L31 37 L20 29 L9 37 L13 25 L3 17 L16 17 Z" fill="currentColor"/>
        </svg>
      </div>

      <div className="absolute bottom-32 right-[5%] opacity-15">
        <Shield className="w-16 h-16 text-[#F3722A]" />
      </div>

      {/* Curved dashed line decoration */}
      <svg className="absolute top-1/4 left-[10%] opacity-20" width="200" height="200" viewBox="0 0 200 200">
        <path d="M10 100 Q 100 10, 190 100" stroke="#F3722A" strokeWidth="2" fill="none" strokeDasharray="8,8" strokeLinecap="round"/>
      </svg>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-[#F3722A] font-medium text-lg lg:text-xl mb-3 handwriting-style">
            Why Choose Us
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-[#2C3539] leading-tight mb-6">
            Why Choose Fox Travel Egypt
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Experience the difference with our trusted service, competitive advantages, and commitment to excellence
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-soft hover:shadow-soft-lg transition-all duration-300 group cursor-pointer hover:-translate-y-2"
              >
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-20 h-20 bg-[#F3722A] rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-[#2C3539] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Optional Trust Badge or Additional Info */}
        <div className="text-center mt-12 lg:mt-16">
          <div className="inline-flex items-center space-x-3 bg-white px-8 py-4 rounded-full shadow-soft">
            <Shield className="w-6 h-6 text-[#F3722A]" />
            <p className="text-gray-800 font-semibold">
              Trusted by over <span className="text-[#F3722A]">10,000+</span> happy travelers
            </p>
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
