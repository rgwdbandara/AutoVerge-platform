import Hero from "../components/Hero";
import FeaturedCars from "../components/home/FeaturedCars";
import BrowseByMake from "../components/home/BrowseByMake";

// 🔥 NEW SECTIONS
import WhyUs from "../components/home/WhyUs";
import BodyType from "../components/home/BodyType";
import FAQ from "../components/home/FAQ";

import HowItWorks from "../components/home/HowItWorks";
import AIMatchingDemo from "../components/home/AIMatchingDemo";
import Footer from "../components/Footer";
import AutoVergeChatbot from "../components/chatbot/AutoVergeChatbot";


function Home() {
  return (
    <>
      <Hero />

      <FeaturedCars />

      <BrowseByMake />

      {/* 🔥 ADD THESE BELOW */}
      <WhyUs />

      <BodyType />

      <HowItWorks />

      <AIMatchingDemo />

      <FAQ />

      <AutoVergeChatbot />

      <Footer />
    </>
  );
}

export default Home;