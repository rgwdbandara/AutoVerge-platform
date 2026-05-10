import Hero from "../components/Hero";
import FeaturedCars from "../components/home/FeaturedCars";
import BrowseByMake from "../components/home/BrowseByMake";

// 🔥 NEW SECTIONS
import WhyUs from "../components/home/WhyUs";
import BodyType from "../components/home/BodyType";
import FAQ from "../components/home/FAQ";

import HowItWorks from "../components/home/HowItWorks";
import LatestAutomotiveNews from "../components/home/LatestAutomotiveNews";
import Footer from "../components/Footer";
import AutoVergeChatbot from "../components/chatbot/AutoVergeChatbot";


function Home() {
  return (
    <>
      <Hero />

      <FeaturedCars />

      <LatestAutomotiveNews />

      <BrowseByMake />

      {/* 🔥 ADD THESE BELOW */}
      <WhyUs />

      <BodyType />

      <HowItWorks />

      <FAQ />

      <AutoVergeChatbot />

      <Footer />
    </>
  );
}

export default Home;