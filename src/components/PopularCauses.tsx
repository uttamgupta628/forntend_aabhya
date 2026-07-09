// components/PopularCauses.tsx

interface Cause {
  id: number;
  category: string;
  title: string;
  description: string;
  raised: string;
  goal: string;
  image: string;
}

const CAUSES: Cause[] = [
  {
    id: 1,
    category: "MEDICAL",
    title: "Providing Medical Aid to Undeserved Areas",
    description: "Offering aid, development programs to empower people in need.",
    raised: "$8000",
    goal: "$10000",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=260&fit=crop&q=80",
  },
  {
    id: 2,
    category: "FOCUS",
    title: "Supporting Mental Health Awareness Initiatives",
    description: "Empowering communities by providing essential programs.",
    raised: "$18000",
    goal: "$30000",
    image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=400&h=260&fit=crop&q=80",
  },
  {
    id: 3,
    category: "EDUCATION",
    title: "Fighting Hunger with Food Distribution Drives",
    description: "Delivering clean water solutions to remote and communities.",
    raised: "$15000",
    goal: "$50000",
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=260&fit=crop&q=80",
  },
];

function ProgressBar({ raised, goal }: { raised: string; goal: string }) {
  const r = parseInt(raised.replace(/\D/g, ""));
  const g = parseInt(goal.replace(/\D/g, ""));
  const pct = Math.min(100, Math.round((r / g) * 100));
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

        {/* ── Cards grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAUSES.map((cause) => (
            <div
              key={cause.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm
                         hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col"
            >
              {/* Image with category badge */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={cause.image}
                  alt={cause.title}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
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
                <p className="text-xs text-gray-400 leading-relaxed">
                  {cause.description}
                </p>

                {/* Progress bar */}
                <ProgressBar raised={cause.raised} goal={cause.goal} />

                {/* Raised / Goal */}
                <div className="flex justify-between text-[11px] text-gray-500">
                  <span>
                    Raised: <span className="font-bold text-[#0d2b2b]">{cause.raised}</span>
                  </span>
                  <span>
                    Goals: <span className="font-bold text-[#0d2b2b]">{cause.goal}</span>
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

      </div>
    </section>
  );
}