'use client'

import Link from 'next/link'
import { BrandLogo } from '@/components/brand-logo'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Plus,
  Search,
  Send,
  X,
} from 'lucide-react'
import { serviceCategories, serviceHref } from '@/lib/services'
import { objectCategories, objectHref } from '@/lib/objects'
import { STUDIO_PHONE, STUDIO_PHONE_HREF, pageHref, siteSections, type SiteSection } from '@/lib/site-pages'

const SERVICES_HREF = '/#services'

type NavItem =
  | { kind: 'link'; label: string; href: string; emphasis?: boolean }
  | { kind: 'mega'; label: string; id: 'services' | 'objects' }
  | { kind: 'menu'; label: string; id: string; section: SiteSection }

const sectionBySlug = (slug: string) => siteSections.find((section) => section.slug === slug)!

const navItems: NavItem[] = [
  { kind: 'link', label: 'Наші роботи', href: '/#projects' },
  { kind: 'mega', label: 'Послуги', id: 'services' },
  { kind: 'mega', label: 'Об’єкти', id: 'objects' },
  { kind: 'menu', label: 'Про нас', id: 'pro-nas', section: sectionBySlug('pro-nas') },
  { kind: 'link', label: 'Відгуки', href: pageHref('vidhuky') },
  { kind: 'link', label: 'Калькулятор', href: '/#calculator' },
  { kind: 'link', label: 'Акції', href: pageHref('aktsii') },
  { kind: 'link', label: 'Оплата', href: pageHref('oplata') },
  { kind: 'link', label: 'Блог', href: pageHref('blog') },
  { kind: 'link', label: 'Співпраця', href: pageHref('spivpratsia') },
  { kind: 'link', label: 'Вакансії', href: pageHref('vakansii') },
  { kind: 'link', label: 'Контакти', href: pageHref('kontakty') },
]

const messengers = [
  { label: 'Telegram', href: 'https://t.me/', icon: Send },
  { label: 'Viber', href: 'viber://chat?number=%2B380487000000', icon: MessageCircle },
  { label: 'WhatsApp', href: 'https://wa.me/380487000000', icon: Phone },
]

const CLOSE_DELAY_MS = 260

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState<string | null>(null)
  const [activeObjectCategory, setActiveObjectCategory] = useState(objectCategories[0].slug)
  const navRef = useRef<HTMLElement>(null)
  const openedByHoverRef = useRef(false)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const activeCategory = objectCategories.find((category) => category.slug === activeObjectCategory) ?? objectCategories[0]

  function cancelClose() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  function scheduleClose() {
    cancelClose()
    closeTimerRef.current = setTimeout(() => {
      openedByHoverRef.current = false
      setOpenDropdown(null)
    }, CLOSE_DELAY_MS)
  }

  function closeDropdown() {
    cancelClose()
    setOpenDropdown(null)
  }

  function closeMobileMenu() {
    setIsMenuOpen(false)
    setMobileOpen(null)
  }

  useEffect(() => cancelClose, [])

  useEffect(() => {
    if (!isMenuOpen && !openDropdown) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
        setOpenDropdown(null)
      }
    }
    function handlePointerDown(event: PointerEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('pointerdown', handlePointerDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isMenuOpen, openDropdown])

  function renderServicesPanel() {
    return (
      <>
        <div className="mega-grid">
          {serviceCategories.map((category, index) => (
            <section className="mega-column" key={category.title} aria-labelledby={`mega-${index}`}>
              <span className="nav-dropdown-index">{String(index + 1).padStart(2, '0')}</span>
              <h3 id={`mega-${index}`}>{category.title}</h3>
              <p className="mega-intro">{category.intro}</p>
              <ul>
                {category.items.map((item) => (
                  <li key={item.slug}>
                    <Link href={serviceHref(item.slug)} onClick={closeDropdown}>
                      <strong>
                        {item.title}
                        <ArrowUpRight aria-hidden="true" />
                      </strong>
                      <small>{item.description}</small>
                      <em className="mega-price">{item.price}</em>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <div className="mega-footer">
          <p>Не знаєте, що обрати? Розрахуйте вартість або напишіть нам — підкажемо.</p>
          <div className="mega-footer-actions">
            <a className="mega-link" href="/#calculator" onClick={closeDropdown}>
              Калькулятор
            </a>
            <a className="nav-dropdown-all" href={SERVICES_HREF} onClick={closeDropdown}>
              Усі послуги
              <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </>
    )
  }

  function renderObjectsPanel() {
    return (
      <>
        <div className="objects-menu">
          <div className="objects-menu-categories">
            <p className="nav-dropdown-title">1 · Категорія</p>
            <ul role="list">
              {objectCategories.map((category, index) => (
                <li key={category.slug}>
                  <button
                    type="button"
                    className={`objects-menu-category${category.slug === activeCategory.slug ? ' is-active' : ''}`}
                    aria-pressed={category.slug === activeCategory.slug}
                    onPointerEnter={(event) => {
                      if (event.pointerType === 'mouse') setActiveObjectCategory(category.slug)
                    }}
                    onClick={() => setActiveObjectCategory(category.slug)}
                  >
                    <span className="nav-dropdown-index">{String(index + 1).padStart(2, '0')}</span>
                    <span className="objects-menu-category-text">
                      <strong>{category.title}</strong>
                      <small>{category.types.length} {category.types.length === 1 ? 'напрям' : 'типів'}</small>
                    </span>
                    <ChevronRight aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="objects-menu-types">
            <p className="nav-dropdown-title">2 · Тип об’єкта</p>
            <p className="mega-intro objects-menu-intro">{activeCategory.intro}</p>
            <ul className="objects-menu-grid">
              {activeCategory.types.map((type) => (
                <li key={type.slug}>
                  <Link href={objectHref(type.slug)} onClick={closeDropdown}>
                    <span className="nav-dropdown-text">
                      <strong>{type.title}</strong>
                      <small>{type.description}</small>
                    </span>
                    <ArrowUpRight aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mega-footer">
          <p>Оберіть тип об’єкта в калькуляторі, щоб побачити орієнтовну вартість.</p>
          <div className="mega-footer-actions">
            <a className="nav-dropdown-all" href="/#calculator" onClick={closeDropdown}>
              Розрахувати вартість
              <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </>
    )
  }

  function renderSectionPanel(section: SiteSection) {
    return (
      <>
        <ul className="simple-menu-list">
          {section.pages.map((page) => (
            <li key={page.slug}>
              <Link href={pageHref(page.slug)} onClick={closeDropdown}>
                <span className="simple-menu-label">{page.title}</span>
                <ArrowRight aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </>
    )
  }

  function renderDropdown(id: string, label: string, variant: string, panel: ReactNode, trigger: 'chevron' | 'plus') {
    const isOpen = openDropdown === id
    return (
      <div
        className={`nav-dropdown nav-dropdown--${variant}${isOpen ? ' is-open' : ''}`}
        key={id}
        onPointerEnter={(event) => {
          if (event.pointerType !== 'mouse') return
          cancelClose()
          if (!isOpen) openedByHoverRef.current = true
          setOpenDropdown(id)
        }}
        onPointerLeave={(event) => {
          if (event.pointerType !== 'mouse') return
          scheduleClose()
        }}
      >
        <button
          className="nav-dropdown-trigger"
          type="button"
          aria-expanded={isOpen}
          aria-controls={`${id}-dropdown`}
          onClick={() => {
            if (openedByHoverRef.current) {
              openedByHoverRef.current = false
              setOpenDropdown(id)
              return
            }
            setOpenDropdown(isOpen ? null : id)
          }}
        >
          {label}
          {trigger === 'plus' ? <Plus aria-hidden="true" /> : <ChevronDown aria-hidden="true" />}
        </button>
        <div className={`nav-dropdown-panel nav-dropdown-panel--${variant}`} id={`${id}-dropdown`} hidden={!isOpen}>
          {panel}
        </div>
      </div>
    )
  }

  const mobileGroups = (item: NavItem) => {
    if (item.kind === 'mega' && item.id === 'services') {
      return serviceCategories.map((category) => ({
        key: category.title,
        title: category.title,
        items: category.items.map((service) => ({ slug: service.slug, title: service.title, href: serviceHref(service.slug), meta: service.price })),
      }))
    }
    if (item.kind === 'mega') {
      return objectCategories.map((category) => ({
        key: category.slug,
        title: category.title,
        items: category.types.map((type) => ({ slug: type.slug, title: type.title, href: objectHref(type.slug), meta: undefined as string | undefined })),
      }))
    }
    if (item.kind === 'menu') {
      return [{
        key: item.section.slug,
        title: item.section.intro,
        items: item.section.pages.map((page) => ({ slug: page.slug, title: page.title, href: pageHref(page.slug), meta: undefined as string | undefined })),
      }]
    }
    return []
  }

  return (
    <header className="site-header">
      <div className="header-top">
        <Link className="brand-link" href="/" aria-label="huge world of design — на головну">
          <BrandLogo />
        </Link>

        <form className="header-search" action="/poshuk" role="search">
          <label className="sr-only" htmlFor="header-search-input">Пошук по сайту</label>
          <Search aria-hidden="true" />
          <input id="header-search-input" name="q" type="search" placeholder="Пошук…" autoComplete="off" maxLength={80} />
          <button type="submit" aria-label="Шукати">
            <ArrowRight aria-hidden="true" />
          </button>
        </form>

        <div className="header-utility">
          <span className="header-city">
            <MapPin aria-hidden="true" />
            Одеса
          </span>
          <ul className="header-messengers" aria-label="Месенджери">
            {messengers.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a href={href} aria-label={label} title={label} target="_blank" rel="noopener noreferrer">
                  <Icon aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
          <span className="header-lang" aria-label="Мова сайту: українська">UA</span>
          <a className="header-phone" href={STUDIO_PHONE_HREF}>{STUDIO_PHONE}</a>
        </div>

        <div className="header-actions">
          <a className="header-cta" href="/#contact">
            <span>Обговорити проєкт</span>
            <ArrowRight aria-hidden="true" />
          </a>
          <button
            className="menu-button"
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="site-menu"
            aria-label={isMenuOpen ? 'Закрити меню' : 'Відкрити меню'}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      <nav className="main-nav" aria-label="Головна навігація" ref={navRef}>
        {navItems.map((item) => {
          if (item.kind === 'link') {
            return (
              <Link className={item.emphasis ? 'is-emphasis' : undefined} href={item.href} key={item.label}>
                {item.label}
              </Link>
            )
          }
          if (item.kind === 'mega') {
            return item.id === 'services'
              ? renderDropdown('services', item.label, 'accent', renderServicesPanel(), 'plus')
              : renderDropdown('objects', item.label, 'objects', renderObjectsPanel(), 'chevron')
          }
          return renderDropdown(item.id, item.label, 'simple', renderSectionPanel(item.section), 'chevron')
        })}
      </nav>

      <div className={`site-menu${isMenuOpen ? ' is-open' : ''}`} id="site-menu" hidden={!isMenuOpen}>
        <nav aria-label="Меню сайту">
          {navItems.map((item, index) => {
            const number = <span>{String(index + 1).padStart(2, '0')}</span>
            if (item.kind === 'link') {
              return (
                <Link href={item.href} key={item.label} onClick={closeMobileMenu}>
                  {number}
                  {item.label}
                </Link>
              )
            }
            const id = item.id
            return (
              <div className="site-menu-group" key={id}>
                <button
                  className="site-menu-toggle"
                  type="button"
                  aria-expanded={mobileOpen === id}
                  aria-controls={`site-menu-${id}`}
                  onClick={() => setMobileOpen((open) => (open === id ? null : id))}
                >
                  {number}
                  {item.label}
                  <ChevronDown aria-hidden="true" />
                </button>
                <ul id={`site-menu-${id}`} hidden={mobileOpen !== id}>
                  {mobileGroups(item).map((group) => (
                    <li className="site-menu-category" key={group.key}>
                      <p>{group.title}</p>
                      <ul>
                        {group.items.map((entry) => (
                          <li key={entry.slug}>
                            <Link href={entry.href} onClick={closeMobileMenu}>
                              {entry.title}
                              {entry.meta && <small>{entry.meta}</small>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </nav>
        <p>
          Одеса · Україна<br />
          <a href={STUDIO_PHONE_HREF}>{STUDIO_PHONE}</a>
        </p>
      </div>
    </header>
  )
}
