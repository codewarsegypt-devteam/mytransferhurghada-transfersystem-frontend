'use client';

import { Compass, Briefcase, Plane } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-[#F5E6D8] overflow-hidden pt-20">
      {/* Decorative Elements */}
      {/* <div className="absolute top-32 right-[15%] opacity-20">
        <Plane className="w-12 h-12 text-[#F3722A] rotate-45" />
      </div> */}
      {/* <div className="absolute top-48 right-[12%] opacity-30">
        <div className="w-20 h-20 border-4 border-[#F3722A] rounded-full" />
      </div> */}
      <div className="absolute bottom-1/3 right-[5%] opacity-25">
        <Plane
          className="w-10 h-10 text-[#F3722A] animate-pulse"
          style={{ animationDuration: '3s' , animationDelay: '1s' }}
        />
      </div>

      {/* Content Container */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="relative z-10">
            {/* Welcome Text */}
            <p className="text-[#F3722A] font-medium text-3xl  mb-4 animate-fade-in-up handwriting-style">
              Welcome to Fox Travel
            </p>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-black mb-10 leading-tight animate-fade-in-up animation-delay-100">
              Adventure &
              <br />
              Experience
              <br />
              The Travel !
            </h1>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-200">
              <button className="bg-[#F3722A] hover:bg-[#F15A22] text-white px-8 py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform">
                <Compass className="w-5 h-5" />
                <span>Explore Our Trips</span>
              </button>
              
              <button className="bg-white hover:bg-gray-50 text-[#F3722A] border-2 border-[#F3722A] px-8 py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hover:scale-105 transform">
                <Plane className="w-5 h-5" />
                <span>Book a Transfer</span>
              </button>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative lg:block hidden">
            {/* Decorative Elements Around Image */}
            <div className="absolute -top-10 -left-10 opacity-40">
              <Compass className="w-16 h-16 text-[#F3722A] animate-spin-slow" />
            </div>

            {/* Main Circular Image Container */}
            <div className="relative">
              {/* Circular Background Shape */}
              <div className="absolute inset-0 rounded-full bg-linear-to-br from-[#F3722A]/20 to-transparent transform scale-110 blur-2xl" />

              {/* Image Container with Organic Shape */}
              <div className="relative w-full aspect-square rounded-full overflow-hidden shadow-2xl">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=2070')",
                    clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)"
                  }}
                />
              </div>

              {/* Decorative Icon - Bottom Left */}
              <div
                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-full shadow-xl animate-bounce"
                style={{ animationDuration: '7s' , animationDelay: '1.2s' }}
              >
                <Compass className="w-10 h-10 text-[#F3722A] " />
              </div>

              {/* Decorative Icon - Top Right */}
              <div
                className="absolute -top-6 -right-6 bg-white p-4 rounded-full shadow-xl animate-bounce"
                style={{ animationDuration: '7s' , animationDelay: '1s' }}
              >
                <Briefcase className="w-10 h-10 text-[#F3722A] " />
              </div>
            </div>


          </div>
        </div>
      </div>

      {/* Bottom Decorative Wave - Optional */}
      <div className="absolute bottom-0 left-0 right-0 opacity-10">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="#F3722A" />
        </svg>
      </div>
    </section>
  );
}
