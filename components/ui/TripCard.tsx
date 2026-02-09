'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, ArrowRight, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { TripItemDto } from '@/lib/types/tripsTypes';

interface TripCardProps {
  trip: TripItemDto;
  className?: string;
  index?: number;
}

export default function TripCard({ trip, className = '', index = 0 }: TripCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ y: -8 }}
      className={className}
    >
      <Link href={`/trips/${trip.slug}`} className="block">
        <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 h-full">
          {/* Image Container with Gradient Overlay */}
          <div className="relative h-64 md:h-80 overflow-hidden">
            <motion.div
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-full h-full"
            >
              <Image
                src={trip.coverImageURL}
                alt={trip.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Discount Badge */}
            {trip.discount != null && trip.discount.value > 0 && (
              <motion.div
                initial={{ scale: 0, rotate: -12 }}
                animate={{ scale: 1, rotate: -12 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 260, 
                  damping: 20,
                  delay: 0.2 + index * 0.1
                }}
                className="absolute top-4 right-4 z-10"
              >
                <div className="bg-gradient-to-br from-[#F9C74F] to-[#f7b731] text-gray-900 px-4 py-2 rounded-xl font-bold text-sm shadow-xl backdrop-blur-sm flex items-center gap-1.5">
                  <Tag className="w-4 h-4" />
                  {trip.discount.value}% OFF
                </div>
              </motion.div>
            )}

            {/* Category Badge */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="absolute top-4 left-4 z-10"
            >
              <div className="bg-white/95 backdrop-blur-md text-[#FF6B35] text-xs font-bold px-4 py-2 rounded-full shadow-lg border border-[#FF6B35]/20">
                {trip.category}
              </div>
            </motion.div>
          </div>

          {/* Card Content */}
          <div className="p-6 space-y-4">
            {/* Location */}
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin className="w-4 h-4 mr-2 text-[#FF6B35]" />
              <span className="font-medium">{trip.city}</span>
            </div>

            {/* Title */}
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-[#FF6B35] transition-colors duration-300">
              {trip.title}
            </h3>

            {/* Duration */}
            <div className="flex items-center text-gray-600 text-sm">
              {/* <Clock className="w-4 h-4 mr-2 text-gray-400" /> */}
              {/* <span>{trip.durationHours} Hour{parseInt(trip.durationHours) > 1 ? 's' : ''}</span> */}
              {/* demo overview text */}
              <span className="text-gray-600 text-sm line-clamp-2">This is a demo overview text to be replaced with the actual overview text from the trip data. replaced with the actual overview text from the trip data. </span>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Price & CTA */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                {/* <p className="text-xs text-gray-500 uppercase tracking-wide">From</p> */}
                <div className="flex items-baseline gap-1">
                  <span className="text-[24px] font-bold text-[#FF6B35]">
                    {trip.price.adult} {trip.price.currency.currencyCode}
                  </span>
                  <span className="text-sm text-gray-600">/person</span>
                </div>
              </div>

              {/* View Details Button */}
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-2 text-[#FF6B35] font-semibold text-sm group/btn"
              >
                <span className="hidden sm:inline">View Details</span>
                <div className="w-10 h-10 rounded-full bg-[#FF6B35] flex items-center justify-center group-hover/btn:bg-[#ff5722] transition-colors shadow-lg">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Hover Accent Line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6B35] to-[#ff5722] origin-left"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </Link>
    </motion.div>
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