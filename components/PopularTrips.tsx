'use client';

import type { TripItemDto } from '@/lib/types/tripsTypes';
import SectionHeader from './SectionHeader';
import Button from './ui/Button';
import TripCard from './ui/TripCard';

/** Demo trips matching API TripItemDto shape (three items). */
const trips: TripItemDto[] = [
  {
    id: 1,
    title: 'Giftun Island Paradise',
    slug: 'giftun-island-paradise',
    city: 'Hurghada, Red Sea',
    price: {
      adult: 150,
      child: 75,
      enfant: 0,
      currency: { currencyCode: 'USD' },
    },
    durationHours: '8',
    category: 'Island Tours',
    coverImageURL: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    discount: {
      type: 'FixedAmount',
      value: 40,
      start: '2025-01-01T00:00:00Z',
      end: '2025-12-31T23:59:59Z',
    },
  },
  {
    id: 2,
    title: 'Orange Bay Beach Trip',
    slug: 'orange-bay-beach-trip',
    city: 'Orange Bay, Giftun Island',
    price: {
      adult: 150,
      child: 75,
      enfant: 0,
      currency: { currencyCode: 'USD' },
    },
    durationHours: '8',
    category: 'Beach',
    coverImageURL: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    discount: {
      type: 'FixedAmount',
      value: 70,
      start: '2025-01-01T00:00:00Z',
      end: '2025-12-31T23:59:59Z',
    },
  },
  {
    id: 3,
    title: 'Luxor Historical Tour',
    slug: 'luxor-historical-tour',
    city: 'Luxor Valley, Egypt',
    price: {
      adult: 150,
      child: 80,
      enfant: 0,
      currency: { currencyCode: 'USD' },
    },
    durationHours: '16',
    category: 'Cultural',
    coverImageURL: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800&q=80',
    discount: {
      type: 'FixedAmount',
      value: 30,
      start: '2025-01-01T00:00:00Z',
      end: '2025-12-31T23:59:59Z',
    },
  },
];

export default function PopularTrips() {
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
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">

          <Button href="#trips" size="lg">View All Tours</Button>
        </div>

      </div>
    </section>
  );
}
