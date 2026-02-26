'use client';

import { Car, Shield, DollarSign, Clock, CheckCircle, MapPin } from 'lucide-react';
import SectionHeader from './SectionHeader';
import Button from './ui/Button';
import Link from 'next/link';

interface TransferOption {
  id: number;
  title: string;
  description: string;
  routes: string[];
  price: string;
  duration: string;
  image: string;
  popular?: boolean;
}

const transferOptions: TransferOption[] = [
  {
    id: 1,
    title: "Airport Transfer",
    description: "Comfortable ride from airport to your hotel",
    routes: ["Hurghada Airport", "Hotel Zone", "Downtown"],
    price: "25",
    duration: "30-45 min",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80",
    popular: true
  },
  {
    id: 2,
    title: "Hotel Transfer",
    description: "Convenient transfers between hotels",
    routes: ["Any Hotel", "Beach Resorts", "City Hotels"],
    price: "20",
    duration: "20-40 min",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
    popular: false
  },
  {
    id: 3,
    title: "Custom Transfer",
    description: "Personalized transfers to any destination",
    routes: ["Custom Route", "Multiple Stops", "Flexible"],
    price: "35",
    duration: "Flexible",
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
    popular: false
  }
];

const keyFeatures = [
  {
    icon: DollarSign,
    title: "Fixed Prices",
    description: "No surprises, no hidden fees"
  },
  {
    icon: Car,
    title: "Air-Conditioned",
    description: "Modern, comfortable vehicles"
  },
  {
    icon: Shield,
    title: "Professional Drivers",
    description: "Licensed & experienced"
  },
  {
    icon: Clock,
    title: "Pickup on Time",
    description: "Reliable & punctual service"
  }
];

function TransferCard({ option }: { option: TransferOption }) {
  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
          style={{
            backgroundImage: `url('${option.image}')`
          }}
        />

        {/* Popular Badge */}
        {option.popular && (
          <div className="absolute top-4 left-4 bg-[#F9C74F] text-gray-900 px-3 py-1.5 rounded-lg font-semibold text-sm shadow-md flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            Most Popular
          </div>
        )}

        {/* Price Badge */}
        {/* <div className="absolute bottom-4 right-4 bg-[#F3722A] text-white px-4 py-2 rounded-lg font-bold shadow-lg">
          <div className="text-2xl leading-none">${option.price}</div>
          <div className="text-xs opacity-90">per transfer</div>
        </div> */}
      </div>

      {/* Card Content */}
      <div className="p-6">
        <h3 className="text-xl md:text-2xl font-bold text-[#2C3539] mb-2">
          {option.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4">
          {option.description}
        </p>

        <div className="mb-4">
          <div className="flex items-start text-gray-600 text-sm mb-2">
            <MapPin className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-[#F3722A]" />
            <div className="flex flex-wrap gap-2">
              {option.routes.map((route, idx) => (
                <span
                  key={idx}
                  className="bg-[#F5EDE4] px-2 py-1 rounded text-xs"
                >
                  {route}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-gray-600 text-sm">
            <Clock className="w-4 h-4 mr-1 text-[#F3722A]" />
            <span>{option.duration}</span>
          </div>

          <button className="bg-[#F3722A] hover:bg-[#F15A22] text-white px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-md">
            Book Now
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default function Transfers() {
  return (
    <section className="relative py-8 lg:py-15 px-4 bg-linear-to-b from-white via-[#F5EDE4] to-white overflow-hidden">
      {/* Decorative Elements
      <div className="absolute top-10 right-[8%] opacity-20">
        <svg width="50" height="50" viewBox="0 0 50 50" className="text-[#F3722A]">
          <circle cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="5,5" />
        </svg>
      </div>

      <div className="absolute bottom-20 left-[5%] opacity-15 animate-bounce-slow">
        <Car className="w-20 h-20 text-[#F3722A]" />
      </div> */}

      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <SectionHeader
          subtitle="Reliable Transportation"
          title="Private Transfers — Safe & Comfortable"
          description="Experience hassle-free travel with our professional transfer services. Fixed prices, modern vehicles, and timely pickups guaranteed."
        />



        {/* Transfer Options Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {transferOptions.map((option) => (
            <TransferCard key={option.id} option={option} />
          ))}
        </div>


        {/* Key Features — compact strip */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10 md:mb-14">
          {keyFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 md:flex-col md:gap-2 bg-white/90 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-gray-100/80 shadow-sm hover:shadow-md hover:border-main/20 transition-all duration-200 group"
              >
                <div className="flex shrink-0 items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-lg bg-main/15 text-main group-hover:bg-main group-hover:text-white transition-colors duration-200">
                  <Icon className="w-5 h-5 md:w-5 md:h-5" />
                </div>
                <div className="min-w-0 md:text-center">
                  <h3 className="text-sm font-semibold text-[#2C3539] leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div> */}


        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/transfer" className="btn-primary inline-flex items-center gap-2">
            Book Airport Transfer
          </Link>
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
