// components/TestimonialsSection.tsx
import { useState, useEffect, useRef } from "react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  rating: number;
  avatar: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Community Volunteer",
    quote:
      "Supporting this charity has been one of the most fulfilling experiences. Their commitment to the cause is unmatched, and the impact they've made in the community is truly inspiring.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80",
  },
  {
    id: 2,
    name: "Emily Carter",
    role: "Corporate Donor",
    quote:
      "Involvement with this charity has been deeply rewarding. Funding specific projects has transformed countless lives and reminded our team what it truly means to make a difference.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=120&h=120&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Michael Torres",
    role: "Monthly Donor",
    quote:
      "I've seen firsthand how every dollar is used wisely. The transparency and passion of the team makes me proud to contribute month after month to such a worthy cause.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=120&h=120&fit=crop&q=80",
  },
  {
    id: 4,
    name: "Sarah Williams",
    role: "Field Volunteer",
    quote:
      "Being on the ground and seeing the smiles on people's faces is priceless. This organization truly changes lives and I'm honored to be part of the mission.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=120&h=120&fit=crop&q=80",
  },
  {
    id: 5,
    name: "Daniel Kim",
    role: "Event Sponsor",
    quote:
      "Sponsoring their annual fundraiser opened my eyes to how much thought goes into every program. The team's dedication and follow-through are second to none.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&q=80",
  },
  {
    id: 6,
    name: "Priya Sharma",
    role: "Youth Mentor",
    quote:
      "Watching the kids in this program grow in confidence has been the highlight of my year. This charity gives them tools and hope that last a lifetime.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&q=80",
  },
  {
    id: 7,
    name: "James Wright",
    role: "Board Member",
    quote:
      "From governance to grassroots delivery, every layer of this organization operates with integrity. It's rare to see a charity this consistent at every level.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&h=120&fit=crop&q=80",
  },
  {
    id: 8,
    name: "Olivia Bennett",
    role: "First-Time Donor",
    quote:
      "I gave once out of curiosity and stayed because of the results. Clear updates, real stories, and visible outcomes made it easy to trust where my money goes.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=120&h=120&fit=crop&q=80",
  },
];

const VISIBLE_COUNT = 4;
const SLIDE_INTERVAL = 5000;
const LINE1 = "OUR TESTIMONIALS";
const LINE2 = "What They're Talking About Us";

const KF = `
  @keyframes ts-fade-up   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ts-fade-in   { from{opacity:0} to{opacity:1} }
  @keyframes ts-img-pop   { from{transform:scale(0.75);opacity:0} to{transform:scale(1);opacity:1} }
  @keyframes tw-blink     { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes ts-sec-in    { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ts-slide-in-r { from{opacity:0;transform:translateX(40px) scale(0.96)} to{opacity:1;transform:translateX(0) scale(1)} }
  @keyframes ts-slide-in-l { from{opacity:0;transform:translateX(-40px) scale(0.96)} to{opacity:1;transform:translateX(0) scale(1)} }
`;

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 24 24"
          fill={i < count ? "#f59e0b" : "#e5e7eb"}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [progKey, setProgKey] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [mounted, setMounted] = useState(false);
  const [tw1, setTw1] = useState("");
  const [tw2, setTw2] = useState("");
  const [twPhase, setTwPhase] = useState<"line1" | "line2" | "done">("line1");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentRef = useRef(0);

  const total = TESTIMONIALS.length;

  /* Inject keyframes once */
  useEffect(() => {
    if (!document.getElementById("ts-kf2")) {
      const s = document.createElement("style");
      s.id = "ts-kf2";
      s.textContent = KF;
      document.head.appendChild(s);
    }
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  /* Typewriter */
  useEffect(() => {
    if (!mounted) return;
    setTw1(""); setTw2(""); setTwPhase("line1");
    let i = 0;
    const t1 = setInterval(() => {
      i++;
      setTw1(LINE1.slice(0, i));
      if (i >= LINE1.length) {
        clearInterval(t1);
        setTwPhase("line2");
        let j = 0;
        const t2 = setInterval(() => {
          j++;
          setTw2(LINE2.slice(0, j));
          if (j >= LINE2.length) { clearInterval(t2); setTwPhase("done"); }
        }, 45);
      }
    }, 60);
    return () => clearInterval(t1);
  }, [mounted]);

  /* Auto-slide */
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const next = (currentRef.current + 1) % total;
      currentRef.current = next;
      setDirection("next");
      setCurrent(next);
      setAnimKey(k => k + 1);
      setProgKey(k => k + 1);
    }, SLIDE_INTERVAL);
  };

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const goTo = (idx: number, dir: "next" | "prev" = "next") => {
    currentRef.current = idx;
    setDirection(dir);
    setCurrent(idx);
    setAnimKey(k => k + 1);
    setProgKey(k => k + 1);
    startTimer();
  };

  const prev = () => goTo((current - 1 + total) % total, "prev");
  const next = () => goTo((current + 1) % total, "next");

  const visible = Array.from({ length: VISIBLE_COUNT }, (_, i) => TESTIMONIALS[(current + i) % total]);

  const arrowBtn = (onClick: () => void, points: string) => (
    <button
      onClick={onClick}
      className="w-11 h-11 rounded-full text-white flex items-center justify-center shrink-0"
      style={{
        background: "#e8490f",
        transition: "background 0.2s, transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s",
      }}
      onMouseEnter={e => {
        const b = e.currentTarget as HTMLButtonElement;
        b.style.background = "#d43d09";
        b.style.transform = "scale(1.12)";
        b.style.boxShadow = "0 6px 18px rgba(232,73,15,0.4)";
      }}
      onMouseLeave={e => {
        const b = e.currentTarget as HTMLButtonElement;
        b.style.background = "#e8490f";
        b.style.transform = "";
        b.style.boxShadow = "";
      }}
      onMouseDown={e => (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.95)"}
      onMouseUp={e => (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.12)"}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points={points} />
      </svg>
    </button>
  );

  const slideAnim = direction === "next" ? "ts-slide-in-r" : "ts-slide-in-l";

  return (
    <section
      className="bg-[#e9e6cc] py-16 px-4 sm:px-8"
      style={{
        animation: mounted ? "ts-sec-in 0.7s cubic-bezier(0.22,1,0.36,1) both" : "none",
      }}
    >
      <div className="w-full max-w-7xl mx-auto">

        {/* ── Header row ── */}
        <div className="flex items-start justify-between gap-4 mb-10 flex-wrap">
          <div>
            {/* Line 1 typewriter */}
            <p
              className="italic font-semibold tracking-widest text-sm text-left mb-2"
              style={{ fontFamily: "'Georgia', serif", color: "#e8490f", minHeight: "1.5em" }}
            >
              {tw1}
              {twPhase === "line1" && (
                <span style={{
                  display: "inline-block", width: 2, height: "1em",
                  background: "#e8490f", verticalAlign: "text-bottom",
                  marginLeft: 2, animation: "tw-blink 0.75s infinite",
                }} />
              )}
            </p>

            {/* Line 2 typewriter */}
            <h2
              className="!text-[#0d2b2b] font-extrabold leading-tight"
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: "clamp(1.7rem, 3.5vw, 2.6rem)",
                minHeight: "1.4em",
              }}
            >
              {tw2}
              {twPhase === "line2" && (
                <span style={{
                  display: "inline-block", width: 3, height: "0.85em",
                  background: "#0d2b2b", verticalAlign: "text-bottom",
                  marginLeft: 3, animation: "tw-blink 0.75s infinite",
                }} />
              )}
            </h2>
          </div>

          {/* Arrows */}
          <div className="flex gap-2 mt-1 self-start">
            {arrowBtn(prev, "15 18 9 12 15 6")}
            {arrowBtn(next, "9 18 15 12 9 6")}
          </div>
        </div>

        {/* ── Cards (4 visible, sliding window) ── */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          style={{ overflow: "hidden" }}
        >
          {visible.map((t, idx) => (
            <div
              key={`${animKey}-${idx}`}
              className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-5"
              style={{
                animation: `${slideAnim} 0.5s ${idx * 0.08}s cubic-bezier(0.22,1,0.36,1) both`,
                transition: "box-shadow 0.25s, transform 0.25s",
              }}
              onMouseEnter={e => {
                const d = e.currentTarget as HTMLDivElement;
                d.style.boxShadow = "0 12px 36px rgba(0,0,0,0.1)";
                d.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={e => {
                const d = e.currentTarget as HTMLDivElement;
                d.style.boxShadow = "";
                d.style.transform = "";
              }}
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-gray-100"
                    style={{
                      animation: `ts-img-pop 0.4s ${idx * 0.08 + 0.1}s cubic-bezier(0.34,1.56,0.64,1) both`,
                    }}
                  >
                    <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-extrabold text-[#0d2b2b] text-sm leading-snug"
                      style={{ fontFamily: "'Georgia', serif" }}>
                      {t.name}
                    </p>
                    <p className="text-xs text-[#e8490f] font-medium mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>

              <Stars count={t.rating} />

              {/* Divider */}
              <div className="h-px bg-gray-100" />

              {/* Quote */}
              <p
                className="text-sm text-gray-500 leading-relaxed flex-1"
                style={{ animation: `ts-fade-in 0.5s ${idx * 0.08 + 0.2}s ease both` }}
              >
                "{t.quote}"
              </p>

              {/* Progress bar on first card only */}
              {idx === 0 && (
                <div className="h-0.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    key={progKey}
                    style={{ height: "100%", background: "#e8490f", borderRadius: 9999, width: "0%" }}
                    ref={el => {
                      if (el) requestAnimationFrame(() => requestAnimationFrame(() => {
                        el.style.transition = `width ${SLIDE_INTERVAL}ms linear`;
                        el.style.width = "100%";
                      }));
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Dot indicators ── */}
        <div className="flex justify-center gap-2 mt-8">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? "next" : "prev")}
              style={{
                height: 10,
                width: current === i ? 28 : 10,
                borderRadius: 9999,
                background: current === i ? "#e8490f" : "#d1d5db",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "width 0.35s cubic-bezier(0.34,1.56,0.64,1), background 0.3s",
              }}
              onMouseEnter={e => {
                if (current !== i)
                  (e.currentTarget as HTMLButtonElement).style.background = "#9ca3af";
              }}
              onMouseLeave={e => {
                if (current !== i)
                  (e.currentTarget as HTMLButtonElement).style.background = "#d1d5db";
              }}
            />
          ))}
        </div>

      </div>
    </section>
  );
}