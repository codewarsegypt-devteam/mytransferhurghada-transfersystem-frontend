"use client";

import Contact from "@/components/Contact";
import PageBanner from "@/components/pageBanner";

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-[#F5F6F6]">
      <PageBanner
        searchBar={false}
        bgImageUrl="/assets/pexels-vojta-kovarik-388639-3243090.jpg"
        bgImageAlt="Contact Image"
        bgOverlay={true}
      />
      <Contact/>
    </div>
  );
}
