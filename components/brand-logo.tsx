type BrandMarkProps = {
  className?: string
}

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg className={['brand-mark', className].filter(Boolean).join(' ')} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <circle className="brand-mark-ring" cx="32" cy="32" r="30.5" />
      <circle className="brand-mark-ring brand-mark-ring--inner" cx="32" cy="32" r="27" />
      <path className="brand-mark-roof" d="M17 27.5 32 16l15 11.5" />
      <path className="brand-mark-gem" d="M32 9.5 34 11.5 32 13.5 30 11.5Z" />
      <text className="brand-mark-mono" x="32" y="43" textAnchor="middle">HW</text>
      <line className="brand-mark-rule" x1="23" y1="48" x2="41" y2="48" />
    </svg>
  )
}

type BrandLogoProps = {
  tone?: 'dark' | 'light'
  className?: string
}

export function BrandLogo({ tone = 'dark', className }: BrandLogoProps) {
  return (
    <span className={['brand-logo', `brand-logo--${tone}`, className].filter(Boolean).join(' ')}>
      <BrandMark />
      <span className="brand-logo-text">
        <span className="brand-logo-name">Huge World</span>
        <span className="brand-logo-sub">of design</span>
      </span>
    </span>
  )
}
