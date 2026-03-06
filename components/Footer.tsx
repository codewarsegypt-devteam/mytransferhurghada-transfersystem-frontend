"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Linkedin,
  Instagram,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#05111E] text-white pt-16 pb-8">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Top accent line */}
        <div className="w-16 h-[3px] bg-[#C9A14A] mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-14">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center group">
              <Image
                src="/icons/whiteLogo.png"
                alt="Fox Travel"
                width={140}
                height={140}
                className="object-contain w-40"
              />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mt-4 max-w-[220px]">
              Premium travel experiences across Egypt's seas, deserts, and ancient wonders.
            </p>
          </div>

          {/* Company Column */}
          {/* <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C9A14A] mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              {[
                { label: "About us", href: "/about" },
                { label: "FAQ", href: "/#faq" },
                { label: "Contact", href: "/contactus" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group text-sm"
                  >
                    <span className="w-4 h-px bg-[#C9A14A] group-hover:w-6 transition-all duration-300 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Our Services Column */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C9A14A] mb-5">
              Our Services
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Sea & Desert Excursions", href: "/trips" },
                { label: "Private Transfers", href: "/transfer" },
                { label: "Airport Transfers", href: "/transfer" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group text-sm"
                  >
                    <span className="w-4 h-px bg-[#C9A14A] group-hover:w-6 transition-all duration-300 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us Column */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C9A14A] mb-5">
              Contact Us
            </h4>
            <ul className="space-y-4">
              {/* <li className="flex items-start gap-3">
                <MapPin className="text-[#C9A14A] mt-0.5 shrink-0 w-4 h-4" />
                <div className="text-slate-400 text-sm">
                  <a
                    href="https://maps.app.goo.gl/75ty98puBGhNridE8?g_st=aw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    <p>Hurghada – Red Sea, Egypt</p>
                    <p>147 El-Kawther, Airport Section</p>
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="text-[#C9A14A] mt-0.5 shrink-0 w-4 h-4" />
                <div className="text-slate-400 text-sm">
                  <a
                    href="https://maps.app.goo.gl/ooih4uWASjdWjU827?g_st=aw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    <p>Nasr City, Cairo</p>
                    <p>2 Hassan Afifi, off Makram Ebeid</p>
                    <p>6th floor, Apt 62</p>
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="text-[#C9A14A] mt-0.5 shrink-0 w-4 h-4" />
                <div className="text-slate-400 text-sm">
                  <a
                    href="https://maps.app.goo.gl/75ty98puBGhNridE8?g_st=aw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    <p>French School Mall, Alhadaba, Office Nr. A3</p>
                    <p>Sharm El Sheikh, South Sinai, Egypt</p>
                  </a>
                </div>
              </li> */}
              <li className="flex items-center gap-3">
                <Phone className="text-[#C9A14A] shrink-0 w-4 h-4" />
                <p className="text-slate-400 text-sm">+201028886667</p>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-[#C9A14A] shrink-0 w-4 h-4" />
                <a
                  href="mailto:info@foxtravelegypt.com"
                  className="text-slate-400 text-sm hover:text-white transition-colors"
                >
                  info@gmail.com
                </a>
              </li>
            </ul>

            {/* Social Media */}
            {/* <div className="flex gap-3 mt-6">
              {[
                { Icon: Facebook, href: "https://www.facebook.com/foxtravelegypt", label: "Facebook" },
                { Icon: Linkedin, href: "https://www.linkedin.com/company/fox-travel-egypt/", label: "LinkedIn" },
                { Icon: Instagram, href: "https://www.instagram.com/foxtravelegypt?igsh=bG1jOGc3Zmd2ZWtt", label: "Instagram" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-md border border-white/10 hover:border-[#C9A14A] hover:bg-[#C9A14A]/10 flex items-center justify-center transition-all duration-200"
                >
                  <Icon className="w-4 h-4 text-slate-400 hover:text-[#C9A14A]" />
                </a>
              ))}
            </div> */}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>
              © {new Date().getFullYear()} My Transfer. All rights reserved
              &nbsp;|&nbsp; Powered by{" "}
              <Link
                href="https://codewarsegypt.com"
                target="_blank"
                className="hover:text-[#C9A14A] transition-colors text-slate-400"
              >
                CODEWARS
              </Link>
            </p>
            <div className="flex gap-6">
              <Link href="#terms" className="hover:text-white transition-colors">
                Terms & Conditions
              </Link>
              <Link href="#privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
