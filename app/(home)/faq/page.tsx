"use client";

import FAQ from "@/components/FAQ";
import PageBanner from "@/components/pageBanner";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#F5F6F6]">
      <PageBanner
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
