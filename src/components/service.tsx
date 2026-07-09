import { useNavigate } from "react-router-dom";

const EducationIcon = () => (
  <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
    <path
      d="M24 8L4 18l20 10 20-10-20-10z"
      stroke="white"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <path
      d="M12 23v10c0 0 4 5 12 5s12-5 12-5V23"
      stroke="white"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M40 18v10" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

const FoodIcon = () => (
  <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
    <path
      d="M10 20h28l-3 14H13L10 20z"
      stroke="white"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <path
      d="M8 20c0-6 4-12 16-12s16 6 16 12"
      stroke="white"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <circle cx="18" cy="30" r="2" fill="white" />
    <circle cx="30" cy="30" r="2" fill="white" />
  </svg>
);

/* ───────── Cards Data ───────── */

const cards = [
  {
    id: 1,
    image:
      "https://res.cloudinary.com/dquki4xol/image/upload/v1775025838/Learning-scaled_aprtia.jpg",
    Icon: EducationIcon,
    title: "Education Support",
    desc:
      "Providing essential educational resources for those in need, with compassion and support.",
  },
  {
    id: 2,
    image:
      "https://res.cloudinary.com/dquki4xol/image/upload/v1782912104/WhatsApp_Image_2026-07-01_at_6.50.58_PM_xkg7xy.jpg",
    Icon: FoodIcon,
    title: "Food Support",
    desc:
      "Offering nutritious food to families and individuals, ensuring no one goes hungry.",
  },
];

/* ───────── Component ───────── */

export default function ServicesSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-[#f0ece4] py-16 px-4">
      <div className="max-w-[1920px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">

        {/* Service Cards */}
        {cards.map(({ id, image, Icon, title, desc }) => (
          <div
            key={id}
            className="bg-white rounded-2xl shadow-sm flex flex-col group overflow-visible"
          >
            {/* Image */}
            <div className="relative h-52 rounded-t-2xl overflow-hidden">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Icon Badge */}
            <div className="flex justify-center -mt-7 relative z-10">
              <div className="relative flex items-center justify-center">

                {/* Dashed Circle */}
                <svg
                  width="72"
                  height="72"
                  viewBox="0 0 72 72"
                  className="absolute"
                >
                  <circle
                    cx="36"
                    cy="36"
                    r="33"
                    stroke="#E8A030"
                    strokeWidth="1.5"
                    strokeDasharray="5 4"
                    fill="none"
                  />
                </svg>

                {/* Icon Background */}
                <div className="w-14 h-14 rounded-full bg-[#E8A030] flex items-center justify-center shadow-md">
                  <Icon />
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="pt-4 pb-7 px-6 text-center flex-1 flex flex-col justify-center">
              <h3 className="text-[#1a3328] font-bold text-base mb-2">
                {title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}

        {/* CTA Card */}
        <div className="rounded-2xl overflow-hidden relative flex flex-col justify-between min-h-95">

          {/* Background Image */}
          <img
            src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600&q=80"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-[#0d2a1f]/80"></div>

          {/* Content */}
          <div className="relative z-10 p-8 flex flex-col justify-between h-full">
            <div>
              <h2 className="text-white text-2xl font-extrabold leading-snug mb-3">
                Contribute Today To Make A Difference
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Your contribution makes change possible today.
              </p>
            </div>

            
            {/* Button */}
            <button
              onClick={() => navigate("/Donation")}
              className="w-full bg-[#E8522A] hover:bg-[#cf4521] text-white font-bold text-xs tracking-widest uppercase px-6 py-3.5 rounded-lg transition-colors"
            >
              Join Us Now!
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}