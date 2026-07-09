// components/HomeIntro.tsx
// Layout: decorative cream blob + photo on LEFT, content on RIGHT

import { useNavigate } from "react-router-dom";

const FEATURE_CARDS = [
  {
    id: 1,
    title: "Be a Hero, Contribute Now",
    bg: "#fde8e8",
    iconColor: "#e8490f",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    ),
  },
  {
    id: 2,
    title: "Help Children with Donations",
    bg: "#fef3d8",
    iconColor: "#f59e0b",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
        <path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
];

export default function HomeIntro() {
  const navigate = useNavigate();

  return (
    <section className="bg-white py-16 px-4 sm:px-8">
      <div className="max-w-[1920px] mx-auto flex flex-col gap-14">

        {/* ── Top: photo LEFT + text RIGHT ── */}
        <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-14">

          {/* ── LEFT: decorative blob + photo ── */}
          <div className="relative md:w-[46%] shrink-0 flex items-center justify-center">
            {/* Cream blob shape behind */}
            <div
              className="absolute"
              style={{
                width: "90%",
                height: "95%",
                background: "#f5f2eb",
                borderRadius: "60% 40% 55% 45% / 50% 60% 40% 50%",
                top: "5%",
                left: "-5%",
                zIndex: 0,
              }}
            />
            {/* Photo */}
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-lg"
                 style={{ width: "82%", aspectRatio: "3/4" }}>
              <img
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=480&h=640&fit=crop&q=85"
                alt="Smiling child"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* ── RIGHT: content ── */}
          <div className="flex-1 text-left flex flex-col gap-5">
            {/* Eyebrow */}
            <p
              className="text-[#e8490f] italic font-semibold tracking-widest text-sm"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              WELCOME, LET'S MAKE A DIFFERENCE!
            </p>

            {/* Headline */}
            <h2
              className=" !text-[#0d2b2b] font-extrabold leading-tight"
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "clamp(1.7rem, 3vw, 2.4rem)",
              }}
            >
              A Trusted Non-Profit Charity<br /> Organization
            </h2>

            {/* Description */}
            <p className="text-sm text-gray-400 leading-relaxed">
              Our non-profit charity center is trustworthy as well as dedicated to<br />changing the
              world. Our goal is to create good change in our community<br />by providing assistance
              to those in need and offering funding.
            </p>

            {/* Feature mini-cards */}
            <div className="flex flex-wrap gap-3">
              {FEATURE_CARDS.map(card => (
                <div
                  key={card.id}
                  className="flex items-center gap-3 bg-gray-50 border border-gray-100
                             rounded-xl px-4 py-3 flex-1 min-w-35"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: card.bg, color: card.iconColor }}
                  >
                    {card.icon}
                  </div>
                  <p className="text-xs font-bold text-[#0d2b2b] leading-snug">
                    {card.title}
                  </p>
                </div>
              ))}
            </div>

            {/* Bullet list */}
            <ul className="flex flex-col gap-2">
              {[
                "Providing essential resources to underserved communities.",
                "Offering support through educational and health programs.",
                "Facilitating volunteer opportunities for community involvement.",
              ].map(point => (
                <li key={point} className="flex items-start gap-2 text-xs text-gray-500">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" className="shrink-0 mt-0.5">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                  </svg>
                  {point}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div>
              <button
                onClick={() => navigate("/Donation")}
                className="px-7 py-3 rounded-lg bg-[#e8490f] text-white font-bold
                           tracking-[0.14em] uppercase text-sm hover:bg-[#d43d09]
                           transition-colors duration-200"
              >
                Support Now
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}