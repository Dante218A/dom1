'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ArrowUpRight, ChevronDown, ChevronRight, Menu, X } from 'lucide-react'
import { serviceCategories, serviceHref } from '@/lib/services'
import { objectCategories, objectHref } from '@/lib/objects'

const SERVICES_HREF = '/#services'
const OBJECTS_HREF = '/#objects'

type DropdownId = 'services' | 'objects'

const links = [
  { href: '/#projects', label: 'Проєкти' },
  { href: SERVICES_HREF, label: 'Послуги', dropdown: 'services' as DropdownId },
  { href: OBJECTS_HREF, label: 'Об’єкти', dropdown: 'objects' as DropdownId },
  { href: '/#calculator', label: 'Калькулятор' },
  { href: '/#about', label: 'Про студію' },
]

const CLOSE_DELAY_MS = 260

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<DropdownId | null>(null)
  const [mobileOpen, setMobileOpen] = useState<DropdownId | null>(null)
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

  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="huge world of design — на головну">
        <span>Huge World</span>
        <small>of design</small>
      </Link>

      <nav className="main-nav" aria-label="Головна навігація" ref={navRef}>
        {links.map((link) => {
          const id = link.dropdown
          if (!id) return <a href={link.href} key={link.href}>{link.label}</a>
          const isOpen = openDropdown === id
          return (
            <div
              className={`nav-dropdown${isOpen ? ' is-open' : ''}`}
              key={link.href}
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
                {link.label}
                <ChevronDown aria-hidden="true" />
              </button>
              <div
                className={`nav-dropdown-panel${id === 'objects' ? ' nav-dropdown-panel--objects' : ''}`}
                id={`${id}-dropdown`}
                hidden={!isOpen}
              >
                {id === 'services' ? renderServicesPanel() : renderObjectsPanel()}
              </div>
            </div>
          )
        })}
      </nav>

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

      <div className={`site-menu${isMenuOpen ? ' is-open' : ''}`} id="site-menu" hidden={!isMenuOpen}>
        <nav aria-label="Меню сайту">
          {links.map((link, index) => {
            const id = link.dropdown
            if (!id) {
              return (
                <a href={link.href} key={link.href} onClick={closeMobileMenu}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {link.label}
                </a>
              )
            }
            const groups = id === 'services'
              ? serviceCategories.map((category) => ({
                  key: category.title,
                  title: category.title,
                  items: category.items.map((item) => ({ slug: item.slug, title: item.title, href: serviceHref(item.slug), meta: item.price })),
                }))
              : objectCategories.map((category) => ({
                  key: category.slug,
                  title: category.title,
                  items: category.types.map((type) => ({ slug: type.slug, title: type.title, href: objectHref(type.slug), meta: undefined })),
                }))
            return (
              <div className="site-menu-group" key={link.href}>
                <button
                  className="site-menu-toggle"
                  type="button"
                  aria-expanded={mobileOpen === id}
                  aria-controls={`site-menu-${id}`}
                  onClick={() => setMobileOpen((open) => (open === id ? null : id))}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {link.label}
                  <ChevronDown aria-hidden="true" />
                </button>
                <ul id={`site-menu-${id}`} hidden={mobileOpen !== id}>
                  {groups.map((group) => (
                    <li className="site-menu-category" key={group.key}>
                      <p>{group.title}</p>
                      <ul>
                        {group.items.map((item) => (
                          <li key={item.slug}>
                            <Link href={item.href} onClick={closeMobileMenu}>
                              {item.title}
                              {item.meta && <small>{item.meta}</small>}
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
          <a href="/#contact" onClick={closeMobileMenu}>
            <span>{String(links.length + 1).padStart(2, '0')}</span>
            Контакти
          </a>
        </nav>
        <p>Одеса · Україна<br />Працюємо всюди</p>
      </div>
    </header>
  )
}
