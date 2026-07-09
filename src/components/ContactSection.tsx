// components/ContactSection.tsx
import { useState } from "react";
import { apiPost, ApiError } from "../lib/api";

export default function ContactSection() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", subject: "", message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setStatus(null);
    setSubmitting(true);
    try {
      const res = await apiPost<{ message: string }>("/api/contact", form);
      setStatus({ type: "success", text: res.message || "Message sent successfully!" });
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      const text = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      setStatus({ type: "error", text });
    } finally {
      setSubmitting(false);
    }
  }

  const inp =
    "w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-700 " +
    "placeholder:text-gray-400 focus:outline-none focus:border-[#e8490f] " +
    "focus:ring-2 focus:ring-[#e8490f]/10 transition-colors bg-white";

  const CONTACTS = [
    {
      label: "Call Us",
      value: "+91 8514984882",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>
        </svg>
      ),
    },
    {
      label: "Email",
      value: "example@123.com",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      ),
    },
    {
      label: "Location",
      value: "Shree Appartment,Sadanand Chakraborty Lane, Near Shyam Mandir,713347, WestBengal,India",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-[#f5f2eb] py-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 lg:gap-16 items-start">

        {/* ── LEFT ── */}
        <div className="md:w-[42%] text-left shrink-0 flex flex-col gap-8">

          {/* Text block */}
          <div>
            <p className="text-[#e8490f] font-bold italic tracking-wide text-sm mb-3"
               style={{ fontFamily: "'Georgia', serif" }}>
              CONTACT WITH US
            </p>
            <h2 className="!text-[#0d2b2b] font-extrabold leading-tight mb-4"
                style={{ fontSize: "clamp(1.7rem, 3vw, 2.2rem)", fontFamily: "'Georgia', serif" }}>
              Contribute Today,Change The Lives
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Join us in changing the world! Your assistance has the power to change lives and give people in need hope.
              Donate now to support our ongoing efforts and long-lasting effects.
            </p>
          </div>

          {/* Contact info card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
            {CONTACTS.map((c) => (
              <div key={c.label} className="flex items-start gap-4">
                {/* Icon circle */}
                <div className="w-10 h-10 rounded-full bg-[#0d2b2b] flex items-center justify-center shrink-0 mt-0.5">
                  {c.icon}
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#e8490f] mb-0.5">
                    {c.label}
                  </p>
                  <p className="text-sm font-semibold text-[#0d2b2b] leading-snug whitespace-pre-line">
                    {c.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT — form ── */}
        <div className="flex-1 bg-white rounded-2xl border text-left border-gray-100 shadow-sm p-6 sm:p-7">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Row 1: Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0d2b2b] mb-1.5">Name</label>
                <input
                  className={inp}
                  name="name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0d2b2b] mb-1.5">Email</label>
                <input
                  className={inp}
                  name="email"
                  type="email"
                  placeholder="Your email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Row 2: Phone + Subject */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#0d2b2b] mb-1.5">Phone</label>
                <input
                  className={inp}
                  name="phone"
                  type="tel"
                  placeholder="Your phone"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0d2b2b] mb-1.5">Subject</label>
                <input
                  className={inp}
                  name="subject"
                  placeholder="Your subject"
                  value={form.subject}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-semibold text-[#0d2b2b] mb-1.5">Message</label>
              <textarea
                className={`${inp} resize-none`}
                name="message"
                rows={5}
                placeholder="Write your message"
                value={form.message}
                onChange={handleChange}
              />
            </div>

            {/* Status message */}
            {status && (
              <p
                className={`text-sm font-medium ${
                  status.type === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {status.text}
              </p>
            )}

            {/* Submit */}
            <div className="flex justify-end mt-1">
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 rounded-xl bg-[#e8490f] text-white font-bold
                           tracking-[0.15em] uppercase text-sm hover:bg-[#d43d09]
                           transition-colors duration-200 shadow-sm disabled:opacity-60
                           disabled:cursor-not-allowed"
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
}