'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Menu, X } from 'lucide-react'

const links = [
  { href: '#projects', label: 'Проєкти' },
  { href: '#services', label: 'Послуги' },
  { href: '#calculator', label: 'Калькулятор' },
  { href: '#about', label: 'Про студію' },
]

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (!isMenuOpen) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="huge world of design — на початок сторінки">
        <span>Huge World</span>
        <small>of design</small>
      </a>

      <nav className="main-nav" aria-label="Головна навігація">
        {links.map((link) => (
          <a href={link.href} key={link.href}>{link.label}</a>
        ))}
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
          {links.map((link, index) => (
            <a href={link.href} key={link.href} onClick={() => setIsMenuOpen(false)}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              {link.label}
            </a>
          ))}
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
