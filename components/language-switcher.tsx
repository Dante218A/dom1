'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

const SOURCE_LANGUAGE = 'uk'
const STORAGE_KEY = 'hw-lang'
const SCRIPT_ID = 'google-translate-script'
const CONTAINER_ID = 'google_translate_element'

const languages = [
  { code: 'uk', label: 'UA', name: 'Українська' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'pl', label: 'PL', name: 'Polski' },
  { code: 'de', label: 'DE', name: 'Deutsch' },
  { code: 'ru', label: 'RU', name: 'Русский' },
] as const

type LanguageCode = (typeof languages)[number]['code']

declare global {
  interface Window {
    googleTranslateElementInit?: () => void
    google?: {
      translate?: {
        TranslateElement: new (options: Record<string, unknown>, elementId: string) => unknown
      }
    }
  }
}

function isLanguageCode(value: string | null): value is LanguageCode {
  return languages.some((language) => language.code === value)
}

function writeTranslateCookie(value: string | null) {
  const expires = value ? '' : '; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  const cookie = `googtrans=${value ?? ''}; path=/${expires}`
  document.cookie = cookie
  document.cookie = `${cookie}; domain=${window.location.hostname}`
}

function loadTranslator(): Promise<void> {
  return new Promise((resolve) => {
    if (window.google?.translate?.TranslateElement && document.getElementById(CONTAINER_ID)?.childElementCount) {
      resolve()
      return
    }

    if (!document.getElementById(CONTAINER_ID)) {
      const container = document.createElement('div')
      container.id = CONTAINER_ID
      container.setAttribute('aria-hidden', 'true')
      document.body.appendChild(container)
    }

    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: SOURCE_LANGUAGE,
            includedLanguages: languages.map((language) => language.code).join(','),
            autoDisplay: false,
          },
          CONTAINER_ID,
        )
      }
      resolve()
    }

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement('script')
      script.id = SCRIPT_ID
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      document.body.appendChild(script)
    }
  })
}

function waitForCombo(timeoutMs = 10000): Promise<HTMLSelectElement | null> {
  return new Promise((resolve) => {
    const startedAt = Date.now()
    const check = () => {
      const combo = document.querySelector<HTMLSelectElement>('select.goog-te-combo')
      if (combo && combo.options.length > 1) {
        resolve(combo)
      } else if (Date.now() - startedAt > timeoutMs) {
        resolve(null)
      } else {
        window.setTimeout(check, 150)
      }
    }
    check()
  })
}

async function translatePage(code: LanguageCode) {
  await loadTranslator()
  const combo = await waitForCombo()
  if (!combo) return false
  combo.value = code
  combo.dispatchEvent(new Event('change'))
  return true
}

export function LanguageSwitcher() {
  const [current, setCurrent] = useState<LanguageCode>(SOURCE_LANGUAGE)
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (isLanguageCode(saved) && saved !== SOURCE_LANGUAGE) {
      setCurrent(saved)
      writeTranslateCookie(`/${SOURCE_LANGUAGE}/${saved}`)
      void translatePage(saved)
    }
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const handlePointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('pointerdown', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('pointerdown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [isOpen])

  const selectLanguage = async (code: LanguageCode) => {
    setIsOpen(false)
    if (code === current) return

    if (code === SOURCE_LANGUAGE) {
      window.localStorage.removeItem(STORAGE_KEY)
      writeTranslateCookie(null)
      window.location.reload()
      return
    }

    window.localStorage.setItem(STORAGE_KEY, code)
    writeTranslateCookie(`/${SOURCE_LANGUAGE}/${code}`)
    setCurrent(code)
    const translated = await translatePage(code)
    if (!translated) window.location.reload()
  }

  const active = languages.find((language) => language.code === current) ?? languages[0]

  return (
    <div className="lang-switcher notranslate" translate="no" ref={rootRef}>
      <button
        type="button"
        className="header-lang"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Мова сайту: ${active.name}`}
        onClick={() => setIsOpen((open) => !open)}
      >
        {active.label}
        <ChevronDown aria-hidden="true" />
      </button>
      {isOpen && (
        <ul className="lang-menu" role="listbox" aria-label="Оберіть мову">
          {languages.map((language) => {
            const selected = language.code === current
            return (
              <li key={language.code} role="option" aria-selected={selected}>
                <button type="button" lang={language.code} onClick={() => selectLanguage(language.code)}>
                  <span className="lang-code">{language.label}</span>
                  <span className="lang-name">{language.name}</span>
                  {selected && <Check aria-hidden="true" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
