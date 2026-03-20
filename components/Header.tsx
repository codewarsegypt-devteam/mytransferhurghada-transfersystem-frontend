"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Button from "./ui/Button";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";

const navLinks = [
  { name: "HOME", href: "/" },
  { name: "TRIPS", href: "/trips" },
  { name: "TRANSFER", href: "/transfer" },
  { name: "CONTACT", href: "/contactus" },
];

export default function Header() {
  const { isSignedIn, isLoaded } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/icons/Transferhurghada.svg"
            alt="Fox Travel"
            width={42}
            height={42}
            className="object-contain"
          />

          <div className="block">
            <div className="text-xs font-medium tracking-[0.18em] text-gray-500">
              MY TRANSFER
            </div>
            <div className="text-base font-semibold text-gray-900">
              Egypt Transfers
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-700 transition hover:text-black"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          {!isLoaded ? (
            <div className="h-10 w-10 rounded-full bg-gray-100" />
          ) : isSignedIn ? (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonTrigger: "focus:shadow-none",
                },
              }}
            />
          ) : (
            <>
              <Link
                href="/transfer"
                className="text-sm font-medium text-gray-700 hover:text-black"
              >
                Quick Booking
              </Link>

              <SignInButton mode="modal">
                <Button className="border border-gray-300 bg-primary-navy text-white shadow-none hover:bg-gray-400">
                  Sign In
                </Button>
              </SignInButton>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 text-gray-800 lg:hidden"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white lg:hidden">
          <div className="mx-auto max-w-7xl space-y-4 px-4 py-4 sm:px-6">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-medium text-gray-700 hover:text-black"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
              {!isLoaded ? (
                <div className="h-10 w-10 rounded-full bg-gray-100" />
              ) : isSignedIn ? (
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                      userButtonTrigger: "focus:shadow-none",
                    },
                  }}
                />
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/transfer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm font-medium text-gray-700 hover:text-black"
                  >
                    Quick Booking
                  </Link>

                  <SignInButton mode="modal">
                    <Button className="w-full border border-gray-300 bg-primary-navy text-white shadow-none hover:bg-gray-400">
                      Sign In
                    </Button>
                  </SignInButton>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}