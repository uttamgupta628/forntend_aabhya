// HeroSection.tsx
// React + Vite + Tailwind CSS

import { useState, useEffect, useRef } from "react";

const VIDEOS = [
  "https://res.cloudinary.com/dquki4xol/video/upload/v1777015927/WhatsApp_Video_2026-04-24_at_12.59.17_PM_upfuiy.mp4",
  "https://res.cloudinary.com/dquki4xol/video/upload/v1777016010/WhatsApp_Video_2026-04-24_at_1.02.24_PM_zctmzs.mp4",
];



const INTERVAL = 5000;

const KF = `
  @keyframes hero-fade-in   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes hero-banner    { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes hero-pulse     { 0%,100%{box-shadow:0 0 0 0 rgba(245,158,11,0.5)} 50%{box-shadow:0 0 0 10px rgba(245,158,11,0)} }
  @keyframes modal-backdrop { from{opacity:0} to{opacity:1} }
  @keyframes modal-scale-in { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }
  @keyframes ripple-ring    { 0%{transform:scale(1);opacity:0.7} 100%{transform:scale(2.2);opacity:0} }
`;

export default function VideoSection() {
  const [active, setActive]       = useState(0);
  const [progKey, setProgKey]     = useState(0);
  const [mounted, setMounted]     = useState(false);
  const [vidSize, setVidSize]     = useState<{ w: number; h: number } | null>(null);
  /* modal state */
  const [modalOpen, setModalOpen] = useState(false);
  /* Frozen at the moment the modal opens, so the background slider
     auto-advancing later can't swap the clip out from under the viewer. */
  const [modalSrc, setModalSrc]   = useState<string | null>(null);

  const timerRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeRef    = useRef(0);
  const videoRefs    = useRef<(HTMLVideoElement | null)[]>([null, null]);
  const modalVidRef  = useRef<HTMLVideoElement | null>(null);

  /* Inject keyframes once */
  useEffect(() => {
    if (!document.getElementById("hero-kf")) {
      const s = document.createElement("style");
      s.id = "hero-kf";
      s.textContent = KF;
      document.head.appendChild(s);
    }
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  /* Lock body scroll when modal open */
  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modalOpen]);

  /* Play modal video when opened */
  useEffect(() => {
    if (modalOpen && modalVidRef.current) {
      modalVidRef.current.currentTime = 0;
      modalVidRef.current.play().catch(() => {});
    } else if (!modalOpen && modalVidRef.current) {
      modalVidRef.current.pause();
    }
  }, [modalOpen]);

  /* Background play/pause */
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === active) { v.currentTime = 0; v.play().catch(() => {}); }
      else v.pause();
    });
  }, [active]);

  /* Auto-slide — paused while the modal is open so the background
     switching clips can't interfere with (or reset) modal playback */
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (modalOpen) return;
    timerRef.current = setInterval(() => {
      const next = (activeRef.current + 1) % VIDEOS.length;
      activeRef.current = next;
      setActive(next);
      setProgKey(k => k + 1);
    }, INTERVAL);
  };

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen]);

  const goTo = (idx: number) => {
    activeRef.current = idx;
    setActive(idx);
    setProgKey(k => k + 1);
    startTimer();
  };

  const handleMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const v = e.currentTarget;
    if (!vidSize && v.videoWidth && v.videoHeight)
      setVidSize({ w: v.videoWidth, h: v.videoHeight });
  };

  /* Clicking the video (or the Watch Video button) opens the modal with
     whichever clip is currently showing, locked in place — it will keep
     playing on loop until the user explicitly closes the modal. */
  const openModal  = () => {
    setModalSrc(VIDEOS[active]);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  /* Close on Escape */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const aspectPadding = vidSize
    ? `${((vidSize.h / vidSize.w) * 100).toFixed(4)}%`
    : undefined;

  return (
    <>
      {/* ═══════════════════════════════════════════════
          FULLSCREEN VIDEO MODAL
      ═══════════════════════════════════════════════ */}
      {modalOpen && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.88)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "modal-backdrop 0.3s ease both",
          }}
        >
          {/* Video wrapper — stops click propagation so clicking video doesn't close */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: "relative",
              width: "min(92vw, 960px)",
              borderRadius: 16,
              overflow: "hidden",
              animation: "modal-scale-in 0.35s cubic-bezier(0.22,1,0.36,1) both",
              boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
            }}
          >
            <video
              ref={modalVidRef}
              src={modalSrc ?? VIDEOS[active]}
              controls
              loop
              playsInline
              style={{ display: "block", width: "100%", background: "#000" }}
            />
          </div>

          {/* Close button */}
          <button
            onClick={closeModal}
            aria-label="Close video"
            style={{
              position: "absolute", top: 20, right: 24,
              width: 40, height: 40, borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "#fff", fontSize: 20, lineHeight: 1,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s, transform 0.2s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#e8490f"; (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.12)"; (e.currentTarget as HTMLButtonElement).style.transform = ""; }}
          >
            ✕
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════ */}
      <section
        className="relative w-full overflow-hidden font-sans"
        style={
          aspectPadding
            ? { paddingBottom: aspectPadding, height: 0, minHeight: "320px", maxHeight: "100vh" }
            : { minHeight: "56vw", maxHeight: "100vh" }
        }
      >
        {/* Video backgrounds */}
        {VIDEOS.map((src, i) => (
          <div
            key={i}
            className="absolute inset-0 cursor-pointer"
            onClick={openModal}
            style={{
              opacity: active === i ? 1 : 0,
              transition: "opacity 0.9s cubic-bezier(0.4,0,0.2,1)",
              zIndex: 0,
            }}
          >
            <video
              ref={el => { videoRefs.current[i] = el; }}
              src={src}
              muted loop playsInline preload="auto"
              onLoadedMetadata={handleMetadata}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-[#0d2b2b]/78" />
          </div>
        ))}

        {/* Overlay content */}
        <div className="absolute inset-0 z-10 flex flex-col">

          {/* Slide indicators */}
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
            style={{ animation: mounted ? "hero-fade-in 0.6s 0.5s both" : "none" }}
          >
            <div className="flex gap-2">
              {VIDEOS.map((_, i) => (
                <button key={i} onClick={() => goTo(i)}
                  style={{
                    height: 8, width: active === i ? 28 : 8, borderRadius: 9999,
                    background: active === i ? "#f59e0b" : "rgba(255,255,255,0.35)",
                    border: "none", cursor: "pointer", padding: 0,
                    transition: "width 0.35s cubic-bezier(0.34,1.56,0.64,1), background 0.3s",
                  }}
                />
              ))}
            </div>
            <div style={{ width: 64, height: 2, borderRadius: 9999, overflow: "hidden" }}>
              <div
                key={progKey}
                ref={el => {
                  if (el) requestAnimationFrame(() => requestAnimationFrame(() => {
                    el.style.transition = `width ${INTERVAL}ms linear`;
                    el.style.width = "100%";
                  }));
                }}
                style={{ height: "100%", background: "#f59e0b", borderRadius: 9999, width: "0%" }}
              />
            </div>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, letterSpacing: "0.1em" }}>
              {String(active + 1).padStart(2, "0")} / {String(VIDEOS.length).padStart(2, "0")}
            </span>
          </div>

         

          {/* Main hero content */}
          <div
            className="mx-auto w-full max-w-[1920px] px-4 sm:px-8 pt-10 pb-14 mt-auto
                       flex flex-col sm:flex-row sm:items-center sm:justify-between text-left gap-8"
            style={{ animation: mounted ? "hero-fade-in 0.7s 0.15s cubic-bezier(0.22,1,0.36,1) both" : "none" }}
          >
            {/* ── Watch Video button ── */}
            <div className="flex flex-col items-center gap-2 shrink-0" style={{ position: "relative", zIndex: 20 }}>
              <button
                onClick={(e) => { e.stopPropagation(); openModal(); }}
                aria-label="Watch Video"
                style={{
                  position: "relative",
                  width: 56, height: 56,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  backdropFilter: "blur(6px)",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.2s, transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s",
                }}
                onMouseEnter={e => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.background = "rgba(255,255,255,0.28)";
                  b.style.transform = "scale(1.12)";
                  b.style.boxShadow = "0 0 0 6px rgba(245,158,11,0.3)";
                }}
                onMouseLeave={e => {
                  const b = e.currentTarget as HTMLButtonElement;
                  b.style.background = "rgba(255,255,255,0.15)";
                  b.style.transform = "";
                  b.style.boxShadow = "";
                }}
              >
                {/* Ripple rings */}
                {[0, 0.5, 1].map((delay, i) => (
                  <span
                    key={i}
                    style={{
                      position: "absolute", inset: 0,
                      borderRadius: "50%",
                      border: "1.5px solid rgba(245,158,11,0.5)",
                      animation: `ripple-ring 2.4s ${delay}s ease-out infinite`,
                      pointerEvents: "none",
                    }}
                  />
                ))}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="none"
                  style={{ transform: "translateX(2px)", position: "relative", zIndex: 1 }}>
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </button>
              <span
                className="text-[#f59e0b] text-[11px] font-semibold italic"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                Watch Video
              </span>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}