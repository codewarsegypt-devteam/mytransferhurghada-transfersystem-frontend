'use client';

import { Waves, Anchor, Fish, Ship, Plus } from 'lucide-react';
import Button from './ui/Button';

export default function SeaAdventures() {
  const adventures = [
    {
      title: 'Snorkeling Trips',
      description: 'Discover colorful coral reefs and marine life in crystal clear waters',
      icon: Fish,
    },
    {
      title: 'Diving Trips',
      description: 'Explore the depths with professional guides and equipment',
      icon: Anchor,
    },
    {
      title: 'Island Trips',
      description: 'Visit Orange Bay & Paradise Island for unforgettable experiences',
      icon: Waves,
    },
    {
      title: 'Private Yacht',
      description: 'Exclusive luxury yacht rentals for your perfect sea adventure',
      icon: Ship,
    },
  ];

  // Sample user avatars for the counter
  const userImages = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  ];

  return (
    <section className="relative py-8 lg:py-15 bg-[#F5E6D8] overflow-hidden">
      {/* Decorative Elements */}
      {/* <div className="absolute top-20 left-[5%] opacity-20 animate-bounce-slow">
        <svg width="40" height="40" viewBox="0 0 40 40" className="text-[#F3722A]">
          <path d="M20 5 L24 17 L37 17 L27 25 L31 37 L20 29 L9 37 L13 25 L3 17 L16 17 Z" fill="currentColor"/>
        </svg>
      </div> */}
      
      <div className="absolute bottom-1/3 left-[8%] opacity-15">
        <Waves className="w-16 h-16 text-[#F3722A]" />
      </div>

      {/* Curved dashed line decoration */}
      <svg className="absolute top-1/4 right-[15%] opacity-20" width="200" height="200" viewBox="0 0 200 200">
        <path d="M10 100 Q 100 10, 190 100" stroke="#F3722A" strokeWidth="2" fill="none" strokeDasharray="8,8" strokeLinecap="round"/>
      </svg>

      {/* Airplane decoration */}
      <div className="absolute bottom-40 right-[12%] opacity-25">
        <Ship className="w-16 h-16 text-[#F3722A]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Creative Image Collage */}
          <div className="relative">
            {/* Main Blob Shape with Images */}
            <div className="relative">
              {/* Main organic blob background */}
              <div 
                className="relative w-full aspect-square max-w-lg mx-auto"
                style={{
                  clipPath: "circle(50% at 50% 50%)"
                }}
              >
                {/* Main large image */}
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070')"
                  }}
                />
              </div>

              {/* Floating circular images */}
              <div className="absolute -top-8 left-[10%] w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl animate-float">
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070')"
                  }}
                />
              </div>

              <div className="absolute top-1/3 -right-8 w-28 h-28 lg:w-36 lg:h-36 rounded-full overflow-hidden border-4 border-white shadow-xl animate-float-delayed">
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=2074')"
                  }}
                />
              </div>

              {/* Decorative scissors icon */}
              {/* <div className="absolute -top-4 right-[15%] opacity-60">
                <svg width="30" height="30" viewBox="0 0 30 30" className="text-[#F3722A]">
                  <path d="M15 5 L25 15 L15 25 M15 5 L5 15 L15 25" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div> */}

              {/* Destination Counter Badge */}
              <div className="absolute -bottom-6 left-[5%] lg:left-[10%] bg-white rounded-full px-6 py-3 shadow-xl">
                <p className="text-2xl lg:text-3xl font-bold text-[#F3722A]">100000+</p>
                <p className="text-xs lg:text-sm text-gray-600 handwriting-style">destinations</p>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <p className="text-[#F3722A] font-medium text-3xl mb-3 handwriting-style">
                Best Features
              </p>
              <h2 className="text-4xl lg:text-5xl font-bold text-black leading-tight mb-6">
                Mapping Adventures,
                <br />
                Making Moments
              </h2>
              <p className="text-gray-600 text-lg">
                Content of a page when looking at layout the point of using lorem the is ipsum less normal
              </p>
            </div>

            {/* Adventure Cards */}
            <div className="space-y-4">
              {adventures.map((adventure, index) => {
                const Icon = adventure.icon;
                return (
                  <div 
                    key={index}
                    className="flex items-start space-x-4 p-5 bg-white rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-300 group cursor-pointer"
                  >
                    <div className="shrink-0">
                      <div className="w-14 h-14 bg-[#F3722A] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-black mb-1">
                        {adventure.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {adventure.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Section */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <Button href="#sea-trips" size="lg">Explore Sea Trips</Button>

              {/* User Count */}
              <div className="flex items-center space-x-3">
                <div className="flex -space-x-3">
                  {userImages.map((img, i) => (
                    <div 
                      key={i}
                      className="w-12 h-12 rounded-full border-3 border-white overflow-hidden shadow-md"
                    >
                      <div 
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${img})` }}
                      />
                    </div>
                  ))}
                  <div className="w-12 h-12 rounded-full border-3 border-white bg-[#F3722A] flex items-center justify-center shadow-md">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-black">18k+</p>
                  <p className="text-sm text-gray-600">Individual Traveller</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 1s;
        }

        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
