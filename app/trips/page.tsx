'use client';

import { useState } from 'react';
import { Search, Filter, MapPin, Loader2 } from 'lucide-react';
import { usePublicTrips } from '@/lib/hooks/useTrips';
import TripCard from '@/components/ui/TripCard';
import SectionHeader from '@/components/SectionHeader';
import type { TripItemDto } from '@/lib/types/tripsTypes';

export default function TripsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');

  // Fetch trips with filters
  const { data, isLoading, isError, error } = usePublicTrips({
    Search: searchQuery || undefined,
    City: selectedCity || undefined,
  });

  const trips: TripItemDto[] = data?.data?.data || [];

  // Extract unique categories and cities for filters
  const categories = Array.from(new Set(trips.map((trip) => trip.category)));
  const cities = Array.from(new Set(trips.map((trip) => trip.city)));

  return (
    <div className="min-h-screen bg-[#F5F6F6]">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-[#F3722A] via-[#F15A22] to-[#F36F24] text-white py-20 md:py-28 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 border-2 border-white rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="handwriting-style text-2xl md:text-3xl mb-4 text-white/90">
              Explore Paradise
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Discover Amazing Adventures
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Explore the Red Sea, visit ancient wonders, and create unforgettable memories in Hurghada
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search trips by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/80 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2 text-gray-700 font-semibold">
              <Filter className="w-5 h-5 text-(--accent-orange)" />
              <span>Filter by:</span>
            </div>

            <div className="flex flex-wrap gap-3 flex-1">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-(--accent-orange) focus:border-transparent bg-white cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* City Filter */}
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-(--accent-orange) focus:border-transparent bg-white cursor-pointer"
              >
                <option value="">All Locations</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    <MapPin className="inline w-4 h-4 mr-1" />
                    {city}
                  </option>
                ))}
              </select>

              {/* Clear Filters */}
              {(selectedCategory || selectedCity || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setSelectedCity('');
                    setSearchQuery('');
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
                </span>{' '}
                {trips.length === 1 ? 'trip' : 'trips'} found
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trips Grid Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-(--accent-orange) animate-spin mb-4" />
              <p className="text-gray-600 text-lg">Loading amazing trips...</p>
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
                  {error instanceof Error ? error.message : 'Failed to load trips. Please try again.'}
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
                Try adjusting your search or filters to find what you&apos;re looking for
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedCity('');
                  setSearchQuery('');
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {trips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {!isLoading && !isError && trips.length > 0 && (
        <section className="py-16 md:py-24 bg-linear-to-br from-[#F3722A] via-[#F15A22] to-[#F36F24]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto text-white">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Can&apos;t Find What You&apos;re Looking For?
              </h2>
              <p className="text-lg md:text-xl mb-8 text-white/90">
                Contact us on WhatsApp and we&apos;ll create a custom experience just for you
              </p>
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white text-(--accent-orange) px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Chat with Us on WhatsApp
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
