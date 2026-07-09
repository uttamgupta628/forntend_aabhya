// components/FloatingWhatsApp.tsx

const WHATSAPP_NUMBER = "918514984882"; // country code + number, no + or spaces
const DEFAULT_MESSAGE = "Hi! I'd like to know more about your work.";

const WhatsAppIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
    <path d="M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.1.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5-.1-.1-.6-1.4-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1s1 2.5 1.1 2.6c.1.2 2 3 4.7 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.6-.7 1.9-1.3.2-.6.2-1.1.2-1.3-.1-.1-.3-.2-.6-.3z" />
    <path d="M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.6 1.4 5.1L2 22l5.1-1.3c1.4.8 3.1 1.3 4.9 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.2c-1.6 0-3.1-.4-4.5-1.2l-.3-.2-3.3.9.9-3.2-.2-.3C3.9 14.4 3.4 12.7 3.4 12c0-4.7 3.9-8.6 8.6-8.6 4.7 0 8.6 3.9 8.6 8.6s-3.9 8.6-8.6 8.6z" />
  </svg>
);

export default function FloatingWhatsApp() {
  const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-[100] group"
    >
      <span className="relative flex items-center justify-center w-16 h-16">
        {/* Outer soft ring */}
        <span className="absolute inset-0 rounded-full bg-white shadow-md" />
        <span className="absolute inset-[3px] rounded-full border-2 border-[#f3b795]" />

        {/* Ping animation */}
        <span className="absolute inset-[7px] rounded-full bg-[#e8490f]/40 animate-ping" />

        {/* Solid orange circle */}
        <span
          className="relative flex items-center justify-center w-[52px] h-[52px] rounded-full
                     bg-[#e8490f] shadow-lg transition-transform duration-200
                     group-hover:scale-105"
        >
          <WhatsAppIcon />
        </span>
      </span>
    </a>
  );
}