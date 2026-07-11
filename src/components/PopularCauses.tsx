// components/PopularCauses.tsx

import { useEffect, useState } from "react";
import { apiGet } from "../lib/api";

interface CauseApiModel {
  _id: string;
  title: string;
  description: string;
  category: string;
  goalAmount: number;
  raisedAmount: number;
  isFeatured: boolean;
  isActive: boolean;
  progressPercent?: number;
  image?: { url: string; publicId: string };
}

interface CauseApiResponse {
  success: boolean;
  count: number;
  data: CauseApiModel[];
}

function formatRupees(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}

function ProgressBar({ raised, goal }: { raised: number; goal: number }) {
  const pct = goal > 0 ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
  return (
    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-[#e8490f] rounded-full transition-all duration-700"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function PopularCauses() {
  const [causes, setCauses] = useState<CauseApiModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await apiGet<CauseApiResponse>("/api/causes");
        if (cancelled) return;
        setCauses(res.data.filter((c) => c.isActive));
        setError(null);
      } catch (err: any) {
        if (!cancelled) setError(err?.message || "Failed to load causes");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Nothing to show and nothing loading/erroring — don't leave an empty
  // section sitting on the homepage.
  if (!loading && !error && causes.length === 0) return null;

  return (
    <section className="bg-white py-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-10">
          <p
            className="text-[#e8490f] italic font-semibold tracking-widest text-sm mb-2"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            OUR CAUSES
          </p>
          <h2
            className="text-[#0d2b2b] font-extrabold"
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "clamp(1.7rem, 3.5vw, 2.4rem)",
            }}
          >
            Find Popular Causes
          </h2>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                <div className="h-44 bg-gray-200" />
                <div className="p-4 flex flex-col gap-2">
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  <div className="h-3 w-full bg-gray-100 rounded mt-1" />
                  <div className="h-1.5 w-full bg-gray-100 rounded mt-2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <p className="text-center text-sm text-red-500">Couldn't load causes: {error}</p>
        )}

        {/* ── Cards grid ── */}
        {!loading && !error && causes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {causes.map((cause) => (
              <div
                key={cause._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm
                           hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col"
              >
                {/* Image with category badge */}
                <div className="relative h-44 overflow-hidden">
                  {cause.image?.url ? (
                    <img
                      src={cause.image.url}
                      alt={cause.title}
                      loading="lazy"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#0d2b2b]/5" />
                  )}
                  <span
                    className="absolute bottom-3 left-3 bg-[#e8490f] text-white
                               text-[10px] font-bold tracking-[0.14em] uppercase
                               px-2.5 py-1 rounded-md"
                  >
                    {cause.category}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2.5 px-4 pt-4 pb-5 flex-1">
                  <h3
                    className="font-extrabold text-[#0d2b2b] leading-snug text-sm"
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    {cause.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                    {cause.description}
                  </p>

                  {/* Progress bar */}
                  <ProgressBar raised={cause.raisedAmount} goal={cause.goalAmount} />

                  {/* Raised / Goal */}
                  <div className="flex justify-between text-[11px] text-gray-500">
                    <span>
                      Raised: <span className="font-bold text-[#0d2b2b]">{formatRupees(cause.raisedAmount)}</span>
                    </span>
                    <span>
                      Goal: <span className="font-bold text-[#0d2b2b]">{formatRupees(cause.goalAmount)}</span>
                    </span>
                  </div>

                  {/* CTA */}
                  <button
                    className="mt-auto w-full py-2.5 rounded-lg bg-[#e8490f] text-white
                               text-[11px] font-bold tracking-[0.18em] uppercase
                               hover:bg-[#d43d09] transition-colors duration-200"
                  >
                    View Causes
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}