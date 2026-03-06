"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Button from "./ui/Button";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";

export default function Header() {
  const { isSignedIn, user, isLoaded } = useUser();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isBlackTheme =
    pathname === "/trips/checkout" ||
    pathname.startsWith("/trips/") ||
    pathname.startsWith("/payment/callback") ||
    pathname.startsWith("/transfer/callback");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "TRIPS", href: "/trips" },
    { name: "TRANSFER", href: "/transfer" },
    // { name: "ABOUT", href: "/about" },
    // { name: "FAQ", href: "/faq" },
    { name: "CONTACT", href: "/contactus" },
  ];

  const scrolled = isScrolled || isBlackTheme || isMobileMenuOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-9999 transition-all duration-300 ${
        scrolled
          ? "bg-[#0D1B2A]/97 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.25)]"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <Image
              src="/icons/whiteLogo.png"
              alt="Fox Travel"
              width={140}
              height={140}
              className="object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`font-medium text-sm transition-colors duration-200 relative group ${
                  pathname === link.href
                    ? "text-[#C9A14A]"
                    : "text-white/80 hover:text-[#C9A14A]"
                }`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] bg-[#C9A14A] transition-all duration-300 ${
                    pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center space-x-4">
            {!isLoaded ? (
              <div className="flex items-center space-x-3" aria-hidden>
                <div className="h-4 w-16 rounded bg-white/20 animate-pulse" />
                <div className="h-10 w-10 rounded-full bg-white/20 animate-pulse" />
              </div>
            ) : isSignedIn ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-white/80">
                  {user?.firstName || user?.username || "User"}
                </span>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                      userButtonTrigger: "focus:shadow-none",
                    },
                  }}
                />
              </div>
            ) : (
              <SignInButton mode="modal">
                <Button>Sign In</Button>
              </SignInButton>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 space-y-1 border-t border-white/10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block px-4 py-3 font-medium transition-all rounded-md ${
                  pathname === link.href
                    ? "text-[#C9A14A] bg-white/10"
                    : "text-white/80 hover:text-[#C9A14A] hover:bg-white/8"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 px-4 border-t border-white/10 mt-2">
              {!isLoaded ? (
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-md" aria-hidden>
                  <div className="h-4 w-20 rounded bg-white/20 animate-pulse" />
                  <div className="h-10 w-10 rounded-full bg-white/20 animate-pulse" />
                </div>
              ) : isSignedIn ? (
                <div className="flex items-center justify-between p-3 bg-white/10 rounded-md">
                  <span className="text-sm font-medium text-white/80">
                    {user?.firstName || user?.username || "User"}
                  </span>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10",
                        userButtonTrigger: "focus:shadow-none",
                      },
                    }}
                  />
                </div>
              ) : (
                <SignInButton mode="modal">
                  <Button
                    className="w-full py-3 text-center block"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Button>
                </SignInButton>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
