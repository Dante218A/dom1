'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react'
import { serviceCategories } from '@/lib/services'

const links = [
  { href: '#projects', label: 'Проєкти' },
  { href: '#services', label: 'Послуги' },
  { href: '#calculator', label: 'Калькулятор' },
  { href: '#about', label: 'Про студію' },
]


export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false)
  const servicesRef = useRef<HTMLDivElement>(null)
  const openedByHoverRef = useRef(false)

  useEffect(() => {
    if (!isMenuOpen && !isServicesOpen) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
        setIsServicesOpen(false)
      }
    }
    function handlePointerDown(event: PointerEvent) {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('pointerdown', handlePointerDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isMenuOpen, isServicesOpen])

  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="huge world of design — на початок сторінки">
        <span>Huge World</span>
        <small>of design</small>
      </a>

      <nav className="main-nav" aria-label="Головна навігація">
        {links.map((link) =>
          link.href === '#services' ? (
            <div
              className={`nav-dropdown${isServicesOpen ? ' is-open' : ''}`}
              key={link.href}
              ref={servicesRef}
              onPointerEnter={(event) => {
                if (event.pointerType !== 'mouse') return
                openedByHoverRef.current = true
                setIsServicesOpen(true)
              }}
              onPointerLeave={(event) => {
                if (event.pointerType !== 'mouse') return
                openedByHoverRef.current = false
                setIsServicesOpen(false)
              }}
            >
              <button
                className="nav-dropdown-trigger"
                type="button"
                aria-expanded={isServicesOpen}
                aria-controls="services-dropdown"
                onClick={() => {
                  if (openedByHoverRef.current) {
                    openedByHoverRef.current = false
                    setIsServicesOpen(true)
                    return
                  }
                  setIsServicesOpen((open) => !open)
                }}
              >
                {link.label}
                <ChevronDown aria-hidden="true" />
              </button>
              <div className="nav-dropdown-panel" id="services-dropdown" hidden={!isServicesOpen}>
                <div className="mega-grid">
                  {serviceCategories.map((category, index) => (
                    <section className="mega-column" key={category.title} aria-labelledby={`mega-${index}`}>
                      <span className="nav-dropdown-index">{String(index + 1).padStart(2, '0')}</span>
                      <h3 id={`mega-${index}`}>{category.title}</h3>
                      <p className="mega-intro">{category.intro}</p>
                      <ul>
                        {category.items.map((item) => (
                          <li key={item.title}>
                            <a href="#services" onClick={() => setIsServicesOpen(false)}>
                              <strong>{item.title}</strong>
                              <small>{item.description}</small>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
                <div className="mega-footer">
                  <p>Не знаєте, що обрати? Розрахуйте вартість або напишіть нам — підкажемо.</p>
                  <div className="mega-footer-actions">
                    <a className="mega-link" href="#calculator" onClick={() => setIsServicesOpen(false)}>
                      Калькулятор
                    </a>
                    <a className="nav-dropdown-all" href="#services" onClick={() => setIsServicesOpen(false)}>
                      Усі послуги
                      <ArrowRight aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <a href={link.href} key={link.href}>{link.label}</a>
          ),
        )}
      </nav>

      <div className="header-actions">
        <a className="header-cta" href="#contact">
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
          {links.map((link, index) =>
            link.href === '#services' ? (
              <div className="site-menu-group" key={link.href}>
                <button
                  className="site-menu-toggle"
                  type="button"
                  aria-expanded={isMobileServicesOpen}
                  aria-controls="site-menu-services"
                  onClick={() => setIsMobileServicesOpen((open) => !open)}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {link.label}
                  <ChevronDown aria-hidden="true" />
                </button>
                <ul id="site-menu-services" hidden={!isMobileServicesOpen}>
                  {serviceCategories.map((category) => (
                    <li className="site-menu-category" key={category.title}>
                      <p>{category.title}</p>
                      <ul>
                        {category.items.map((item) => (
                          <li key={item.title}>
                            <a href="#services" onClick={() => setIsMenuOpen(false)}>{item.title}</a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <a href={link.href} key={link.href} onClick={() => setIsMenuOpen(false)}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {link.label}
              </a>
            ),
          )}
          <a href="#contact" onClick={() => setIsMenuOpen(false)}>
            <span>05</span>
            Контакти
          </a>
        </nav>
        <p>Одеса · Україна<br />Працюємо всюди</p>
      </div>
    </header>
  )
}
