'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
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
  Sparkles,
  ClipboardList,
  Globe,
  ChartNoAxesGantt,
} from 'lucide-react';
import { WhatsAppCTA } from '@/components/ui/WhatsAppCTA';
import { ImageCarousel } from '@/components/ui/ImageCarousel';
import { motion } from 'framer-motion';

export default function TripDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

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

  const finalPrice =
    trip.discount && trip.discount.amount > 0
      ? trip.price.adult - trip.discount.amount
      : trip.price.adult;

  return (
    <div className="min-h-screen bg-[#F5F6F6]">
      {/* Back Button */}
      {/* <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/trips"
            className="inline-flex items-center text-gray-600 hover:text-(--accent-orange) transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium">Back to All Trips</span>
          </Link>
        </div>
      </div> */}

      {/* Hero Section with Image Carousel */}
      <ImageCarousel
        images={trip.images}
        title={trip.title}
        discount={trip.discount}
        autoplayInterval={3000}
        showThumbnails={true}
      />

      {/* Main Content */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title and Quick Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-soft border border-gray-100"
              >
                <div className="flex items-center gap-2 mb-5">
                  <div className="h-1 w-1 rounded-full bg-(--accent-orange)" />
                  <span className="text-xs uppercase tracking-wider font-semibold text-(--accent-orange)">
                    {trip.categoryName}
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  {trip.title}
                </h1>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-linear-to-br from-orange-50 to-orange-50/30 border border-orange-100"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                      <Clock className="w-4 h-4 text-(--accent-orange)" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 font-medium">Duration</p>
                      <p className="text-sm font-bold text-gray-900">{trip.durationHours}</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-linear-to-br from-orange-50 to-orange-50/30 border border-orange-100"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-(--accent-orange)" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 font-medium">Location</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{trip.city}</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-linear-to-br from-orange-50 to-orange-50/30 border border-orange-100"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                      <Languages className="w-4 h-4 text-(--accent-orange)" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 font-medium">Languages</p>
                      <p className="text-sm font-bold text-gray-900">{trip.languages.length}</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-linear-to-br from-orange-50 to-orange-50/30 border border-orange-100"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-(--accent-orange)" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 font-medium">Dates & times</p>
                      <p className="text-sm font-bold text-gray-900">{trip.tripSlots.length}</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-linear-to-br from-white to-gray-50/50 rounded-2xl p-5 md:p-6 shadow-soft border border-gray-100"
              >
                {/* <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-lg bg-(--accent-orange)/10 flex items-center justify-center">
                    <Info className="w-3.5 h-3.5 text-(--accent-orange)" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    Overview
                  </h2>
                </div> */}
                <div className="flex items-center gap-2 mb-4">
                  <ChartNoAxesGantt className="w-5 h-5 text-(--accent-orange)" />
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    Overview
                  </h2>
                </div>
                <p className="text-gray-600 text-base leading-relaxed whitespace-pre-line">
                  {trip.overview}
                </p>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-2xl p-5 md:p-6 shadow-soft border border-gray-100 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-(--accent-orange)/5 rounded-full -translate-y-16 translate-x-16" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-(--accent-orange)" />
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                      About This Experience
                    </h2>
                  </div>
                  <p
                    className={`text-gray-600 text-base leading-relaxed whitespace-pre-line ${!descriptionExpanded ? 'line-clamp-3' : ''}`}
                  >
                    {trip.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => setDescriptionExpanded((v) => !v)}
                    className="mt-3 text-(--accent-orange) font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-(--accent-orange)/30 rounded"
                  >
                    {descriptionExpanded ? 'See less' : 'See more'}
                  </button>
                </div>
              </motion.div>

              {/* Highlights */}
              {trip.highlights.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-linear-to-br from-amber-50/50 via-white to-orange-50/30 rounded-2xl p-5 md:p-6 shadow-soft border border-orange-100"
                >
                  <div className="flex items-center gap-2 mb-5">
                    <Sparkles className="w-5 h-5 text-(--accent-orange)" />
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                      Highlights
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {trip.highlights.map((highlight, idx) => (
                      <motion.div
                        key={highlight.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        whileHover={{ x: 4 }}
                        className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white border border-orange-100 shadow-sm"
                      >
                        <div className="w-5 h-5 rounded-full bg-(--accent-orange) flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-700 text-sm font-medium leading-snug">{highlight.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Inclusions */}
                {trip.inclusions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-linear-to-br from-emerald-50/50 to-white rounded-2xl p-6 shadow-soft border border-emerald-100"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Check className="w-4 h-4 text-emerald-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        What&apos;s Included
                      </h3>
                    </div>
                    <ul className="space-y-2.5">
                      {trip.inclusions.map((inclusion, idx) => (
                        <motion.li
                          key={inclusion.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.4 + idx * 0.03 }}
                          className="flex items-start gap-2 text-gray-700 text-sm"
                        >
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{inclusion.name}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* Exclusions */}
                {trip.exclusions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-linear-to-br from-red-50/50 to-white rounded-2xl p-6 shadow-soft border border-red-100"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-lg bg-red-100 flex items-center justify-center">
                        <X className="w-4 h-4 text-red-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        What&apos;s Not Included
                      </h3>
                    </div>
                    <ul className="space-y-2.5">
                      {trip.exclusions.map((exclusion, idx) => (
                        <motion.li
                          key={exclusion.id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.4 + idx * 0.03 }}
                          className="flex items-start gap-2 text-gray-700 text-sm"
                        >
                          <X className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                          <span>{exclusion.name}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>

              {/* Info Sections / Itinerary */}
              {trip.infoSections.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="bg-white rounded-2xl p-5 md:p-6 shadow-soft border border-gray-100"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <ClipboardList className="w-5 h-5 text-(--accent-orange)" />
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                      Detailed Itinerary
                    </h2>
                  </div>
                  <div className="space-y-5">
                    {trip.infoSections.map((section, idx) => (
                      <motion.div
                        key={section.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 + idx * 0.1 }}
                        className="relative"
                      >
                        {/* Timeline indicator */}
                        {idx !== trip.infoSections.length - 1 && (
                          <div className="absolute left-4 top-10 bottom-0 w-px bg-linear-to-b from-orange-200 via-orange-100 to-transparent" />
                        )}

                        <div className="flex gap-3.5">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="w-8 h-8 rounded-lg bg-linear-to-br from-(--accent-orange) to-(--secondary-orange) text-white text-sm font-bold flex items-center justify-center shrink-0 relative z-10 shadow-sm"
                          >
                            {idx + 1}
                          </motion.div>
                          <div className="flex-1 pb-5">
                            <h3 className="text-base font-bold text-gray-900 mb-2.5">
                              {section.title}
                            </h3>
                            <ul className="space-y-1.5">
                              {section.items.map((item) => (
                                <li
                                  key={item.id}
                                  className="flex items-start gap-2 text-gray-600 text-sm"
                                >
                                  <div className="w-1 h-1 rounded-full bg-(--accent-orange) shrink-0 mt-2" />
                                  <span>{item.title}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Languages */}
              {trip.languages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-white rounded-2xl p-5 md:p-6 shadow-soft border border-gray-100"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Globe className="w-5 h-5 text-(--accent-orange)" />
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                      Available Languages
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {trip.languages.map((language, idx) => (
                      <motion.div
                        key={language.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.6 + idx * 0.05 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="px-3.5 py-1.5 bg-linear-to-r from-(--accent-orange)/10 to-(--secondary-orange)/10 text-(--accent-orange) rounded-lg text-sm font-semibold border border-(--accent-orange)/20"
                      >
                        {language.name}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Available Slots */}
              {trip.tripSlots.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="bg-white rounded-2xl p-5 md:p-6 shadow-soft border border-gray-100"
                >

                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-(--accent-orange)" />
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                      Schedule & Availability
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {trip.tripSlots.map((slot, idx) => (
                      <motion.div
                        key={slot.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.7 + idx * 0.05 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="group relative bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-(--accent-orange) hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            {slot.day}
                          </span>
                          <div className="w-1.5 h-1.5 rounded-full bg-(--accent-orange)" />
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-(--accent-orange) shrink-0" />
                          <p className="text-sm font-bold text-gray-900">
                            {slot.startsAt}
                          </p>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-(--accent-orange) to-(--secondary-orange) rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </motion.div>
                    ))}
                  </div>


                </motion.div>
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
                      className="w-full cursor-pointer flex items-center justify-center gap-3 bg-(--accent-orange) text-white px-6 py-4 rounded-2xl font-bold text-lg hover:bg-(--secondary-orange) transition-all duration-300 hover:scale-105 shadow-xl"
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
                        className="w-full cursor-pointer flex items-center justify-center gap-3 bg-(--accent-orange) text-white px-6 py-4 rounded-2xl font-bold text-lg hover:bg-(--secondary-orange) transition-all duration-300 hover:scale-105 shadow-xl"
                      >
                        <ShoppingCartIcon className="w-6 h-6" />
                        {isAuthLoaded ? 'Sign in to Book' : 'Book Now'}
                      </button>
                    </SignInButton>
                  )}

                  <Link href="/contactus" className="w-full flex items-center justify-center cursor-pointer btn-secondary py-4 text-lg">
                    Ask a Question
                  </Link>
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
      {/* <section className="py-16 md:py-24 bg-linear-to-br from-[#F3722A] via-[#F15A22] to-[#F36F24]">
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
      </section> */}
      <WhatsAppCTA
        title="Ready for an Unforgettable Adventure?"
        description="Join thousands of happy travelers who have explored Egypt with us"
        buttonLabel="Book This Trip Now"
        variant="gradient"
        href={`/trips/checkout?slug=${slug}`}
      />
    </div>
  );
}
