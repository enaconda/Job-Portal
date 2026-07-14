// Small line-icon set used in the "How it works" section — kept as one component
// with a `type` prop so all icons share stroke weight and sizing.
export default function StepIcon({ type }) {
  const common = { width: 28, height: 28, stroke: 'var(--primary)', strokeWidth: 1.8, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };

  switch (type) {
    case 'profile':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
        </svg>
      );
    case 'search':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="M20 20l-4.5-4.5" />
        </svg>
      );
    case 'apply':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M6 3h9l4 4v14H6z" />
          <path d="M15 3v4h4" />
          <path d="M9 13l2 2 4-4" />
        </svg>
      );
    case 'post':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M8 10h8M8 14h5" />
        </svg>
      );
    case 'review':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M4 4h16v12H8l-4 4z" />
          <path d="M8 9h8M8 12h5" />
        </svg>
      );
    case 'hire':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8z" />
        </svg>
      );
    default:
      return null;
  }
}
