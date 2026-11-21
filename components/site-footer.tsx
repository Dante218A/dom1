import Link from 'next/link'
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from 'lucide-react'
import { STUDIO_PHONE, STUDIO_PHONE_HREF, pageHref, siteSections, standalonePages } from '@/lib/site-pages'

const socials = [
  { label: 'Instagram', href: 'https://instagram.com/' },
  { label: 'Telegram', href: 'https://t.me/' },
  { label: 'Viber', href: 'viber://chat?number=%2B380487000000' },
  { label: 'WhatsApp', href: 'https://wa.me/380487000000' },
  { label: 'Facebook', href: 'https://facebook.com/' },
  { label: 'Pinterest', href: 'https://pinterest.com/' },
]

const anchorLinks = [
  { label: 'Наш підхід', href: '#about' },
  { label: 'Проєкти', href: '#projects' },
  { label: 'Послуги', href: '#services' },
  { label: 'Етапи роботи', href: '#stages' },
  { label: 'Калькулятор', href: '#calculator' },
  { label: 'Зв’язатися', href: '#contact' },
]

const STUDIO_ADDRESS = 'вул. Дерибасівська, 12, Одеса'
const MAP_EMBED = 'https://www.openstreetmap.org/export/embed.html?bbox=30.7300%2C46.4790%2C30.7520%2C46.4880&layer=mapnik&marker=46.4835%2C30.7410'
const MAP_LINK = 'https://www.openstreetmap.org/?mlat=46.4835&mlon=30.7410#map=17/46.4835/30.7410'

export function SiteFooter() {
  const extraPages = [...siteSections.flatMap((section) => section.pages.slice(0, 1)), ...standalonePages]

  return (
    <footer className="site-footer" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">Контакти та навігація</h2>

      <div className="footer-top">
        <div className="footer-brand">
          <a className="wordmark footer-wordmark" href="#top">huge world<small>of design</small></a>
          <p>Студія інтер’єру, що створює теплі, продумані простори з характером. Одеса, Україна та весь світ.</p>
          <ul className="footer-socials" aria-label="Соціальні мережі">
            {socials.map((social) => (
              <li key={social.label}>
                <a href={social.href} target="_blank" rel="noopener noreferrer">
                  {social.label} <ArrowUpRight aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav className="footer-nav" aria-label="Навігація у футері">
          <div>
            <p className="footer-label">На сторінці</p>
            <ul>
              {anchorLinks.map((link) => (
                <li key={link.href}><a href={link.href}>{link.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="footer-label">Студія</p>
            <ul>
              {extraPages.map((page) => (
                <li key={page.slug}><Link href={pageHref(page.slug)}>{page.title}</Link></li>
              ))}
            </ul>
          </div>
        </nav>

        <address className="footer-contacts">
          <p className="footer-label">Контакти</p>
          <a className="footer-phone" href={STUDIO_PHONE_HREF}>{STUDIO_PHONE}</a>
          <ul>
            <li><MapPin aria-hidden="true" /><span>{STUDIO_ADDRESS}</span></li>
            <li><Mail aria-hidden="true" /><a href="mailto:hello@hugeworld.design">hello@hugeworld.design</a></li>
            <li><Phone aria-hidden="true" /><a href={STUDIO_PHONE_HREF}>Дзвінок, Viber, WhatsApp</a></li>
            <li><Clock aria-hidden="true" /><span>Пн — Пт · 10:00–18:00</span></li>
          </ul>
        </address>
      </div>

      <div className="footer-map">
        <iframe
          title={`Карта: студія huge world of design, ${STUDIO_ADDRESS}`}
          src={MAP_EMBED}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="footer-map-card">
          <p className="footer-label">Студія в Одесі</p>
          <p className="footer-map-address">{STUDIO_ADDRESS}</p>
          <a className="text-link" href={MAP_LINK} target="_blank" rel="noopener noreferrer">
            Прокласти маршрут <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="copyright">© 2026 huge world of design</span>
        <p>Створено з увагою до життя.</p>
        <a className="back-top" href="#top">На початок <ArrowUpRight aria-hidden="true" /></a>
      </div>
    </footer>
  )
}
