"use client";

import { useEffect, useRef, useState } from "react";
import { geoapifyAutocomplete } from "@/lib/apis/geoapify";
import type { GeoapifyAutocompleteResult } from "@/lib/types/geoapify";

type Options = {
  minLength?: number;
  filter?: string;
  lang?: string;
  debounceMs?: number;
};

export function useGeoapifyAutocomplete(query: string, opts: Options = {}) {
  const { minLength = 2, filter, lang, debounceMs = 300 } = opts;

  const [results, setResults] = useState<GeoapifyAutocompleteResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const q = query.trim();

    if (q.length < minLength) {
      setResults([]);
      setIsLoading(false);
      abortRef.current?.abort();
      abortRef.current = null;
      return;
    }

    const t = window.setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoading(true);
      try {
        const data = await geoapifyAutocomplete({
          text: q,
          filter,
          lang,
          signal: controller.signal,
        });
        setResults(data.results ?? []);
      } catch (e: any) {
        if (e?.name !== "AbortError") setResults([]);
      } finally {
        // لو الطلب ده لسه هو آخر واحد
        if (abortRef.current === controller) {
          setIsLoading(false);
          abortRef.current = null;
        }
      }
    }, debounceMs);

    return () => clearTimeout(t);
  }, [query, minLength, filter, lang, debounceMs]);

  return { results, isLoading };
}