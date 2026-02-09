'use client';

import { 
  Compass, 
  Briefcase, 
  Plane, 
  Palmtree, 
  Camera, 
  MapPin, 
  Sun, 
  Star, 
  Anchor,
  MapPinned,
  Waves,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-linear-to-br from-[#F5E6D8] via-[#FFF5EB] to-[#F5E6D8] overflow-hidden pt-20">
      {/* Animated Background Gradient Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-[#F3722A]/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#F3722A]/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
      
      {/* Floating Decorative Icons */}
      <div className="absolute top-32 left-[8%] opacity-30 animate-float" style={{ animationDelay: '0s' }}>
        <Palmtree className="w-12 h-12 text-[#F3722A]" />
      </div>
      
      <div className="absolute top-[20%] right-[12%] opacity-25 animate-float" style={{ animationDelay: '1s' }}>
        <Camera className="w-10 h-10 text-[#F3722A]" />
      </div>
      
      <div className="absolute bottom-[30%] right-[8%] opacity-20 animate-float" style={{ animationDelay: '2s' }}>
        <Plane className="w-14 h-14 text-[#F3722A]" />
      </div>
      
      <div className="absolute bottom-[40%] left-[5%] opacity-25 animate-float" style={{ animationDelay: '1.5s' }}>
        <Anchor className="w-11 h-11 text-[#F3722A]" />
      </div>
      
      <div className="absolute top-[60%] left-[15%] opacity-20 animate-float" style={{ animationDelay: '3s' }}>
        <MapPin className="w-9 h-9 text-[#F3722A]" />
      </div>
      
      <div className="absolute top-[45%] right-[5%] opacity-30 animate-float" style={{ animationDelay: '2.5s' }}>
        <Star className="w-8 h-8 text-[#F3722A]" />
      </div>

      <div className="absolute bottom-[20%] left-[20%] opacity-25 animate-float" style={{ animationDelay: '1.8s' }}>
        <Waves className="w-10 h-10 text-[#F3722A]" />
      </div>

      {/* Content Container */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="relative z-10">
            {/* Sparkle Effect */}
            <div className="absolute -top-8 -left-8 animate-spin-slow">
              <Sparkles className="w-16 h-16 text-[#F3722A] opacity-40" />
            </div>
            
            {/* Welcome Text with gradient */}
            <p className="text-[#F3722A] font-medium text-3xl mb-4 animate-fade-in-up handwriting-style relative inline-block">
              Welcome to Fox Travel
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-linear-to-r from-[#F3722A] to-transparent animate-expand-width" />
            </p>

            {/* Main Heading with text shadow and gradient */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-black mb-10 leading-tight animate-fade-in-up animation-delay-100 relative">
              <span className="inline-block hover:scale-105 transition-transform cursor-default">Adventure</span> <span className="text-[#F3722A]">&</span>
              <br />
              <span className="inline-block hover:scale-105 transition-transform cursor-default bg-linear-to-r from-black to-[#F3722A] bg-clip-text text-transparent">Experience</span>
              <br />
              <span className="inline-block hover:scale-105 transition-transform cursor-default">The Travel</span> <span className="text-[#F3722A] animate-pulse">!</span>
            </h1>

            {/* Stats or Trust Badges - Optional Enhancement */}
            <div className="flex gap-6 mb-8 animate-fade-in-up animation-delay-150">
              <div className="flex items-center gap-2">
                <div className="bg-[#F3722A]/10 p-2 rounded-full">
                  <MapPinned className="w-5 h-5 text-[#F3722A]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-black">50+</p>
                  <p className="text-sm text-gray-600">Destinations</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-[#F3722A]/10 p-2 rounded-full">
                  <Star className="w-5 h-5 text-[#F3722A]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-black">4.9</p>
                  <p className="text-sm text-gray-600">Rating</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons with enhanced effects */}
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-200">
              <Link 
                href="/trips" 
                className="group bg-linear-to-r from-[#F3722A] to-[#F15A22] hover:from-[#F15A22] hover:to-[#E04A12] text-white px-8 py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-[#F3722A]/50 hover:scale-105 transform relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Compass className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                <span>Explore Our Trips</span>
              </Link>
              
              <Link 
                href="/transfer" 
                className="group bg-white hover:bg-linear-to-r hover:from-white hover:to-[#FFF5EB] text-[#F3722A] border-2 border-[#F3722A] px-8 py-4 rounded-xl text-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-[#F3722A]/30 hover:scale-105 transform relative overflow-hidden"
              >
                <Plane className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                <span>Book a Transfer</span>
              </Link>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative lg:block hidden">
            {/* Animated Compass - Top Left */}
            <div className="absolute -top-10 -left-10 opacity-40 animate-spin-slow">
              <Compass className="w-20 h-20 text-[#F3722A]" />
            </div>
            
            {/* Sun Icon - Top Right */}
            <div className="absolute -top-8 -right-8 opacity-30 animate-pulse" style={{ animationDuration: '3s' }}>
              <Sun className="w-24 h-24 text-[#F3722A]" />
            </div>

            {/* Main Image Container */}
            <div className="relative animate-fade-in-up animation-delay-300">
              {/* Gradient Glow Effect */}
              <div className="absolute inset-0 rounded-full bg-linear-to-br from-[#F3722A]/30 via-[#F3722A]/10 to-transparent transform scale-110 blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />

              {/* Rotating Ring */}
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-[#F3722A]/30 animate-spin-slow" style={{ animationDuration: '20s' }} />

              {/* Image Container with Modern Shape */}
              <div className="relative w-full aspect-square rounded-full overflow-hidden shadow-2xl shadow-[#F3722A]/20 hover:shadow-3xl hover:shadow-[#F3722A]/30 transition-shadow duration-500">
                <div
                  className="w-full h-full bg-cover bg-center transform hover:scale-110 transition-transform duration-700"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=2070')",
                    clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)"
                  }}
                />
              </div>

              {/* Floating Decorative Icons Around Image */}
              <div
                className="absolute -bottom-8 -left-8 bg-linear-to-br from-white to-[#FFF5EB] p-5 rounded-2xl shadow-2xl animate-float backdrop-blur-sm border border-[#F3722A]/20"
                style={{ animationDelay: '0s' }}
              >
                <Compass className="w-12 h-12 text-[#F3722A]" />
              </div>

              <div
                className="absolute -top-6 -right-6 bg-linear-to-br from-white to-[#FFF5EB] p-5 rounded-2xl shadow-2xl animate-float backdrop-blur-sm border border-[#F3722A]/20"
                style={{ animationDelay: '1s' }}
              >
                <Camera className="w-12 h-12 text-[#F3722A]" />
              </div>

              <div
                className="absolute top-1/4 -left-10 bg-linear-to-br from-white to-[#FFF5EB] p-4 rounded-2xl shadow-xl animate-float backdrop-blur-sm border border-[#F3722A]/20"
                style={{ animationDelay: '2s' }}
              >
                <Palmtree className="w-10 h-10 text-[#F3722A]" />
              </div>

              <div
                className="absolute bottom-1/4 -right-10 bg-linear-to-br from-white to-[#FFF5EB] p-4 rounded-2xl shadow-xl animate-float backdrop-blur-sm border border-[#F3722A]/20"
                style={{ animationDelay: '1.5s' }}
              >
                <Briefcase className="w-10 h-10 text-[#F3722A]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 opacity-20 animate-pulse" style={{ animationDuration: '6s' }}>
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="url(#wave-gradient)" />
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F3722A" />
              <stop offset="50%" stopColor="#F15A22" />
              <stop offset="100%" stopColor="#F3722A" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
}
