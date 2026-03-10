"use client";

import { useState } from "react";
import { Search, Filter, MapPin, Loader2 } from "lucide-react";
import { usePublicTrips } from "@/lib/hooks/useTrips";
import TripCard from "@/components/ui/TripCard";
import Select from "@/components/ui/Select";
import SectionHeader from "@/components/SectionHeader";
import { WhatsAppCTA } from "@/components/ui/WhatsAppCTA";
import type { TripItemDto } from "@/lib/types/tripsTypes";
import PageBanner from "@/components/pageBanner";
import Contact from "@/components/Contact";

export default function TripsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  // Fetch trips with filters
  const { data, isLoading, isError, error } = usePublicTrips({
    Search: searchQuery || undefined,
    City: selectedCity || undefined,
  });

  const trips: TripItemDto[] = data?.data?.data || [];

  // Extract unique categories and cities for filters
  const categories = Array.from(new Set(trips.map((trip) => trip.category)));
  const cities = Array.from(new Set(trips.map((trip) => trip.city)));

  const categoryOptions = categories.map((c) => ({ value: c, label: c }));
  const cityOptions = cities.map((city) => ({
    value: city,
    label: city,
    icon: <MapPin className="w-4 h-4" />,
  }));

  return (
    <div className="min-h-screen bg-[#F5F6F6] ">
      {/* Hero Section */}
      <PageBanner
        subtitle="Explore Paradise"
        title="Discover Amazing Adventures"
        description="Explore the Red Sea, visit ancient wonders, and create unforgettable memories in Hurghada"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search for a trip"
        searchBar={true}
        bgImageUrl="/assets/travel-bags-airport.jpg"
        bgImageAlt="Trips Image"
        bgOverlay={true}
      />
      <div className="">
        {/* Filters Section */}
        <section className="bg-white border-b border-gray-200 z-40 shadow-sm">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2 text-gray-700 font-semibold">
                <Filter className="w-5 h-5 text-(--accent-orange)" />
                <span>Filter by:</span>
              </div>

              <div className="flex flex-wrap gap-3 flex-1">
                {/* Category Filter */}
                <Select
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  options={categoryOptions}
                  placeholder="All Categories"
                  aria-label="Filter by category"
                />

                {/* City Filter */}
                <Select
                  value={selectedCity}
                  onChange={setSelectedCity}
                  options={cityOptions}
                  placeholder="All Locations"
                  leadingIcon={<MapPin className="w-4 h-4" />}
                  aria-label="Filter by location"
                />
                {/* <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for a trip"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/80 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-xl"
                />
              </div>
            </div> */}
                {/* Clear Filters */}
                {(selectedCategory || selectedCity || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedCategory("");
                      setSelectedCity("");
                      setSearchQuery("");
                    }}
                    className="px-4 py-2 text-sm font-medium text-(--accent-orange) hover:bg-(--accent-orange)/10 rounded-lg transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              {/* Results Count */}
              {!isLoading && (
                <div className="text-gray-600 text-sm whitespace-nowrap">
                  <span className="font-semibold text-(--accent-orange)">
                    {trips.length}
                  </span>{" "}
                  {trips.length === 1 ? "trip" : "trips"} found
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Trips Grid Section */}
        <section className="py-12 md:py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-(--accent-orange) animate-spin mb-4" />
                <p className="text-gray-600 text-lg">
                  Loading amazing trips...
                </p>
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="max-w-md mx-auto text-center py-20">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-red-600 text-3xl">⚠️</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Oops! Something went wrong
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {error instanceof Error
                      ? error.message
                      : "Failed to load trips. Please try again."}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="btn-primary"
                  >
                    Reload Page
                  </button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !isError && trips.length === 0 && (
              <div className="max-w-md mx-auto text-center py-20">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No trips found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filters to find what you&apos;re
                  looking for
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("");
                    setSelectedCity("");
                    setSearchQuery("");
                  }}
                  className="btn-secondary"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Trips Grid */}
            {!isLoading && !isError && trips.length > 0 && (
              <>
                <SectionHeader
                  subtitle="Our Collection"
                  title="All Adventures Await"
                  description="Choose from our carefully curated selection of unforgettable experiences"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 ">
                  {trips.map((trip) => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
        {/* <Contact/> */}

      </div>
        {!isLoading && !isError && trips.length > 0 && (
          <WhatsAppCTA
            title="Can't Find What You're Looking For?"
            description="Contact us on WhatsApp and we'll create a custom experience just for you"
            buttonLabel="Chat with Us on WhatsApp"
            variant="gradient"
          />
        )}
    </div>
  );
}
