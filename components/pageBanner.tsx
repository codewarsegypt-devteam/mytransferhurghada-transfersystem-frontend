import { Search } from "lucide-react";
import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

type PageBannerProps = {
  searchBar?: boolean;
  searchQuery?: string;
  setSearchQuery?: (value: string) => void;
  placeholder?: string;
  bgImageUrl?: string;
  bgImageAlt?: string;
  bgOverlay?: boolean;
};

const PageBanner = ({
  searchBar = true,
  searchQuery,
  setSearchQuery,
  placeholder,
  bgImageUrl,
  bgImageAlt = "",
  bgOverlay = false,
}: PageBannerProps) => {
  const pathname = usePathname();

  const pageTitleByPath: Record<string, string> = {
    "/trips": "Trips",
    "/about": "About Us",
    "/contactus": "Contact Us",
    "/faq": "FAQ",
  };

  const pageTitle = pageTitleByPath[pathname] ?? "Fox Travel Egypt";

  return (
    <section className="relative text-white py-24 md:py-32 overflow-hidden bg-[#1B3565]">
      {/* Background image */}
      {/* {bgImageUrl && (
        <Image
          src={bgImageUrl}
          alt={bgImageAlt}
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 object-cover object-center opacity-30"
        />
      )} */}

      {/* Dark overlay */}
      {/* {bgImageUrl && bgOverlay && (
        <div
          className="absolute inset-0 bg-linear-to-b from-primary-navy/80 via-primary-navy/60 to-primary-navy/90"
          aria-hidden
        />
      )} */}

      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            {pageTitle}
          </h1>

          {searchBar && (
            <div className="mt-6 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={placeholder ?? "Search for a trip"}
                  value={searchQuery ?? ""}
                  onChange={(e) => setSearchQuery?.(e.target.value)}
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
