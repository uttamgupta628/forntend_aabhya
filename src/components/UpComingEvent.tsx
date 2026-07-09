
import { useEffect, useState } from "react";
import { apiGet } from "../lib/api";

interface EventApiModel {
  _id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: { url: string; publicId: string };
  isActive: boolean;
}

interface EventApiResponse {
  success: boolean;
  count: number;
  data: EventApiModel[];
}

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15.5 14" />
  </svg>
);

const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

/**
 * `date` is free text on the backend ("Every Sunday" or an actual date
 * string), so there's no reliable structured field to filter on. Heuristic:
 * if it parses as a real calendar date and that date is before today, treat
 * the event as over. If it doesn't parse (recurring phrases like "Every
 * Sunday"), treat it as always-current and keep showing it.
 */
function isUpcoming(dateStr: string): boolean {
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return true;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  parsed.setHours(0, 0, 0, 0);

  return parsed.getTime() >= today.getTime();
}

export default function UpcomingEvents() {
  const [events, setEvents] = useState<EventApiModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await apiGet<EventApiResponse>("/api/events");
        if (cancelled) return;
        setEvents(res.data.filter((e) => isUpcoming(e.date)));
        setError(null);
      } catch (err: any) {
        if (!cancelled) setError(err?.message || "Failed to load events");
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
  if (!loading && !error && events.length === 0) return null;

  return (
    <section className="bg-[#f5f2eb] py-16 px-4 sm:px-8">
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <p
            className="text-[#e8490f] italic font-semibold tracking-widest text-sm mb-2"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            UPCOMING EVENTS
          </p>
          <h2
            className="!text-[#0d2b2b] font-extrabold leading-tight"
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "clamp(1.7rem, 3.5vw, 2.6rem)",
            }}
          >
            Join Us At Our Next Gathering
          </h2>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-44 bg-gray-200" />
                <div className="p-5 flex flex-col gap-2">
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  <div className="h-3 w-1/2 bg-gray-100 rounded" />
                  <div className="h-3 w-full bg-gray-100 rounded mt-2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <p className="text-center text-sm text-red-500">Couldn't load events: {error}</p>
        )}

        {/* Event cards */}
        {!loading && !error && events.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event._id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100
                           transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="h-44 overflow-hidden">
                  <img
                    src={event.image.url}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 flex flex-col gap-3 text-left">
                  <h3
                    className="font-extrabold text-[#0d2b2b] text-base leading-snug"
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    {event.title}
                  </h3>

                  <div className="flex flex-col gap-1.5 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5 text-[#e8490f] font-semibold">
                      <CalendarIcon /> {event.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <ClockIcon /> {event.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <PinIcon /> {event.location}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}