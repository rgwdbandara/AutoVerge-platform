import Hero from "../components/Hero";
import FeaturedCars from "../components/home/FeaturedCars";
import BrowseByMake from "../components/home/BrowseByMake";

// 🔥 NEW SECTIONS
import WhyUs from "../components/home/WhyUs";
import BodyType from "../components/home/BodyType";
import FAQ from "../components/home/FAQ";
import CTA from "../components/home/CTA";

function Home() {
  return (
    <>
      <Hero />

      <FeaturedCars />

      <BrowseByMake />

      {/* 🔥 ADD THESE BELOW */}
      <WhyUs />

      <BodyType />

      <FAQ />

      <CTA />
    </>
  );
}

export default Home;