'use client';

import { MapPin, Calendar, Users, Search, Compass, Briefcase, Plane } from 'lucide-react';

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

            {/* Search Form - compact minimal */}
            <div className="bg-white/90 backdrop-blur rounded-xl border border-gray-200/80 shadow-sm p-3 animate-fade-in-up animation-delay-200">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:divide-x sm:divide-gray-200">
                {/* Location */}
                <div className="flex items-center gap-2 sm:flex-1 sm:px-3 py-2 min-w-0">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-gray-400 uppercase tracking-wide">Location</p>
                    <p className="text-sm text-gray-800 truncate font-medium">Where to next</p>
                  </div>
                </div>

                {/* Type */}
                <div className="flex items-center gap-2 sm:flex-1 sm:px-3 py-2 min-w-0">
                  <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-gray-400 uppercase tracking-wide">Type</p>
                    <p className="text-sm text-gray-800 truncate font-medium">Booking Type</p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 sm:flex-1 sm:px-3 py-2 min-w-0">
                  <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-gray-400 uppercase tracking-wide">Date</p>
                    <p className="text-sm text-gray-800 truncate font-medium">Select Date</p>
                  </div>
                </div>

                {/* Guests */}
                <div className="flex items-center gap-2 sm:flex-1 sm:px-3 py-2 min-w-0">
                  <Users className="w-4 h-4 text-gray-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-gray-400 uppercase tracking-wide">Guests</p>
                    <p className="text-sm text-gray-800 font-medium">02</p>
                  </div>
                </div>

                {/* Search Button */}
                <button className="sm:shrink-0 bg-[#F3722A] hover:bg-[#F15A22] text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors">
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </div>
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
