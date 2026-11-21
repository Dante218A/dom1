type BrandMarkProps = {
  className?: string
}

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg className={['brand-mark', className].filter(Boolean).join(' ')} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <path className="brand-mark-ring" strokeLinejoin="miter" d="M5 30.5 32 5l27 25.5V61H5Z" />
      <path className="brand-mark-ring brand-mark-ring--inner" strokeLinejoin="miter" d="M9.5 32.3 32 11.2l22.5 21.1V56.5h-45Z" />
      <path className="brand-mark-gem" d="M32 18.5 34 20.5 32 22.5 30 20.5Z" />
      <text className="brand-mark-mono" x="32" y="43" textAnchor="middle">HW</text>
      <line className="brand-mark-rule" x1="23" y1="48.5" x2="41" y2="48.5" />
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
