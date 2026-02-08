'use client';

import { usePublicTrips } from '@/lib/hooks/useTrips';
import SectionHeader from './SectionHeader';
import Button from './ui/Button';
import TripCard from './ui/TripCard';

export default function PopularTrips() {
  const { data, isLoading, isError, error } = usePublicTrips({
    PageNumber: 1,
    PageSize: 3,
  });

  const trips = data?.data?.data ?? [];

  return (
    <section className="py-8 lg:py-15 px-4 bg-linear-to-b from-[#F5EDE4] to-white">
      <div className="container mx-auto max-w-7xl">
        <SectionHeader
          subtitle="Featured Tours"
          title="Most Popular Tour Places"
          description="Content of a page when looking at layout the point of using lorem the is Ipsum less"
        />

        {/* Trip Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-xl bg-white/60 animate-pulse"
                aria-hidden
              />
            ))
          ) : isError ? (
            <p className="col-span-full text-center text-red-600 py-8">
              {error?.message ?? 'Failed to load trips.'}
            </p>
          ) : (
            trips.map((trip) => <TripCard key={trip.id} trip={trip} />)
          )}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">

          <Button href="/trips" size="lg">View All Tours</Button>
        </div>

      </div>
    </section>
  );
}
