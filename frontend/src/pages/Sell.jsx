import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "Is posting a vehicle on AutoVerge free?",
    a: "Yes. You can post your vehicle for free and reach buyers across Sri Lanka.",
  },
  {
    q: "What details should I include?",
    a: "Add correct brand, model, year, mileage, price, fuel type, transmission, description, and clear photos.",
  },
  {
    q: "Can I upload multiple vehicle images?",
    a: "Yes. Uploading multiple clear images helps buyers trust your listing.",
  },
  {
    q: "What happens after I post my vehicle?",
    a: "Your vehicle will appear in the marketplace, and buyers can view its details.",
  },
  {
    q: "Can I edit or delete my listing later?",
    a: "Yes. You can manage your listings from the seller dashboard.",
  },
];

function Sell() {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const [openFaq, setOpenFaq] = useState(null);

  const handlePostVehicle = () => {
    if (isSignedIn) {
      navigate("/seller/add-car");
    } else {
      navigate("/sign-up");
    }
  };

  return (
  <div className="min-h-screen bg-gray-50">
    {/* HERO */}
    <section className="relative overflow-hidden text-white min-h-[80vh] flex items-center justify-center">
      {/* 🔥 Background Image */}
  <div
    className="absolute inset-0 z-0 bg-center bg-cover"
    style={{
      backgroundImage: "url('/public/hero-car1.jpg')",
    }}
      />

     {/* 🔥 LIGHT OVERLAY (not too dark) */}
  <div className="absolute inset-0 z-0 bg-black/40" />

     {/* 🔥 Optional blue gradient effect (soft) */}
  <div className="absolute inset-0 z-0 bg-gradient-to-r from-blue-900/40 via-transparent to-black/40" />

      {/* CONTENT */}
  <div className="relative z-10 max-w-6xl px-6 py-24 mx-auto text-center">
        <Motion.span
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-2 mb-5 text-sm border rounded-full bg-white/10 border-white/20"
        >
          Sell vehicles smarter with AutoVerge
        </Motion.span>

        <Motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-extrabold leading-tight md:text-6xl"
        >
          Sell Your Vehicle Fast in Sri Lanka
        </Motion.h1>

        <Motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto mt-5 text-lg text-blue-100"
        >
          Create a trusted vehicle listing with real details, clear images,
          and reach serious buyers faster.
        </Motion.p>

        <Motion.button
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={handlePostVehicle}
          className="px-8 py-4 mt-8 font-semibold bg-white shadow-lg text-slate-950 rounded-2xl"
        >
          Post Your Vehicle
        </Motion.button>
      </div>
    </section>

      {/* BEFORE POST */}
      <section className="max-w-6xl px-6 py-16 mx-auto">
        <Motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 bg-white border border-gray-100 shadow-sm rounded-3xl"
        >
          <h2 className="mb-8 text-3xl font-bold">Before you post</h2>

          <div className="grid gap-5 md:grid-cols-2">
            {[
              ["📝", "Enter accurate vehicle details"],
              ["📸", "Upload clear vehicle images"],
              ["💰", "Use a realistic LKR selling price"],
              ["📊", "Add correct mileage, year, and fuel type"],
              ["⚠️", "Do not post fake or duplicate listings"],
              ["✅", "Make sure seller information is correct"],
            ].map(([icon, text], index) => (
              <Motion.div
                key={text}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 p-5 transition rounded-2xl bg-gray-50 hover:bg-blue-50"
              >
                <span className="text-2xl">{icon}</span>
                <p className="font-medium text-gray-800">{text}</p>
              </Motion.div>
            ))}
          </div>
        </Motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-6xl px-6 pb-16 mx-auto">
        <h2 className="mb-10 text-3xl font-bold text-center">
          How selling works
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["1", "Add Details", "Fill vehicle information and upload photos."],
            ["2", "Publish Listing", "Your car appears in the AutoVerge marketplace."],
            ["3", "Reach Buyers", "Interested buyers can view your vehicle details."],
          ].map(([num, title, desc], index) => (
            <Motion.div
              key={title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center bg-white border border-gray-100 shadow-sm p-7 rounded-3xl"
            >
              <div className="flex items-center justify-center mx-auto mb-5 text-xl font-bold text-white bg-blue-600 rounded-full w-14 h-14">
                {num}
              </div>
              <h3 className="mb-2 text-xl font-bold">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </Motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-5xl px-6 pb-16 mx-auto">
        <h2 className="mb-10 text-4xl font-extrabold text-center text-blue-700">
          FAQ
        </h2>

        <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-3xl">
          {faqs.map((faq, index) => (
            <div key={faq.q} className="border-b last:border-b-0">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="flex items-center justify-between w-full px-6 py-5 text-lg font-semibold text-left"
              >
                {faq.q}
                <span className="text-2xl">{openFaq === index ? "−" : "+"}</span>
              </button>

              <AnimatePresence>
                {openFaq === index && (
                  <Motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-5 overflow-hidden text-gray-600"
                  >
                    {faq.a}
                  </Motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* SUPPORT */}
      <section className="max-w-3xl px-6 pb-16 mx-auto">
        <div className="p-8 text-center border border-blue-100 bg-blue-50 rounded-3xl">
          <h2 className="mb-3 text-2xl font-bold">Still have questions?</h2>
          <p className="mb-5 text-gray-600">
            Our AutoVerge support team can help you with vehicle listing steps.
          </p>
          <button className="py-3 font-semibold text-white transition bg-blue-700 px-7 rounded-xl hover:bg-blue-800">
            Contact Support Team
          </button>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-6xl px-6 pb-20 mx-auto">
        <Motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-800 to-blue-950 text-white rounded-[2rem] py-16 px-6 text-center shadow-xl"
        >
          <h2 className="text-4xl font-extrabold">
            Ready to Sell Your Car?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Get started today and connect with serious buyers in Sri Lanka.
          </p>

          <Motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={handlePostVehicle}
            className="py-4 mt-8 font-bold text-blue-900 bg-white px-9 rounded-2xl"
          >
            Post Free Ad →
          </Motion.button>
        </Motion.div>
      </section>
    </div>
  );
}

export default Sell;