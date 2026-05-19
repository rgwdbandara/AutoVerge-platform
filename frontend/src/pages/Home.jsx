/* eslint-disable no-unused-vars */
import { useRef, useEffect } from "react";
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
import useScrollAnimation from "../useScrollAnimation";


function Home() {
  const ref1 = useScrollAnimation();
  const ref2 = useScrollAnimation();
  const ref3 = useScrollAnimation();
  const ref4 = useScrollAnimation();
  const ref5 = useScrollAnimation();
  const ref6 = useScrollAnimation();
  const ref7 = useScrollAnimation();

  return (
    <>
      <div id="ai-image-search" className="scroll-mt-28">
        <Hero />
      </div>

      <div id="featured-cars" className="scroll-mt-28 scroll-section" ref={ref1}>
        <FeaturedCars />
      </div>

      <div id="latest-news" className="scroll-mt-28 scroll-section-left" ref={ref2}>
        <LatestAutomotiveNews />
      </div>

      <div className="scroll-section-right" ref={ref3}>
        <BrowseByMake />
      </div>

      <div className="scroll-section-scale" ref={ref4}>
        <WhyUs />
      </div>

      <div className="scroll-section" ref={ref5}>
        <BodyType />
      </div>

      <div id="how-it-works" className="scroll-mt-28 scroll-section-left" ref={ref6}>
        <HowItWorks />
      </div>

      <div id="faq" className="scroll-mt-28 scroll-section-right" ref={ref7}>
        <FAQ />
      </div>

      <AutoVergeChatbot />

      <Footer />
    </>
  );
}

export default Home;