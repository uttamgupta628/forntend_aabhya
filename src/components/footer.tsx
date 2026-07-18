import { useState } from "react";
import { Link } from "react-router-dom";
import { apiPost, ApiError } from "../lib/api";


const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none" />
  </svg>
);
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.25 2.25h6.863l4.268 5.641L18.244 2.25zM17.083 19.77h1.833L7.084 4.126H5.117z" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#E8522A">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#E8522A">
    <path d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24c1.12.37 2.33.57 3.6.57a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1C9.4 20 4 14.6 4 8a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.03L6.6 10.8z" />
  </svg>
);
const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#E8522A">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);
const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E8522A"
       strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

// ── Govt. registration verified badge icon (shield + check) ──
const ShieldCheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <path
      d="M12 2.5l7.5 3v5.2c0 4.9-3.2 9.28-7.5 10.8-4.3-1.52-7.5-5.9-7.5-10.8V5.5l7.5-3z"
      fill="#E8522A" fillOpacity="0.18" stroke="#E8A030" strokeWidth="1.3" strokeLinejoin="round"
    />
    <path d="M8.5 12.2l2.3 2.3 4.7-4.9" stroke="#E8A030" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PAGES_LINKS = [
  { label: "Home",       to: "/" },
  { label: "About",      to: "/about" },
  { label: "Gallery",    to: "/gallery" },
  { label: "Donation",   to: "/Donation" },
  { label: "Volunteer",  to: "/VolunteerPage" },
  { label: "Contact Us", to: "/contact" },
];

const SERVICES_LINKS = [
  { label: "Community Support",   to: "/contact" },
  { label: "Food & Nutrition",    to: "/Donation" },
  { label: "Education Programs",  to: "/Donation" },
  { label: "Women Empowerment",   to: "/Donation" },
];

// 👉 Social media links ka placeholder — apna actual URL yahan daalein
const SOCIAL_LINKS = [
  { label: "Facebook",  Icon: FacebookIcon,  href: "https://www.facebook.com/share/14cQu3oySUp/" },
  { label: "Instagram", Icon: InstagramIcon, href: "https://www.instagram.com/aabhya_foundation?igsh=MXZ0dXFzOXN6NHhneg==" },
   { label: "X",         Icon: XIcon,         href: "https://x.com/yourhandle" },
];

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleNewsletterSubscribe() {
    if (newsletterSubmitting || !newsletterEmail) return;
    setNewsletterStatus(null);
    setNewsletterSubmitting(true);
    try {
      const res = await apiPost<{ message: string }>("/api/newsletter", { email: newsletterEmail });
      setNewsletterStatus({ type: "success", text: res.message || "Subscribed successfully!" });
      setNewsletterEmail("");
    } catch (err) {
      const text = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      setNewsletterStatus({ type: "error", text });
    } finally {
      setNewsletterSubmitting(false);
    }
  }

  return (
    <footer className="bg-[#0d2a1f] text-white">

      {/* ── Main content: 4 columns ── */}
      <div className="max-w-7xl mx-auto px-8 pt-7 pb-7">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr_1fr_1.5fr] gap-10 text-left">

          {/* COL 1 — Logo + tagline + socials */}
          <div className="flex flex-col">
            <Link to="/">
              <img src={"https://res.cloudinary.com/dquki4xol/image/upload/v1782214369/aabhya_logo_n9ugcz.png"} className="h-auto  w-auto object-cover mb-2" />
            </Link>

            {/* Govt. registration badge */}
            <div
              className="inline-flex items-center gap-1.5 self-start bg-[#1a3728]
                         border border-[#E8A030]/30 rounded-full pl-2 pr-3 py-1 mb-5"
            >
              <ShieldCheckIcon />
              <span className="text-[10px] font-bold tracking-wide text-[#E8A030] whitespace-nowrap">
                Govt. Reg. No.: IV-230500039/2026
              </span>
            </div>

            <p className="text-gray-300 text-xs leading-relaxed mb-5 uppercase ">
              Together, we can make a difference today. Join our community and help
              create lasting change for those in need.
            </p>
            <div className="w-24 h-0.5 bg-[#E8522A] mb-5" />
            <p className="text-white text-[11px] font-bold tracking-widest uppercase mb-3">
              Socials
            </p>
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map(({ label, Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-[#1a3728] border border-gray-600
                              flex items-center justify-center
                              hover:bg-[#E8522A] hover:border-[#E8522A]
                              transition-all duration-200"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
          

          {/* COL 2 — Pages */}
          <div>
            <h4 className="text-white font-extrabold text-sm tracking-widest uppercase mb-5">
              Pages
            </h4>
            <ul className="space-y-2.5">
              {PAGES_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to}
                        className="flex items-center gap-2 text-gray-300 text-sm
                                   hover:text-[#E8522A] transition-colors">
                    <ArrowRight /> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COL 3 — What We Do */}
          <div>
            <h4 className="text-white font-extrabold text-sm tracking-widest uppercase mb-5">
              What We Do
            </h4>
            <ul className="space-y-2.5">
              {SERVICES_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to}
                        className="flex items-center gap-2 text-gray-300 text-sm
                                   hover:text-[#E8522A] transition-colors">
                    <ArrowRight /> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COL 4 — Contact Info + Newsletter stacked below */}
          <div className="flex flex-col gap-6">

            {/* Contact rows */}
            <div className="flex flex-col gap-0">
              {/* Address */}
              <div className="flex items-start gap-3 pb-4">
                <span className="mt-0.5 shrink-0"><MapPinIcon /></span>
                <p className="text-gray-300 text-xs leading-relaxed uppercase tracking-wide">
                 Shree Appartment,Sadanand Chakraborty Lane, Near Shyam Mandir,713347, WestBengal,India
                </p>
              </div>
              <div className="h-px bg-white/10 mb-4" />

              {/* Email */}
              <div className="flex items-center gap-3 pb-4">
                <span className="shrink-0"><MailIcon /></span>
                <a href="mailto:info@kindflow.com"
                   className="text-gray-300 text-xs uppercase tracking-wide
                              hover:text-[#E8522A] transition-colors">
                  example@123.com
                </a>
              </div>
              <div className="h-px bg-white/10 mb-4" />

              {/* Phone */}
              <div className="flex items-center gap-3">
                <span className="shrink-0"><PhoneIcon /></span>
                <a href="tel:4236435345"
                   className="text-gray-300 text-xs uppercase tracking-wide
                              hover:text-[#E8522A] transition-colors">
                 +91 8514984882
                </a>
              </div>
            </div>

            {/* ── Newsletter — stacked below contact ── */}
            <div className="flex flex-col gap-3 pt-2">
              <h4 className="text-white font-bold text-sm tracking-widest uppercase ">
              Sign Up For Our Latest News
              </h4>

              <div className="flex items-center bg-white rounded-lg overflow-hidden border border-gray-200">
                <input
                  type="email"
                  placeholder="Your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-transparent px-4 py-3 text-sm text-gray-600
                             placeholder-gray-400 outline-none min-w-0"
                />
                <button
                  onClick={handleNewsletterSubscribe}
                  disabled={newsletterSubmitting}
                  className="bg-[#E8522A] hover:bg-[#cf4521] text-white font-bold
                                   text-[10px] tracking-widest px-5 py-3 transition-colors
                                   uppercase shrink-0 disabled:opacity-60 disabled:cursor-not-allowed">
                  {newsletterSubmitting ? "..." : "Subscribe"}
                </button>
              </div>

              {newsletterStatus && (
                <p
                  className={`text-[11px] font-semibold ${
                    newsletterStatus.type === "success" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {newsletterStatus.text}
                </p>
              )}

              <p className="text-gray-400 text-[11px] leading-relaxed">
                By clicking Subscribe, you are agreeing to our{" "}
                <a href="#" className="text-[#E8522A] hover:underline">
                Privacy&amp;Cookie Policy
                </a>.
              </p>
            </div>

          </div>
          {/* END COL 4 */}

        </div>
      </div>

      {/* ── Copyright bar ── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-5 text-center text-xs text-gray-400">
          ©2026–2027 AabhyaFoundation | All Rights Reserved
        </div>
      </div>

    </footer>
  );
}