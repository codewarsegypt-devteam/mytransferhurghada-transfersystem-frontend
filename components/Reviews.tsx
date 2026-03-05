"use client";

import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
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

  const getVisibleReviews = () => {
    const visibleReviews = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % reviews.length;
      visibleReviews.push(reviews[index]);
    }
    return visibleReviews;
  };

  return (
    <section className="relative py-16 lg:py-24 bg-white border-t border-[#E2E8F0] overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #1B3565 0px, #1B3565 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #1B3565 0px, #1B3565 1px, transparent 1px, transparent 40px)",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeader
          subtitle="Testimonials"
          title="What Travelers Say"
          description="Hear from our satisfied customers who have experienced the magic of Egypt with Fox Travel"
        />

        {/* Review Cards */}
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 mb-8">
            {getVisibleReviews().map((review, index) => (
              <div
                key={`${review.id}-${index}`}
                className={`bg-white rounded-md p-6 border border-[#E2E8F0] hover:border-main/20 hover:shadow-[0_8px_30px_rgba(27,53,101,0.08)] transition-all duration-300 hover:-translate-y-1 ${
                  index > 0 ? "hidden md:block" : ""
                } ${index > 1 ? "hidden lg:block" : ""}`}
              >
                {/* Star Rating */}
                <div className="flex items-center gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? "fill-[#C9A14A] text-[#C9A14A]"
                          : "text-[#E2E8F0]"
                      }`}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-slate-600 text-sm leading-relaxed mb-5">
                  &quot;{review.text}&quot;
                </p>

                {/* Trip Name Badge */}
                <div className="mb-4">
                  <span className="inline-block bg-[#F0F4F8] text-main text-xs font-semibold px-3 py-1.5 rounded-sm border border-[#E2E8F0] uppercase tracking-wide">
                    {review.tripName}
                  </span>
                </div>

                {/* Reviewer */}
                <div className="flex items-center pt-4 border-t border-[#E2E8F0]">
                  <div className="relative w-10 h-10 rounded-sm overflow-hidden mr-3 shrink-0 border border-[#E2E8F0]">
                    <Image
                      src={review.avatar}
                      alt={review.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[#0F172A] text-sm">
                      {review.name}
                    </h4>
                    <p className="text-slate-400 text-xs">
                      {review.country} · {review.date}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <button
              onClick={handlePrevious}
              className="w-10 h-10 rounded-md border border-[#E2E8F0] bg-white hover:bg-main hover:border-main hover:text-white text-main transition-all duration-200 flex items-center justify-center"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`h-1.5 rounded-sm transition-all duration-300 ${
                    index === currentIndex
                      ? "w-8 bg-main"
                      : "w-1.5 bg-[#E2E8F0] hover:bg-main/30"
                  }`}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-md border border-[#E2E8F0] bg-white hover:bg-main hover:border-main hover:text-white text-main transition-all duration-200 flex items-center justify-center"
              aria-label="Next review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button className="btn-primary px-8 py-3.5 text-sm font-semibold rounded-md inline-flex items-center gap-2">
            Book Your Adventure Now
          </button>
        </div>
      </div>
    </section>
  );
}
