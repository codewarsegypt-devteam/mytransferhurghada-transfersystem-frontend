import Hero from '../components/Hero';
import PopularTrips from '../components/PopularTrips';
import SeaAdventures from '../components/SeaAdventures';
import Transfers from '../components/Transfers';
import WhyChoose from '../components/WhyChoose';
import Reviews from '../components/Reviews';
import FAQ from '../components/FAQ';


export default function Home() {
  return (
    <>

      <Hero />
      <PopularTrips />
      <SeaAdventures />
      <Transfers />
      {/* <Accommodation /> */}
      <WhyChoose />
      <Reviews />
      <FAQ />
      {/* <Newsletter /> */}

    </>
  );
}
