'use client'

import Image from 'next/image'
import { useRef, useState, type KeyboardEvent, type TouchEvent } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const slides = [
  {
    image: '/studio-hero.png',
    alt: 'Сонячна вітальня у природній палітрі з м’яким диваном і скульптурним столиком',
    caption: 'Квартира на Подолі · 2025',
  },
  {
    image: '/project-house.png',
    alt: 'Спальня заміського будинку в теплих природних відтінках',
    caption: 'Дім серед тиші · Львівщина',
  },
  {
    image: '/project-cafe.png',
    alt: 'Інтер’єр кав’ярні зі світлою штукатуркою та бордовою м’якою лавою',
    caption: 'Кава і повільні ранки · Львів',
  },
]

export function HeroPhotoCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)

  function showSlide(index: number) {
    setActiveIndex(Math.max(0, Math.min(slides.length - 1, index)))
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      showSlide(activeIndex + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      showSlide(activeIndex - 1)
    }
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const endX = event.changedTouches[0]?.clientX
    if (touchStartX.current === null || endX === undefined) return

    const distance = touchStartX.current - endX
    if (distance > 48) showSlide(activeIndex + 1)
    if (distance < -48) showSlide(activeIndex - 1)
    touchStartX.current = null
  }

  return (
    <div
      className="hero-visual hero-carousel"
      role="group"
      aria-label="Фото інтер’єрів студії"
      aria-roledescription="карусель"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((slide, index) => (
        <div className={`hero-slide${index === activeIndex ? ' is-active' : ''}`} key={slide.image} aria-hidden={index !== activeIndex}>
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            priority={index === 0}
            sizes="(max-width: 760px) 100vw, 55vw"
            className="hero-image"
          />
        </div>
      ))}

      <div className="image-caption" aria-live="polite" aria-atomic="true">
        <span>{String(activeIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
        <span>{slides[activeIndex].caption}</span>
      </div>
      <dl className="hero-stats">
        <div><dt>Реалізованих проєктів</dt><dd>120+</dd></div>
        <div><dt>Років досвіду</dt><dd>8</dd></div>
        <div><dt>Міст і країн</dt><dd>15+</dd></div>
      </dl>

      <div className="hero-carousel-controls" role="group" aria-label="Керування каруселлю">
        <button
          className="hero-carousel-arrow"
          type="button"
          aria-label="Попереднє фото"
          disabled={activeIndex === 0}
          onClick={() => showSlide(activeIndex - 1)}
        >
          <ArrowLeft aria-hidden="true" />
        </button>
        <div className="hero-carousel-dots" role="group" aria-label="Обрати фото">
          {slides.map((slide, index) => (
            <button
              className={`hero-carousel-dot${index === activeIndex ? ' is-active' : ''}`}
              key={slide.image}
              type="button"
              aria-label={`Показати фото ${index + 1}: ${slide.caption}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => showSlide(index)}
            />
          ))}
        </div>
        <button
          className="hero-carousel-arrow"
          type="button"
          aria-label="Наступне фото"
          disabled={activeIndex === slides.length - 1}
          onClick={() => showSlide(activeIndex + 1)}
        >
          <ArrowRight aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
