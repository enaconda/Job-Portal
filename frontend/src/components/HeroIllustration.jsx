// Custom SVG illustration for the landing page hero — abstract "job match" motif:
// a resume card and a job card connecting, echoing the app's core action.
export default function HeroIllustration() {
  return (
    <svg viewBox="0 0 480 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="hero-illustration">
      <circle cx="240" cy="210" r="190" fill="var(--primary-tint)" />

      {/* Job card (top) */}
      <g transform="translate(150, 40) rotate(-6 90 60)">
        <rect x="0" y="0" width="220" height="120" rx="14" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.5" />
        <rect x="18" y="20" width="90" height="12" rx="4" fill="var(--primary)" />
        <rect x="18" y="42" width="140" height="8" rx="4" fill="var(--border)" />
        <rect x="18" y="58" width="110" height="8" rx="4" fill="var(--border)" />
        <rect x="18" y="86" width="60" height="18" rx="9" fill="var(--amber-tint)" />
        <rect x="90" y="86" width="60" height="18" rx="9" fill="var(--primary-tint)" />
      </g>

      {/* Resume card (bottom) */}
      <g transform="translate(110, 210) rotate(4 90 90)">
        <rect x="0" y="0" width="180" height="170" rx="14" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.5" />
        <circle cx="40" cy="36" r="16" fill="var(--amber)" />
        <rect x="66" y="28" width="80" height="10" rx="4" fill="var(--ink)" opacity="0.8" />
        <rect x="66" y="44" width="55" height="8" rx="4" fill="var(--border)" />
        <rect x="20" y="70" width="140" height="7" rx="3.5" fill="var(--border)" />
        <rect x="20" y="86" width="140" height="7" rx="3.5" fill="var(--border)" />
        <rect x="20" y="102" width="90" height="7" rx="3.5" fill="var(--border)" />
        <rect x="20" y="126" width="50" height="16" rx="8" fill="var(--primary-tint)" />
        <rect x="76" y="126" width="50" height="16" rx="8" fill="var(--primary-tint)" />
      </g>

      {/* Connecting check badge */}
      <circle cx="330" cy="230" r="26" fill="var(--primary)" />
      <path d="M319 230l8 8 16-16" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Floating dots for texture */}
      <circle cx="80" cy="120" r="5" fill="var(--amber)" />
      <circle cx="400" cy="120" r="4" fill="var(--primary)" />
      <circle cx="380" cy="340" r="6" fill="var(--amber)" opacity="0.7" />
    </svg>
  );
}
