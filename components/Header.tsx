'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Button from './ui/Button';
import { useUser, SignInButton, UserButton } from '@clerk/nextjs';

export default function Header() {
  const { isSignedIn, user, isLoaded } = useUser();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isBlackTheme =
    pathname === '/transfer' || pathname === '/trips/checkout' || pathname.startsWith('/trips/');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', href: '/' },
    // { name: 'PAGES', href: '#pages' },
    { name: 'TRIPS', href: '/trips' },
    { name: 'TRANSFER', href: '/transfer' },
    { name: 'ABOUT', href: '/about' },
    // { name: 'NEWS', href: '#news' },
    { name: 'CONTACT', href: '/contactus' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 ${isScrolled || isBlackTheme
          ? `bg-[#F5E6D8]/98 backdrop-blur-md shadow-md`
          : 'bg-transparent '
        }`}
    >
      <nav className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            {isScrolled || isBlackTheme ? (<Image
              src="/icons/blackLogo.png"
              alt="Fox Travel"
              width={140}
              height={140}
              className="object-contain"
            />
            ) : (
              <Image
                src="/icons/whiteLogo.png"
                alt="Fox Travel"
                width={140}
                height={140}
                className="object-contain"
              />)}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`${isScrolled || isBlackTheme ? 'text-black' : 'text-white'} hover:text-[#F3722A] font-medium text-sm transition-colors duration-200 relative group`}
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F3722A] group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* <Button variant="icon" aria-label="Search">
              <Search className="w-5 h-5 text-gray-800" />
            </Button> */}
            {!isLoaded ? (
              <div className="flex items-center space-x-3" aria-hidden>
                <div className="h-4 w-16 rounded bg-gray-300/50 animate-pulse" />
                <div className="h-10 w-10 rounded-full bg-gray-300/50 animate-pulse" />
              </div>
            ) : isSignedIn ? (
              <div className="flex items-center space-x-3">
                <span className={`text-sm font-medium ${isScrolled || isBlackTheme ? 'text-black' : 'text-white'}`}>
                  {user?.firstName || user?.username || 'User'}
                </span>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: 'w-10 h-10',
                      userButtonTrigger: 'focus:shadow-none',
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
            className="lg:hidden p-2 rounded-lg hover:bg-white/50 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-black" />
            ) : (
              <Menu className="w-6 h-6 text-black" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="py-4 space-y-3 border-t border-gray-300/30">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-4 py-2 text-gray-800 hover:text-[#F3722A] hover:bg-white/50 rounded-lg font-medium transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 space-y-3 px-4">
              {!isLoaded ? (
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg" aria-hidden>
                  <div className="h-4 w-20 rounded bg-gray-200/60 animate-pulse" />
                  <div className="h-10 w-10 rounded-full bg-gray-200/60 animate-pulse" />
                </div>
              ) : isSignedIn ? (
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                  <span className="text-sm font-medium text-gray-800">
                    {user?.firstName || user?.username || 'User'}
                  </span>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: 'w-10 h-10',
                        userButtonTrigger: 'focus:shadow-none',
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
