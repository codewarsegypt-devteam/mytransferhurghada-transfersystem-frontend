'use client';

import { motion } from 'framer-motion';
import { 
  Award, 
  Heart, 
  Shield, 
  Star, 
  Users, 
  MapPin,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Compass
} from 'lucide-react';
import Button from '@/components/ui/Button';
import PageBanner from '@/components/pageBanner';

export default function AboutPage() {
  const stats = [
    { value: '15+', label: 'Years Experience', icon: Calendar },
    { value: '10K+', label: 'Happy Travelers', icon: Users },
    { value: '50+', label: 'Amazing Trips', icon: MapPin },
    { value: '4.9/5', label: 'Average Rating', icon: Star },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Your satisfaction and safety are our top priorities. We go above and beyond to ensure every trip exceeds expectations.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We maintain the highest standards in everything we do, from trip planning to execution, ensuring quality experiences.',
    },
    {
      icon: Shield,
      title: 'Trust & Safety',
      description: 'Licensed, insured, and committed to your safety. We follow strict safety protocols and partner with trusted providers.',
    },
    {
      icon: Compass,
      title: 'Local Expertise',
      description: 'Born and raised in Hurghada, we know Egypt like no one else. Discover hidden gems and authentic experiences.',
    },
  ];

  const reasons = [
    'Best prices guaranteed - no hidden fees',
    'Instant booking confirmation',
    'Flexible cancellation policy',
    'Expert local guides',
    'Small group sizes for personalized experience',
    '24/7 customer support',
    'Carefully curated itineraries',
    'All-inclusive packages available',
  ];

  return (
    <div className="min-h-screen bg-[#F5F6F6]">
      {/* Hero Section */}
    <PageBanner
      subtitle="About Us"
      title="Your Gateway to Egypt's Wonders"
      description="We're more than a travel company—we're your local friends in Hurghada, dedicated to creating unforgettable Egyptian adventures tailored just for you."
      searchQuery={""}
      setSearchQuery={() => {}}
      placeholder="Search for a trip"
      searchBar={false}
      bgImageUrl="/assets/about.webp"
      bgImageAlt="About Image"
      bgOverlay={true}
    />

      {/* Stats Section */}
      <section className="container mx-auto px-4 -mt-12 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-brand-lg shadow-soft-lg p-6 md:p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-linear-to-br from-[#F3722A] to-[#F15A22] rounded-full mb-3">
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-[#F3722A] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
{/* Our Story Section - Paper Theme */}
<section className="container mx-auto px-4 py-16 md:py-24">
  <div className="max-w-5xl mx-auto">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-10 md:mb-14"
    >
      <p className="handwriting-style text-xl md:text-2xl text-[#F3722A] mb-3">
        Our Journey
      </p>
      <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-5">
        The Fox Travel Story
      </h2>
      <div className="w-24 h-1 bg-linear-to-r from-[#F3722A] to-[#F15A22] mx-auto rounded-full" />
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="relative"
    >
      {/* Paper stack + shadows */}
      <div
        className="absolute inset-0 -rotate-[1.2deg] rounded-[28px] bg-[#FBF7EF] shadow-[0_18px_55px_rgba(0,0,0,0.10)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 rotate-[0.8deg] rounded-[28px] bg-[#F7F1E6] shadow-[0_12px_35px_rgba(0,0,0,0.08)]"
        aria-hidden
      />

      {/* Main sheet */}
      <div className="relative overflow-hidden rounded-[28px] border border-black/5 bg-[#FFFCF5] shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
        {/* Paper grain + vignette */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute inset-0 opacity-[0.35] bg-[radial-gradient(circle_at_20%_15%,rgba(0,0,0,0.05),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(243,114,42,0.07),transparent_48%),radial-gradient(circle_at_30%_85%,rgba(0,0,0,0.04),transparent_55%)]" />
          {/* faint fold line */}
          <div className="absolute left-1/2 top-0 h-full w-px bg-black/5" />
          {/* subtle top edge shading */}
          <div className="absolute inset-x-0 top-0 h-10 bg-linear-to-b from-black/[0.05] to-transparent" />
        </div>

        {/* Paper header strip */}
        <div className="relative px-6 sm:px-8 md:px-10 pt-8 md:pt-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#F3722A] shadow-[0_0_0_6px_rgba(243,114,42,0.12)]" />
              <p className="text-xs sm:text-sm font-semibold tracking-wide text-gray-700 uppercase">
                Hurghada • Red Sea • Egypt
              </p>
            </div>

            {/* “Tape” corners */}
            <div className="hidden sm:block text-xs font-semibold text-gray-500">
              Since 2010
            </div>
          </div>

          <div className="mt-6 h-px w-full bg-black/10" />
        </div>

        {/* Content */}
        <div className="relative px-6 sm:px-8 md:px-10 pb-8 md:pb-10 pt-6">
          {/* Lined paper effect */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.20]" aria-hidden>
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)] bg-[length:100%_34px]" />
          </div>

          <div className="relative">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-800 leading-relaxed mb-6">
                Founded in the heart of Hurghada over 15 years ago, Fox Travel Egypt began with a simple
                mission: to share the magic of Egypt&apos;s Red Sea with travelers from around the world.
                What started as a small family-run business has grown into one of Hurghada&apos;s most trusted
                travel agencies.
              </p>
              <p className="text-gray-800 leading-relaxed mb-6">
                Our founder grew up exploring the vibrant coral reefs, ancient desert landscapes, and historic
                sites that make Egypt extraordinary. This deep connection to the region inspired a passion for
                showing others the Egypt we know and love—not just the tourist highlights, but the authentic
                experiences that create lasting memories.
              </p>
              <p className="text-gray-800 leading-relaxed">
                Today, we&apos;re proud to have welcomed over 10,000 travelers from every corner of the globe.
                Each trip we organize carries the same personal touch and attention to detail that defined our
                first tours. We&apos;re not just tour operators—we&apos;re storytellers, guides, and friends who
                can&apos;t wait to introduce you to the wonders of Egypt.
              </p>
            </div>

            {/* Signature / stamp */}
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="handwriting-style text-2xl text-[#F3722A]">
                Fox Travel Team
              </p>

              <div className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white/60 px-4 py-2 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-[#111827]/70" />
                <p className="text-sm font-semibold text-gray-700">Handcrafted experiences</p>
              </div>
            </div>
          </div>
        </div>

        {/* Paper “tape” accents */}
        <div className="pointer-events-none absolute -top-3 left-10 h-10 w-24 rotate-[-8deg] rounded-lg bg-[#F2E7D3]/90 shadow-[0_10px_20px_rgba(0,0,0,0.10)] ring-1 ring-black/5" aria-hidden />
        <div className="pointer-events-none absolute -top-3 right-10 h-10 w-24 rotate-[8deg] rounded-lg bg-[#F2E7D3]/90 shadow-[0_10px_20px_rgba(0,0,0,0.10)] ring-1 ring-black/5" aria-hidden />
      </div>
    </motion.div>
  </div>
</section>

      {/* Values Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="handwriting-style text-xl md:text-2xl text-[#F3722A] mb-3">
              What Drives Us
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#000000] mb-6">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do and shape every experience we create.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#F5F6F6] rounded-brand-lg p-6 hover:shadow-soft-lg transition-all duration-300 group"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-linear-to-br from-[#F3722A] to-[#F15A22] rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#000000] mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="handwriting-style text-xl md:text-2xl text-[#F3722A] mb-3">
              Your Perfect Choice
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#000000] mb-6">
              Why Travel With Fox?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Here&apos;s what makes us different from other travel companies in Egypt.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-brand-lg shadow-soft-lg p-6 md:p-10"
          >
            <div className="grid md:grid-cols-2 gap-4">
              {reasons.map((reason, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#F5F6F6] transition-colors"
                >
                  <CheckCircle2 className="w-6 h-6 text-[#F3722A] shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">{reason}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust & Growth Section */}
      <section className="bg-linear-to-br from-[#F3722A] via-[#F15A22] to-[#F36F24] text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <TrendingUp className="w-16 h-16 mx-auto mb-6 text-white/90" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Growing Together With Our Community
              </h2>
              <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                Every year, more travelers choose Fox Travel Egypt for their Egyptian adventures.
                Our success is built on your trust, your stories, and your recommendations.
                We&apos;re honored to be part of your journey and committed to making every trip
                better than the last.
              </p>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                <span className="font-semibold">Rated 4.9/5 by 2,500+ travelers</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#000000]">
                Ready to Start Your Egyptian Adventure?
              </h2>
              <p className="text-lg text-gray-600 mb-10">
                Join thousands of travelers who have discovered the magic of Egypt with Fox Travel.
                Browse our trips and find your perfect adventure today.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button href="/trips" variant="primary" size="lg">
                  Explore Our Trips
                </Button>
                <a
                  href="/contactus"
                  className="inline-flex items-center px-8 py-4 text-base bg-white text-[#F3722A] border-2 border-[#F3722A] rounded-lg font-semibold hover:bg-[#F5F6F6] transition-all duration-300"
                >
                  Get in Touch
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
