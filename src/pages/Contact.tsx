// components/ContactHero.tsx

import ContactSection from "../components/ContactSection";
import FAQSection from "../components/FAQ";

const ADDRESS =
  "Shree Appartment, Sadanand Chakraborty Lane, Near Shyam Mandir, 713347, West Bengal, India";

const MAP_EMBED_SRC =
  "https://maps.google.com/maps?q=" +
  encodeURIComponent(ADDRESS) +
  "&t=&z=15&ie=UTF8&iwloc=&output=embed";

export default function ContactHero() {
  return (
    <section className="bg-[#f5f2eb] px-4 sm:px-8 ">
      <div
        className="max-w-6xl mx-auto rounded-3xl bg-[#f0ede3] flex flex-col
                   items-center justify-center text-center py-10 px-6"
      >
        {/* Eyebrow */}
        <p
          className="text-[#e8490f] italic font-semibold tracking-widest text-sm mb-3"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          CONTACT US
        </p>

        {/* Headline */}
        <h1
          className="!text-[#0d2b2b] font-extrabold leading-tight"
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
          }}
        >
          Connect With Us Here
        </h1>
      </div>

      <ContactSection />

      {/* ── Location Map ── */}
      <div className="max-w-6xl mx-auto mt-10 mb-2">
        <p
          className="text-[#e8490f] italic font-semibold tracking-widest text-sm mb-2 text-center"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          FIND US HERE
        </p>
        <h2
          className="!text-[#0d2b2b] font-extrabold text-center mb-6"
          style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(1.4rem, 3vw, 2rem)" }}
        >
          Our Location
        </h2>

        <div className="rounded-3xl overflow-hidden shadow-md border border-black/5">
          <iframe
            title="KindFlow Location Map"
            src={MAP_EMBED_SRC}
            width="100%"
            height="380"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        <p className="text-gray-500 text-xs text-center mt-3 leading-relaxed">
          {ADDRESS}
        </p>
      </div>

      <FAQSection />
    </section>
  );
}