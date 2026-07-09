"use client";
// components/ServicesSection.tsx

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const SERVICES = [
  {
    id: 1,
    title: "Funding",
    description:
      "Your donations fund vital programs, transforming lives and communities.",
    bg: "#fde8e8",
    dotBorder: "#e8490f",
    iconColor: "#e8490f",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a5 5 0 015 5v1h1a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a2 2 0 012-2h1V7a5 5 0 015-5z"/>
        <circle cx="12" cy="14" r="2"/>
        <path d="M7 10V7a5 5 0 0110 0v3"/>
      </svg>
    ),
  },
  {
    id: 2,
    title: "Food",
    description:
      "Providing nutritious food to underserved communities for healthier lives.",
    bg: "#fef3d8",
    dotBorder: "#f59e0b",
    iconColor: "#f59e0b",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 10h16" />
        <path d="M5 10c0-3 3-5 7-5s7 2 7 5" />
        <path d="M4 14h16" />
        <path d="M6 18h12" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Education",
    description:
      "Providing education and letting people build their own futures.",
    bg: "#e8e8e8",
    dotBorder: "#9ca3af",
    iconColor: "#6b7280",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
  },
  {
    id: 4,
    title: "Support",
    description:
      "Offering complete support services to help people overcome obstacles.",
    bg: "#ede8f8",
    dotBorder: "#7c5cbf",
    iconColor: "#7c5cbf",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 010 8h-1"/>
        <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/>
        <line x1="6" y1="1" x2="6" y2="4"/>
        <line x1="10" y1="1" x2="10" y2="4"/>
        <line x1="14" y1="1" x2="14" y2="4"/>
      </svg>
    ),
  },
];

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="services-section relative bg-[#e8f0ee] py-16 px-4 sm:px-8 overflow-hidden"
    >
      {/* ── Ambient background blobs ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full opacity-40 blur-3xl animate-drift"
        style={{ background: "#e8490f22" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-16 w-96 h-96 rounded-full opacity-40 blur-3xl animate-drift-slow"
        style={{ background: "#7c5cbf22" }}
      />

      <div className="relative max-w-[1920px] mx-auto flex flex-col items-center gap-12">

        {/* ── Header ── */}
        <div
          className={`text-center transition-all duration-700 ease-out ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <p
            className="relative inline-block text-[#e8490f] italic font-semibold tracking-widest text-sm mb-10"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            OUR BEST SERVICES
            <span
              className={`absolute left-0 -bottom-1 h-[2px] bg-[#e8490f] transition-all duration-700 ease-out ${
                visible ? "w-full" : "w-0"
              }`}
              style={{ transitionDelay: "300ms" }}
            />
          </p>
          <h2
            className="!text-[#0d2b2b]  font-extrabold leading-tight"
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "clamp(1.9rem, 4vw, 3rem)",
            }}
          >
            Helping The Poor, Your<br />Support Matters
          </h2>
        </div>

        {/* ── Service cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
          {SERVICES.map((svc, i) => (
            <div
              key={svc.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate("/Donation")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate("/Donation");
                }
              }}
              className={`group relative bg-white rounded-2xl px-6 pt-10 pb-8 flex flex-col items-center
                         text-center gap-4 shadow-sm cursor-pointer overflow-hidden
                         transition-all duration-500 ease-out
                         hover:-translate-y-2 hover:shadow-xl
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e8490f] focus-visible:ring-offset-2
                         ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{
                transitionProperty: "opacity, transform, box-shadow",
                transitionDelay: visible ? `${i * 120}ms` : "0ms",
              }}
            >
              {/* Soft color wash that sweeps in on hover */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100
                           transition-opacity duration-500"
                style={{
                  background: `radial-gradient(120% 120% at 50% 0%, ${svc.bg} 0%, transparent 70%)`,
                }}
              />

              {/* Dashed ring + filled circle + icon */}
              <div className="relative flex items-center justify-center mb-2">
                {/* Outer dashed ring — spins gently on hover */}
                <svg
                  width="96" height="96" viewBox="0 0 96 96"
                  className="absolute transition-transform duration-[1200ms] ease-out group-hover:rotate-180"
                  style={{ opacity: 0.45 }}
                >
                  <circle
                    cx="48" cy="48" r="44"
                    fill="none"
                    stroke={svc.dotBorder}
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                </svg>

                {/* Inner filled circle */}
                <div
                  className="relative w-16 h-16 rounded-full flex items-center justify-center
                               transition-transform duration-300 ease-out
                               group-hover:scale-110 group-hover:-rotate-6"
                  style={{ background: svc.bg, color: svc.iconColor }}
                >
                  {svc.icon}
                </div>
              </div>

              {/* Title */}
              <h3
                className="relative font-extrabold text-[#0d2b2b] text-lg leading-snug
                           transition-colors duration-300"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                {svc.title}
              </h3>

              {/* Description */}
              <p className="relative text-sm text-gray-400 leading-relaxed">
                {svc.description}
              </p>

              {/* Bottom accent bar — grows in on hover */}
              <span
                aria-hidden="true"
                className="absolute left-1/2 -translate-x-1/2 bottom-0 h-1 w-0 rounded-t-full
                           group-hover:w-2/3 transition-all duration-400 ease-out"
                style={{ background: svc.dotBorder }}
              />
            </div>
          ))}
        </div>

      </div>

      <style>{`
        @keyframes drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, 30px) scale(1.08); }
        }
        @keyframes drift-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-25px, -15px) scale(1.05); }
        }
        .animate-drift {
          animation: drift 12s ease-in-out infinite;
        }
        .animate-drift-slow {
          animation: drift-slow 16s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-drift,
          .animate-drift-slow {
            animation: none;
          }
          .services-section * {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
}