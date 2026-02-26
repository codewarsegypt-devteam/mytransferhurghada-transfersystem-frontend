"use client";

import { useState, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import SectionHeader from "./SectionHeader";

interface Review {
  id: number;
  name: string;
  country: string;
  rating: number;
  text: string;
  date: string;
  avatar: string;
  tripName: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    country: "United States",
    rating: 5,
    text: "An absolutely incredible experience! Fox Travel made our Egypt trip unforgettable. The guides were knowledgeable, the accommodations perfect, and every detail was handled with care. We visited the Pyramids, sailed the Nile, and explored Luxor - all beyond our expectations!",
    date: "January 2026",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    tripName: "Cairo & Luxor Tour",
  },
  {
    id: 2,
    name: "Michael Chen",
    country: "Canada",
    rating: 5,
    text: "Professional service from start to finish! The snorkeling trip to Orange Bay was spectacular. Crystal clear waters, amazing coral reefs, and the entire crew was fantastic. Highly recommend Fox Travel for anyone visiting the Red Sea area.",
    date: "December 2025",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    tripName: "Orange Bay Snorkeling",
  },
  {
    id: 3,
    name: "Emma Williams",
    country: "United Kingdom",
    rating: 5,
    text: "Fox Travel exceeded all our expectations! The private yacht experience was luxurious and the staff was incredibly attentive. We felt safe and pampered throughout our entire journey. Best vacation we've ever had!",
    date: "November 2025",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    tripName: "Private Yacht Charter",
  },
  {
    id: 4,
    name: "David Martinez",
    country: "Spain",
    rating: 5,
    text: "Outstanding organization and excellent value for money! Our family had an amazing time exploring Egypt with Fox Travel. The transfers were comfortable, hotels were great, and our guide was passionate about Egyptian history. We'll definitely be back!",
    date: "October 2025",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    tripName: "Family Egypt Adventure",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    country: "Australia",
    rating: 5,
    text: "The diving experience was world-class! Fox Travel's team was professional, safety-focused, and knew all the best spots. We saw incredible marine life and the underwater world of the Red Sea is truly magical. Can't wait to come back!",
    date: "September 2025",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
    tripName: "Red Sea Diving",
  },
  {
    id: 6,
    name: "James Brown",
    country: "Germany",
    rating: 5,
    text: "Exceptional service and attention to detail! From booking to the end of our trip, everything was seamless. The 24/7 WhatsApp support was incredibly helpful. Fox Travel made our honeymoon in Egypt absolutely perfect!",
    date: "August 2025",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
    tripName: "Romantic Egypt Honeymoon",
  },
];

export default function Reviews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  // Calculate visible reviews (show 3 on desktop, 1 on mobile)
  const getVisibleReviews = () => {
    const visibleReviews = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % reviews.length;
      visibleReviews.push(reviews[index]);
    }
    return visibleReviews;
  };

  // Calculate average rating
  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
    <section className="relative py-8 lg:py-15 bg-linear-to-b from-white to-[#F5EDE4] overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <SectionHeader
            subtitle="Testimonials"
            title="What Travelers Say"
            description="Hear from our satisfied customers who have experienced the magic of Egypt with Fox Travel"
          />

          {/* Overall Rating Display */}
          <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
            <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-soft gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-[#F9C74F] text-[#F9C74F]"
                  />
                ))}
              </div>
              <span className="text-lg font-bold text-[#2C3539]">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-600">/ 5</span>
            </div>
            <span className="text-sm text-gray-600">
              <span className="font-semibold text-[#2C3539]">
                {reviews.length}+
              </span>{" "}
              reviews
            </span>
          </div>
        </div>

        {/* Reviews Carousel */}
        <div className="relative max-w-7xl mx-auto">
          {/* Review Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
            {getVisibleReviews().map((review, index) => (
              <div
                key={`${review.id}-${index}`}
                className={`bg-white rounded-3xl p-8 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-2 ${
                  index > 0 ? "hidden md:block" : ""
                } ${index > 1 ? "hidden lg:block" : ""}`}
              >
                {/* Quote Icon */}
                <div className="mb-4">
                  <Quote className="w-10 h-10 text-[#F3722A] opacity-30" />
                </div>

                {/* Star Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < review.rating
                          ? "fill-[#F9C74F] text-[#F9C74F]"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-gray-600 text-base leading-relaxed mb-6">
                  &quot;{review.text}&quot;
                </p>

                {/* Trip Name Badge */}
                <div className="mb-4">
                  <span className="inline-block bg-[#F5EDE4] text-[#F3722A] text-xs font-semibold px-3 py-1.5 rounded-full">
                    {review.tripName}
                  </span>
                </div>

                {/* Reviewer Info */}
                <div className="flex items-center pt-4 border-t border-gray-100">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4 shrink-0">
                    <Image
                      src={review.avatar}
                      alt={review.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[#2C3539] text-lg">
                      {review.name}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {review.country} • {review.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation: arrows left/right, dots in the middle */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <button
              onClick={handlePrevious}
              className="w-12 h-12 rounded-full bg-white shadow-soft hover:shadow-soft-lg hover:bg-[#F3722A] hover:text-white text-[#2C3539] transition-all duration-300 flex items-center justify-center group shrink-0"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center justify-center gap-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-8 bg-[#F3722A]"
                      : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full bg-white shadow-soft hover:shadow-soft-lg hover:bg-[#F3722A] hover:text-white text-[#2C3539] transition-all duration-300 flex items-center justify-center group shrink-0"
              aria-label="Next review"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Trust Badges
        <div className="flex flex-wrap items-center justify-center gap-8 mt-16">
          <div className="flex items-center space-x-3 bg-white px-6 py-4 rounded-2xl shadow-soft">
            <div className="w-12 h-12 bg-[#F3722A] rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <p className="font-bold text-[#2C3539] text-lg">Excellent</p>
              <p className="text-gray-600 text-sm">TripAdvisor Rating</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-white px-6 py-4 rounded-2xl shadow-soft">
            <div className="w-12 h-12 bg-[#F3722A] rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-[#2C3539] text-lg">5.0 Stars</p>
              <p className="text-gray-600 text-sm">Google Reviews</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-white px-6 py-4 rounded-2xl shadow-soft">
            <div className="w-12 h-12 bg-[#F3722A] rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-[#2C3539] text-lg">10,000+</p>
              <p className="text-gray-600 text-sm">Happy Travelers</p>
            </div>
          </div>
        </div> */}

        {/* CTA Section */}
        <div className="text-center mt-12">
          {/* <p className="text-gray-600 mb-6">Ready to create your own amazing story?</p> */}
          <button className="btn-primary px-8 py-4 text-lg font-semibold">
            Book Your Adventure Now
          </button>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
