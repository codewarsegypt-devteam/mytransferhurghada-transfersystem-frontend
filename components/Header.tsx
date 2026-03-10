"use client";

import { useEffect, useState } from "react";
import { Menu, X, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Button from "./ui/Button";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";

const navLinks = [
  { name: "HOME", href: "/" },
  { name: "TRIPS", href: "/trips" },
  { name: "TRANSFER", href: "/transfer" },
  { name: "CONTACT", href: "/contactus" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const { isSignedIn, user, isLoaded } = useUser();
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isDarkForced =
    pathname === "/trips/checkout" ||
    pathname.startsWith("/trips/") ||
    pathname.startsWith("/payment/callback") ||
    pathname.startsWith("/transfer/callback");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const elevated = isScrolled || isDarkForced || isMobileMenuOpen;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[9999] px-3 pt-3 sm:px-4 lg:px-6">
        <div
          className={[
            "mx-auto max-w-7xl rounded-2xl border transition-all duration-300",
            elevated
              ? "border-white/10 bg-[#0D1B2A]/88 shadow-[0_10px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl"
              : "border-black/5 bg-white/78 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl",
          ].join(" ")}
        >
          <nav className="px-4 sm:px-6 lg:px-8">
            <div className="flex h-[76px] items-center justify-between">
              {/* Logo */}
              <Link href="/" className="group flex shrink-0 items-center gap-3">
                <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white/90 shadow-sm ring-1 ring-black/5">
                  <Image
                    src="/icons/Transferhurghada.svg"
                    alt="Fox Travel"
                    width={42}
                    height={42}
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="hidden sm:block">
                  <div
                    className={[
                      "text-sm font-semibold tracking-[0.18em]",
                      elevated ? "text-white/55" : "text-[#0D1B2A]",
                    ].join(" ")}
                  >
                    MY TRANSFER
                  </div>
                  <div
                    className={[
                      "text-base font-bold tracking-tight",
                      elevated ? "text-white" : "text-[#0D1B2A]/45",
                    ].join(" ")}
                  >
                    Egypt Transfers
                  </div>
                </div>
              </Link>

              {/* Desktop Nav */}
              <div className="hidden lg:flex items-center">
                <div
                  className={[
                    "flex items-center gap-2 rounded-full border px-2 py-2",
                    elevated
                      ? "border-white/10 bg-white/5"
                      : "border-black/5 bg-black/[0.03]",
                  ].join(" ")}
                >
                  {navLinks.map((link) => {
                    const active = isActivePath(pathname, link.href);

                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        className={[
                          "relative rounded-full px-4 py-2 text-sm font-semibold tracking-wide transition-all duration-200",
                          active
                            ? elevated
                              ? "bg-[#C9A14A] text-[#0D1B2A] "
                              : "bg-[#0D1B2A] text-white shadow-sm"
                            : elevated
                              ? "text-white/78 hover:bg-white/8 hover:text-white"
                              : "text-[#0D1B2A]/72 hover:bg-black/[0.05] hover:text-[#0D1B2A]",
                        ].join(" ")}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Desktop Actions */}
              <div className="hidden lg:flex items-center gap-3">
                {!isLoaded ? (
                  <div className="flex items-center gap-3" aria-hidden>
                    <div
                      className={[
                        "h-10 w-24 animate-pulse rounded-full",
                        elevated ? "bg-white/10" : "bg-black/8",
                      ].join(" ")}
                    />
                    <div
                      className={[
                        "h-10 w-10 animate-pulse rounded-full",
                        elevated ? "bg-white/10" : "bg-black/8",
                      ].join(" ")}
                    />
                  </div>
                ) : isSignedIn ? (
                  <div
                    className={[
                      "flex items-center gap-3 rounded-full border pl-3 pr-2 py-2",
                      elevated
                        ? "border-white/10 bg-white/5"
                        : "border-black/5 bg-black/[0.03]",
                    ].join(" ")}
                  >
                    <div className="text-right leading-tight">
                      <div
                        className={[
                          "text-xs",
                          elevated ? "text-white/45" : "text-[#0D1B2A]/45",
                        ].join(" ")}
                      >
                        Welcome back
                      </div>
                      <div
                        className={[
                          "max-w-[120px] truncate text-sm font-semibold",
                          elevated ? "text-white" : "text-[#0D1B2A]",
                        ].join(" ")}
                      >
                        {user?.firstName || user?.username || "User"}
                      </div>
                    </div>

                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-10 h-10 ring-2 ring-white/10",
                          userButtonTrigger: "focus:shadow-none",
                        },
                      }}
                    />
                  </div>
                ) : (
                  <>
                    <Link
                      href="/transfer"
                      className={[
                        "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                        elevated
                          ? "text-white/78 hover:text-white"
                          : "text-[#0D1B2A]/75 hover:text-[#0D1B2A]",
                      ].join(" ")}
                    >
                      Quick Booking
                    </Link>

                    <SignInButton mode="modal">
                      <Button className="rounded-full px-5 py-2.5">
                        Sign In
                      </Button>
                    </SignInButton>
                  </>
                )}
              </div>

              {/* Mobile Toggle */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className={[
                  "inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-colors lg:hidden",
                  elevated
                    ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
                    : "border-black/5 bg-black/[0.03] text-[#0D1B2A] hover:bg-black/[0.06]",
                ].join(" ")}
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Overlay */}
      <div
        className={[
          "fixed inset-0 z-[9990] bg-[#07111d]/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isMobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Drawer */}
      <div
        className={[
          "fixed inset-x-3 top-[92px] z-[9991] origin-top rounded-3xl border border-white/10 bg-[#0D1B2A]/96 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-300 lg:hidden",
          isMobileMenuOpen
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-3 scale-[0.98] opacity-0",
        ].join(" ")}
      >
        <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-white/45">
            Navigation
          </div>
          <div className="mt-1 text-lg font-bold text-white">
            Explore Fox Travel
          </div>
        </div>

        <div className="space-y-2">
          {navLinks.map((link) => {
            const active = isActivePath(pathname, link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                className={[
                  "flex items-center justify-between rounded-2xl border px-4 py-3.5 transition-all",
                  active
                    ? "border-[#C9A14A]/35 bg-[#C9A14A]/14 text-[#F3D48A]"
                    : "border-white/8 bg-white/[0.03] text-white/82 hover:bg-white/[0.06]",
                ].join(" ")}
              >
                <span className="text-sm font-semibold tracking-wide">
                  {link.name}
                </span>
                <ChevronRight className="h-4 w-4 opacity-70" />
              </Link>
            );
          })}
        </div>

        <div className="mt-4 border-t border-white/10 pt-4">
          {!isLoaded ? (
            <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <div className="space-y-2">
                <div className="h-3.5 w-20 animate-pulse rounded bg-white/10" />
                <div className="h-3 w-28 animate-pulse rounded bg-white/10" />
              </div>
              <div className="h-11 w-11 animate-pulse rounded-full bg-white/10" />
            </div>
          ) : isSignedIn ? (
            <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <div>
                <div className="text-xs text-white/45">Signed in as</div>
                <div className="mt-1 text-sm font-semibold text-white">
                  {user?.firstName || user?.username || "User"}
                </div>
              </div>

              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-11 h-11 ring-2 ring-white/10",
                    userButtonTrigger: "focus:shadow-none",
                  },
                }}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <Link
                href="/transfer"
                className="flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/85"
              >
                Quick Booking
              </Link>

              <SignInButton mode="modal">
                <Button className="w-full rounded-2xl py-3">Sign In</Button>
              </SignInButton>
            </div>
          )}
        </div>
      </div>
    </>
  );
}