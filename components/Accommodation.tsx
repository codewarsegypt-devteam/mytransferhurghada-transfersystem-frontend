'use client';

import Image from 'next/image';
import { MapPin, Star, Users, Bed } from 'lucide-react';

interface Package {
  id: number;
  name: string;
  location: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  type: string;
  capacity: number;
  beds: string;
  featured?: boolean;
  packageDetails?: string;
}

const packages: Package[] = [
  {
    id: 1,
    name: "Luxury Beach Resort",
    location: "Hurghada, Red Sea",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    price: 299.00,
    rating: 4.9,
    reviews: 186,
    type: "All-Inclusive Package",
    capacity: 4,
    beds: "2 King Beds",
    featured: true,
    packageDetails: "3 Days / 2 Nights"
  },
  {
    id: 2,
    name: "Paradise Island Hotel",
    location: "Sharm El Sheikh",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    price: 249.00,
    rating: 4.8,
    reviews: 254,
    type: "Half Board Package",
    capacity: 2,
    beds: "1 King Bed",
    featured: true,
    packageDetails: "2 Days / 1 Night"
  },
  {
    id: 3,
    name: "Desert Oasis Resort",
    location: "Luxor, Nile Valley",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    price: 199.00,
    rating: 4.7,
    reviews: 142,
    type: "Bed & Breakfast",
    capacity: 3,
    beds: "1 King + 1 Single",
    packageDetails: "Flexible Dates"
  },
  {
    id: 4,
    name: "Nile View Boutique Hotel",
    location: "Cairo, Nile River",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    price: 279.00,
    rating: 4.9,
    reviews: 312,
    type: "Premium Package",
    capacity: 2,
    beds: "1 King Bed",
    featured: true,
    packageDetails: "4 Days / 3 Nights"
  },
  {
    id: 5,
    name: "Red Sea Diving Resort",
    location: "Marsa Alam, Red Sea",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    price: 329.00,
    rating: 4.8,
    reviews: 198,
    type: "Dive Package",
    capacity: 2,
    beds: "2 Twin Beds",
    packageDetails: "5 Days / 4 Nights"
  },
  {
    id: 6,
    name: "Coastal Retreat Villa",
    location: "Dahab, Sinai",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
    price: 399.00,
    rating: 5.0,
    reviews: 89,
    type: "Private Villa Package",
    capacity: 6,
    beds: "3 King Beds",
    featured: true,
    packageDetails: "7 Days / 6 Nights"
  }
];

export default function Accommodation() {
  return (
    <section className="py-16 md:py-24 px-4 bg-linear-to-b from-white to-[#F5EDE4]">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="handwriting-style text-[#F3722A] text-xl md:text-2xl mb-3">
            Stay with Comfort
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#2C3539] mb-4">
            Accommodation & Packages
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
            Discover handpicked hotels and exclusive packages designed for your perfect Egyptian getaway
          </p>
        </div>

        {/* Package Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="relative h-64 md:h-72 overflow-hidden">
                <Image
                  src={pkg.image}
                  alt={pkg.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Package Type Badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-lg font-semibold text-sm shadow-md">
                  {pkg.type}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                {/* Featured Badge */}
                {pkg.featured && (
                  <span className="inline-block bg-[#F3722A] text-white text-xs font-semibold px-3 py-1 rounded-md mb-3">
                    Featured
                  </span>
                )}

                {/* Location */}
                <div className="flex items-center text-gray-600 text-sm mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{pkg.location}</span>
                </div>

                {/* Name */}
                <h3 className="text-xl md:text-2xl font-bold text-[#2C3539] mb-3">
                  {pkg.name}
                </h3>

                {/* Package Details */}
                {pkg.packageDetails && (
                  <div className="text-sm text-[#F3722A] font-medium mb-4">
                    {pkg.packageDetails}
                  </div>
                )}

                {/* Accommodation Details */}
                <div className="flex items-center gap-4 mb-4 text-gray-600 text-sm">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{pkg.capacity} Guests</span>
                  </div>
                  <div className="flex items-center">
                    <Bed className="w-4 h-4 mr-1" />
                    <span>{pkg.beds}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-sm text-gray-600">From </span>
                  <span className="text-[#F3722A] font-bold text-2xl">
                    ${pkg.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-600">/Per night</span>
                </div>

                {/* Rating and Book Button */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  {/* Rating */}
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(pkg.rating)
                              ? 'fill-[#F9C74F] text-[#F9C74F]'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">({pkg.reviews})</span>
                  </div>

                  {/* Book Now Link */}
                  <button className="text-[#F3722A] font-semibold text-sm hover:text-[#F15A22] transition-colors">
                    Book Now →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button className="btn-primary px-8 py-4 text-lg font-semibold">
            View All Accommodation
          </button>
        </div>
      </div>
    </section>
  );
}
