'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Clock, Shield } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Please enter your full name';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.phone || formData.phone.length < 6) {
      newErrors.phone = 'Enter a valid phone number';
    }

    if (!formData.message || formData.message.length < 5) {
      newErrors.message = 'Please add a short message';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'contact',
        }),
      });

      const data = await response.json();

      if (data.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
        // Reset success message after 5 seconds
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setErrorMessage(data.message || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
      console.error('Contact form error:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const whatsappNumber = '+201010836364'; // Fox Travel Egypt WhatsApp

  return (
    <div className="min-h-screen bg-[#F5F6F6]">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-[#F3722A] via-[#F15A22] to-[#F36F24] text-white pt-24 md:pt-32 pb-14 md:pb-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 border-2 border-white rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="handwriting-style text-2xl md:text-3xl mb-4 text-white/90">
              Contact Us
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              We&apos;re here to help you with your travel needs.
            </p>

            {/* Search Bar */}
            {/* <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search trips by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/80 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-xl"
                />
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 lg:gap-10">
            {/* Contact Form - Takes up 3 columns */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="md:col-span-3 bg-white rounded-brand-lg shadow-soft-lg p-6 md:p-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-[#000000]">
                Send Us a Message
              </h2>
              <p className="text-gray-600 mb-6">
                Fill out the form below and we&apos;ll get back to you as soon as possible.
              </p>

              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-800 font-medium">Message sent successfully!</p>
                    <p className="text-green-700 text-sm">We&apos;ll get back to you soon.</p>
                  </div>
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-800 font-medium">Failed to send message</p>
                    <p className="text-red-700 text-sm">{errorMessage}</p>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.name
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-[#F3722A]'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.email
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-[#F3722A]'
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.phone
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-[#F3722A]'
                    }`}
                    placeholder="+20 123 456 7890"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${
                      errors.message
                        ? 'border-red-300 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-[#F3722A]'
                    }`}
                    placeholder="Tell us about your inquiry..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={status === 'loading'}
                  className="w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* Contact Information - Takes up 2 columns */}
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="md:col-span-2"
            >
              <div className="bg-white rounded-brand-lg shadow-soft-lg p-6 md:p-8 h-full flex flex-col">
                <h3 className="text-xl md:text-2xl font-bold mb-6 text-[#000000]">
                  Contact Information
                </h3>
                <p className="text-gray-600 mb-8">
                  Reach out to us through any of these channels and we&apos;ll respond promptly.
                </p>
                
                <div className="space-y-6 grow">
                  {/* Email */}
                  <div className="group">
                    <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-[#F5F6F6] transition-colors">
                      <div className="w-12 h-12 bg-linear-to-br from-[#F3722A] to-[#F15A22] rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Email Us</p>
                        <a
                          href="mailto:info@foxtravelegypt.com"
                          className="text-[#F3722A] hover:text-[#F15A22] transition-colors break-all"
                        >
                          info@foxtravelegypt.com
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="group">
                    <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-[#F5F6F6] transition-colors">
                      <div className="w-12 h-12 bg-linear-to-br from-[#F3722A] to-[#F15A22] rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Call Us</p>
                        <a
                          href={`tel:${whatsappNumber}`}
                          className="text-[#F3722A] hover:text-[#F15A22] transition-colors"
                        >
                          {whatsappNumber}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="group">
                    <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-[#F5F6F6] transition-colors">
                      <div className="w-12 h-12 bg-linear-to-br from-[#F3722A] to-[#F15A22] rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Visit Us</p>
                        <p className="text-gray-600">
                          Hurghada, Red Sea<br />Egypt
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Response Time */}
                  <div className="group">
                    <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-[#F5F6F6] transition-colors">
                      <div className="w-12 h-12 bg-linear-to-br from-[#F3722A] to-[#F15A22] rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Response Time</p>
                        <p className="text-gray-600">
                          Usually within 24 hours
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Badge */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 text-center flex items-center justify-center">
                    <Shield className="w-4 h-4 inline-block mr-2 text-gray-500" /> Trusted by travelers since 2010
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#000000]">
              Ready to Explore Egypt?
            </h2>
            <p className="text-gray-600 mb-8">
              Discover our amazing trips and start planning your next adventure in Hurghada.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button href="/trips" variant="primary" size="lg">
                View Our Trips
              </Button>
              <a
                href="/about"
                className="inline-flex items-center px-8 py-4 text-base bg-white text-[#F3722A] border-2 border-[#F3722A] rounded-lg font-semibold hover:bg-[#F5F6F6] transition-all duration-300"
              >
                About Fox Travel
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
