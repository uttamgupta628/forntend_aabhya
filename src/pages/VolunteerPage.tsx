import { useState, useEffect, useRef } from "react";
import { apiGet, apiPostFormData, ApiError } from "../lib/api";

/* ── Typewriter Hook — types, holds, erases, repeats ── */
function useTypewriter(text: string, speed = 70, pauseMs = 3500) {
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"typing" | "erasing">("typing");

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      if (displayed.length < text.length) {
        timeout = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), speed);
      } else {
        timeout = setTimeout(() => setPhase("erasing"), pauseMs);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(text.slice(0, displayed.length - 1)), speed / 2);
      } else {
        timeout = setTimeout(() => setPhase("typing"), 400);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, phase, text, speed, pauseMs]);

  return displayed;
}

/* Helper: initials for the placeholder avatar */
function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join("")
    .toUpperCase();
}

/* Helper: split volunteers into N sequential rows, as evenly as possible */
function splitIntoRows<T>(items: T[], rowCount: number): T[][] {
  const rows: T[][] = Array.from({ length: rowCount }, () => []);
  const base = Math.floor(items.length / rowCount);
  const extra = items.length % rowCount;
  let cursor = 0;
  for (let r = 0; r < rowCount; r++) {
    const count = base + (r < extra ? 1 : 0);
    rows[r] = items.slice(cursor, cursor + count);
    cursor += count;
  }
  return rows;
}

/* ── Icons ── */
const InstagramIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
  </svg>
);
const CalIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

/* ── Team volunteer, fetched from GET /api/volunteers ── */
type TeamVolunteer = {
  _id: string;
  name: string;
  role: string;
  image: { url: string } | null;
  instagram: string;
};

/* ── A single volunteer card, sized for the horizontal marquee ── */
function VolunteerCard({ v }: { v: TeamVolunteer }) {
  return (
    <div className="vp-marquee-card w-40 sm:w-48 shrink-0">
      <div className="vp-card-float">
        <div className="vp-photo-frame mb-3">
          {v.image?.url ? (
            <img
              src={v.image.url}
              alt={v.name}
              className="vp-img w-full h-full object-cover object-top"
              draggable={false}
            />
          ) : (
            <div className="vp-placeholder">{getInitials(v.name)}</div>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="min-w-0">
            <p className="vp-name text-[#0d2b2b] font-extrabold text-sm leading-tight truncate">
              {v.name}
            </p>
            <p className="vp-role text-gray-400 text-left text-[11px] mt-0.5 truncate">{v.role}</p>
          </div>
          <a
            href={v.instagram && v.instagram !== "#" ? v.instagram : undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${v.name} on Instagram`}
            aria-disabled={!v.instagram || v.instagram === "#"}
            onClick={(e) => { if (!v.instagram || v.instagram === "#") e.preventDefault(); }}
            className={`vp-ig-btn shrink-0 ${v.instagram && v.instagram !== "#" ? "text-gray-900" : "text-gray-300 cursor-default"}`}
          >
            <InstagramIcon />
          </a>
        </div>
      </div>
    </div>
  );
}

/* ── A single marquee row — scrolls continuously, alternating direction ── */
function MarqueeRow({ items, direction, speedSeconds }: {
  items: TeamVolunteer[];
  direction: "left" | "right";
  speedSeconds: number;
}) {
  if (items.length === 0) return null;
  // Duplicate the row so the track can loop seamlessly from 0 → -50%.
  const track = [...items, ...items];

  return (
    <div className="vp-marquee-row overflow-hidden">
      <div
        className={`vp-marquee-track flex gap-6 ${direction === "right" ? "vp-marquee-reverse" : ""}`}
        style={{ animationDuration: `${speedSeconds}s` }}
      >
        {track.map((v, i) => (
          <VolunteerCard key={`${v._id}-${i}`} v={v} />
        ))}
      </div>
    </div>
  );
}

export default function VolunteersPage() {
  /* ── Team grid — fetched from backend ── */
  const [volunteers, setVolunteers] = useState<TeamVolunteer[]>([]);
  const [volunteersLoading, setVolunteersLoading] = useState(true);

  useEffect(() => {
    apiGet<{ success: boolean; data: TeamVolunteer[] }>("/api/volunteers")
      .then((res) => setVolunteers(res.data))
      .catch(() => setVolunteers([]))
      .finally(() => setVolunteersLoading(false));
  }, []);

  const rows = splitIntoRows(volunteers, 3);
  const rowDirections: Array<"left" | "right"> = ["left", "right", "left"];

  /* ── Enrollment form ── */
  const [form, setForm] = useState({
    name: "", email: "", phone: "", dob: "",
    occupation: "", address: "", county: "", message: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dobInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showModal, setShowModal] = useState(false);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return file ? URL.createObjectURL(file) : null;
    });
  }

  function resetImage() {
    setImageFile(null);
    setImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    // File inputs are uncontrolled in the browser — React state alone
    // cannot clear the native "chosen file" text, so reset it via ref.
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function openDatePicker() {
    // showPicker() is the reliable way to open the native calendar from
    // anywhere on the field / custom icon, not just the tiny native icon hitbox.
    dobInputRef.current?.showPicker?.();
  }

  async function handleSubmit() {
    if (submitting) return;
    setStatus(null);
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (imageFile) formData.append("image", imageFile);

      const res = await apiPostFormData<{ message: string }>("/api/volunteer-applications", formData);
      setStatus({ type: "success", text: res.message || "Thanks for applying!" });
      setShowModal(true);
      setForm({ name: "", email: "", phone: "", dob: "", occupation: "", address: "", county: "", message: "" });
      resetImage();
    } catch (err) {
      const text = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      setStatus({ type: "error", text });
      setShowModal(true);
    } finally {
      setSubmitting(false);
    }
  }

  function closeModalAndReload() {
    setShowModal(false);
    window.location.reload();
  }

  /* Typewriters */
  const volLabel  = useTypewriter("Our Volunteers", 85, 3500);
  const volTitle  = useTypewriter("Our Passionate Volunteers", 60, 3500);
  const formLabel = useTypewriter("Enroll In Our Mission", 80, 3500);
  const formTitle = useTypewriter("Become A Volunteer And Join Our Community", 50, 3500);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const inputCls =
    "w-full rounded-lg bg-white border border-gray-200 px-3 py-2.5 text-xs " +
    "text-[#0d2b2b] placeholder-gray-400 outline-none focus:ring-2 " +
    "focus:ring-[#e8490f]/25 focus:border-[#e8490f]/50 transition vp-input";

  return (
    <div className="bg-white" style={{ fontFamily: "'Georgia', serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        /* ── Cursor ── */
        .vp-cursor {
          display: inline-block;
          width: 2px;
          background: currentColor;
          margin-left: 2px;
          animation: vpCursorBlink 0.8s step-end infinite;
          vertical-align: middle;
        }
        @keyframes vpCursorBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }

        /* ── Banner fade-in ── */
        .vp-banner-fade {
          animation: vpBannerIn 0.7s ease both;
        }
        @keyframes vpBannerIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Marquee rows — continuous horizontal auto-scroll ── */
        .vp-marquee-row {
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%);
          mask-image: linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%);
        }
        .vp-marquee-track {
          width: max-content;
          animation-name: vpMarqueeLeft;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        .vp-marquee-track.vp-marquee-reverse {
          animation-name: vpMarqueeRight;
        }
        @keyframes vpMarqueeLeft {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes vpMarqueeRight {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        .vp-marquee-row:hover .vp-marquee-track {
          animation-play-state: paused;
        }
        .vp-marquee-card {
          padding: 4px;
        }

        /* ── Card continuous float ── */
        .vp-card-float {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border-radius: 1rem;
          position: relative;
          overflow: hidden;
        }
        .vp-card-float:hover {
          transform: translateY(-6px) scale(1.03);
          box-shadow: 0 18px 36px rgba(13,43,43,0.13);
        }

        /* ── Image zoom on hover ── */
        .vp-card-float:hover .vp-img {
          transform: scale(1.07);
        }
        .vp-img {
          transition: transform 0.5s ease;
        }

        /* ── Standardized photo frame (fixed size, same for every card) ── */
        .vp-photo-frame {
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 1rem;
          overflow: hidden;
          background: #f5f2eb;
        }

        /* ── Initials placeholder for missing photos ── */
        .vp-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f5f2eb 0%, #ece6d8 100%);
          color: #e8490f;
          font-weight: 800;
          font-size: clamp(1.4rem, 3vw, 2rem);
          letter-spacing: 0.05em;
          position: relative;
        }
        .vp-placeholder::after {
          content: '';
          position: absolute;
          inset: 14%;
          border: 2px dashed rgba(232,73,15,0.35);
          border-radius: 50%;
          animation: vpRingPulse 2.6s ease-in-out infinite;
        }
        @keyframes vpRingPulse {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50%       { transform: scale(1.06); opacity: 1; }
        }

        /* ── Instagram icon hover spin ── */
        .vp-ig-btn {
          transition: color 0.2s, transform 0.3s;
        }
        .vp-ig-btn:hover {
          color: #e8490f;
          transform: rotate(15deg) scale(1.2);
        }
        .vp-ig-btn:active {
          transform: rotate(15deg) scale(0.95);
        }

        /* ── Name underline on card hover ── */
        .vp-card-float:hover .vp-name {
          color: #e8490f;
          transition: color 0.2s ease;
        }
        .vp-name {
          transition: color 0.2s ease;
        }

        /* ── Role badge slide-in ── */
        .vp-role {
          display: inline-block;
        }

        /* ── Form section fade-in ── */
        .vp-form-fade {
          animation: vpFormIn 0.8s ease both;
          animation-delay: 0.2s;
        }
        @keyframes vpFormIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Input focus lift ── */
        .vp-input {
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
        }
        .vp-input:focus {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(232,73,15,0.10);
        }

        /* ── Date input: hide native icon, let our showPicker()-driven CalIcon
               be the only visible trigger, but keep native indicator clickable
               as a fallback for browsers without showPicker() support ── */
        .vp-date-input {
          cursor: pointer;
        }
        .vp-date-input::-webkit-calendar-picker-indicator {
          opacity: 0;
          position: absolute;
          right: 0;
          top: 0;
          width: 2.25rem;
          height: 100%;
          cursor: pointer;
        }
        .vp-date-input::-webkit-datetime-edit {
          cursor: pointer;
        }

        /* ── Submit button pulse (repeats) ── */
        .vp-submit-btn {
          animation: vpBtnPulse 3s ease-in-out infinite;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        @keyframes vpBtnPulse {
          0%, 100% { box-shadow: 0 4px 16px rgba(232,73,15,0.35); }
          50%       { box-shadow: 0 4px 28px rgba(232,73,15,0.60); }
        }
        .vp-submit-btn:hover {
          animation-play-state: paused;
          background: #d43d09 !important;
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 8px 24px rgba(232,73,15,0.45);
        }

        /* ── Shimmer sweep on card hover ── */
        .vp-card-float::before {
          content: '';
          position: absolute;
          top: 0; left: -75%;
          width: 50%; height: 100%;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.16), transparent);
          transform: skewX(-20deg);
          opacity: 0;
          pointer-events: none;
          z-index: 10;
        }
        .vp-card-float:hover::before {
          opacity: 1;
          animation: vpShimmer 0.65s ease forwards;
        }
        @keyframes vpShimmer {
          from { left: -75%; }
          to   { left: 125%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .vp-marquee-track {
            animation: none !important;
          }
          .vp-marquee-row {
            overflow-x: auto;
          }
        }

        /* ── Status popup modal ── */
        .vp-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(13,43,43,0.55);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          z-index: 1000;
          animation: vpModalOverlayIn 0.2s ease both;
        }
        @keyframes vpModalOverlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .vp-modal-card {
          background: #ffffff;
          border-radius: 1rem;
          padding: 2rem 1.75rem 1.75rem;
          max-width: 360px;
          width: 100%;
          text-align: center;
          box-shadow: 0 20px 50px rgba(13,43,43,0.25);
          animation: vpModalCardIn 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes vpModalCardIn {
          from { opacity: 0; transform: translateY(12px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .vp-modal-icon {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          font-size: 1.4rem;
          font-weight: 800;
        }
        .vp-modal-icon-success {
          background: #e6f6ee;
          color: #1a9d5c;
        }
        .vp-modal-icon-error {
          background: #fdeae4;
          color: #e8490f;
        }
        .vp-modal-text {
          color: #0d2b2b;
          font-size: 0.85rem;
          font-weight: 600;
          line-height: 1.5;
          margin-bottom: 1.5rem;
        }
        .vp-modal-btn {
          background: #e8490f;
          color: #fff;
          font-weight: 700;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 0.65rem 2.5rem;
          border-radius: 0.65rem;
          border: none;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }
        .vp-modal-btn:hover {
          background: #d43d09;
          transform: translateY(-1px);
        }
      `}</style>

      {/* ════════════════════════════════════════
          SECTION 1 — Our Passionate Volunteers
      ════════════════════════════════════════ */}
      <section className="px-4 sm:px-8">

        {/* Header banner */}
        <div className="vp-banner-fade max-w-[1920px] mx-auto rounded-2xl bg-[#f5f2eb] flex flex-col
                        items-center justify-center py-10 px-6 mb-14 text-center">
          <p className="text-[#e8490f] text-sm italic font-semibold tracking-widest uppercase mb-2"
             style={{ minHeight: "1.5em" }}>
            {volLabel}
           
          </p>
          <h2
            className="!text-[#0d2b2b] font-extrabold"
            style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", minHeight: "1.4em" }}
          >
            {volTitle}
          
          </h2>
        </div>

        {/* Volunteer rows — fetched from GET /api/volunteers, shown as 3
            horizontally auto-scrolling rows, alternating direction */}
        {!volunteersLoading && volunteers.length === 0 ? (
          <p className="text-center text-sm text-gray-400 mb-14">No team members to show yet.</p>
        ) : (
          <div className="max-w-[1920px] mx-auto flex flex-col gap-8 mb-14">
            {rows.map((rowItems, i) => (
              <MarqueeRow
                key={i}
                items={rowItems}
                direction={rowDirections[i]}
                speedSeconds={Math.max(18, rowItems.length * 6)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════
          SECTION 2 — Volunteer Enrollment Form
      ════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-8 bg-white">

        {/* Header */}
        <div className="vp-form-fade max-w-2xl mx-auto text-center mb-10">
          <p className="text-[#e8490f] italic text-2xl font-semibold tracking-widest uppercase mb-2"
             style={{ minHeight: "1.5em" }}>
            {formLabel}
          </p>
          <h2
            className="!text-[#0d2b2b] font-extrabold leading-tight"
            style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", minHeight: "1.4em" }}
          >
            {formTitle}
            
          </h2>
        </div>

        {/* Form card */}
        <div
          className="vp-form-fade max-w-2xl mx-auto rounded-2xl bg-[#f5f2eb] text-left p-7 sm:p-9"
          style={{ boxShadow: "0 2px 24px rgba(13,43,43,0.06)", animationDelay: "0.35s" }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* ── LEFT column ── */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0d2b2b] mb-1.5">Name</label>
                <input type="text" placeholder="Your full name"
                       value={form.name} onChange={set("name")} className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0d2b2b] mb-1.5">Email</label>
                  <input type="email" placeholder="Your email"
                         value={form.email} onChange={set("email")} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0d2b2b] mb-1.5">Phone</label>
                  <input type="tel" placeholder="Your phone"
                         value={form.phone} onChange={set("phone")} className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0d2b2b] mb-1.5">Date Of Birth</label>
                <div className="relative">
                  <input
                    ref={dobInputRef}
                    type="date"
                    value={form.dob}
                    onChange={set("dob")}
                    onClick={openDatePicker}
                    className={inputCls + " pr-9 vp-date-input"}
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={openDatePicker}
                  >
                    <CalIcon />
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0d2b2b] mb-1.5">Occupation</label>
                <input type="text" placeholder="Your occupation"
                       value={form.occupation} onChange={set("occupation")} className={inputCls} />
              </div>
            </div>

            {/* ── RIGHT column ── */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-[#0d2b2b] mb-1.5">Address</label>
                <input type="text" placeholder="Enter address"
                       value={form.address} onChange={set("address")} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0d2b2b] mb-1.5">County/State</label>
                <input type="text" placeholder="Your state / country"
                       value={form.county} onChange={set("county")} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0d2b2b] mb-1.5">Photo</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={inputCls + " file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-[#e8490f] file:text-white"}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-2 w-14 h-14 rounded-lg object-cover border border-gray-200"
                  />
                )}
              </div>
              <div className="flex-1 flex flex-col">
                <label className="block text-xs font-bold text-[#0d2b2b] mb-1.5">Message</label>
                <textarea
                  placeholder="What are your hobbies and skills?"
                  value={form.message}
                  onChange={set("message")}
                  rows={5}
                  className={inputCls + " resize-none flex-1"}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-7 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="vp-submit-btn px-12 py-3.5 rounded-xl bg-[#e8490f] text-white
                         font-bold uppercase tracking-widest text-xs disabled:opacity-60
                         disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Now"}
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          Status popup — shown after submit, reloads page on close
      ════════════════════════════════════════ */}
      {showModal && status && (
        <div
          className="vp-modal-overlay"
          role="dialog"
          aria-modal="true"
          onClick={closeModalAndReload}
        >
          <div className="vp-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className={`vp-modal-icon ${status.type === "success" ? "vp-modal-icon-success" : "vp-modal-icon-error"}`}>
              {status.type === "success" ? "✓" : "!"}
            </div>
            <p className="vp-modal-text">{status.text}</p>
            <button className="vp-modal-btn" onClick={closeModalAndReload}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}