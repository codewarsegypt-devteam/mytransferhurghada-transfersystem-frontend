"use client";

import Contact from "@/components/Contact";
import PageBanner from "@/components/pageBanner";

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-[#F5F6F6]">
      <PageBanner
        subtitle="Contact Us"
        title="Let’s Plan Your Next Adventure"
        description="Send us a message, or reach out instantly via WhatsApp. We usually reply within 24 hours."
        searchQuery=""
        setSearchQuery={() => {}}
        placeholder="Search for a trip"
        searchBar={false}
        bgImageUrl="/assets/pexels-vojta-kovarik-388639-3243090.jpg"
        bgImageAlt="Contact Image"
        bgOverlay={true}
      />
      <Contact/>
    </div>
  );
}
