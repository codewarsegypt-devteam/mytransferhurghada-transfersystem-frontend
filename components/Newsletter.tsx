'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter submission
    console.log('Newsletter email:', email);
    setEmail('');
  };

  return (
    <section className="relative bg-[#0a1f1f] pt-20 pb-32 overflow-hidden">
      {/* Newsletter Card */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-[#f5e6d3] rounded-3xl rounded-br-[100px] p-12 md:p-16 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left Side - Heading */}
            <div className="flex-1">
              <div className="flex items-start gap-3">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0a1f1f] leading-tight">
                  Get Updated The Latest
                  <br />
                  Newsletter
                </h2>
                <svg 
                  className="w-8 h-8 text-teal-500 shrink-0 mt-2" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 w-full md:w-auto">
              <form onSubmit={handleSubmit} className="flex gap-4">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email Address"
                    required
                    className="w-full px-6 py-4 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-md"
                  />
                  <div className="absolute left-6 bottom-[-8px] w-6 h-6 bg-white rounded-full border-2 border-gray-300"></div>
                </div>
                <button
                  type="submit"
                  className="px-8 py-4 bg-[#ff6b35] hover:bg-[#ff5520] text-white font-semibold rounded-xl transition-colors shadow-lg whitespace-nowrap"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 opacity-30">
        <svg width="100" height="100" viewBox="0 0 100 100" className="text-teal-700">
          <path
            d="M 10 50 Q 30 20, 50 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        </svg>
        <svg 
          className="w-12 h-12 text-teal-700 absolute top-0 left-12" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M10 2L3 6v2l7-4 7 4V6l-7-4z"/>
          <path d="M3 8v2l7 4 7-4V8l-7 4-7-4z"/>
        </svg>
      </div>
    </section>
  );
}
