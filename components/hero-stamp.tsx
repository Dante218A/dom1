import { BrandMark } from '@/components/brand-logo'

export function HeroStamp() {
  return (
    <div className="hero-stamp" aria-hidden="true">
      <svg className="hero-stamp-ring" viewBox="0 0 120 120">
        <defs>
          <path id="hero-stamp-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
        </defs>
        <text textLength="286" lengthAdjust="spacing">
          <textPath href="#hero-stamp-circle" startOffset="0">
            huge world of design • huge world of design •
          </textPath>
        </text>
      </svg>
      <BrandMark className="hero-stamp-mark" />
    </div>
  )
}
