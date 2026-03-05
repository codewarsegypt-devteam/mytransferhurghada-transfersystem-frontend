import { Search } from "lucide-react";
import React from "react";
import Image from "next/image";

type PageBannerProps = {
  subtitle: string;
  title: string;
  description: string;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  placeholder: string;
  searchBar?: boolean;

  /** Reusable background image */
  bgImageUrl?: string;
  bgImageAlt?: string;
  bgOverlay?: boolean;
};

const PageBanner = ({
  subtitle,
  title,
  description,
  searchQuery,
  setSearchQuery,
  placeholder,
  searchBar = true,
  bgImageUrl,
  bgImageAlt = "",
  bgOverlay = true,
}: PageBannerProps) => {
  return (
    <section className="relative text-white py-20 md:py-28 overflow-hidden">
      {/* ✅ Background image */}
      {bgImageUrl && (
        <Image
          src={bgImageUrl}
          alt={bgImageAlt}
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 object-cover object-center"
        />
      )}

      {/* ✅ Gradient layer (keeps your existing look) */}
      {/* <div
        className="absolute inset-0 bg-linear-to-br from-[#F3722A] via-[#F15A22] to-[#F36F24]"
        aria-hidden
      /> */}

      {/* ✅ Optional dark overlay to improve text contrast over photos */}
      {bgImageUrl && bgOverlay && (
        <div className="absolute inset-0 bg-black/35" aria-hidden />
      )}

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" aria-hidden>
        <div className="absolute top-10 left-10 w-64 h-64 border-2 border-white rounded-full" />
        <div className="absolute bottom-20 right-20 w-96 h-96 border-2 border-white rounded-full" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="handwriting-style text-2xl md:text-3xl mb-4 text-white/90">
            {subtitle}
          </p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {title}
          </h1>

          <p className="text-lg md:text-xl text-white/90 mb-8">{description}</p>

          {searchBar && (
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={placeholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/80 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-xl"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PageBanner;
