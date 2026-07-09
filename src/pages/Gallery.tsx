// pages/GalleryPage.tsx
import { useState, useRef, useEffect } from "react";
import { apiGet } from "../lib/api";

type Category = "All" | "Food Distribution" | "Events";
type PhotoCategory = "All" | "Orphans" | "Food Distribution" | "Events";

interface GalleryVideo {
  id: string;
  title: string;
  category: Category;
  src: string;
  isNew?: boolean;
}

interface GalleryPhoto {
  id: string;
  title: string;
  category: PhotoCategory;
  src: string;
  isNew?: boolean;
}

// Shape returned by GET /api/gallery/videos
interface GalleryVideoApiModel {
  _id: string;
  title: string;
  category: "Food Distribution" | "Events";
  video: { url: string; publicId: string };
  isNew: boolean;
  isActive: boolean;
}

// Shape returned by GET /api/gallery/photos
interface GalleryPhotoApiModel {
  _id: string;
  title: string;
  category: "Orphans" | "Food Distribution" | "Events";
  photo: { url: string; publicId: string };
  isNew: boolean;
  isActive: boolean;
}

interface GalleryVideoApiResponse {
  success: boolean;
  count: number;
  data: GalleryVideoApiModel[];
}

interface GalleryPhotoApiResponse {
  success: boolean;
  count: number;
  data: GalleryPhotoApiModel[];
}

const CATEGORIES: Category[] = ["All", "Food Distribution", "Events"];
const PHOTO_CATEGORIES: PhotoCategory[] = ["All", "Orphans", "Food Distribution", "Events"];

/* ── Typewriter Hook — repeats every `pauseMs` ms ── */
function useTypewriter(text: string, speed = 70, pauseMs = 3500) {
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<"typing" | "pausing" | "erasing">("typing");

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (displayed.length < text.length) {
        timeout = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), speed);
      } else {
        timeout = setTimeout(() => setPhase("erasing"), pauseMs);
      }
    } else if (phase === "erasing") {
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

/* ── Video Lightbox ── */
function VideoModal({ video, onClose }: { video: GalleryVideo; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative bg-black rounded-2xl overflow-hidden shadow-2xl"
        style={{ width: "min(360px, 90vw)", maxHeight: "90vh" }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/50
                     hover:bg-black/80 flex items-center justify-center text-white transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <video
          src={video.src}
          controls
          autoPlay
          playsInline
          className="w-full bg-black"
          style={{ aspectRatio: "9/16", objectFit: "cover" }}
        />

        <div className="px-4 py-3 bg-[#0d2b2b]">
          <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#e8490f]">
            {video.category}
          </span>
          <h3 className="text-white font-bold text-sm mt-0.5" style={{ fontFamily: "'Georgia', serif" }}>
            {video.title}
          </h3>
        </div>
      </div>
    </div>
  );
}

/* ── Photo Lightbox ── */
function PhotoModal({ photo, onClose }: { photo: GalleryPhoto; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative bg-black rounded-2xl overflow-hidden shadow-2xl"
        style={{ width: "min(420px, 92vw)", maxHeight: "90vh" }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/50
                     hover:bg-black/80 flex items-center justify-center text-white transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <img
          src={photo.src}
          alt={photo.title}
          className="w-full bg-black"
          style={{ maxHeight: "72vh", objectFit: "cover" }}
        />

        <div className="px-4 py-3 bg-[#0d2b2b]">
          <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#e8490f]">
            {photo.category}
          </span>
          <h3 className="text-white font-bold text-sm mt-0.5" style={{ fontFamily: "'Georgia', serif" }}>
            {photo.title}
          </h3>
        </div>
      </div>
    </div>
  );
}

/* ── Reel Card — auto-plays muted 15s preview on hover ── */
function ReelCard({ video, onClick }: { video: GalleryVideo; onClick: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  const startPreview = () => {
    const el = videoRef.current;
    if (!el) return;
    el.currentTime = 0;
    el.play().catch(() => {});
    setPlaying(true);

    timerRef.current = setTimeout(() => {
      el.pause();
      el.currentTime = 0;
      setPlaying(false);
      setProgress(0);
    }, 15000);
  };

  const stopPreview = () => {
    const el = videoRef.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
    setPlaying(false);
    setProgress(0);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleTimeUpdate = () => {
    const el = videoRef.current;
    if (!el || el.duration === 0) return;
    setProgress(Math.min((el.currentTime / 15) * 100, 100));
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => { setHovered(true); startPreview(); }}
      onMouseLeave={() => { setHovered(false); stopPreview(); }}
      className="group relative cursor-pointer rounded-2xl overflow-hidden shadow-md
                 hover:shadow-xl card-hover-anim"
      style={{ aspectRatio: "9/16" }}
    >
      <video
        ref={videoRef}
        src={video.src}
        muted
        playsInline
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500"
        style={{ transform: hovered ? "scale(1.04)" : "scale(1)" }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30
                      pointer-events-none" />

      {video.isNew && (
        <span className="absolute top-3 left-3 bg-[#e8490f] text-white text-[9px] font-bold
                         tracking-[0.15em] uppercase px-2 py-1 rounded-full z-10 animate-pulse">
          NEW
        </span>
      )}

      <span className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white
                       text-[9px] font-semibold tracking-wide uppercase px-2 py-1 rounded-full z-10">
        {video.category === "Food Distribution" ? "🍱 Food" : "🎉 Event"}
      </span>

      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg
                          group-hover:scale-110 transition-transform duration-300">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#0d2b2b">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
        </div>
      )}

      {playing && (
        <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20 z-10">
          <div
            className="h-full bg-[#e8490f] transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="absolute bottom-0 inset-x-0 px-3 pb-3 pointer-events-none"
           style={{ paddingBottom: playing ? "10px" : "12px" }}>
        <h3 className="text-white font-bold text-xs leading-snug line-clamp-2"
            style={{ fontFamily: "'Georgia', serif" }}>
          {video.title}
        </h3>
      </div>
    </div>
  );
}

/* ── Photo Card — image tile with hover zoom, used in the masonry photo grid ── */
function PhotoCard({ photo, onClick }: { photo: GalleryPhoto; onClick: () => void }) {
  const [loaded, setLoaded] = useState(false);

  const catIcon =
    photo.category === "Orphans" ? "🧡" :
    photo.category === "Food Distribution" ? "🍱" : "🎉";

  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer rounded-2xl overflow-hidden shadow-md
                 hover:shadow-xl card-hover-anim mb-3 sm:mb-4 break-inside-avoid"
    >
      {!loaded && (
        <div className="w-full bg-[#e7e2d4] animate-pulse" style={{ aspectRatio: "3/4" }} />
      )}
      <img
        src={photo.src}
        alt={photo.title}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-auto object-cover transition-all duration-500 group-hover:scale-105
                   ${loaded ? "opacity-100" : "opacity-0 absolute inset-0"}`}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 to-black/10
                      opacity-70 group-hover:opacity-90 transition-opacity duration-300 pointer-events-none" />

      {photo.isNew && (
        <span className="absolute top-3 left-3 bg-[#e8490f] text-white text-[9px] font-bold
                         tracking-[0.15em] uppercase px-2 py-1 rounded-full z-10 animate-pulse">
          NEW
        </span>
      )}

      <span className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white
                       text-[9px] font-semibold tracking-wide uppercase px-2 py-1 rounded-full z-10">
        {catIcon} {photo.category}
      </span>

      <div className="absolute bottom-0 inset-x-0 px-3 pb-3 pointer-events-none">
        <h3 className="text-white font-bold text-xs leading-snug line-clamp-2"
            style={{ fontFamily: "'Georgia', serif" }}>
          {photo.title}
        </h3>
      </div>

      <div className="absolute inset-0 flex items-center justify-center opacity-0
                      group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d2b2b" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </div>
      </div>
    </div>
  );
}

type MediaTab = "videos" | "photos";

/* ── Media Toggle — switches between Videos and Photos sections ── */
function MediaToggle({ tab, onChange }: { tab: MediaTab; onChange: (t: MediaTab) => void }) {
  return (
    <div className="max-w-6xl mx-auto flex justify-center mb-2">
      <div className="relative inline-flex bg-white rounded-full p-1 shadow-sm border border-gray-200">
        <div
          className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-[#0d2b2b]
                     transition-transform duration-300 ease-out"
          style={{ transform: tab === "videos" ? "translateX(0%)" : "translateX(calc(100% + 8px))" }}
        />
        <button
          onClick={() => onChange("videos")}
          className={`relative z-10 px-6 sm:px-8 py-2.5 rounded-full text-sm font-bold
                     tracking-wide transition-colors duration-300 flex items-center gap-2
                     ${tab === "videos" ? "text-white" : "text-gray-500 hover:text-[#0d2b2b]"}`}
        >
          🎬 Videos
        </button>
        <button
          onClick={() => onChange("photos")}
          className={`relative z-10 px-6 sm:px-8 py-2.5 rounded-full text-sm font-bold
                     tracking-wide transition-colors duration-300 flex items-center gap-2
                     ${tab === "photos" ? "text-white" : "text-gray-500 hover:text-[#0d2b2b]"}`}
        >
          📸 Photos
        </button>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<MediaTab>("videos");

  const [videos, setVideos] = useState<GalleryVideo[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [videosError, setVideosError] = useState<string | null>(null);

  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [photosLoading, setPhotosLoading] = useState(true);
  const [photosError, setPhotosError] = useState<string | null>(null);

  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [activeVideo, setActiveVideo] = useState<GalleryVideo | null>(null);

  const [activePhotoCategory, setActivePhotoCategory] = useState<PhotoCategory>("All");
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);

  const line1 = useTypewriter("OUR GALLERY", 80, 3500);
  const line2 = useTypewriter("Moments That Matter", 65, 3500);

  /* Fetch both videos and photos once on mount so tab-switching is instant */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setVideosLoading(true);
        const res = await apiGet<GalleryVideoApiResponse>("/api/gallery/videos");
        if (cancelled) return;
        setVideos(
          res.data.map((v) => ({
            id: v._id,
            title: v.title,
            category: v.category,
            src: v.video?.url || "",
            isNew: v.isNew,
          }))
        );
        setVideosError(null);
      } catch (err: any) {
        if (!cancelled) setVideosError(err?.message || "Failed to load videos");
      } finally {
        if (!cancelled) setVideosLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setPhotosLoading(true);
        const res = await apiGet<GalleryPhotoApiResponse>("/api/gallery/photos");
        if (cancelled) return;
        setPhotos(
          res.data.map((p) => ({
            id: p._id,
            title: p.title,
            category: p.category,
            src: p.photo?.url || "",
            isNew: p.isNew,
          }))
        );
        setPhotosError(null);
      } catch (err: any) {
        if (!cancelled) setPhotosError(err?.message || "Failed to load photos");
      } finally {
        if (!cancelled) setPhotosLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Backend already returns newest-first (sort({ createdAt: -1 })), so no
  // client-side id sort is needed anymore — just filter by category.
  const filtered =
    activeCategory === "All" ? videos : videos.filter((v) => v.category === activeCategory);

  const filteredPhotos =
    activePhotoCategory === "All"
      ? photos
      : photos.filter((p) => p.category === activePhotoCategory);

  return (
    <div className="min-h-screen bg-[#f5f2eb]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        .reel-fade {
          animation: reelIn .4s ease both;
        }
        @keyframes reelIn {
          from { opacity: 0; transform: scale(0.93) translateY(14px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }

        .card-hover-anim {
          animation: cardFloat 4s ease-in-out infinite;
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }
        .card-hover-anim:nth-child(2n)   { animation-delay: -1s; }
        .card-hover-anim:nth-child(3n)   { animation-delay: -2s; }
        .card-hover-anim:nth-child(4n)   { animation-delay: -0.5s; }
        .card-hover-anim:nth-child(5n)   { animation-delay: -1.7s; }
        @keyframes cardFloat {
          0%,100% { transform: translateY(0px);  }
          50%      { transform: translateY(-5px); }
        }
        .card-hover-anim:hover {
          animation-play-state: paused;
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.18);
        }

        .card-hover-anim::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            120deg,
            transparent 30%,
            rgba(255,255,255,0.12) 50%,
            transparent 70%
          );
          background-size: 200% 100%;
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
          border-radius: inherit;
          animation: shimmerSlide 1.5s ease forwards;
          animation-play-state: paused;
        }
        .card-hover-anim:hover::after {
          opacity: 1;
          animation-play-state: running;
        }
        @keyframes shimmerSlide {
          from { background-position: 200% 0; }
          to   { background-position: -200% 0; }
        }

        .tw-cursor {
          display: inline-block;
          width: 2px;
          background: currentColor;
          margin-left: 2px;
          animation: cursorBlink 0.8s step-end infinite;
          vertical-align: middle;
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }

        .hero-fade {
          animation: heroIn 0.8s ease both;
        }
        @keyframes heroIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .section-divider {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .section-divider::before,
        .section-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, #d8d2c0, transparent);
        }

        .photo-masonry {
          column-count: 2;
          column-gap: 0.75rem;
        }
        @media (min-width: 640px) {
          .photo-masonry { column-count: 3; column-gap: 1rem; }
        }
        @media (min-width: 768px) {
          .photo-masonry { column-count: 4; }
        }
        @media (min-width: 1024px) {
          .photo-masonry { column-count: 5; }
        }

        .tab-fade {
          animation: tabIn .35s ease both;
        }
        @keyframes tabIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Hero banner */}
      <section className="px-4 sm:px-8">
        <div className="max-w-[1920px] mx-auto mb-5 rounded-3xl bg-[#f0ede3] flex flex-col items-center
                        justify-center text-center py-10 px-6 hero-fade">
          <p
            className="text-[#e8490f] italic font-semibold tracking-widest text-sm mb-2"
            style={{ fontFamily: "'Georgia', serif", minHeight: "1.5em" }}
          >
            {line1}
          </p>
          <h1
            className="!text-[#0d2b2b] font-extrabold leading-tight mb-3"
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
              minHeight: "1.4em",
            }}
          >
            {line2}
          </h1>
          <p className="text-[#54544c] text-sm max-w-md">
            Every meal served, every child taught, every festival shared — captured here in
            videos and photos from our Sankalp Sunday journey.
          </p>
        </div>
      </section>

      {/* ══════════════ VIDEO / PHOTO TOGGLE ══════════════ */}
      <section className="px-4 sm:px-8 pb-2 pt-1">
        <MediaToggle tab={activeTab} onChange={setActiveTab} />
      </section>

      {activeTab === "videos" ? (
        <div className="tab-fade">
          {/* ══════════════ VIDEOS ══════════════ */}
          <section className="px-4 sm:px-8 pb-3">
            <div className="max-w-6xl mx-auto section-divider">
              <span className="text-[#0d2b2b] font-extrabold text-lg sm:text-xl whitespace-nowrap"
                    style={{ fontFamily: "'Georgia', serif" }}>
                🎬 Video Reels
              </span>
            </div>
          </section>

          {/* Filter tabs — videos */}
          <section className="px-4 sm:px-8 pb-5 pt-3">
            <div className="max-w-6xl mx-auto flex flex-wrap gap-2 justify-center">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200
                    ${activeCategory === cat
                      ? "bg-[#e8490f] text-white shadow-sm scale-105"
                      : "bg-white text-gray-500 border border-gray-200 hover:border-[#e8490f] hover:text-[#e8490f]"}`}
                >
                  {cat}
                  {cat !== "All" && (
                    <span className={`ml-1.5 text-[10px] font-bold
                      ${activeCategory === cat ? "text-white/70" : "text-gray-400"}`}>
                      ({videos.filter(v => v.category === cat).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Reel grid */}
          <section className="px-4 sm:px-8 pb-16">
            <div className="max-w-6xl mx-auto">
              {videosLoading && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-2xl bg-[#e7e2d4] animate-pulse"
                      style={{ aspectRatio: "9/16" }}
                    />
                  ))}
                </div>
              )}

              {!videosLoading && videosError && (
                <div className="text-center py-20 text-red-400 text-sm">
                  Couldn't load videos: {videosError}
                </div>
              )}

              {!videosLoading && !videosError && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                  {filtered.map((video, i) => (
                    <div
                      key={video.id}
                      className="reel-fade"
                      style={{ animationDelay: `${i * 55}ms` }}
                    >
                      <ReelCard video={video} onClick={() => setActiveVideo(video)} />
                    </div>
                  ))}
                </div>
              )}

              {!videosLoading && !videosError && filtered.length === 0 && (
                <div className="text-center py-20 text-gray-400 text-sm">
                  No videos in this category yet.
                </div>
              )}
            </div>
          </section>
        </div>
      ) : (
        <div className="tab-fade">
          {/* ══════════════ PHOTOS ══════════════ */}
          <section className="px-4 sm:px-8 pb-3">
            <div className="max-w-6xl mx-auto section-divider">
              <span className="text-[#0d2b2b] font-extrabold text-lg sm:text-xl whitespace-nowrap"
                    style={{ fontFamily: "'Georgia', serif" }}>
                📸 Photo Moments
              </span>
            </div>
          </section>

          {/* Filter tabs — photos */}
          <section className="px-4 sm:px-8 pb-5 pt-3">
            <div className="max-w-6xl mx-auto flex flex-wrap gap-2 justify-center">
              {PHOTO_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActivePhotoCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200
                    ${activePhotoCategory === cat
                      ? "bg-[#0d2b2b] text-white shadow-sm scale-105"
                      : "bg-white text-gray-500 border border-gray-200 hover:border-[#0d2b2b] hover:text-[#0d2b2b]"}`}
                >
                  {cat}
                  {cat !== "All" && (
                    <span className={`ml-1.5 text-[10px] font-bold
                      ${activePhotoCategory === cat ? "text-white/70" : "text-gray-400"}`}>
                      ({photos.filter(p => p.category === cat).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Photo masonry grid */}
          <section className="px-4 sm:px-8 pb-20">
            <div className="max-w-6xl mx-auto">
              {photosLoading && (
                <div className="photo-masonry">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-2xl bg-[#e7e2d4] animate-pulse mb-3 sm:mb-4 break-inside-avoid"
                      style={{ aspectRatio: "3/4" }}
                    />
                  ))}
                </div>
              )}

              {!photosLoading && photosError && (
                <div className="text-center py-20 text-red-400 text-sm">
                  Couldn't load photos: {photosError}
                </div>
              )}

              {!photosLoading && !photosError && (
                <div className="photo-masonry">
                  {filteredPhotos.map((photo, i) => (
                    <div
                      key={photo.id}
                      className="reel-fade"
                      style={{ animationDelay: `${i * 55}ms` }}
                    >
                      <PhotoCard photo={photo} onClick={() => setActivePhoto(photo)} />
                    </div>
                  ))}
                </div>
              )}

              {!photosLoading && !photosError && filteredPhotos.length === 0 && (
                <div className="text-center py-20 text-gray-400 text-sm">
                  No photos in this category yet.
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {activeVideo && (
        <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
      {activePhoto && (
        <PhotoModal photo={activePhoto} onClose={() => setActivePhoto(null)} />
      )}
    </div>
  );
}