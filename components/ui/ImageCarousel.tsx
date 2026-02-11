'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselImage {
  id: number;
  imageURL: string;
  isCoverImage: boolean;
}

interface ImageCarouselProps {
  images: CarouselImage[];
  title: string;
  discount?: {
    amount: number;
  } | null;
  autoplayInterval?: number;
  showThumbnails?: boolean;
}

export function ImageCarousel({
  images,
  title,
  discount,
  autoplayInterval = 5000,
  showThumbnails = true,
}: ImageCarouselProps) {
  // Sort images: cover image first, then rest
  const sortedImages = [...images].sort((a, b) => {
    if (a.isCoverImage) return -1;
    if (b.isCoverImage) return 1;
    return 0;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const [direction, setDirection] = useState(0);

  const imageCount = sortedImages.length;

  // Navigate to specific index
  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setIsAutoplayPaused(true);
  }, [currentIndex]);

  // Navigate to previous slide
  const goToPrevious = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? imageCount - 1 : prev - 1));
    setIsAutoplayPaused(true);
  }, [imageCount]);

  // Navigate to next slide
  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === imageCount - 1 ? 0 : prev + 1));
    setIsAutoplayPaused(true);
  }, [imageCount]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevious, goToNext]);

  // Autoplay
  useEffect(() => {
    if (isAutoplayPaused || imageCount <= 1) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev === imageCount - 1 ? 0 : prev + 1));
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [isAutoplayPaused, autoplayInterval, imageCount]);

  // Resume autoplay after pause
  useEffect(() => {
    if (!isAutoplayPaused) return;

    const timeout = setTimeout(() => {
      setIsAutoplayPaused(false);
    }, autoplayInterval * 2);

    return () => clearTimeout(timeout);
  }, [isAutoplayPaused, autoplayInterval]);

  // Swipe detection
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold) {
      goToPrevious();
    } else if (info.offset.x < -swipeThreshold) {
      goToNext();
    }
  };

  // Fallback for no images
  if (imageCount === 0) {
    return (
      <section className="relative bg-[#F5E6D8]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative h-96 lg:h-[600px] rounded-3xl overflow-hidden shadow-soft-lg">
            <Image
              src="/placeholder.jpg"
              alt={title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>
    );
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
    }),
  };

  const imageVariants = {
    initial: { scale: 1 },
    animate: { 
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      }
    },
  };

  return (
    <section className="relative bg-[#F5E6D8]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-[100px]">
        {/* Main Carousel */}
        <div 
          className="relative h-96 lg:h-[600px] rounded-3xl overflow-hidden shadow-soft-lg group"
          onMouseEnter={() => setIsAutoplayPaused(true)}
          onMouseLeave={() => setIsAutoplayPaused(false)}
        >
          {/* Image Container */}
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              <motion.div
                initial={{ scale: 1 }}
                animate={{ 
                  scale: 1.02, 
                  transition: { 
                    duration: 0.3, 
                    ease: [0.42, 0, 0.58, 1] // equivalent to 'easeOut'
                  } 
                }}
                className="relative w-full h-full"
              >
                <Image
                  src={sortedImages[currentIndex].imageURL}
                  alt={`${title} - Image ${currentIndex + 1}`}
                  fill
                  className="object-cover"
                  priority={currentIndex === 0}
                  quality={90}
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Title overlay */}
          {title && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent pt-20 pb-12 px-6 z-20">
              <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold drop-shadow-md">
                {title}
              </h1>
            </div>
          )}

          {/* Discount Badge */}
          {discount && discount.amount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute top-6 left-6 bg-[#F9C74F] text-gray-900 px-4 py-2 rounded-xl font-bold text-lg shadow-xl z-20"
            >
              Save ${discount.amount}
            </motion.div>
          )}

          {/* Navigation Arrows */}
          {imageCount > 1 && (
            <>
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 0, x: -20 }}
                whileHover={{ opacity: 1, x: 0 }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-900 p-3 rounded-full shadow-lg hover:bg-white transition-all z-20 opacity-0 group-hover:opacity-100"
                onClick={goToPrevious}
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>

              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 0, x: 20 }}
                whileHover={{ opacity: 1, x: 0 }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm text-gray-900 p-3 rounded-full shadow-lg hover:bg-white transition-all z-20 opacity-0 group-hover:opacity-100"
                onClick={goToNext}
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </>
          )}

          {/* Dot Indicators */}
          {imageCount > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {sortedImages.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all rounded-full ${
                    index === currentIndex
                      ? 'w-8 h-2 bg-white'
                      : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`Go to image ${index + 1}`}
                  aria-current={index === currentIndex}
                />
              ))}
            </div>
          )}

          {/* Image Counter */}
          <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-semibold z-20">
            {currentIndex + 1} / {imageCount}
          </div>
        </div>

        {/* Thumbnails */}
        {showThumbnails && imageCount > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-2 flex justify-center gap-3 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
          >
            {sortedImages.map((image, index) => (
              <motion.button
                key={image.id}
                onClick={() => goToSlide(index)}
                className={`relative shrink-0 w-20 h-20 lg:w-24 lg:h-24 rounded-xl overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? 'border-[#F3722A] shadow-lg scale-105'
                    : 'border-transparent hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  src={image.imageURL}
                  alt={`${title} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 80px, 96px"
                />
                {index === currentIndex && (
                  <motion.div
                    layoutId="thumbnail-indicator"
                    className="absolute inset-0 bg-[#F3722A]/20"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
