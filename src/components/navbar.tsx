import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const VolunteerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="7" r="3" fill="#E8A030" />
    <circle cx="15" cy="7" r="3" fill="#E8A030" />
    <path d="M3 19c0-3.87 2.69-7 6-7h6c3.31 0 6 3.13 6 7" stroke="#E8A030" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="#E8A030" strokeWidth="2" />
    <path d="M2 8l10 7 10-7" stroke="#E8A030" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24c1.12.37 2.33.57 3.6.57a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1C9.4 20 4 14.6 4 8a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.03L6.6 10.8z" fill="#E8A030" />
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ── Govt. registration verified badge icon (shield + check) ──
const ShieldCheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <path
      d="M12 2.5l7.5 3v5.2c0 4.9-3.2 9.28-7.5 10.8-4.3-1.52-7.5-5.9-7.5-10.8V5.5l7.5-3z"
      fill="#E8522A" fillOpacity="0.14" stroke="#E8522A" strokeWidth="1.3" strokeLinejoin="round"
    />
    <path d="M8.5 12.2l2.3 2.3 4.7-4.9" stroke="#E8522A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const NAV_LINKS = [
  { label: "Home",    to: "/" },
  { label: "About",   to: "/about" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
];

const activeCls  = "text-[#E8522A]";
const defaultCls = "text-black hover:text-[#E8522A] transition-colors";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="w-full font-sans">

      {/* Top Bar */}
      <div className="bg-[#1a3328] text-white px-6 py-2.5 flex items-center justify-between text-sm flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <VolunteerIcon />
          <span className="text-gray-300 tracking-wide text-xs">
            LET'S HELP OTHERS :{" "}
            <Link to="/VolunteerPage" className="font-bold text-white hover:text-[#E8A030] transition-colors">
              BECOME A VOLUNTEER
            </Link>
          </span>
        </div>

        <div className="flex items-center gap-5">
          <a href="mailto:info@kindflow.com"
             className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors text-xs">
            <MailIcon /> aabhyafoundation1@gmail.com
          </a>
          <span className="text-gray-600 hidden sm:inline">|</span>
          <a href="tel:4236435345"
             className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors text-xs">
            <PhoneIcon /> 8514984882
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white shadow-md px-4 py-2 flex items-center justify-between relative z-20">

        <Link to="/" className="flex flex-col items-center gap-1 shrink-0">
          <img
            src={"https://res.cloudinary.com/dquki4xol/image/upload/v1782213583/ChatGPT_Image_Jun_23__2026__04_47_33_PM-removebg-preview_n55snw.png"}
            className="h-20 w-auto object-contain"
          />
          <span
            className="inline-flex items-center gap-1 bg-[#fdece6] border border-[#E8522A]/25
                       rounded-full pl-1.5 pr-2.5 py-0.5 -mt-1"
          >
            <ShieldCheckIcon />
            <span className="text-[9px] font-bold tracking-wide text-[#E8522A] whitespace-nowrap">
              Govt. Reg. No.: IV-230500039/2026
            </span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, to }) => (
            <NavLink
              key={label}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `relative font-medium text-base transition-colors group ${isActive ? activeCls : defaultCls}`
              }
            >
              {({ isActive }) => (
                <>
                  {label}
                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] bg-[#E8522A] transition-all duration-300
                               ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/VolunteerPage"
            className="inline-flex items-center justify-center bg-white hover:bg-[#1a3328]
                       border-2 border-[#1a3328] text-[#1a3328] hover:text-white
                       font-bold text-xs px-5 h-10 rounded-md
                       tracking-wide transition-all duration-200 uppercase whitespace-nowrap
                       hover:shadow-md hover:-translate-y-0.5"
          >
            Volunteers
          </Link>

          <Link
            to="/Donation"
            className="inline-flex items-center justify-center bg-[#E8522A] hover:bg-[#cf4521]
                       text-white font-bold text-xs px-5 h-10 rounded-md
                       tracking-wide transition-all duration-200 uppercase whitespace-nowrap
                       shadow-sm shadow-[#E8522A]/30 hover:shadow-lg hover:shadow-[#E8522A]/40
                       hover:-translate-y-0.5"
          >
            Donate Now
          </Link>
        </div>

        <button
          className="md:hidden text-gray-700 hover:text-[#E8522A] transition-colors"
          onClick={() => setMobileOpen(o => !o)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4
                        flex flex-col gap-4 shadow-md animate-[navMobileIn_0.25s_ease]">
          <style>{`
            @keyframes navMobileIn {
              from { opacity: 0; transform: translateY(-8px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>
          {NAV_LINKS.map(({ label, to }) => (
            <NavLink
              key={label}
              to={to}
              end={to === "/"}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `font-medium text-sm transition-colors ${isActive ? activeCls : "text-gray-700 hover:text-[#E8522A]"}`
              }
            >
              {label}
            </NavLink>
          ))}

          <Link
            to="/VolunteerPage"
            onClick={() => setMobileOpen(false)}
            className="inline-flex justify-center items-center bg-white border-2 border-[#1a3328]
                       text-[#1a3328] font-bold text-sm h-10 rounded-md
                       tracking-wide transition-colors uppercase mt-2"
          >
            Volunteers
          </Link>

          <Link
            to="/Donation"
            onClick={() => setMobileOpen(false)}
            className="inline-flex justify-center items-center bg-[#E8522A] hover:bg-[#cf4521]
                       text-white font-bold text-sm h-10 rounded-md
                       tracking-wide transition-colors uppercase
                       shadow-sm shadow-[#E8522A]/30"
          >
            Donate Now
          </Link>
        </div>
      )}
    </div>
  );
}