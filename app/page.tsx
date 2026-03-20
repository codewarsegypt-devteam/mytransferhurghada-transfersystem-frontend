import PulseFitHero from "@/components/ui/pulse-fit-hero";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import WhyBookWithUs from "@/components/landing/WhyBookWithUs";
import TransferFleetRow from "@/components/landing/TransferFleetRow";
import PopularRoutesGrid from "@/components/landing/PopularRoutesGrid";
import LandingValueBar from "@/components/landing/LandingValueBar";
import NewsletterSection from "@/components/landing/NewsletterSection";

/**
 * Landing page — sectioned layout: hero → value → fleet → routes →
 * value bar → reviews → newsletter → contact.
 */
export default function Home() {
  return (
    <>
      <PulseFitHero />
      <WhyBookWithUs />
      <TransferFleetRow />
      <PopularRoutesGrid />
      <LandingValueBar />
      <Reviews variant="landing" />
      <NewsletterSection />
      <Contact />
    </>
  );
}
