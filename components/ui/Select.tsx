'use client';

import { useState, useRef, useEffect, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder: string;
  leadingIcon?: ReactNode;
  className?: string;
  'aria-label'?: string;
}

export default function Select({
  value,
  onChange,
  options,
  placeholder,
  leadingIcon,
  className = '',
  'aria-label': ariaLabel,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel ?? placeholder}
        className="flex items-center gap-2 w-full min-w-[160px] px-4 py-2.5 rounded-xl border border-(--light-grey) bg-white text-gray-700 font-medium shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-(--primary-orange)/40 hover:shadow-[0_2px_12px_rgba(243,114,42,0.12)] focus:outline-none focus:ring-2 focus:ring-(--accent-orange) focus:ring-offset-2 focus:border-transparent transition-all duration-200 cursor-pointer"
      >
        {leadingIcon && (
          <span className="shrink-0 text-(--accent-orange)">
            {leadingIcon}
          </span>
        )}
        <span className="flex-1 text-left truncate">
          {selectedOption && selectedOption.icon ? (
            <span className="inline-flex items-center gap-1.5">
              {selectedOption.icon}
              {selectedOption.label}
            </span>
          ) : (
            displayLabel
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-(--accent-orange)' : ''}`}
          aria-hidden
        />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label={ariaLabel ?? placeholder}
          className="absolute z-50 mt-2 w-full min-w-[200px] max-h-60 overflow-auto rounded-xl border border-(--light-grey) bg-white py-1 shadow-[0_4px_20px_rgba(0,0,0,0.08)] animate-fade-in-up"
        >
          <li role="option" aria-selected={!value}>
            <button
              type="button"
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
              className={`flex items-center gap-2 w-full px-4 py-2.5 text-left text-sm font-medium transition-colors ${!value ? 'bg-(--accent-orange)/10 text-(--accent-orange)' : 'text-gray-700 hover:bg-(--off-white)'}`}
            >
              {placeholder}
            </button>
          </li>
          {options.map((option) => (
            <li key={option.value} role="option" aria-selected={value === option.value}>
              <button
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-2 w-full px-4 py-2.5 text-left text-sm font-medium transition-colors ${value === option.value ? 'bg-(--accent-orange)/10 text-(--accent-orange)' : 'text-gray-700 hover:bg-(--off-white)'}`}
              >
                {option.icon && (
                  <span className="shrink-0 text-(--accent-orange)">
                    {option.icon}
                  </span>
                )}
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
