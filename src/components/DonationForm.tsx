import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { apiGet, apiPost, apiPut, ApiError } from "../lib/api";

type CauseType = "" | "general" | "food" | "clothes" | "education" | "medical";
type YesNo = "" | "yes" | "no";
type PaymentMethod = "card" | "upi";

const CAUSE_OPTIONS: { value: CauseType; label: string }[] = [
  { value: "",          label: "Select One Option" },
  { value: "general",   label: "General Donation" },
  { value: "food",      label: "Food" },
  { value: "clothes",   label: "Clothes" },
  { value: "education", label: "Education" },
  { value: "medical",   label: "Medical Aids" },
];

const HandIcon = () => (
  <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
    {/* Heart */}
    <path
      d="M12 8.6c-.9-1.6-2.4-2.4-3.9-2.1-1.8.3-3 1.9-2.9 3.7.2 3 3.7 5.4 6.8 7.4 3.1-2 6.6-4.4 6.8-7.4.1-1.8-1.1-3.4-2.9-3.7-1.5-.3-3 .5-3.9 2.1z"
      fill="#e8490f"
    />
    {/* Cupped hand underneath */}
    <path
      d="M4 15.5c0-.9.7-1.5 1.5-1.5h13c.8 0 1.5.6 1.5 1.5 0 2.6-1.7 4.8-4.2 5.6-1.2.4-2.5.6-3.8.6s-2.6-.2-3.8-.6c-2.5-.8-4.2-3-4.2-5.6z"
      stroke="#e8490f" strokeWidth="1.6" strokeLinejoin="round"
    />
  </svg>
);

export default function DonationForm() {
  const [cause,       setCause]       = useState<CauseType>("");
  const [amount,      setAmount]      = useState("");
  const [name,        setName]        = useState("");
  const [email,       setEmail]       = useState("");
  const [phone,       setPhone]       = useState("");
  const [aadhar,      setAadhar]      = useState("");
  const [taxBenefit,  setTaxBenefit]  = useState<YesNo>("");
  const [citizen,     setCitizen]     = useState<YesNo>("");
  const [agreed,      setAgreed]      = useState(false);
  const [submitting,  setSubmitting]  = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // ── UPI payment ──
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [upiId, setUpiId] = useState<string | null>(null);
  const [upiPayeeName, setUpiPayeeName] = useState("Aabhya Foundation");
  const [upiModalOpen, setUpiModalOpen] = useState(false);
  const [donationId, setDonationId] = useState<string | null>(null);
  const [utrValue, setUtrValue] = useState("");
  const [utrSubmitting, setUtrSubmitting] = useState(false);
  const [utrSubmitted, setUtrSubmitted] = useState(false);
  const [utrError, setUtrError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<{ success: boolean; data: { upiId: string | null; upiPayeeName: string } }>(
      "/api/config/payment"
    )
      .then((res) => {
        setUpiId(res.data.upiId);
        setUpiPayeeName(res.data.upiPayeeName);
      })
      .catch(() => setUpiId(null));
  }, []);

  const causeLabel = CAUSE_OPTIONS.find((c) => c.value === cause)?.label;
  const upiUri = upiId
    ? `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiPayeeName)}&am=${encodeURIComponent(
        amount || "0"
      )}&cu=INR&tn=${encodeURIComponent(causeLabel ? `Donation - ${causeLabel}` : "Donation")}`
    : "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed || submitting) return;
    setStatus(null);
    setSubmitting(true);
    try {
      const res = await apiPost<{ message: string; paymentLink: string | null; data?: { _id?: string } }>(
        "/api/donations",
        { cause, amount, name, email, phone, aadhar, taxBenefit, citizen, paymentMethod }
      );

      if (paymentMethod === "upi") {
        setDonationId(res.data?._id || null);
        setUtrValue("");
        setUtrSubmitted(false);
        setUtrError(null);
        setUpiModalOpen(true);
      } else if (res.paymentLink) {
        // Send the donor straight to Stripe Checkout
        window.location.href = res.paymentLink;
        return;
      } else {
        setStatus({ type: "success", text: res.message || "Donation request received!" });
      }
    } catch (err) {
      const text = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      setStatus({ type: "error", text });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUtrSubmit() {
    if (!donationId || !utrValue.trim()) {
      setUtrError("Please enter your transaction reference number");
      return;
    }
    setUtrError(null);
    setUtrSubmitting(true);
    try {
      const res = await apiPut<{ message: string }>(
        `/api/donations/${donationId}/utr`,
        { utrReference: utrValue.trim() }
      );
      setUtrSubmitted(true);
      setStatus({ type: "success", text: res.message || "Thanks! We'll verify and confirm your donation." });
    } catch (err) {
      const text = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      setUtrError(text);
    } finally {
      setUtrSubmitting(false);
    }
  }

  function closeUpiModal() {
    setUpiModalOpen(false);
    setDonationId(null);
    setUtrValue("");
    setUtrSubmitted(false);
    setUtrError(null);
  }

  const label = "block text-sm font-bold text-[#e8490f] mb-1.5";

  const inp =
    "w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-sm text-gray-700 " +
    "placeholder:text-gray-400 focus:outline-none focus:border-[#e8490f] " +
    "focus:ring-2 focus:ring-[#e8490f]/10 transition-colors bg-white";

  const select =
    "w-full border rounded-md px-3.5 py-2.5 text-sm text-gray-700 bg-white " +
    "focus:outline-none focus:ring-2 focus:ring-[#e8490f]/10 transition-colors appearance-none " +
    "border-[#e8490f]";

  const RadioRow = ({
    value, onChange,
  }: { value: YesNo; onChange: (v: YesNo) => void }) => (
    <div className="flex items-center gap-6 mt-1.5">
      {(["yes", "no"] as const).map(opt => (
        <label key={opt} className="flex items-center gap-2 cursor-pointer group">
          <div
            onClick={() => onChange(opt)}
            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
              ${value === opt ? "border-[#e8490f]" : "border-gray-300 group-hover:border-gray-400"}`}
          >
            {value === opt && <div className="w-2 h-2 rounded-full bg-[#e8490f]" />}
          </div>
          <span className="text-sm text-gray-700 capitalize">{opt}</span>
        </label>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-3xl mx-auto p-8">

        {/* ── Heading ── */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold !text-[#e8490f] tracking-wide">
            DONATION NOW
          </h2>
          <div className="flex justify-center mt-2">
            <HandIcon />
          </div>
        </div>

        {/* ── Payment Method ── */}
        <div className="mb-6">
          <label className={label}>Payment Method *</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod("card")}
              className={`flex items-center justify-center gap-2 py-3 rounded-md border-2 text-sm font-semibold transition-colors
                ${paymentMethod === "card"
                  ? "border-[#e8490f] bg-[#fde8e8] text-[#0d2b2b]"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
              </svg>
              Card / Online
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("upi")}
              disabled={!upiId}
              title={!upiId ? "UPI isn't configured yet" : undefined}
              className={`flex items-center justify-center gap-2 py-3 rounded-md border-2 text-sm font-semibold transition-colors
                ${paymentMethod === "upi"
                  ? "border-[#e8490f] bg-[#fde8e8] text-[#0d2b2b]"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"}
                ${!upiId ? "opacity-40 cursor-not-allowed hover:border-gray-200" : ""}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/>
                <rect x="4" y="14" width="6" height="6"/><line x1="14" y1="14" x2="20" y2="14"/>
                <line x1="14" y1="20" x2="20" y2="20"/><line x1="17" y1="14" x2="17" y2="20"/>
              </svg>
              UPI (QR Code)
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-x-8 gap-y-5">

          {/* I Want to Donate for */}
          <div>
            <label className={label}>I Want to Donate for *</label>
            <select
              className={select}
              value={cause}
              onChange={e => setCause(e.target.value as CauseType)}
            >
              {CAUSE_OPTIONS.map(({ value, label: l }) => (
                <option key={value || "placeholder"} value={value}>{l}</option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className={label}>Amount Donation In Number</label>
            <input
              className={inp}
              type="number"
              placeholder="Amount Donation*"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              min="1"
            />
          </div>

          {/* Name */}
          <div>
            <label className={label}>Name</label>
            <input
              className={inp}
              placeholder="Enter Name*"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className={label}>Email</label>
            <input
              className={inp}
              type="email"
              placeholder="Enter Email*"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className={label}>Phone Number</label>
            <div className="flex">
              <span className="flex items-center gap-1 px-3 border border-r-0 border-gray-200
                               rounded-l-md bg-[#faf9f7] text-sm text-gray-600 shrink-0">
                🇮🇳 +91
              </span>
              <input
                className={inp + " rounded-l-none"}
                type="tel"
                placeholder="Phone Number*"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Aadhar Card Number */}
          <div>
            <label className={label}>Aadhar Card Number</label>
            <input
              className={inp}
              placeholder="Aadhar Card Number"
              value={aadhar}
              onChange={e => setAadhar(e.target.value)}
            />
          </div>

          {/* 80G Tax Benefit */}
          <div>
            <label className="block text-sm font-bold text-[#0d2b2b] mb-1.5">
              Do You Want 80G Tax Benefit
            </label>
            <RadioRow value={taxBenefit} onChange={setTaxBenefit} />
          </div>

          {/* Citizen In India */}
          <div>
            <label className="block text-sm font-bold text-[#0d2b2b] mb-1.5">
              Are You Citizen In India*
            </label>
            <RadioRow value={citizen} onChange={setCitizen} />
          </div>
        </div>

        {/* Note */}
        <p className="text-xs text-[#1a4fd6] leading-relaxed mt-5">
          Please Tick this Box if you are a Taxpayer in India and would like to avail Tax Benifits
          under 80G. To avail this, you need to Provide your PAN/Aadhar Number
        </p>

        {/* Agree + Submit */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-5">
          <label className="flex items-start gap-2.5 cursor-pointer group">
            <div
              onClick={() => setAgreed(!agreed)}
              className={`mt-0.5 w-4 h-4 min-w-[16px] rounded border-2 flex items-center justify-center transition-colors
                ${agreed ? "bg-[#e8490f] border-[#e8490f]" : "border-gray-300 group-hover:border-gray-400"}`}
            >
              {agreed && (
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
            <span className="text-xs text-gray-600 leading-relaxed">
              I agree and accept that donation are not refundable under any circumstances. *
            </span>
          </label>

          <button
            onClick={handleSubmit}
            disabled={!agreed || submitting}
            className={`shrink-0 px-8 py-3 rounded-md font-bold tracking-wide uppercase text-sm
                        text-white transition-colors duration-200 whitespace-nowrap
                        ${agreed && !submitting
                          ? "bg-[#e8490f] hover:bg-[#d43d09] cursor-pointer"
                          : "bg-[#e8490f]/50 cursor-not-allowed"}`}
          >
            {submitting ? "Processing..." : paymentMethod === "upi" ? "Show UPI QR Code" : "Donate Now"}
          </button>
        </div>

        {status && (
          <p
            className={`text-sm font-medium mt-4 text-center ${
              status.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {status.text}
          </p>
        )}

      </div>

      {/* ── UPI QR Modal ── */}
      {upiModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d2b2b]/60 backdrop-blur-sm px-4"
          onClick={closeUpiModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 sm:p-7 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[#e8490f] italic font-semibold tracking-widest text-xs uppercase mb-1">
              Scan To Pay
            </p>
            <h3 className="!text-[#0d2b2b] font-extrabold text-lg mb-4">
              ₹{Number(amount || 0).toLocaleString("en-IN")} via UPI
            </h3>

            <div className="flex justify-center mb-4">
              <div className="p-3 bg-white border-2 border-gray-100 rounded-xl">
                <QRCodeSVG value={upiUri} size={200} fgColor="#0d2b2b" />
              </div>
            </div>

            <p className="text-xs text-gray-400 mb-1">Scan with any UPI app, or on mobile:</p>
            <a
              href={upiUri}
              className="inline-block text-sm font-bold text-[#e8490f] hover:underline mb-4"
            >
              Tap to open your UPI app
            </a>

            <div className="flex items-center justify-center gap-2 bg-[#faf9f7] border border-gray-100 rounded-lg px-3 py-2 mb-5">
              <span className="text-xs text-gray-500 font-mono">{upiId}</span>
              <button
                type="button"
                onClick={() => {
                  if (upiId) navigator.clipboard.writeText(upiId);
                }}
                className="text-[#e8490f] text-xs font-bold hover:underline shrink-0"
              >
                Copy
              </button>
            </div>

            {utrSubmitted ? (
              <>
                <div className="flex flex-col items-center gap-2 mb-5 px-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-[#0d2b2b]">Reference submitted!</p>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    We'll verify your payment against this reference and confirm your donation shortly.
                    Thank you for your support!
                  </p>
                </div>

                <button
                  onClick={closeUpiModal}
                  className="w-full py-3 rounded-xl bg-[#0d2b2b] text-white font-bold
                             tracking-[0.15em] uppercase text-xs hover:bg-[#1a4040] transition-colors"
                >
                  Done
                </button>
              </>
            ) : (
              <>
                <div className="text-left mb-4">
                  <label className="block text-xs font-bold text-[#0d2b2b] mb-1.5">
                    Already paid? Enter your UPI transaction reference (UTR)
                  </label>
                  <input
                    type="text"
                    value={utrValue}
                    onChange={(e) => setUtrValue(e.target.value)}
                    placeholder="e.g. 123456789012"
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-700
                               placeholder:text-gray-400 focus:outline-none focus:border-[#e8490f]
                               focus:ring-2 focus:ring-[#e8490f]/10 transition-colors bg-[#faf9f7]"
                  />
                  <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed">
                    Found in your UPI app's payment history / success screen. This helps us match
                    your payment faster — we still verify it manually before confirming.
                  </p>
                  {utrError && (
                    <p className="text-[11px] font-semibold text-red-600 mt-1.5">{utrError}</p>
                  )}
                </div>

                <button
                  onClick={handleUtrSubmit}
                  disabled={utrSubmitting || !utrValue.trim()}
                  className="w-full py-3 rounded-xl bg-[#e8490f] text-white font-bold
                             tracking-[0.15em] uppercase text-xs hover:bg-[#d43d09]
                             disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-3"
                >
                  {utrSubmitting ? "Submitting..." : "Submit Reference"}
                </button>

                <button
                  onClick={closeUpiModal}
                  className="w-full py-3 rounded-xl bg-transparent text-gray-400 font-bold
                             tracking-[0.15em] uppercase text-xs hover:text-gray-600 transition-colors"
                >
                  I'll do this later
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}