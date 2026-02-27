import PopularTrips from '../components/PopularTrips';
import SeaAdventures from '../components/SeaAdventures';
import Transfers from '../components/Transfers';
import WhyChoose from '../components/WhyChoose';
import Reviews from '../components/Reviews';
import FAQ from '../components/FAQ';
import { PulseFitHero } from '@/components/ui/pulse-fit-hero';
import { buildWhatsAppHref } from '@/components/ui/WhatsAppCTA';
import type { TripItemDto } from '@/lib/types/tripsTypes';
import PopularDestinationHero from '@/components/PopularDestinationHero';
import Contact from '@/components/Contact';


/** Demo trips for hero carousel only. No API fetch. */
const HERO_DEMO_TRIPS: TripItemDto[] = [
  {
    id: 1,
    title: 'Snorkeling & island hopping',
    slug: 'snorkeling-island-hopping',
    city: 'Hurghada',
    price: { adult: 45, child: 25, enfant: 0, currency: { currencyCode: 'USD' } },
    durationHours: '8',
    category: 'Sea trip',
    coverImageURL: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=500&fit=crop',
  },
  {
    id: 2,
    title: 'Desert safari & quad biking',
    slug: 'desert-safari-quad-biking',
    city: 'Hurghada',
    price: { adult: 55, child: 30, enfant: 0, currency: { currencyCode: 'USD' } },
    durationHours: '6',
    category: 'Desert',
    coverImageURL: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=500&fit=crop',
  },
  {
    id: 3,
    title: 'Luxor & ancient temples',
    slug: 'luxor-ancient-temples',
    city: 'Luxor',
    price: { adult: 120, child: 60, enfant: 0, currency: { currencyCode: 'USD' } },
    durationHours: '12',
    category: 'Day trip',
    coverImageURL: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=500&fit=crop',
  },
  {
    id: 4,
    title: 'Diving & yacht trips',
    slug: 'diving-yacht-trips',
    city: 'Hurghada',
    price: { adult: 80, child: 40, enfant: 0, currency: { currencyCode: 'USD' } },
    durationHours: '6',
    category: 'Sea trip',
    coverImageURL: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=500&fit=crop',
    discount: { type: 'FixedAmount', value: 10, start: '', end: '' },
  },
  {
    id: 5,
    title: 'Orange Bay & Paradise Island',
    slug: 'orange-bay-paradise-island',
    city: 'Hurghada',
    price: { adult: 35, child: 20, enfant: 0, currency: { currencyCode: 'USD' } },
    durationHours: '7',
    category: 'Sea trip',
    coverImageURL: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=500&fit=crop',
  },
];

export default function Home() {
  return (
    <>
      <PulseFitHero
        trips={HERO_DEMO_TRIPS}
      />
      {/* <PopularTrips /> */}
      <Transfers />
      {/* <SeaAdventures /> */}
      {/* <Accommodation /> */}
      <PopularDestinationHero />
      <WhyChoose />
      <Reviews />
      {/* <FAQ /> */}
      <Contact/>
      {/* <Newsletter /> */}
    </>
  );
}
