'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth, SignInButton } from '@clerk/nextjs';
import { usePublicTripBySlug, isApiError } from '@/lib/hooks/useTrips';
import {
  Clock,
  MapPin,
  Calendar,
  Users,
  Check,
  X,
  Languages,
  Loader2,
  ArrowLeft,
  Info,
  ShoppingCartIcon,
} from 'lucide-react';

export default function TripDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();

  const { data, isLoading, isError, error } = usePublicTripBySlug(slug);
  const trip = data?.data;

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F6F6] flex flex-col items-center justify-center py-20">
        <Loader2 className="w-16 h-16 text-(--accent-orange) animate-spin mb-6" />
        <p className="text-gray-600 text-xl">Loading trip details...</p>
      </div>
    );
  }

  // Error State
  if (isError || !trip) {
    return (
      <div className="min-h-screen bg-[#F5F6F6] flex flex-col items-center justify-center py-20 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-3xl">⚠️</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Trip Not Found
            </h3>
            <p className="text-gray-600 mb-6">
              {isApiError(error)
                ? error.message
                : 'The trip you are looking for does not exist or has been removed.'}
            </p>
            <Link href="/trips" className="btn-primary">
              <ArrowLeft className="inline w-5 h-5 mr-2" />
              Back to All Trips
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const coverImage = trip.images.find((img) => img.isCoverImage);
  const finalPrice =
    trip.discount && trip.discount.amount > 0
      ? trip.price.adult - trip.discount.amount
      : trip.price.adult;

  return (
    <div className="min-h-screen bg-[#F5F6F6]">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/trips"
            className="inline-flex items-center text-gray-600 hover:text-(--accent-orange) transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium">Back to All Trips</span>
          </Link>
        </div>
      </div>

      {/* Hero Section with Image Gallery */}
      <section className="relative bg-[#F5E6D8]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Main Image */}
            <div className="relative h-96 lg:h-[600px] rounded-3xl overflow-hidden shadow-soft-lg">
              <Image
                src={coverImage?.imageURL || trip.images[0]?.imageURL || '/placeholder.jpg'}
                alt={trip.title}
                fill
                className="object-cover"
                priority
              />
              {trip.discount && trip.discount.amount > 0 && (
                <div className="absolute top-6 left-6 bg-[#F9C74F] text-gray-900 px-4 py-2 rounded-xl font-bold text-lg shadow-xl">
                  Save ${trip.discount.amount}
                </div>
              )}
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-4">
              {trip.images.slice(1, 5).map((image) => (
                <div
                  key={image.id}
                  className="relative h-44 lg:h-[288px] rounded-3xl overflow-hidden shadow-soft"
                >
                  <Image
                    src={image.imageURL}
                    alt={trip.title}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title and Quick Info */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft">
                <div className="inline-block bg-(--accent-orange) text-white text-sm font-semibold px-4 py-1.5 rounded-lg mb-4">
                  {trip.categoryName}
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  {trip.title}
                </h1>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-(--accent-orange)/10 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-(--accent-orange)" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-bold text-gray-900">{trip.durationHours}h</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-(--accent-orange)/10 flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-(--accent-orange)" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-bold text-gray-900">{trip.city}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-(--accent-orange)/10 flex items-center justify-center">
                      <Languages className="w-6 h-6 text-(--accent-orange)" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Languages</p>
                      <p className="font-bold text-gray-900">{trip.languages.length}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-(--accent-orange)/10 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-(--accent-orange)" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Slots</p>
                      <p className="font-bold text-gray-900">{trip.tripSlots.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overview */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Overview
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                  {trip.overview}
                </p>
              </div>

              {/* Description */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  About This Experience
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                  {trip.description}
                </p>
              </div>

              {/* Highlights */}
              {trip.highlights.length > 0 && (
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                    Highlights
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {trip.highlights.map((highlight) => (
                      <div
                        key={highlight.id}
                        className="flex items-start gap-3 p-4 rounded-xl bg-(--accent-orange)/5 border border-(--accent-orange)/10"
                      >
                        <div className="w-6 h-6 rounded-full bg-(--accent-orange) flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-gray-800 font-medium">{highlight.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inclusions */}
                {trip.inclusions.length > 0 && (
                  <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Check className="w-6 h-6 text-green-600" />
                      What&apos;s Included
                    </h3>
                    <ul className="space-y-3">
                      {trip.inclusions.map((inclusion) => (
                        <li
                          key={inclusion.id}
                          className="flex items-start gap-2 text-gray-700"
                        >
                          <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                          <span>{inclusion.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Exclusions */}
                {trip.exclusions.length > 0 && (
                  <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <X className="w-6 h-6 text-red-600" />
                      What&apos;s Not Included
                    </h3>
                    <ul className="space-y-3">
                      {trip.exclusions.map((exclusion) => (
                        <li
                          key={exclusion.id}
                          className="flex items-start gap-2 text-gray-700"
                        >
                          <X className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                          <span>{exclusion.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Info Sections / Itinerary */}
              {trip.infoSections.length > 0 && (
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                    Detailed Itinerary
                  </h2>
                  <div className="space-y-6">
                    {trip.infoSections.map((section, idx) => (
                      <div key={section.id} className="relative">
                        {/* Timeline indicator */}
                        {idx !== trip.infoSections.length - 1 && (
                          <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200" />
                        )}

                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-full bg-(--accent-orange) text-white font-bold flex items-center justify-center shrink-0 relative z-10">
                            {idx + 1}
                          </div>
                          <div className="flex-1 pb-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                              {section.title}
                            </h3>
                            <ul className="space-y-2">
                              {section.items.map((item) => (
                                <li
                                  key={item.id}
                                  className="flex items-start gap-2 text-gray-700"
                                >
                                  <Info className="w-4 h-4 text-(--accent-orange) shrink-0 mt-1" />
                                  <span>{item.title}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {trip.languages.length > 0 && (
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    Available Languages
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {trip.languages.map((language) => (
                      <div
                        key={language.id}
                        className="px-4 py-2 bg-(--accent-orange)/10 text-(--accent-orange) rounded-xl font-medium"
                      >
                        {language.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Slots */}
              {trip.tripSlots.length > 0 && (
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    Available Days & Times
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trip.tripSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="p-4 border-2 border-gray-200 rounded-xl hover:border-(--accent-orange) transition-colors"
                      >
                        <p className="font-bold text-gray-900 mb-1">{slot.day}</p>
                        <p className="text-sm text-gray-600 mb-2">
                          Starts at {slot.startsAt}
                        </p>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Users className="w-4 h-4" />
                          <span>{slot.capacity} spots</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Booking Card (Sticky) */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-3xl p-6 md:p-8 shadow-soft-lg border-2 border-(--accent-orange)/20">
                <div className="text-center mb-6">
                  <p className="text-gray-600 text-sm mb-2">Price per person</p>
                  <div className="flex items-center justify-center gap-3">
                    {trip.discount && trip.discount.amount > 0 && (
                      <span className="text-2xl text-gray-400 line-through">
                        ${trip.price.adult}
                      </span>
                    )}
                    <span className="text-4xl md:text-5xl font-bold text-(--accent-orange)">
                      ${finalPrice}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {trip.price.currency.currencyCode}
                  </p>
                </div>

                {/* Pricing Breakdown */}
                <div className="bg-gray-50 rounded-2xl p-4 mb-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Adult</span>
                    <span className="font-semibold text-gray-900">
                      ${trip.price.adult}
                    </span>
                  </div>
                  {trip.price.child > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Child</span>
                      <span className="font-semibold text-gray-900">
                        ${trip.price.child}
                      </span>
                    </div>
                  )}
                  {trip.price.enfant > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Infant</span>
                      <span className="font-semibold text-gray-900">
                        ${trip.price.enfant}
                      </span>
                    </div>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  {isAuthLoaded && isSignedIn ? (
                    <button
                      onClick={() => {
                        window.location.href = `/trips/checkout?slug=${slug}`;
                      }}
                      className="w-full flex items-center justify-center gap-3 bg-(--accent-orange) text-white px-6 py-4 rounded-2xl font-bold text-lg hover:bg-(--secondary-orange) transition-all duration-300 hover:scale-105 shadow-xl"
                    >
                      <ShoppingCartIcon className="w-6 h-6" />
                      Book Now
                    </button>
                  ) : (
                    <SignInButton
                      mode="modal"
                      forceRedirectUrl={`/trips/checkout?slug=${slug}`}
                    >
                      <button
                        type="button"
                        className="w-full flex items-center justify-center gap-3 bg-(--accent-orange) text-white px-6 py-4 rounded-2xl font-bold text-lg hover:bg-(--secondary-orange) transition-all duration-300 hover:scale-105 shadow-xl"
                      >
                        <ShoppingCartIcon className="w-6 h-6" />
                        {isAuthLoaded ? 'Sign in to Book' : 'Book Now'}
                      </button>
                    </SignInButton>
                  )}

                  <button className="w-full btn-secondary py-4 text-lg">
                    Ask a Question
                  </button>
                </div>

                {/* Info Notice */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-sm text-blue-800">
                    <Info className="inline w-4 h-4 mr-1" />
                    Book at least <strong>{trip.bookingWindowHours} hours</strong> in advance
                  </p>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      Free cancellation up to 24h
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      Instant confirmation
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      Local expert guides
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-linear-to-br from-[#F3722A] via-[#F15A22] to-[#F36F24]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready for an Unforgettable Adventure?
            </h2>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              Join thousands of happy travelers who have explored Egypt with us
            </p>
            <a
              href={`https://wa.me/1234567890?text=Hi! I'd like to book "${trip.title}"`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-(--accent-orange) px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-xl"
            >
              Book This Trip Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
