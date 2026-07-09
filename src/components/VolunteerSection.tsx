import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../lib/api";

interface Volunteer {
  _id: string;
  name: string;
  role: string;
  image: { url: string } | null;
  instagram: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);

export default function VolunteersSection() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<{ success: boolean; data: Volunteer[] }>("/api/volunteers")
      .then((res) => setVolunteers(res.data.slice(0, 4)))
      .catch(() => setVolunteers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-white py-16 px-4 sm:px-8">
      <style>{`
        /* ── Header fade-in ── */
        .vol-header-fade {
          animation: volHeaderIn 0.7s ease both;
        }
        @keyframes volHeaderIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .vol-header-fade .vol-eyebrow {
          display: inline-block;
          animation: volEyebrowIn 0.6s ease both;
          animation-delay: 0.1s;
        }
        @keyframes volEyebrowIn {
          from { opacity: 0; letter-spacing: 0.02em; }
          to   { opacity: 1; letter-spacing: 0.2em; }
        }

        /* ── Card entrance — alternating left/right, staggered ── */
        .vol-card-enter {
          animation: volCardInRight 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .vol-card-enter.vol-from-left {
          animation-name: volCardInLeft;
        }
        @keyframes volCardInRight {
          from { opacity: 0; transform: translateX(20px) translateY(18px) scale(0.94); }
          to   { opacity: 1; transform: translateX(0) translateY(0) scale(1); }
        }
        @keyframes volCardInLeft {
          from { opacity: 0; transform: translateX(-20px) translateY(18px) scale(0.94); }
          to   { opacity: 1; transform: translateX(0) translateY(0) scale(1); }
        }

        /* ── Gentle continuous float ── */
        .vol-card-float {
          position: relative;
          overflow: hidden;
          border-radius: 1rem;
          animation: volFloat 4.2s ease-in-out infinite;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .vol-card-enter:nth-child(4n+2) .vol-card-float { animation-delay: -1s; }
        .vol-card-enter:nth-child(4n+3) .vol-card-float { animation-delay: -2s; }
        .vol-card-enter:nth-child(4n+4) .vol-card-float { animation-delay: -3s; }
        @keyframes volFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-5px); }
        }
        .vol-card-float:hover {
          animation-play-state: paused;
          transform: translateY(-8px);
          box-shadow: 0 18px 36px rgba(0,0,0,0.12);
        }
        .vol-card-float::before {
          content: '';
          position: absolute;
          top: 0; left: -75%;
          width: 50%; height: 100%;
          background: linear-gradient(
            120deg,
            transparent,
            rgba(255,255,255,0.25),
            transparent
          );
          transform: skewX(-20deg);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.1s;
          z-index: 10;
        }
        .vol-card-float:hover::before {
          opacity: 1;
          animation: volShimmer 0.65s ease forwards;
        }
        @keyframes volShimmer {
          from { left: -75%; }
          to   { left: 125%; }
        }

        /* ── Standardized photo frame — same size/shape for every card ── */
        .vol-photo-frame {
          width: 100%;
          aspect-ratio: 4 / 5;
          background: #f3f4f6;
        }

        /* ── Image zoom on hover ── */
        .vol-img {
          transition: transform 0.55s ease;
        }
        .vol-card-float:hover .vol-img {
          transform: scale(1.08);
        }

        /* ── Initials placeholder for missing photos ── */
        .vol-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f3f4f6 0%, #e9eaee 100%);
          color: #e8490f;
          font-weight: 800;
          font-size: clamp(1.2rem, 2.6vw, 1.8rem);
          letter-spacing: 0.05em;
        }

        /* ── Name/role slide-up reveal on hover ── */
        .vol-meta {
          transition: transform 0.3s ease;
        }
        .vol-card-enter:hover .vol-meta {
          transform: translateY(-2px);
        }
        .vol-name {
          transition: color 0.2s ease;
        }
        .vol-card-enter:hover .vol-name {
          color: #e8490f;
        }

        /* ── Instagram icon pop ── */
        .vol-insta {
          transition: transform 0.25s ease, color 0.2s ease;
        }
        .vol-insta:hover {
          transform: scale(1.2) rotate(8deg);
        }

        /* ── Button pulse ── */
        .vol-btn {
          animation: volBtnPulse 3s ease-in-out infinite;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .vol-btn:hover {
          animation-play-state: paused;
          background: #d43d09 !important;
          transform: scale(1.03);
          box-shadow: 0 4px 16px rgba(232,73,15,0.3);
        }
        @keyframes volBtnPulse {
          0%, 100% { box-shadow: 0 0 0 0px rgba(232,73,15,0); }
          50%       { box-shadow: 0 0 0 5px rgba(232,73,15,0.15); }
        }
      `}</style>

      <div className="w-full max-w-7xl mx-auto flex flex-col items-center gap-10">

        {/* Header */}
        <div className="vol-header-fade text-center">
          <p className="vol-eyebrow text-[#e8490f] italic font-semibold tracking-widest text-sm mb-2"
             style={{ fontFamily: "'Georgia', serif" }}>
            OUR VOLUNTEERS
          </p>
          <h2 className="!text-[#0d2b2b] font-extrabold"
              style={{ fontFamily: "'Georgia', serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}>
            Our Passionate Volunteers
          </h2>
        </div>

        {/* Cards — fetched from GET /api/volunteers */}
        {!loading && volunteers.length === 0 ? (
          <p className="text-sm text-gray-400">No team members to show yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 w-full">
            {volunteers.map((vol, i) => (
              <div
                key={vol._id}
                className={`vol-card-enter flex flex-col gap-3 ${i % 2 === 0 ? "vol-from-left" : ""}`}
                style={{ animationDelay: `${i * 130}ms` }}
              >
                <div className="vol-card-float vol-photo-frame">
                  {vol.image?.url ? (
                    <img
                      src={vol.image.url}
                      alt={vol.name}
                      loading="lazy"
                      className="vol-img w-full h-full object-cover"
                    />
                  ) : (
                    <div className="vol-placeholder">{getInitials(vol.name)}</div>
                  )}
                </div>
                <div className="vol-meta flex items-center justify-between px-1">
                  <div>
                    <p className="vol-name text-sm text-left font-bold text-[#0d2b2b]">{vol.name}</p>
                    <p className="text-xs text-left text-gray-400 mt-0.5">{vol.role}</p>
                  </div>
                  <a href={vol.instagram && vol.instagram !== "#" ? vol.instagram : undefined}
                     target="_blank"
                     rel="noopener noreferrer"
                     aria-disabled={!vol.instagram || vol.instagram === "#"}
                     onClick={(e) => { if (!vol.instagram || vol.instagram === "#") e.preventDefault(); }}
                     className={`vol-insta ${vol.instagram && vol.instagram !== "#" ? "text-gray-900 hover:text-[#e8490f]" : "text-gray-300 cursor-default"}`}
                     aria-label="Instagram">
                    <InstagramIcon />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View More Button */}
        <Link to="/volunteers">
          <button className="vol-btn px-10 py-3 rounded-lg bg-[#e8490f] text-white font-bold
                             tracking-[0.14em] uppercase text-sm shadow-sm">
            View More
          </button>
        </Link>

      </div>
    </section>
  );
}