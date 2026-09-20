import { useState, type FormEvent } from 'react';
import { submitRSVP, type RSVPData } from '@/lib/rsvp';
import { SectionOrnament, FloralDivider, BotanicalCorner } from '@/components/Decorations';
import {
  Minus,
  Plus,
  Check,
  X,
  Heart,
  Loader2,
} from 'lucide-react';

type Errors = Partial<Record<keyof RSVPData | 'email' | 'submit', string>>;

const COUNTRIES = [
  { code: '+250', name: 'Rwanda', flag: '🇷🇼' },
  { code: '+254', name: 'Kenya', flag: '🇰🇪' },
  { code: '+256', name: 'Uganda', flag: '🇺🇬' },
  { code: '+255', name: 'Tanzania', flag: '🇹🇿' },
  { code: '+1', name: 'United States', flag: '🇺🇸' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: '+33', name: 'France', flag: '🇫🇷' },
  { code: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: '+27', name: 'South Africa', flag: '🇿🇦' },
  { code: '+234', name: 'Nigeria', flag: '🇳🇬' },
  { code: '+91', name: 'India', flag: '🇮🇳' },
  { code: '+971', name: 'UAE', flag: '🇦🇪' },
];

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs font-light text-[#a0522d]">{message}</p>;
}

const inputClass =
  'w-full rounded-lg border border-line bg-paper/70 px-4 py-3 font-body text-sm text-dark-brown placeholder:text-warm-gray/60 transition-colors focus:border-gold/50 focus:bg-paper';

export function RSVPForm() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState(COUNTRIES[0].code);
  const [email, setEmail] = useState('');
  const [attending, setAttending] = useState<boolean | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): Errors => {
    const e: Errors = {};
    if (!fullName.trim()) e.fullName = 'Please tell us your name.';
    else if (fullName.trim().length < 2) e.fullName = 'Your name seems a little short.';

    if (!phone.trim()) e.phone = 'A phone number helps us reach you.';
    else if (phone.replace(/\D/g, '').length < 5) e.phone = 'That number looks incomplete.';

    if (email.trim()) {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
      if (!ok) e.email = 'Please enter a valid email address.';
    }

    if (attending === null) e.attending = 'Please let us know if you can make it.';
    if (guestCount < 1) e.guestCount = 'At least one guest is required.';
    return e;
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    setSubmitError(null);
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSubmitting(true);
    const result = await submitRSVP({
      fullName: fullName.trim(),
      phone: `${countryCode} ${phone.trim()}`,
      email: email.trim() || undefined,
      attending: attending ?? false,
      guestCount,
      message: message.trim() || undefined,
    });
    setSubmitting(false);

    if (result.ok) setSuccess(true);
    else setSubmitError(result.error ?? 'Something went wrong. Please try again.');
  };

  if (success) {
    return (
      <div className="reveal mx-auto max-w-md rounded-2xl border border-line bg-paper/90 px-8 py-14 text-center shadow-[0_18px_40px_-28px_rgba(81,72,63,0.5)]">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold">
          <Check size={26} strokeWidth={1.5} />
        </div>
        <h3 className="mt-6 font-display text-3xl text-dark-brown">Thank you!</h3>
        <p className="mt-3 font-body text-sm font-light leading-relaxed text-muted-brown">
          We can’t wait to celebrate with you.
        </p>
        <div className="mt-8 flex justify-center">
          <FloralDivider className="w-48 text-muted-brown/70" />
        </div>
        <button
          type="button"
          onClick={() => {
            setSuccess(false);
            setFullName('');
            setPhone('');
            setEmail('');
            setAttending(null);
            setGuestCount(1);
            setMessage('');
            setErrors({});
          }}
          className="mt-8 font-body text-xs uppercase tracking-[0.2em] text-warm-gray underline-offset-4 hover:underline"
        >
          Send another RSVP
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="reveal mx-auto max-w-md rounded-2xl border border-line bg-paper/90 px-6 py-10 text-left shadow-[0_18px_40px_-28px_rgba(81,72,63,0.5)] sm:px-9"
    >
      {/* Full name */}
      <div>
        <label htmlFor="rsvp-name" className="mb-2 block font-body text-xs uppercase tracking-[0.18em] text-warm-gray">
          Full name <span className="text-gold">*</span>
        </label>
        <input
          id="rsvp-name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your name"
          className={inputClass}
          aria-invalid={!!errors.fullName}
          autoComplete="name"
        />
        <FieldError message={errors.fullName} />
      </div>

      {/* Phone */}
      <div className="mt-5">
        <label htmlFor="rsvp-phone" className="mb-2 block font-body text-xs uppercase tracking-[0.18em] text-warm-gray">
          Phone number <span className="text-gold">*</span>
        </label>
        <div className="flex gap-2">
          <div className="relative">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              aria-label="Country code"
              className={`h-full min-w-[5.5rem] shrink-0 appearance-none rounded-lg border border-line bg-paper/70 px-3 py-3 pr-7 font-body text-sm text-dark-brown whitespace-nowrap transition-colors focus:border-gold/50 ${
                errors.phone ? 'border-[#c98b6a]' : ''
              }`}
            >
              {COUNTRIES.map((c) => (
                <option key={c.code + c.name} value={c.code}>
                  {c.flag} {c.code}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-warm-gray">▾</span>
          </div>
          <input
            id="rsvp-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="788 123 456"
            className={inputClass}
            aria-invalid={!!errors.phone}
            autoComplete="tel-national"
          />
        </div>
        <FieldError message={errors.phone} />
      </div>

      {/* Email */}
      <div className="mt-5">
        <label htmlFor="rsvp-email" className="mb-2 block font-body text-xs uppercase tracking-[0.18em] text-warm-gray">
          Email
        </label>
        <input
          id="rsvp-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="youremail.com"
          className={`${inputClass} ${errors.email ? 'border-[#c98b6a]' : ''}`}
          aria-invalid={!!errors.email}
          autoComplete="email"
        />
        <FieldError message={errors.email} />
      </div>

      {/* Attendance */}
      <fieldset className="mt-5">
        <legend className="mb-2 block font-body text-xs uppercase tracking-[0.18em] text-warm-gray">
          Will you attend? <span className="text-gold">*</span>
        </legend>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label
            className={`flex flex-1 cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
              attending === true
                ? 'border-gold/60 bg-gold/10'
                : 'border-line bg-paper/60 hover:border-gold/40'
            }`}
          >
            <input
              type="radio"
              name="attending"
              value="yes"
              checked={attending === true}
              onChange={() => setAttending(true)}
              className="sr-only"
            />
            <span className={`grid h-5 w-5 place-items-center rounded-full border ${attending === true ? 'border-gold bg-gold/20 text-gold' : 'border-line text-transparent'}`}>
              <Check size={12} strokeWidth={2} />
            </span>
            <span className="font-body text-sm text-dark-brown">Yes, I will attend</span>
          </label>
          <label
            className={`flex flex-1 cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
              attending === false
                ? 'border-gold/60 bg-gold/10'
                : 'border-line bg-paper/60 hover:border-gold/40'
            }`}
          >
            <input
              type="radio"
              name="attending"
              value="no"
              checked={attending === false}
              onChange={() => setAttending(false)}
              className="sr-only"
            />
            <span className={`grid h-5 w-5 place-items-center rounded-full border ${attending === false ? 'border-gold bg-gold/20 text-gold' : 'border-line text-transparent'}`}>
              <X size={12} strokeWidth={2} />
            </span>
            <span className="font-body text-sm text-dark-brown">No, I can’t attend</span>
          </label>
        </div>
        <FieldError message={errors.attending} />
      </fieldset>

      {/* Guests */}
      <div className="mt-5">
        <label className="mb-2 block font-body text-xs uppercase tracking-[0.18em] text-warm-gray">
          Number of guests (including yourself)
        </label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setGuestCount((n) => Math.max(1, n - 1))}
            aria-label="Decrease guest count"
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-paper text-muted-brown transition-colors hover:border-gold/40"
          >
            <Minus size={16} strokeWidth={1.4} />
          </button>
          <span className="min-w-[2rem] text-center font-display text-2xl text-dark-brown" aria-live="polite">
            {guestCount}
          </span>
          <button
            type="button"
            onClick={() => setGuestCount((n) => Math.min(12, n + 1))}
            aria-label="Increase guest count"
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-paper text-muted-brown transition-colors hover:border-gold/40"
          >
            <Plus size={16} strokeWidth={1.4} />
          </button>
        </div>
        <FieldError message={errors.guestCount} />
      </div>

      {/* Message */}
      <div className="mt-5">
        <label htmlFor="rsvp-message" className="mb-2 block font-body text-xs uppercase tracking-[0.18em] text-warm-gray">
          Message for the couple (optional)
        </label>
        <textarea
          id="rsvp-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write us a few words..."
          rows={4}
          className={`${inputClass} resize-none`}
        />
      </div>

      {submitError && (
        <p role="alert" className="mt-5 rounded-lg border border-[#c98b6a]/40 bg-[#c98b6a]/10 px-4 py-3 text-xs text-[#8a4b2f]">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-full border border-gold/50 bg-gold/15 px-6 py-3.5 font-body text-sm uppercase tracking-[0.2em] text-dark-brown transition-all hover:bg-gold/25 disabled:opacity-60"
      >
        {submitting ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Heart size={15} strokeWidth={1.5} />
        )}
        {submitting ? 'Sending…' : 'Send RSVP'}
      </button>
    </form>
  );
}

export function RSVPSection() {
  return (
    <section id="rsvp" className="paper-grain relative bg-ivory px-6 py-24">
      <BotanicalCorner className="absolute left-0 top-10 w-32 text-muted-brown/30 sm:w-44" />
      <BotanicalCorner className="absolute bottom-10 right-0 w-32 text-muted-brown/30 sm:w-44" flip />

      <div className="mx-auto max-w-invite">
        <div className="text-center">
          <p className="reveal font-body text-[0.62rem] uppercase tracking-[0.34em] text-warm-gray">
            Kindly respond
          </p>
          <h2 className="reveal mt-4 font-display text-4xl text-dark-brown sm:text-5xl">
            We can’t wait to celebrate with you
          </h2>
          <p className="reveal mt-4 mx-auto max-w-sm font-body text-sm font-light leading-relaxed text-muted-brown">
            Let us know if you’ll be joining us so we can prepare a seat at the table
            with your name on it.
          </p>
          <div className="reveal mt-6 flex justify-center">
            <SectionOrnament />
          </div>
        </div>

        <RSVPForm />
      </div>
    </section>
  );
}
