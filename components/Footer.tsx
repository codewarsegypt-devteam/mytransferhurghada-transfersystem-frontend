"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  MapPin,
  Phone,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0a1f1f] text-white pt-16 pb-8">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 group">
              <Image
                src="/icons/whiteLogo.png"
                alt="Fox Travel"
                width={140}
                height={140}
                className="object-contain w-40"
              />
            </Link>
            {/* <p className="text-gray-400 text-sm leading-relaxed">
              content of a page when looking at layout the point of using lorem
              the is Ipsum less normal
            </p> */}
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-xl font-semibold mb-6">Company</h4>
            <ul className="space-y-3">
              {[
                { label: "About us", href: "/about" },
                // { label: "Destination", href: "#destination" },
                { label: "Faq", href: "/#faq" },
                { label: "Contact", href: "/contactus" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-orange-500">»</span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services Column */}
          <div>
            <h4 className="text-xl font-semibold mb-6">Our Services</h4>
            <ul className="space-y-3">
              {[
                { label: "Sea & Desert Excursions", href: "/trips" },
                { label: "Private Transfers", href: "/transfer" },
                { label: "Airport Transfers", href: "/transfer" },
                // { label: "City Tours", href: "/trips" },
                // { label: "Day Trips", href: "/trips" },
                // { label: "Multi-Day Trips", href: "/trips" },
                // { label: "Transfers", href: "/transfer" },
                // { label: "Accommodation", href: "/accommodation" },
                // { label: "Visa Processing", href: "#visa" },
                // { label: "Car Hire", href: "#car" },
                // { label: "Tour Packages", href: "#tours" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-orange-500">»</span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destination Column */}
          {/* <div>
            <h4 className="text-xl font-semibold mb-6">Destination</h4>
            <ul className="space-y-3">
              {[
                { label: "Dubai", href: "#dubai" },
                { label: "Bangkok", href: "#bangkok" },
                { label: "Singapore city", href: "#singapore" },
                { label: "Thailand", href: "#thailand" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-orange-500">»</span>
                    <span className="group-hover:translate-x-1 transition-transform">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Contact Us Column */}
          <div>
            <h4 className="text-xl font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-orange-500 mt-1 shrink-0 w-4 h-4" />
                <div className="text-gray-300 text-sm">
                <a
                    href="https://maps.app.goo.gl/75ty98puBGhNridE8?g_st=aw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-orange-400 transition-colors underline underline-offset-2"
                  >
                  <p>Hurghada – Red Sea, Egypt</p>
                  <p>147 El-Kawther, Airport Section</p>
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="text-orange-500 mt-1 shrink-0 w-4 h-4" />
                <div className="text-gray-300 text-sm">
                  <a
                    href="https://maps.app.goo.gl/ooih4uWASjdWjU827?g_st=aw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-orange-400 transition-colors underline underline-offset-2"
                  >
                    <p>Nasr City, Cairo</p>
                    <p>2 Hassan Afifi, off Makram Ebeid, behind Mahgoub</p>
                    <p>6th floor, Apt 62</p>
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="text-orange-500 mt-1 shrink-0 w-4 h-4" />
                <div className="text-gray-300 text-sm">
                  <a
                    href="https://maps.app.goo.gl/75ty98puBGhNridE8?g_st=aw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-orange-400 transition-colors underline underline-offset-2"
                  >
                    <p>French School Mall, Alhadaba, Office Nr. A3</p>
                    <p>Sharm El Sheikh, South Sinai, Egypt</p>
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="text-orange-500  shrink-0 w-4 h-4" />
                <div className="text-gray-300 text-sm">
                  <p>+201028886667</p>
                </div>
              </li>
            </ul>

            {/* Social Media Icons */}
            <div className="flex gap-3 mt-6">
              {[
                { Icon: Facebook, href: "https://www.facebook.com/foxtravelegypt", label: "Facebook" },
                // { Icon: Twitter, href: "#", label: "Twitter" },
                { Icon: Linkedin, href: "https://www.linkedin.com/company/fox-travel-egypt/", label: "LinkedIn" },
                { Icon: Instagram, href: "https://www.instagram.com/foxtravelegypt?igsh=bG1jOGc3Zmd2ZWtt", label: "Instagram" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-[#0d2a2a] hover:bg-orange-500 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>
              © {new Date().getFullYear()} Fox Travel Egypt. All rights
              reserved|  Powered by <Link href="https://codewarsegypt.com" target="_blank" className="hover:text-white transition-colors text-[#58a31b]">CODEWARS</Link>
              </p>
            <div className="flex gap-6">
              <Link
                href="#terms"
                className="hover:text-white transition-colors"
              >
                Terms & Conditions
              </Link>
              <Link
                href="#privacy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              {/* <Link
                href="#refund"
                className="hover:text-white transition-colors"
              >
                Refund Policy
              </Link> */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
