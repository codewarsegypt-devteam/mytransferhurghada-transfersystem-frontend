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
    <section className="relative text-white py-24 md:py-32 overflow-hidden bg-[#0D1B2A]">
      {/* Background image */}
      {bgImageUrl && (
        <Image
          src={bgImageUrl}
          alt={bgImageAlt}
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 object-cover object-center opacity-30"
        />
      )}

      {/* Dark overlay */}
      {bgImageUrl && bgOverlay && (
        <div className="absolute inset-0 bg-linear-to-b from-[#0D1B2A]/70 via-[#0D1B2A]/50 to-[#0D1B2A]/80" aria-hidden />
      )}

      {/* Geometric decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-0 w-48 h-48 border border-[#C9A14A]/10" style={{ transform: "translate(-50%, -50%) rotate(45deg)" }} />
        <div className="absolute bottom-0 right-0 w-64 h-64 border border-[#C9A14A]/8" style={{ transform: "translate(40%, 40%) rotate(45deg)" }} />
        <div className="absolute top-8 right-16 w-3 h-3 bg-[#C9A14A]/40 rotate-45" />
        <div className="absolute bottom-12 left-20 w-2 h-2 bg-[#C9A14A]/30 rotate-45" />
      </div>

      {/* Gold top line */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-linear-to-r from-transparent via-[#C9A14A] to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="w-6 h-px bg-[#C9A14A]" />
            <p className="text-[#C9A14A] text-xs font-semibold uppercase tracking-[0.18em]">
              {subtitle}
            </p>
            <span className="w-6 h-px bg-[#C9A14A]" />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 text-white leading-tight">
            {title}
          </h1>

          <p className="text-base md:text-lg text-white/60 mb-8 leading-relaxed">{description}</p>

          {searchBar && (
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={placeholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-5 py-4 bg-white/95 rounded-md text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C9A14A]/50 shadow-xl text-sm font-medium"
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
