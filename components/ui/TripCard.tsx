'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock } from 'lucide-react';
import { TripItemDto } from '@/lib/types/tripsTypes';

// export interface TripCardData {
//   id: number;
//   title: string;
//   location: string;
//   image: string;
//   price: number;
//   duration: number;
//   rating: number;
//   reviews: number;
//   discount?: number;
//   featured?: boolean;
// }

interface TripCardProps {
  trip: TripItemDto;
  className?: string;
}

export default function TripCard({ trip, className = '' }: TripCardProps) {
  return (
    <div
      className={`group cursor-pointer relative bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1 ${className}`}
    >
      {/* Image Container */}
      <div className="relative h-64 md:h-72 overflow-hidden">
        <Image
          src={trip.coverImageURL}
          alt={trip.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Discount Badge */}
        {trip.discount != null && trip.discount.value > 0 && (
          <div className="absolute top-4 left-4 bg-[#F9C74F] text-gray-900 px-3 py-1.5 rounded-lg font-semibold text-sm shadow-md">
            {trip.discount.value}% Off
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* category Badge */}
        <div className="inline-block bg-(--accent-orange) text-white text-xs font-semibold px-3.5 py-1 rounded-lg mb-3">
          {trip.category}
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{trip.city}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold text-[#2C3539] mb-3">
          {trip.title}
        </h3>

        {/* Price */}
        <div className="mb-4">
          {/* <span className="text-sm text-gray-600">Form </span> */}
          <span className="text-(--accent-orange) font-bold text-lg">
            ${trip.price.adult}
          </span>
          <span className="text-sm text-gray-600">/Per person</span>
        </div>

        {/* Rating and Duration */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          

          {/* Duration */}
          <div className="flex items-center text-gray-600 text-sm">
            <Clock className="w-4 h-4 mr-1" />
            <span>{trip.durationHours} Hour{parseInt(trip.durationHours) > 1 ? 's' : ''}</span>
          </div>
          {/* CTA Button */}
          <Link
            href={`/trips/${trip.slug}`}
            className="text-sm font-medium text-(--accent-orange) hover:text-(--accent-orange)/90 transition-colors"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  );
}

// {/* Rating */}
// <div className="flex items-center">
// <div className="flex items-center">
//   {[...Array(5)].map((_, i) => (
//     <Star
//       key={i}
//       className={`w-4 h-4 ${
//         i < Math.floor(trip.rating)
//           ? 'fill-[#F9C74F] text-[#F9C74F]'
//           : 'text-gray-300'
//       }`}
//     />
//   ))}
// </div>
// <span className="text-sm text-gray-600 ml-2">({trip.reviews})</span>
// </div>