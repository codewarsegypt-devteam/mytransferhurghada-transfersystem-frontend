'use client';

import Link from 'next/link';
import { type ButtonHTMLAttributes, type ReactNode } from 'react';

const variantStyles = {
  primary:
    'bg-[#F3722A] hover:bg-[#F15A22] text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300',
  icon: 'hover:bg-white/50 rounded-lg transition-colors inline-flex items-center justify-center',
} as const;

export type ButtonVariant = keyof typeof variantStyles;
export type ButtonSize = 'sm' | 'md' | 'lg';

const sizeStyles: Record<ButtonVariant, Record<ButtonSize, string>> = {
  primary: {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  },
  icon: {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  },
};

export interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

export interface ButtonAsButton
  extends ButtonBaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> {
  href?: never;
}

export interface ButtonAsLink
  extends ButtonBaseProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | keyof ButtonBaseProps> {
  href: string;
}

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = variantStyles[variant];
  const sizeStyle = sizeStyles[variant][size];
  const combinedClassName = `${baseStyles} ${sizeStyle} ${className}`.trim();

  if ('href' in props && props.href) {
    const { href, ...linkProps } = props;
    return (
      <Link href={href} className={combinedClassName} {...linkProps}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as Omit<ButtonAsButton, keyof ButtonBaseProps>;
  return (
    <button type="button" className={combinedClassName} {...buttonProps}>
      {children}
    </button>
  );
}
