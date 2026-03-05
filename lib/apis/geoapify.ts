const BASE_URL =
  process.env.NEXT_PUBLIC_GEOAPIFY_BASE_URL ??
  "https://api.geoapify.com/v1/geocode/autocomplete";

const API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_KEY;

type Params = {
  text: string;
  type?:
    | "country"
    | "state"
    | "city"
    | "postcode"
    | "street"
    | "amenity"
    | "locality";
  lang?: string;
  filter?: string;
  signal?: AbortSignal;
};

export async function geoapifyAutocomplete({
  text,
  type,
  lang,
  filter,
  signal,
}: Params) {
  const q = text.trim();
  if (!API_KEY || q.length < 2) return { results: [], query: { text } };

  const url = new URL(BASE_URL);
  url.searchParams.set("apiKey", API_KEY);
  url.searchParams.set("text", q);
  url.searchParams.set("format", "json");
  if (type) url.searchParams.set("type", type);
  if (lang) url.searchParams.set("lang", lang);
  if (filter) url.searchParams.set("filter", filter);

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Geoapify: ${res.status}`);
  return res.json();
}
