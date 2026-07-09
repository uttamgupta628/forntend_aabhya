// components/MissionSection.tsx
import { useNavigate } from "react-router-dom";

const FOUNDER_INSTAGRAM = "https://www.instagram.com/paritosh_shekhar_singh?igsh=NW1tczhlZW14dnh6"; // paste Paritosh's Instagram profile URL here

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
  </svg>
);

export default function MissionSection() {
  const navigate = useNavigate();

  return (
    <section className="ms-section bg-[#e8f0ee] py-16 px-4 sm:px-8 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 lg:gap-14 items-center">

        {/* ── LEFT ── */}
        <div className="ms-left flex-1 flex text-left flex-col gap-5">
          {/* Eyebrow */}
          <p
            className="ms-fade text-[#e8490f] italic font-semibold tracking-widest text-sm"
            style={{ fontFamily: "'Georgia', serif", animationDelay: "0.05s" }}
          >
            OUR MISSION
          </p>

          {/* Headline */}
          <h2
            className="ms-fade !text-[#0d2b2b] font-extrabold leading-tight"
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)",
              animationDelay: "0.15s",
            }}
          >
            Committed To Achieving Our Core Goals
          </h2>

          {/* Description */}
          <p
            className="ms-fade text-sm text-gray-500 leading-relaxed max-w-sm"
            style={{ animationDelay: "0.25s" }}
          >
            Our mission is to improve impoverished areas by offering opportunity,
            assistance, and necessary resources. Our non-profit works to enhance
            people's lives and promote sustainable development.
          </p>

          {/* Donate button */}
          <div className="ms-fade" style={{ animationDelay: "0.35s" }}>
            <button
              onClick={() => navigate("/Donation")}
              className="ms-donate-btn px-7 py-3 rounded-lg bg-[#f59e0b] text-white font-bold
                         tracking-[0.14em] uppercase text-sm shadow-sm"
            >
              Donate Now
            </button>
          </div>
        </div>

        {/* ── RIGHT ── */}
        <div className="ms-card flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-7 sm:p-9 flex flex-col gap-5">

          {/* Card headline */}
          <h3
            className="!text-[#0d2b2b] font-bold leading-snug text-left text-2xl"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Dedicated To Positive Change Through Charity
          </h3>

          {/* Card description */}
          <p className="text-sm text-gray-400 leading-relaxed text-left">
            Our charity foundation is dedicated to making a meaningful impact in
            the community. Through targeted initiatives and compassionate outreach,
            we strive to uplift lives, foster positive change, and support those in need.
          </p>

          {/* Bullet points */}
          <ul className="flex flex-col gap-2">
            {[
              "Delivering essential meals quickly to those in need.",
              "Empowering communities through quality education.",
              "Supporting women with opportunities for growth and independence..",
              "Encouraging blood donation to save precious lives.",
            ].map((point, i) => (
              <li
                key={point}
                className="ms-bullet flex items-start gap-2.5 text-sm text-gray-600"
                style={{ animationDelay: `${0.15 + i * 0.1}s` }}
              >
                <svg
                  width="16" height="16" viewBox="0 0 24 24"
                  fill="#f59e0b" className="shrink-0 mt-0.5"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
                {point}
              </li>
            ))}
          </ul>

          {/* Divider */}
          <div className="h-px bg-gray-100 my-1" />

          {/* Founder row */}
          <div className="flex items-center gap-4">
            <div className="ms-founder-ring shrink-0">
              <div className="ms-founder-img w-28 h-28 sm:w-40 sm:h-40 rounded-xl overflow-hidden bg-gray-200">
                <img
                  src="https://res.cloudinary.com/dquki4xol/image/upload/v1775127386/WhatsApp_Image_2026-04-02_at_4.21.18_PM_j2kl27.jpg"
                  alt="Paritosh Shekhar Singh"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="min-w-0 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <p className="text-lg sm:text-xl font-bold text-[#0d2b2b] truncate">Paritosh Shekhar Singh</p>
                <a
                  href={FOUNDER_INSTAGRAM || undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Paritosh Shekhar Singh on Instagram"
                  onClick={(e) => { if (!FOUNDER_INSTAGRAM) e.preventDefault(); }}
                  className={`ms-ig-btn shrink-0
                              ${FOUNDER_INSTAGRAM ? "text-[#e8490f]" : "text-gray-300 cursor-default"}`}
                >
                  <InstagramIcon />
                </a>
              </div>
              <p className="text-sm text-gray-400">Founder &amp; President</p>
              <span
                className="text-[#e8490f] text-2xl mt-1.5"
                style={{ fontFamily: "'Dancing Script', cursive", fontWeight: 600 }}
              >
                Paritosh Shekhar Singh
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Load cursive font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&display=swap');

        /* ── Generic fade-up entrance, staggered via animation-delay ── */
        .ms-fade {
          animation: msFadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes msFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Left column and card slide in from opposite sides ── */
        .ms-left {
          animation: msSlideRight 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .ms-card {
          animation: msSlideLeft 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
          animation-delay: 0.1s;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }
        @keyframes msSlideRight {
          from { opacity: 0; transform: translateX(-30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes msSlideLeft {
          from { opacity: 0; transform: translateX(30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .ms-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(13,43,43,0.10);
        }

        /* ── Bullet points pop in one by one ── */
        .ms-bullet {
          animation: msBulletIn 0.5s ease both;
          transition: transform 0.2s ease;
        }
        @keyframes msBulletIn {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .ms-bullet:hover {
          transform: translateX(3px);
        }

        /* ── Donate button: soft glow pulse + lift on hover ── */
        .ms-donate-btn {
          animation: msDonatePulse 2.8s ease-in-out infinite;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        @keyframes msDonatePulse {
          0%, 100% { box-shadow: 0 4px 14px rgba(245,158,11,0.35); }
          50%       { box-shadow: 0 4px 26px rgba(245,158,11,0.65); }
        }
        .ms-donate-btn:hover {
          animation-play-state: paused;
          background: #e08e00;
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 10px 24px rgba(245,158,11,0.5);
        }

        /* ── Founder image: bigger, subtle highlight, no color overlay ── */
        .ms-founder-ring {
          padding: 3px;
          border-radius: 9999px;
          animation: msRingGlow 2.4s ease-in-out infinite;
        }
        @keyframes msRingGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(232,73,15,0.25); }
          50%       { box-shadow: 0 0 0 8px rgba(232,73,15,0); }
        }
        .ms-founder-img {
          border: 3px solid white;
          transition: transform 0.4s ease;
        }
        .ms-founder-ring:hover .ms-founder-img {
          transform: scale(1.06);
        }

        /* ── Instagram link hover ── */
        .ms-ig-btn {
          transition: transform 0.25s ease, opacity 0.2s ease;
        }
        .ms-ig-btn:hover {
          transform: translateX(2px);
          opacity: 0.8;
        }
      `}</style>
    </section>
  );
}