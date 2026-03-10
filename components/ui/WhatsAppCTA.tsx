'use client';

import Link from 'next/link';
import { type ReactNode } from 'react';

/** Build WhatsApp link from phone (e.g. +201010836364) and optional prefill message */
export function buildWhatsAppHref(
  phone: string,
  message?: string
): string {
  const normalized = phone.replace(/\D/g, '');
  const base = `https://wa.me/${normalized}`;
  if (message?.trim()) {
    return `${base}?text=${encodeURIComponent(message.trim())}`;
  }
  return base;
}

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export type WhatsAppCTAVariant = 'gradient' | 'minimal';

export interface WhatsAppCTAProps {
  /** Main heading */
  title: string;
  /** Short description below the title */
  description?: string;
  /** Button label (default: "Chat with Us on WhatsApp") */
  buttonLabel?: string;
  /** Full WhatsApp URL (e.g. https://wa.me/201010836364). If not set, uses `phone` + optional `message`. */
  href?: string;
  /** Phone in international format (e.g. +201010836364). Ignored if `whatsAppHref` is set. */
  phone?: string;
  /** Prefill message for WhatsApp. Only used when building link from `phone`. */
  message?: string;
  /** Visual style: gradient (orange brand) or minimal (light background) */
  variant?: WhatsAppCTAVariant;
  /** Extra class for the outer section */
  className?: string;
  /** Replace the default button with custom content (e.g. icon + text). If set, `buttonLabel` is ignored for default button; you render the link yourself. */
  children?: ReactNode;
}

const defaultPhone = '+201027241392';

export function WhatsAppCTA({
  title,
  description,
  buttonLabel = 'Chat with Us on WhatsApp',
  href,
  phone = defaultPhone,
  message,
  variant = 'gradient',
  className = '',
  children,
}: WhatsAppCTAProps) {
  const redirectHref =
    href ?? buildWhatsAppHref(phone, message);

  const isGradient = variant === 'gradient';

  return (
    <section
      className={
        isGradient
          ? `py-10 md:py-14 bg-linear-to-br from-[#F3722A] via-[#F15A22] to-[#F36F24] text-white ${className}`.trim()
          : `py-10 md:py-14 bg-(--off-white) text-(--black) ${className}`.trim()
      }
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto">
          <h2
            className={
              isGradient
                ? 'text-2xl md:text-3xl font-bold mb-2'
                : 'text-2xl md:text-3xl font-bold mb-2 text-(--black)'
            }
          >
            {title}
          </h2>
          {description && (
            <p
              className={
                isGradient
                  ? 'text-base md:text-lg mb-5 text-white/90'
                  : 'text-base md:text-lg mb-5 text-black/80'
              }
            >
              {description}
            </p>
          )}
          {children !== undefined ? (
            <div className="flex flex-wrap justify-center gap-3">
              {children}
            </div>
          ) : (
            <Link
              href={redirectHref}
              target="_blank"
              rel="noopener noreferrer"
              className={
                isGradient
                  ? 'inline-flex items-center gap-2 bg-white text-(--accent-orange) px-6 py-3 rounded-xl font-bold text-base hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-lg'
                  : 'inline-flex items-center gap-2 bg-(--primary-orange) text-white px-6 py-3 rounded-xl font-bold text-base hover:bg-(--accent-orange) transition-all duration-300 hover:scale-105 shadow-lg'
              }
            >
              {/* <WhatsAppIcon className="w-5 h-5" /> */}
              {buttonLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
