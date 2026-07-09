// components/FAQSection.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: 1,
    question: "What is your mission?",
    answer:
      "Our mission is to empower underserved communities through education, healthcare, and sustainable development programs that create lasting change across generations.",
  },
  {
    id: 2,
    question: "How can I donate?",
    answer:
      "You can donate online through our secure payment portal, by bank transfer, or by mailing a check. We accept one-time and recurring donations of any amount.",
  },
  {
    id: 3,
    question: "Are donations tax-deductible?",
    answer:
      "Yes! We are a registered 501(c)(3) nonprofit organization. All donations are fully tax-deductible to the extent permitted by law. You will receive a receipt for your records.",
  },
  {
    id: 4,
    question: "Can I volunteer?",
    answer:
      "Absolutely. We welcome volunteers in a variety of roles — from on-the-ground fieldwork to remote support like graphic design, writing, and fundraising. Fill out our volunteer form to get started.",
  },
  {
    id: 5,
    question: "How can I get involved?",
    answer:
      "There are many ways to get involved: donate, volunteer, spread awareness on social media, organize a fundraiser, or partner with us as a corporate sponsor. Every contribution matters.",
  },
];

/* ── Keyframe styles injected once ── */
const KEYFRAMES = `
  @keyframes faq-slide-left {
    from { opacity: 0; transform: translateX(-40px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes faq-slide-up {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes faq-fade-in {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes faq-pulse-dot {
    0%, 100% { box-shadow: 0 0 0 0 rgba(232,73,15,0.4); }
    50%       { box-shadow: 0 0 0 8px rgba(232,73,15,0); }
  }
`;

export default function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  /* Inject keyframes once */
  useEffect(() => {
    if (!document.getElementById("faq-kf")) {
      const style = document.createElement("style");
      style.id = "faq-kf";
      style.textContent = KEYFRAMES;
      document.head.appendChild(style);
    }
    /* Tiny delay so initial paint fires before animations kick in */
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  function toggle(id: number) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <section className="bg-[#f5f2eb] py-16 px-4 sm:px-8">
      <div className="max-w-[1920px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16">

        {/* ── LEFT ── */}
        <div
          className="lg:w-[38%] text-left shrink-0 flex flex-col justify-between gap-8"
          style={{
            animation: mounted ? "faq-slide-left 0.7s cubic-bezier(0.22,1,0.36,1) both" : "none",
          }}
        >
          <div>
            {/* Eyebrow — pulse dot accent */}
            <p
              className="text-[#e8490f] font-bold italic tracking-wide text-sm mb-4 flex items-center gap-2"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              <span
                className="inline-block w-2 h-2 rounded-full bg-[#e8490f]"
                style={{ animation: "faq-pulse-dot 2s ease-in-out infinite" }}
              />
              FREQUENTLY ASKED QUESTIONS
            </p>

            {/* Headline */}
            <h2
              className="!text-[#0d2b2b] font-extrabold leading-tight mb-5"
              style={{
                fontSize: "clamp(1.75rem, 3vw, 2.4rem)",
                fontFamily: "'Georgia', serif",
              }}
            >
              Key Questions Answered About Our Charity Initiatives
            </h2>

            {/* Subtext */}
            <p className="text-gray-500 text-sm leading-relaxed">
              Explore our Frequently Asked Questions for answers about our
              charity's mission, projects, and how to help.
            </p>
          </div>

          {/* Still Have Questions card */}
          <div
            className="border border-gray-200 rounded-2xl p-5 bg-white"
            style={{
              animation: mounted
                ? "faq-slide-left 0.7s 0.15s cubic-bezier(0.22,1,0.36,1) both"
                : "none",
              transition: "box-shadow 0.3s, transform 0.3s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 8px 32px rgba(232,73,15,0.12)";
              (e.currentTarget as HTMLDivElement).style.transform =
                "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = "";
              (e.currentTarget as HTMLDivElement).style.transform = "";
            }}
          >
            <div className="flex items-center gap-4 mb-5">
              {/* Orange question mark icon */}
              <div
                className="w-12 h-12 rounded-full bg-[#f59e0b] flex items-center justify-center shrink-0 shadow-sm"
                style={{ transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.transform = "scale(1.15) rotate(-8deg)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLDivElement).style.transform = "")
                }
              >
                <span className="text-white font-black text-xl leading-none">?</span>
              </div>
              <div>
                <p className="font-extrabold text-[#0d2b2b] text-base leading-snug">
                  Still Have Questions?
                </p>
                <p className="text-gray-400 text-sm mt-0.5">
                  Get the answers you need, quickly!
                </p>
              </div>
            </div>

            {/* Contact Us button */}
            <button
              onClick={() => navigate("/contact")}
              className="w-full py-3.5 rounded-xl bg-[#e8490f] text-white font-bold
                         tracking-[0.15em] uppercase text-sm shadow-sm"
              style={{
                transition: "background 0.2s, transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.background = "#d43d09";
                b.style.transform = "scale(1.03)";
                b.style.boxShadow = "0 6px 20px rgba(232,73,15,0.35)";
              }}
              onMouseLeave={(e) => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.background = "";
                b.style.transform = "";
                b.style.boxShadow = "";
              }}
              onMouseDown={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.transform = "scale(0.97)")
              }
              onMouseUp={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1.03)")
              }
            >
              Contact Us
            </button>
          </div>
        </div>

        {/* ── RIGHT — Accordion ── */}
        <div className="flex-1 flex flex-col gap-3">
          {FAQS.map((faq, i) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`bg-white rounded-2xl border
                  ${isOpen ? "border-[#e8490f]/30" : "border-gray-100"}`}
                style={{
                  /* staggered entrance */
                  animation: mounted
                    ? `faq-slide-up 0.55s ${0.08 * i}s cubic-bezier(0.22,1,0.36,1) both`
                    : "none",
                  /* hover lift */
                  transition: "box-shadow 0.25s, transform 0.25s, border-color 0.2s",
                  boxShadow: isOpen ? "0 4px 20px rgba(232,73,15,0.08)" : "",
                }}
                onMouseEnter={(e) => {
                  if (!isOpen) {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "0 6px 24px rgba(0,0,0,0.07)";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "";
                  if (!isOpen)
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "";
                }}
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
                >
                  <span
                    className={`font-bold text-base leading-snug transition-colors duration-200
                      ${isOpen ? "text-[#e8490f]" : "text-[#0d2b2b]"}`}
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    {faq.question}
                  </span>

                  {/* +/× toggle icon — rotates 45° when open */}
                  <span
                    className={`shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center
                      ${isOpen ? "border-[#e8490f] bg-[#e8490f]" : "border-gray-300 bg-transparent"}`}
                    style={{
                      transform: isOpen ? "rotate(45deg) scale(1.1)" : "rotate(0deg) scale(1)",
                      transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), background 0.25s, border-color 0.25s",
                    }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke={isOpen ? "#fff" : "#6b7280"}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      style={{ transition: "stroke 0.2s" }}
                    >
                      <line x1="7" y1="1" x2="7" y2="13" />
                      <line x1="1" y1="7" x2="13" y2="7" />
                    </svg>
                  </span>
                </button>

                {/* Answer — smooth height + fade */}
                <div
                  style={{
                    maxHeight: isOpen ? "300px" : "0px",
                    overflow: "hidden",
                    transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)",
                  }}
                >
                  <p
                    className="px-6 pb-5 text-sm text-gray-500 leading-relaxed"
                    style={{
                      opacity: isOpen ? 1 : 0,
                      transform: isOpen ? "translateY(0)" : "translateY(6px)",
                      transition: isOpen
                        ? "opacity 0.35s 0.1s ease, transform 0.35s 0.1s ease"
                        : "opacity 0.15s ease, transform 0.15s ease",
                    }}
                  >
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}