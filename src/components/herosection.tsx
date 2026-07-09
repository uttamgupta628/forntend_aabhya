import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HeartOutlineIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const MedicalIcon = () => (
  <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="20" stroke="#E8522A" strokeWidth="1.5" fill="none" />
    <path d="M20 16v16M16 20h16" stroke="#E8522A" strokeWidth="2" strokeLinecap="round" />
    <path d="M14 28c0 3.3 2.7 6 6 6h8c3.3 0 6-2.7 6-6" stroke="#E8522A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

const TrustIcon = () => (
  <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="18" r="7" stroke="#E8522A" strokeWidth="1.5" fill="none" />
    <path d="M10 38c0-7.7 6.3-14 14-14s14 6.3 14 14" stroke="#E8522A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M30 22c3.9 0 7 3.1 7 7" stroke="#E8522A" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const FundsIcon = () => (
  <svg width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="14" width="36" height="24" rx="3" stroke="#E8522A" strokeWidth="1.5" fill="none" />
    <path d="M6 22h36" stroke="#E8522A" strokeWidth="1.5" />
    <circle cx="24" cy="30" r="3" stroke="#E8522A" strokeWidth="1.5" fill="none" />
    <path d="M14 10h20" stroke="#E8522A" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/* ── Background slider images — swap these for your own Cloudinary/site photos any time ── */
const SLIDES = [
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1400&q=80",
  "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1400&q=80",
  "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1400&q=80",
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1400&q=80",
];

const SLIDE_DURATION = 5000; // ms per slide

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % SLIDES.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#f0ece4] flex flex-col py-8 px-4">
      <style>{`
        /* ── Background slow Ken Burns zoom (applied per active slide) ── */
        .hs-bg {
          animation: hsBgZoom 6s ease-in-out infinite alternate;
        }
        @keyframes hsBgZoom {
          from { transform: scale(1); }
          to   { transform: scale(1.08); }
        }

        /* ── Slider slide crossfade + gentle horizontal drift ── */
        .hs-slide {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 0;
          transform: scale(1.04);
          transition: opacity 1.2s ease, transform 6s ease;
          pointer-events: none;
        }
        .hs-slide.is-active {
          opacity: 1;
          transform: scale(1);
          z-index: 1;
        }

        /* ── Slide dots ── */
        .hs-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: rgba(255,255,255,0.4);
          transition: all 0.35s ease;
          cursor: pointer;
        }
        .hs-dot.is-active {
          width: 22px;
          background: #E8522A;
        }

        /* ── Content staggered fade/slide-in ── */
        .hs-fade-up {
          opacity: 0;
          animation: hsFadeUp 0.7s ease forwards;
        }
        @keyframes hsFadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Underline draw under "Heart" ── */
        .hs-underline {
          transform: scaleX(0);
          transform-origin: left;
          animation: hsUnderline 0.6s ease forwards;
          animation-delay: 1.1s;
        }
        @keyframes hsUnderline {
          to { transform: scaleX(1); }
        }

        /* ── Donate button pulse ── */
        .hs-btn-donate {
          animation: hsBtnPulse 3s ease-in-out infinite;
        }
        .hs-btn-donate:hover {
          animation-play-state: paused;
          transform: scale(1.04);
        }
        @keyframes hsBtnPulse {
          0%, 100% { box-shadow: 0 0 0 0px rgba(232,82,42,0); }
          50%       { box-shadow: 0 0 0 6px rgba(232,82,42,0.18); }
        }

        /* ── Volunteer link + heart icon ── */
        .hs-btn-volunteer svg {
          transition: transform 0.3s ease;
        }
        .hs-btn-volunteer:hover svg {
          transform: scale(1.25);
        }

        /* ── Stats bar entrance ── */
        .hs-stats-enter {
          opacity: 0;
          animation: hsFadeUp 0.6s ease forwards;
          animation-delay: 0.9s;
        }

        /* ── Stat item hover + icon pop ── */
        .hs-stat-item {
          transition: transform 0.25s ease;
        }
        .hs-stat-item:hover {
          transform: translateY(-3px);
        }
        .hs-stat-item svg {
          transition: transform 0.35s ease;
        }
        .hs-stat-item:hover svg {
          transform: scale(1.12) rotate(-4deg);
        }
      `}</style>

      {/* Hero Card */}
      <div className="relative rounded-2xl overflow-hidden max-w-[1920px] mx-auto w-full" style={{ minHeight: "420px" }}>
        {/* Background image slider */}
        <div className="absolute inset-0 overflow-hidden">
          {SLIDES.map((src, i) => (
            <div
              key={src}
              className={`hs-slide ${i === current ? "is-active hs-bg" : ""}`}
              style={{ backgroundImage: `url('${src}')` }}
            />
          ))}
        </div>
        {/* Dark gradient overlay — left to right */}
        <div className="absolute inset-0 bg-linear-to-r from-[#0d2a1f]/95 via-[#0d2a1f]/75 to-transparent z-[2]" />

        {/* Slide dots */}
        <div className="absolute bottom-5 right-6 z-[3] flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <span
              key={i}
              onClick={() => setCurrent(i)}
              className={`hs-dot ${i === current ? "is-active" : ""}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 px-10 py-14 text-left max-w-lg">
          {/* Eyebrow */}
          <p
            className="hs-fade-up text-[#E8522A] text-xs font-bold tracking-[0.2em] uppercase mb-4"
            style={{ animationDelay: "0.1s" }}
          >
            Help Make A Difference
          </p>

          {/* Headline */}
          <h1
            className="hs-fade-up text-white text-4xl sm:text-5xl font-extrabold leading-tight mb-5"
            style={{ animationDelay: "0.3s" }}
          >
            Lend Your{" "}
            <span className="text-[#E8522A] italic relative">
              Heart
              <span
                className="hs-underline absolute -bottom-1 left-0 w-full h-0.5 bg-[#E8522A] rounded"
                style={{ display: "block" }}
              />
            </span>
            <br />
            To Change A<br />
            <span className="text-[#E8522A]">Child's</span> Story
          </h1>

          {/* Description */}
          <p
            className="hs-fade-up text-gray-300 text-sm leading-relaxed mb-8 max-w-xs"
            style={{ animationDelay: "0.5s" }}
          >
            Join our mission to support and uplift helpless children. Your
            donation helps provide essential care and hope.
          </p>

          {/* CTAs */}
          <div
            className="hs-fade-up flex items-center gap-5 mt-2 flex-wrap"
            style={{ animationDelay: "0.7s" }}
          >
            <button
              onClick={() => navigate("/Donation")}
              className="hs-btn-donate bg-[#E8522A] hover:bg-[#cf4521] text-white font-bold text-xs tracking-widest px-6 py-3 rounded transition-all uppercase"
            >
              Donate Now
            </button>
            <button
              onClick={() => navigate("/Volunteers")}
              className="hs-btn-volunteer flex items-center gap-2 text-white text-xs font-semibold tracking-widest uppercase hover:text-[#E8522A] transition-colors"
            >
              <HeartOutlineIcon />
              Be A Volunteer
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-[1920px] mx-auto w-full mt-0">
        <div className="hs-stats-enter bg-white rounded-b-2xl shadow-md px-8 py-6 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          {[
            {
              Icon: MedicalIcon,
              title: "Medical Aid",
              desc: "Essential help for health.",
            },
            {
              Icon: TrustIcon,
              title: "Trust Funds",
              desc: "Support those in need.",
            },
            {
              Icon: FundsIcon,
              title: "Funds Raised",
              desc: "Collect funds for causes.",
            },
          ].map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="hs-stat-item flex items-center gap-4 px-6 py-4 sm:py-0"
            >
              <div className="shrink-0">
                <Icon />
              </div>
              <div>
                <p className="text-[#1a3328] font-bold text-sm">{title}</p>
                <p className="text-gray-400 text-xs mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}