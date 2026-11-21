type BrandMarkProps = {
  className?: string
}

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg className={['brand-mark', className].filter(Boolean).join(' ')} viewBox="0 0 64 80" aria-hidden="true" focusable="false">
      <path className="brand-mark-arch" d="M6 76V32a26 26 0 0 1 52 0v44Z" />
      <path className="brand-mark-arch brand-mark-arch--inner" d="M11 71V32.5a21 21 0 0 1 42 0V71Z" />
      <path className="brand-mark-gem" d="M32 1.5 35 4.5 32 7.5 29 4.5Z" />
      <text className="brand-mark-h" x="24.5" y="52" textAnchor="middle">H</text>
      <text className="brand-mark-w" x="39.5" y="60" textAnchor="middle">W</text>
      <line className="brand-mark-rule" x1="20" y1="66" x2="44" y2="66" />
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
