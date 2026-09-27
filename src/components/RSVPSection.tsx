import { useState, useRef, useEffect, type FormEvent } from 'react';
import { submitRSVP, type RSVPData } from '@/lib/rsvp';
import { SectionOrnament, FloralDivider, BotanicalCorner } from '@/components/Decorations';
import { useWeddingData } from '@/hooks/useWeddingData';
import {
  Minus,
  Plus,
  Check,
  X,
  Heart,
  Loader2,
  Search,
} from 'lucide-react';

type Errors = Partial<Record<keyof RSVPData | 'email' | 'submit', string>>;

export interface Country {
  code: string;
  name: string;
  flag: string;
}

export const COUNTRIES: Country[] = [
  { code: '+93', name: 'Afghanistan', flag: '🇦🇫' },
  { code: '+355', name: 'Albania', flag: '🇦🇱' },
  { code: '+213', name: 'Algeria', flag: '🇩🇿' },
  { code: '+1684', name: 'American Samoa', flag: '🇦🇸' },
  { code: '+376', name: 'Andorra', flag: '🇦🇩' },
  { code: '+244', name: 'Angola', flag: '🇦🇴' },
  { code: '+1264', name: 'Anguilla', flag: '🇦🇮' },
  { code: '+1268', name: 'Antigua and Barbuda', flag: '🇦🇬' },
  { code: '+54', name: 'Argentina', flag: '🇦🇷' },
  { code: '+374', name: 'Armenia', flag: '🇦🇲' },
  { code: '+297', name: 'Aruba', flag: '🇦🇼' },
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: '+43', name: 'Austria', flag: '🇦🇹' },
  { code: '+994', name: 'Azerbaijan', flag: '🇦🇿' },
  { code: '+1242', name: 'Bahamas', flag: '🇧🇸' },
  { code: '+973', name: 'Bahrain', flag: '🇧🇭' },
  { code: '+880', name: 'Bangladesh', flag: '🇧🇩' },
  { code: '+1246', name: 'Barbados', flag: '🇧🇧' },
  { code: '+375', name: 'Belarus', flag: '🇧🇾' },
  { code: '+32', name: 'Belgium', flag: '🇧🇪' },
  { code: '+501', name: 'Belize', flag: '🇧🇿' },
  { code: '+229', name: 'Benin', flag: '🇧🇯' },
  { code: '+1441', name: 'Bermuda', flag: '🇧🇲' },
  { code: '+975', name: 'Bhutan', flag: '🇧🇹' },
  { code: '+591', name: 'Bolivia', flag: '🇧🇴' },
  { code: '+387', name: 'Bosnia and Herzegovina', flag: '🇧🇦' },
  { code: '+267', name: 'Botswana', flag: '🇧🇼' },
  { code: '+55', name: 'Brazil', flag: '🇧🇷' },
  { code: '+246', name: 'British Indian Ocean Territory', flag: '🇮🇴' },
  { code: '+673', name: 'Brunei', flag: '🇧🇳' },
  { code: '+359', name: 'Bulgaria', flag: '🇧🇬' },
  { code: '+226', name: 'Burkina Faso', flag: '🇧🇫' },
  { code: '+257', name: 'Burundi', flag: '🇧🇮' },
  { code: '+238', name: 'Cabo Verde', flag: '🇨🇻' },
  { code: '+855', name: 'Cambodia', flag: '🇰🇭' },
  { code: '+237', name: 'Cameroon', flag: '🇨🇲' },
  { code: '+1', name: 'Canada', flag: '🇨🇦' },
  { code: '+1345', name: 'Cayman Islands', flag: '🇰🇾' },
  { code: '+236', name: 'Central African Republic', flag: '🇨🇫' },
  { code: '+235', name: 'Chad', flag: '🇹🇩' },
  { code: '+56', name: 'Chile', flag: '🇨🇱' },
  { code: '+86', name: 'China', flag: '🇨🇳' },
  { code: '+57', name: 'Colombia', flag: '🇨🇴' },
  { code: '+269', name: 'Comoros', flag: '🇰🇲' },
  { code: '+242', name: 'Congo (Republic)', flag: '🇨🇬' },
  { code: '+243', name: 'Congo (DRC)', flag: '🇨🇩' },
  { code: '+682', name: 'Cook Islands', flag: '🇨🇰' },
  { code: '+506', name: 'Costa Rica', flag: '🇨🇷' },
  { code: '+225', name: "Côte d'Ivoire", flag: '🇨🇮' },
  { code: '+385', name: 'Croatia', flag: '🇭🇷' },
  { code: '+53', name: 'Cuba', flag: '🇨🇺' },
  { code: '+599', name: 'Curaçao', flag: '🇨🇼' },
  { code: '+357', name: 'Cyprus', flag: '🇨🇾' },
  { code: '+420', name: 'Czechia', flag: '🇨🇿' },
  { code: '+45', name: 'Denmark', flag: '🇩🇰' },
  { code: '+253', name: 'Djibouti', flag: '🇩🇯' },
  { code: '+1767', name: 'Dominica', flag: '🇩🇲' },
  { code: '+1809', name: 'Dominican Republic', flag: '🇩🇴' },
  { code: '+593', name: 'Ecuador', flag: '🇪🇨' },
  { code: '+20', name: 'Egypt', flag: '🇪🇬' },
  { code: '+503', name: 'El Salvador', flag: '🇸🇻' },
  { code: '+240', name: 'Equatorial Guinea', flag: '🇬🇶' },
  { code: '+291', name: 'Eritrea', flag: '🇪🇷' },
  { code: '+372', name: 'Estonia', flag: '🇪🇪' },
  { code: '+268', name: 'Eswatini', flag: '🇸🇿' },
  { code: '+251', name: 'Ethiopia', flag: '🇪🇹' },
  { code: '+500', name: 'Falkland Islands', flag: '🇫🇰' },
  { code: '+298', name: 'Faroe Islands', flag: '🇫🇴' },
  { code: '+679', name: 'Fiji', flag: '🇫🇯' },
  { code: '+358', name: 'Finland', flag: '🇫🇮' },
  { code: '+33', name: 'France', flag: '🇫🇷' },
  { code: '+594', name: 'French Guiana', flag: '🇬🇫' },
  { code: '+689', name: 'French Polynesia', flag: '🇵🇫' },
  { code: '+241', name: 'Gabon', flag: '🇬🇦' },
  { code: '+220', name: 'Gambia', flag: '🇬🇲' },
  { code: '+995', name: 'Georgia', flag: '🇬🇪' },
  { code: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: '+233', name: 'Ghana', flag: '🇬🇭' },
  { code: '+350', name: 'Gibraltar', flag: '🇬🇮' },
  { code: '+30', name: 'Greece', flag: '🇬🇷' },
  { code: '+299', name: 'Greenland', flag: '🇬🇱' },
  { code: '+1473', name: 'Grenada', flag: '🇬🇩' },
  { code: '+590', name: 'Guadeloupe', flag: '🇬🇵' },
  { code: '+1671', name: 'Guam', flag: '🇬🇺' },
  { code: '+502', name: 'Guatemala', flag: '🇬🇹' },
  { code: '+224', name: 'Guinea', flag: '🇬🇳' },
  { code: '+245', name: 'Guinea-Bissau', flag: '🇬🇼' },
  { code: '+592', name: 'Guyana', flag: '🇬🇾' },
  { code: '+509', name: 'Haiti', flag: '🇭🇹' },
  { code: '+504', name: 'Honduras', flag: '🇭🇳' },
  { code: '+852', name: 'Hong Kong', flag: '🇭🇰' },
  { code: '+36', name: 'Hungary', flag: '🇭🇺' },
  { code: '+354', name: 'Iceland', flag: '🇮🇸' },
  { code: '+91', name: 'India', flag: '🇮🇳' },
  { code: '+62', name: 'Indonesia', flag: '🇮🇩' },
  { code: '+98', name: 'Iran', flag: '🇮🇷' },
  { code: '+964', name: 'Iraq', flag: '🇮🇶' },
  { code: '+353', name: 'Ireland', flag: '🇮🇪' },
  { code: '+972', name: 'Israel', flag: '🇮🇱' },
  { code: '+39', name: 'Italy', flag: '🇮🇹' },
  { code: '+1876', name: 'Jamaica', flag: '🇯🇲' },
  { code: '+81', name: 'Japan', flag: '🇯🇵' },
  { code: '+962', name: 'Jordan', flag: '🇯🇴' },
  { code: '+7', name: 'Kazakhstan', flag: '🇰🇿' },
  { code: '+254', name: 'Kenya', flag: '🇰🇪' },
  { code: '+686', name: 'Kiribati', flag: '🇰🇮' },
  { code: '+850', name: 'North Korea', flag: '🇰🇵' },
  { code: '+82', name: 'South Korea', flag: '🇰🇷' },
  { code: '+383', name: 'Kosovo', flag: '🇽🇰' },
  { code: '+965', name: 'Kuwait', flag: '🇰🇼' },
  { code: '+996', name: 'Kyrgyzstan', flag: '🇰🇬' },
  { code: '+856', name: 'Laos', flag: '🇱🇦' },
  { code: '+371', name: 'Latvia', flag: '🇱🇻' },
  { code: '+961', name: 'Lebanon', flag: '🇱🇧' },
  { code: '+266', name: 'Lesotho', flag: '🇱🇸' },
  { code: '+231', name: 'Liberia', flag: '🇱🇷' },
  { code: '+218', name: 'Libya', flag: '🇱🇾' },
  { code: '+423', name: 'Liechtenstein', flag: '🇱🇮' },
  { code: '+370', name: 'Lithuania', flag: '🇱🇹' },
  { code: '+352', name: 'Luxembourg', flag: '🇱🇺' },
  { code: '+853', name: 'Macau', flag: '🇲🇴' },
  { code: '+261', name: 'Madagascar', flag: '🇲🇬' },
  { code: '+265', name: 'Malawi', flag: '🇲🇼' },
  { code: '+60', name: 'Malaysia', flag: '🇲🇾' },
  { code: '+960', name: 'Maldives', flag: '🇲🇻' },
  { code: '+223', name: 'Mali', flag: '🇲🇱' },
  { code: '+356', name: 'Malta', flag: '🇲🇹' },
  { code: '+692', name: 'Marshall Islands', flag: '🇲🇭' },
  { code: '+596', name: 'Martinique', flag: '🇲🇶' },
  { code: '+222', name: 'Mauritania', flag: '🇲🇷' },
  { code: '+230', name: 'Mauritius', flag: '🇲🇺' },
  { code: '+262', name: 'Mayotte', flag: '🇾🇹' },
  { code: '+52', name: 'Mexico', flag: '🇲🇽' },
  { code: '+691', name: 'Micronesia', flag: '🇫🇲' },
  { code: '+373', name: 'Moldova', flag: '🇲🇩' },
  { code: '+377', name: 'Monaco', flag: '🇲🇨' },
  { code: '+976', name: 'Mongolia', flag: '🇲🇳' },
  { code: '+382', name: 'Montenegro', flag: '🇲🇪' },
  { code: '+1664', name: 'Montserrat', flag: '🇲🇸' },
  { code: '+212', name: 'Morocco', flag: '🇲🇦' },
  { code: '+258', name: 'Mozambique', flag: '🇲🇿' },
  { code: '+95', name: 'Myanmar', flag: '🇲🇲' },
  { code: '+264', name: 'Namibia', flag: '🇳🇦' },
  { code: '+674', name: 'Nauru', flag: '🇳🇷' },
  { code: '+977', name: 'Nepal', flag: '🇳🇵' },
  { code: '+31', name: 'Netherlands', flag: '🇳🇱' },
  { code: '+687', name: 'New Caledonia', flag: '🇳🇨' },
  { code: '+64', name: 'New Zealand', flag: '🇳🇿' },
  { code: '+505', name: 'Nicaragua', flag: '🇳🇮' },
  { code: '+227', name: 'Niger', flag: '🇳🇪' },
  { code: '+234', name: 'Nigeria', flag: '🇳🇬' },
  { code: '+683', name: 'Niue', flag: '🇳🇺' },
  { code: '+389', name: 'North Macedonia', flag: '🇲🇰' },
  { code: '+47', name: 'Norway', flag: '🇳🇴' },
  { code: '+968', name: 'Oman', flag: '🇴🇲' },
  { code: '+92', name: 'Pakistan', flag: '🇵🇰' },
  { code: '+680', name: 'Palau', flag: '🇵🇼' },
  { code: '+970', name: 'Palestine', flag: '🇵🇸' },
  { code: '+507', name: 'Panama', flag: '🇵🇦' },
  { code: '+675', name: 'Papua New Guinea', flag: '🇵🇬' },
  { code: '+595', name: 'Paraguay', flag: '🇵🇾' },
  { code: '+51', name: 'Peru', flag: '🇵🇪' },
  { code: '+63', name: 'Philippines', flag: '🇵🇭' },
  { code: '+48', name: 'Poland', flag: '🇵🇱' },
  { code: '+351', name: 'Portugal', flag: '🇵🇹' },
  { code: '+1787', name: 'Puerto Rico', flag: '🇵🇷' },
  { code: '+974', name: 'Qatar', flag: '🇶🇦' },
  { code: '+262', name: 'Réunion', flag: '🇷🇪' },
  { code: '+40', name: 'Romania', flag: '🇷🇴' },
  { code: '+7', name: 'Russia', flag: '🇷🇺' },
  { code: '+250', name: 'Rwanda', flag: '🇷🇼' },
  { code: '+590', name: 'Saint Barthélemy', flag: '🇧🇱' },
  { code: '+1869', name: 'Saint Kitts and Nevis', flag: '🇰🇳' },
  { code: '+1758', name: 'Saint Lucia', flag: '🇱🇨' },
  { code: '+590', name: 'Saint Martin', flag: '🇲🇫' },
  { code: '+508', name: 'Saint Pierre and Miquelon', flag: '🇵🇲' },
  { code: '+1784', name: 'Saint Vincent and the Grenadines', flag: '🇻🇨' },
  { code: '+685', name: 'Samoa', flag: '🇼🇸' },
  { code: '+378', name: 'San Marino', flag: '🇸🇲' },
  { code: '+239', name: 'Sao Tome and Principe', flag: '🇸🇹' },
  { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+221', name: 'Senegal', flag: '🇸🇳' },
  { code: '+381', name: 'Serbia', flag: '🇷🇸' },
  { code: '+248', name: 'Seychelles', flag: '🇸🇨' },
  { code: '+232', name: 'Sierra Leone', flag: '🇸🇱' },
  { code: '+65', name: 'Singapore', flag: '🇸🇬' },
  { code: '+421', name: 'Slovakia', flag: '🇸🇰' },
  { code: '+386', name: 'Slovenia', flag: '🇸🇮' },
  { code: '+677', name: 'Solomon Islands', flag: '🇸🇧' },
  { code: '+252', name: 'Somalia', flag: '🇸🇴' },
  { code: '+27', name: 'South Africa', flag: '🇿🇦' },
  { code: '+211', name: 'South Sudan', flag: '🇸🇸' },
  { code: '+34', name: 'Spain', flag: '🇪🇸' },
  { code: '+94', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: '+249', name: 'Sudan', flag: '🇸🇩' },
  { code: '+597', name: 'Suriname', flag: '🇸🇷' },
  { code: '+46', name: 'Sweden', flag: '🇸🇪' },
  { code: '+41', name: 'Switzerland', flag: '🇨🇭' },
  { code: '+963', name: 'Syria', flag: '🇸🇾' },
  { code: '+886', name: 'Taiwan', flag: '🇹🇼' },
  { code: '+992', name: 'Tajikistan', flag: '🇹🇯' },
  { code: '+255', name: 'Tanzania', flag: '🇹🇿' },
  { code: '+66', name: 'Thailand', flag: '🇹🇭' },
  { code: '+670', name: 'Timor-Leste', flag: '🇹🇱' },
  { code: '+228', name: 'Togo', flag: '🇹🇬' },
  { code: '+690', name: 'Tokelau', flag: '🇹🇰' },
  { code: '+676', name: 'Tonga', flag: '🇹🇴' },
  { code: '+1868', name: 'Trinidad and Tobago', flag: '🇹🇹' },
  { code: '+216', name: 'Tunisia', flag: '🇹🇳' },
  { code: '+90', name: 'Turkey', flag: '🇹🇷' },
  { code: '+993', name: 'Turkmenistan', flag: '🇹🇲' },
  { code: '+1649', name: 'Turks and Caicos Islands', flag: '🇹🇨' },
  { code: '+688', name: 'Tuvalu', flag: '🇹🇻' },
  { code: '+256', name: 'Uganda', flag: '🇺🇬' },
  { code: '+380', name: 'Ukraine', flag: '🇺🇦' },
  { code: '+971', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: '+1', name: 'United States', flag: '🇺🇸' },
  { code: '+598', name: 'Uruguay', flag: '🇺🇾' },
  { code: '+998', name: 'Uzbekistan', flag: '🇺🇿' },
  { code: '+678', name: 'Vanuatu', flag: '🇻🇺' },
  { code: '+379', name: 'Vatican City', flag: '🇻🇦' },
  { code: '+58', name: 'Venezuela', flag: '🇻🇪' },
  { code: '+84', name: 'Vietnam', flag: '🇻🇳' },
  { code: '+681', name: 'Wallis and Futuna', flag: '🇼🇫' },
  { code: '+967', name: 'Yemen', flag: '🇾🇪' },
  { code: '+260', name: 'Zambia', flag: '🇿🇲' },
  { code: '+263', name: 'Zimbabwe', flag: '🇿🇼' },
];

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs font-light text-[#a0522d]">{message}</p>;
}

const inputClass =
  'w-full rounded-lg border border-line bg-paper/70 px-4 py-3 font-body text-sm text-dark-brown placeholder:text-warm-gray/60 transition-colors focus:border-gold/50 focus:bg-paper';

export function RSVPForm() {
  const { events } = useWeddingData();
  const gusabaEvent = events.find(e => e.id === 'gusaba') || events[0];
  const whiteEvent = events.find(e => e.id === 'white') || events[1];

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState(COUNTRIES[0].code);
  const [showCountrySearch, setShowCountrySearch] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  const countryRef = useRef<HTMLDivElement>(null);
  
  const [email, setEmail] = useState('');
  const [attending, setAttending] = useState<boolean | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [eventsAttending, setEventsAttending] = useState<'both' | 'gusaba' | 'white'>('both');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
        setShowCountrySearch(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCountries = COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(countrySearchQuery.toLowerCase()) || 
    c.code.includes(countrySearchQuery)
  );

  const selectedCountry = COUNTRIES.find(c => c.code === countryCode) || COUNTRIES[0];

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
      eventsAttending,
    });
    setSubmitting(false);

    if (result.ok) setSuccess(true);
    else setSubmitError(result.error ?? 'Something went wrong. Please try again.');
  };

  if (success) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border border-gold/30 bg-paper/95 px-8 py-16 text-center shadow-[0_24px_60px_-20px_rgba(176,138,67,0.15)] relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        {/* Subtle background decoration */}
        <div className="absolute -right-12 -top-12 opacity-10">
          <BotanicalCorner className="w-48 text-gold" />
        </div>
        <div className="absolute -bottom-12 -left-12 opacity-10">
          <BotanicalCorner className="w-48 text-gold" style={{ transform: 'rotate(180deg)' }} />
        </div>

        <div className="relative z-10">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-gold/40 bg-gradient-to-br from-gold/20 to-transparent text-gold">
            <Heart size={32} strokeWidth={1.2} className={attending ? "animate-pulse" : ""} />
          </div>
          
          <h3 className="mt-8 font-display text-4xl text-dark-brown">
            {attending ? "We're thrilled!" : "You'll be missed"}
          </h3>
          
          <div className="mx-auto mt-6 max-w-[280px]">
            <p className="font-body text-sm font-light leading-relaxed text-muted-brown">
              {attending 
                ? `Thank you for your RSVP, ${fullName.split(' ')[0]}. We can’t wait to celebrate this special day with you!`
                : `Thank you for letting us know, ${fullName.split(' ')[0]}. We'll miss you, but you'll be in our hearts on the day.`}
            </p>
          </div>

          <div className="mt-10 flex justify-center">
            <FloralDivider className="w-48 text-gold/40" />
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
              setEventsAttending('both');
              setMessage('');
              setErrors({});
            }}
            className="mt-10 inline-flex items-center gap-2 rounded-full border border-line bg-transparent px-6 py-2.5 font-body text-xs uppercase tracking-[0.2em] text-warm-gray transition-colors hover:border-gold/40 hover:text-muted-brown"
          >
            Send another RSVP
          </button>
        </div>
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
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative" ref={countryRef}>
            <button
              type="button"
              onClick={() => setShowCountrySearch(!showCountrySearch)}
              className={`flex h-[46px] items-center justify-between gap-2 min-w-[6.5rem] rounded-lg border border-line bg-paper/70 px-3 font-body text-sm text-dark-brown whitespace-nowrap transition-colors focus:border-gold/50 ${errors.phone ? 'border-[#c98b6a]' : ''}`}
            >
              <span>{selectedCountry.flag} {selectedCountry.code}</span>
              <span className="text-warm-gray text-xs">▾</span>
            </button>
            
            {showCountrySearch && (
              <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-lg border border-line bg-paper shadow-xl">
                <div className="p-2 border-b border-line flex items-center gap-2">
                  <Search size={14} className="text-warm-gray" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search country or code..."
                    value={countrySearchQuery}
                    onChange={(e) => setCountrySearchQuery(e.target.value)}
                    className="w-full bg-transparent text-sm text-dark-brown outline-none placeholder:text-warm-gray/60"
                  />
                </div>
                <div className="max-h-60 overflow-y-auto p-1">
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((c) => (
                      <button
                        key={c.code + c.name}
                        type="button"
                        onClick={() => {
                          setCountryCode(c.code);
                          setShowCountrySearch(false);
                          setCountrySearchQuery('');
                        }}
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-dark-brown hover:bg-gold/10"
                      >
                        <span className="text-lg">{c.flag}</span>
                        <span className="font-medium w-12">{c.code}</span>
                        <span className="truncate text-muted-brown">{c.name}</span>
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-center text-sm text-warm-gray">No countries found</div>
                  )}
                </div>
              </div>
            )}
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
            className={`flex flex-1 cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${attending === true
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
            className={`flex flex-1 cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${attending === false
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

      {/* Events Attending - Only show if attending is yes */}
      {attending === true && (
        <div className="mt-5">
          <label className="mb-2 block font-body text-xs uppercase tracking-[0.18em] text-warm-gray">
            Which events will you attend?
          </label>
          <div className="flex flex-col gap-2">
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${eventsAttending === 'both' ? 'border-gold/60 bg-gold/10' : 'border-line bg-paper/60 hover:border-gold/40'}`}
            >
              <input type="radio" name="eventsAttending" value="both" checked={eventsAttending === 'both'} onChange={() => setEventsAttending('both')} className="sr-only" />
              <span className={`grid h-5 w-5 place-items-center rounded-full border shrink-0 ${eventsAttending === 'both' ? 'border-gold bg-gold/20 text-gold' : 'border-line text-transparent'}`}><Check size={12} strokeWidth={2} /></span>
              <span className="font-body text-sm text-dark-brown">Both Events ({gusabaEvent?.display_date_short} & {whiteEvent?.display_date_short})</span>
            </label>
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${eventsAttending === 'gusaba' ? 'border-gold/60 bg-gold/10' : 'border-line bg-paper/60 hover:border-gold/40'}`}
            >
              <input type="radio" name="eventsAttending" value="gusaba" checked={eventsAttending === 'gusaba'} onChange={() => setEventsAttending('gusaba')} className="sr-only" />
              <span className={`grid h-5 w-5 place-items-center rounded-full border shrink-0 ${eventsAttending === 'gusaba' ? 'border-gold bg-gold/20 text-gold' : 'border-line text-transparent'}`}><Check size={12} strokeWidth={2} /></span>
              <span className="font-body text-sm text-dark-brown">Gusaba Only ({gusabaEvent?.display_date_long || gusabaEvent?.display_date_short})</span>
            </label>
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${eventsAttending === 'white' ? 'border-gold/60 bg-gold/10' : 'border-line bg-paper/60 hover:border-gold/40'}`}
            >
              <input type="radio" name="eventsAttending" value="white" checked={eventsAttending === 'white'} onChange={() => setEventsAttending('white')} className="sr-only" />
              <span className={`grid h-5 w-5 place-items-center rounded-full border shrink-0 ${eventsAttending === 'white' ? 'border-gold bg-gold/20 text-gold' : 'border-line text-transparent'}`}><Check size={12} strokeWidth={2} /></span>
              <span className="font-body text-sm text-dark-brown">White Wedding Only ({whiteEvent?.display_date_long || whiteEvent?.display_date_short})</span>
            </label>
          </div>
        </div>
      )}

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
