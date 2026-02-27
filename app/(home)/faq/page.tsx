"use client";

import FAQ from "@/components/FAQ";
import PageBanner from "@/components/pageBanner";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#F5F6F6]">
      <PageBanner
        subtitle="FAQ"
        title="Frequently Asked Questions"
        description="Find answers to common questions about our trips, transfers, and services in Hurghada and the Red Sea."
        searchQuery=""
        setSearchQuery={() => {}}
        placeholder="Search for a trip"
        searchBar={false}
        bgImageUrl="/assets/contact.avif"
        bgImageAlt="FAQ"
        bgOverlay={true}
      />
      <div className="">
        <FAQ variant="page" />
      </div>
    </div>
  );
}
