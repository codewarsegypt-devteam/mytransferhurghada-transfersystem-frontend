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
      <section className="relative bg-linear-to-br from-[#F3722A] via-[#F15A22] to-[#F36F24] text-white pt-24 md:pt-32 pb-14 md:pb-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 border-2 border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-48 h-48 border-2 border-white rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="handwriting-style text-2xl md:text-3xl mb-4 text-white/90"
            >
              Welcome to Fox Travel Egypt
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              Your Gateway to Egypt&apos;s Wonders
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed"
            >
              We&apos;re more than a travel company—we&apos;re your local friends in Hurghada,
              dedicated to creating unforgettable Egyptian adventures tailored just for you.
            </motion.p>
          </div>
        </div>
      </section>

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

      {/* Our Story Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="handwriting-style text-xl md:text-2xl text-[#F3722A] mb-3">
              Our Journey
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#000000] mb-6">
              The Fox Travel Story
            </h2>
            <div className="w-20 h-1 bg-linear-to-r from-[#F3722A] to-[#F15A22] mx-auto rounded-full"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-brand-lg shadow-soft-lg p-6 md:p-10"
          >
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                Founded in the heart of Hurghada over 15 years ago, Fox Travel Egypt began with a simple
                mission: to share the magic of Egypt&apos;s Red Sea with travelers from around the world.
                What started as a small family-run business has grown into one of Hurghada&apos;s most trusted
                travel agencies.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Our founder grew up exploring the vibrant coral reefs, ancient desert landscapes, and historic
                sites that make Egypt extraordinary. This deep connection to the region inspired a passion for
                showing others the Egypt we know and love—not just the tourist highlights, but the authentic
                experiences that create lasting memories.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Today, we&apos;re proud to have welcomed over 10,000 travelers from every corner of the globe.
                Each trip we organize carries the same personal touch and attention to detail that defined our
                first tours. We&apos;re not just tour operators—we&apos;re storytellers, guides, and friends who
                can&apos;t wait to introduce you to the wonders of Egypt.
              </p>
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
