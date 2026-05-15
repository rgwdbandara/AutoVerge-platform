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
      <div id="ai-image-search" className="scroll-mt-28">
        <Hero />
      </div>

      <div id="featured-cars" className="scroll-mt-28">
        <FeaturedCars />
      </div>

      <div id="latest-news" className="scroll-mt-28">
        <LatestAutomotiveNews />
      </div>

      <BrowseByMake />

      <WhyUs />

      <BodyType />

      <div id="how-it-works" className="scroll-mt-28">
        <HowItWorks />
      </div>

      <div id="faq" className="scroll-mt-28">
        <FAQ />
      </div>

      <AutoVergeChatbot />

      <Footer />
    </>
  );
}

export default Home;