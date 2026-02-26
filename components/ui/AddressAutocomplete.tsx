"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useGeoapifyAutocomplete } from "@/lib/hooks/useGeoapifyAutocomplete";
import type { GeoapifyAutocompleteResult } from "@/lib/types/geoapify";

export interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string, result?: GeoapifyAutocompleteResult) => void;
  onBlur?: () => void;
  placeholder?: string;
  label?: string;
  error?: string;
  name?: string;
  id?: string;
  filter?: string;
  lang?: string;
  minLength?: number;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
}

export function AddressAutocomplete({
  value,
  onChange,
  onBlur,
  placeholder,
  label,
  error,
  name,
  id,
  filter = "countrycode:eg",
  lang = "en",
  minLength = 2,
  className = "",
  inputClassName = "",
  disabled,
}: AddressAutocompleteProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [rect, setRect] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  const { results, isLoading } = useGeoapifyAutocomplete(value, {
    minLength,
    filter,
    lang,
  });

  const showDropdown = isOpen && (isLoading || results.length > 0);
  const canSelect = results.length > 0 && !isLoading;

  const measure = () => {
    const el = rootRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setRect({ top: r.bottom + 6, left: r.left, width: r.width });
  };

  // update position when opening/changing
  useLayoutEffect(() => {
    if (!showDropdown) {
      setRect(null);
      return;
    }
    measure();
    const onUpdate = () => measure();
    window.addEventListener("scroll", onUpdate, true);
    window.addEventListener("resize", onUpdate);
    return () => {
      window.removeEventListener("scroll", onUpdate, true);
      window.removeEventListener("resize", onUpdate);
    };
  }, [showDropdown, results.length, isLoading]);
  console.log(results);
  
  // close on outside click (works with portal)
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;

      const insideInput = rootRef.current?.contains(target);
      const insideList = (target as HTMLElement | null)?.closest?.(
        id ? `#${id}-listbox` : "[data-geoapify-listbox]",
      );

      if (!insideInput && !insideList) {
        setIsOpen(false);
        setHighlightIndex(-1);
      }
    };

    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [id]);

  // reset highlight when closing
  useEffect(() => {
    if (!showDropdown) setHighlightIndex(-1);
  }, [showDropdown]);

  const handleSelect = (r: GeoapifyAutocompleteResult) => {
    onChange(r.formatted, r); // ✅ selection
    setIsOpen(false);
    setHighlightIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setHighlightIndex(-1);
      return;
    }
    if (!showDropdown) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!canSelect) return;
      setHighlightIndex((i) => Math.min(i + 1, results.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!canSelect) return;
      setHighlightIndex((i) => Math.max(i - 1, -1));
      return;
    }
    if (e.key === "Enter") {
      if (!canSelect) return;
      const idx = highlightIndex >= 0 ? highlightIndex : 0; // ✅ enter picks first
      const picked = results[idx];
      if (picked) {
        e.preventDefault();
        handleSelect(picked);
      }
      return;
    }
  };

  return (
    <div ref={rootRef} className={`relative min-w-0 flex-1 ${className}`}>
      {label && (
        <label className="block text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
          {label}
        </label>
      )}

      <input
        type="text"
        name={name}
        id={id}
        value={value}
        onChange={(e) => {
          onChange(e.target.value); // typing
          setIsOpen(true);
        }}
        onFocus={() => {
          setIsOpen(true);
          // measure right away to avoid a frame delay
          queueMicrotask(measure);
        }}
        onBlur={() => onBlur?.()}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        role="combobox"
        aria-expanded={showDropdown}
        aria-autocomplete="list"
        aria-controls={id ? `${id}-listbox` : undefined}
        aria-activedescendant={
          highlightIndex >= 0 && id ? `${id}-opt-${highlightIndex}` : undefined
        }
        className={`block w-full text-sm font-medium text-gray-800 bg-transparent outline-none truncate ${inputClassName}`}
      />

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}

      {showDropdown &&
        rect &&
        typeof document !== "undefined" &&
        createPortal(
          <ul
            id={id ? `${id}-listbox` : undefined}
            data-geoapify-listbox
            role="listbox"
            onMouseDown={(e) => e.preventDefault()} // keep focus
            style={{
              position: "fixed",
              top: rect.top,
              left: rect.left,
              width: rect.width,
              minWidth: "12rem",
              zIndex: 9999,
            }}
            className="max-h-56 overflow-auto rounded-xl border border-gray-200 bg-white py-1 shadow-xl"
          >
            {isLoading ? (
              <li className="px-4 py-3 text-sm text-gray-500">Searching...</li>
            ) : (
              results.map((r, index) => (
                <li
                  key={r.place_id}
                  id={id ? `${id}-opt-${index}` : undefined}
                  role="option"
                  aria-selected={index === highlightIndex}
                  onMouseEnter={() => setHighlightIndex(index)}
                  onClick={() => handleSelect(r)}
                  className={`cursor-pointer px-4 py-2.5 text-sm transition-colors ${
                    index === highlightIndex
                      ? "bg-main/15 text-gray-900"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="font-medium">{r.formatted}</span>
                  {r.address_line2 && (
                    <span className="ml-1 text-gray-500">
                      {r.address_line2}
                    </span>
                  )}
                </li>
              ))
            )}
          </ul>,
          document.body,
        )}
    </div>
  );
}
