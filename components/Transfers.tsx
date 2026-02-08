'use client';

import { Car, Shield, DollarSign, Clock, CheckCircle, MapPin } from 'lucide-react';
import SectionHeader from './SectionHeader';
import Button from './ui/Button';

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
    <section className="relative pt-8 lg:pt-15 px-4 bg-linear-to-b from-white via-[#F5EDE4] to-white overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-10 right-[8%] opacity-20">
        <svg width="50" height="50" viewBox="0 0 50 50" className="text-[#F3722A]">
          <circle cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="5,5" />
        </svg>
      </div>

      <div className="absolute bottom-20 left-[5%] opacity-15 animate-bounce-slow">
        <Car className="w-20 h-20 text-[#F3722A]" />
      </div>

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


        {/* Key Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-15 md:mb-20">
          {keyFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-5 md:p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1 text-center group"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#F3722A] bg-opacity-10 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>
                <h3 className="text-base md:text-lg font-bold text-[#2C3539] mb-2">
                  {feature.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Trust Indicators */}
        {/* <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#F3722A] bg-opacity-10 rounded-full flex items-center justify-center mb-3">
                <Shield className="w-8 h-8 text-[#F3722A]" />
              </div>
              <h4 className="text-2xl font-bold text-[#2C3539] mb-1">100% Safe</h4>
              <p className="text-gray-600 text-sm">Verified Drivers</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#F3722A] bg-opacity-10 rounded-full flex items-center justify-center mb-3">
                <CheckCircle className="w-8 h-8 text-[#F3722A]" />
              </div>
              <h4 className="text-2xl font-bold text-[#2C3539] mb-1">5000+ Trips</h4>
              <p className="text-gray-600 text-sm">Successfully Completed</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#F3722A] bg-opacity-10 rounded-full flex items-center justify-center mb-3">
                <Clock className="w-8 h-8 text-[#F3722A]" />
              </div>
              <h4 className="text-2xl font-bold text-[#2C3539] mb-1">24/7 Support</h4>
              <p className="text-gray-600 text-sm">Always Available</p>
            </div>
          </div>
        </div> */}

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button href="/transfer" size="lg">
            Book Airport Transfer
          </Button>
          {/* <button className="bg-white hover:bg-gray-50 text-[#F3722A] border-2 border-[#F3722A] px-8 py-[15px] text-base rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-md w-full sm:w-auto">
            All Transfers
          </button> */}
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
