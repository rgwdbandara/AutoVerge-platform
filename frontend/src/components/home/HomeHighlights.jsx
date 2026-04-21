import { useState } from "react";
import { ChevronRight, CarFront, ClipboardCheck, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import bmw from "../../assets/logos/bmw.webp";
import ford from "../../assets/logos/ford.webp";
import honda from "../../assets/logos/honda.webp";
import hyundai from "../../assets/logos/hyundai.webp";
import mahindra from "../../assets/logos/mahindra.webp";
import tata from "../../assets/logos/tata.webp";
import sedanBody from "../../assets/body/sedan.webp";
import suvBody from "../../assets/body/suv.webp";
import hatchbackBody from "../../assets/body/hatchback.webp";
import convertibleBody from "../../assets/body/convertible.webp";

const makes = [
  { name: "BMW", image: bmw },
  { name: "HONDA", image: honda },
  { name: "HYUNDAI", image: hyundai },
  { name: "FORD", image: ford },
  { name: "MAHINDRA", image: mahindra },
  { name: "TATA", image: tata },
];

const strengths = [
  {
    icon: CarFront,
    title: "Smart Search & Recommendations",
    text: "Explore vehicles using image-based search and smart recommendations that perfectly match your preferences.",
  },
  {
    icon: ClipboardCheck,
    title: "EMI Calculator",
    text: "Calculate your monthly loan payments using the integrated EMI calculator before making a purchase decision.",
  },
  {
    icon: ShieldCheck,
    title: "AutoScore Grading & Price Analysis",
    text: "View AutoScore graded vehicle conditions and AI-based price analysis to ensure transparency and trust.",
  },
];

const bodyShapes = [
  { name: "SUV", image: suvBody },
  { name: "Sedan", image: sedanBody },
  { name: "Hatchback", image: hatchbackBody },
  { name: "Convertible", image: convertibleBody },
];

const faqs = [
  {
    question: "What is the AutoScore Grading System in AutoVerge?",
    answer:
      "The AutoScore Grading System is a vehicle evaluation method in AutoVerge that displays a car's condition and quality using a clear grade, so buyers can understand reliability before purchasing.",
  },
  {
    question: "How does the AI Price Estimation work?",
    answer:
      "Our AI compares market trends, vehicle condition, mileage, model year, and similar listings to estimate a fair and transparent market price.",
  },
  {
    question: "Can I search for a car using an image?",
    answer:
      "Yes. Upload an image and the platform will find visually similar cars from available listings.",
  },
  {
    question: "Is the AutoVerge platform safe to use?",
    answer:
      "Yes. AutoVerge is built with verified listings, secure workflows, and transparent seller information to provide a safe buying experience.",
  },
  {
    question: "What tools are available for buyers?",
    answer:
      "Buyers can use image search, smart recommendations, AutoScore grading insights, AI price estimation, and EMI calculation tools.",
  },
  {
    question: "What tools are available for sellers?",
    answer:
      "Sellers can list vehicles, manage inventory, upload details with AI-assisted flows, and use pricing insights to position listings better.",
  },
];

function HomeHighlights() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <section className="bg-slate-50">
      <div className="px-6 mx-auto max-w-7xl py-14 lg:py-20">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="mb-2 text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase">
              Browse by Make
            </p>
            <h2 className="text-3xl font-semibold text-slate-900">Find the brand you want faster</h2>
          </div>

          <Link to="/browse" className="items-center hidden gap-2 text-sm font-semibold transition text-slate-700 hover:text-slate-950 md:flex">
            View All <ChevronRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {makes.map((make) => (
            <Link
              key={make.name}
              to={`/browse?make=${make.name}`}
              className="group flex h-28 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-4 text-center shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)]"
            >
              <img src={make.image} alt={make.name} className="object-contain w-24 h-12 mb-2 transition duration-300 group-hover:scale-105" />
              <span className="text-sm font-medium tracking-wide text-slate-600">{make.name}</span>
            </Link>
          ))}
        </div>

        <div className="mt-16 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] md:p-10">
          <div className="mb-10 text-center">
            <p className="mb-3 text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase">
              Why We Stand Out
            </p>
            <h2 className="text-3xl font-semibold text-slate-900">Simple, trusted and made for confident buying</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {strengths.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="px-6 py-8 text-center rounded-3xl bg-slate-50 ring-1 ring-slate-200">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-5 text-indigo-700 bg-indigo-100 rounded-full">
                    <Icon size={30} />
                  </div>
                  <h3 className="text-xl font-medium text-slate-900">{item.title}</h3>
                  <p className="max-w-xs mx-auto mt-4 text-sm leading-6 text-slate-600">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-16">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="mb-2 text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase">
                Browse by Body Type
              </p>
              <h2 className="text-3xl font-semibold text-slate-900">Choose the style that fits your life</h2>
            </div>

            <Link to="/browse" className="items-center hidden gap-2 text-sm font-semibold transition text-slate-700 hover:text-slate-950 md:flex">
              View All <ChevronRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {bodyShapes.map((shape) => (
              <Link
                key={shape.name}
                to={`/browse?body=${shape.name.toLowerCase()}`}
                className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition hover:-translate-y-1"
              >
                <div className="relative overflow-hidden h-36">
                  <img
                    src={shape.image}
                    alt={shape.name}
                    className="object-cover w-full h-full transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                  <span className="absolute text-3xl font-semibold tracking-normal text-white bottom-3 left-4 sm:text-4xl">
                    {shape.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-8 text-center lg:text-left">
              <p className="mb-2 text-sm font-semibold tracking-[0.25em] text-slate-500 uppercase">
                Frequently Asked Question
              </p>
              <h2 className="text-3xl font-semibold text-slate-900">Common questions, answered clearly</h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;

                return (
                  <div key={faq.question} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? -1 : index)}
                      className="flex items-center justify-between w-full gap-4 px-4 py-4 text-left text-slate-900"
                    >
                      <span className="font-medium">{faq.question}</span>
                      <span className={`transition ${isOpen ? "rotate-180" : "rotate-0"}`}>
                        <ChevronRight size={18} />
                      </span>
                    </button>
                    {isOpen && <div className="px-4 pb-4 text-sm leading-6 text-slate-600">{faq.answer}</div>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] bg-slate-950 px-8 py-10 text-center text-white shadow-[0_30px_80px_rgba(15,23,42,0.35)]">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-white/10 text-amber-300">
              <Sparkles size={30} />
            </div>
            <p className="mb-4 text-sm font-semibold tracking-[0.25em] text-slate-400 uppercase">
              Begin Your Journey To The Right Car
            </p>
            <h2 className="max-w-md mx-auto text-3xl font-semibold leading-tight text-white">
              Discover, compare, and choose your ideal car with ease.
            </h2>
            <p className="max-w-xl mx-auto mt-5 text-sm leading-7 text-slate-300">
              Our platform connects you to trusted listings, helping you explore models, prices, and features for a smooth, confident purchase journey.
            </p>

            <Link
              to="/browse"
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg transition hover:-translate-y-0.5"
            >
              View All Car
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeHighlights;