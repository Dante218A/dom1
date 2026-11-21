'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'

type Project = {
  number: string
  name: string
  style: string
  type: string
  area: string
  image: string
  alt: string
}

type ProjectCarouselProps = {
  projects: Project[]
}

export function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setTimeout(() => {
      goToSlide(activeIndex === projects.length - 1 ? 0 : activeIndex + 1)
    }, 5000)
    return () => window.clearTimeout(timer)
  })

  function goToSlide(index: number) {
    const nextIndex = Math.max(0, Math.min(projects.length - 1, index))
    const viewport = viewportRef.current
    const slide = trackRef.current?.children.item(nextIndex) as HTMLElement | null

    if (!viewport || !slide) return

    viewport.scrollTo({
      left: slide.offsetLeft,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    })
    setActiveIndex(nextIndex)
  }

  function updateActiveSlide() {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return

    let nearestIndex = 0
    let nearestDistance = Number.POSITIVE_INFINITY

    Array.from(track.children).forEach((slide, index) => {
      const distance = Math.abs((slide as HTMLElement).offsetLeft - viewport.scrollLeft)
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestIndex = index
      }
    })

    setActiveIndex((currentIndex) => currentIndex === nearestIndex ? currentIndex : nearestIndex)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goToSlide(activeIndex + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goToSlide(activeIndex - 1)
    }
  }

  return (
    <section className="projects section-shell" id="projects" aria-labelledby="projects-title" aria-roledescription="карусель">
      <div className="section-heading">
        <div>
          <p className="eyebrow section-kicker">02 / Обране</p>
          <h2 id="projects-title">Простори, що<br /><em>розповідають.</em></h2>
        </div>
        <div className="section-heading-aside">
          <p className="section-heading-note">Кожен проєкт починається з розмови<br />і закінчується відчуттям «це моє».</p>
          <div className="project-style-chips" role="group" aria-label="Стилі інтер’єру">
            {projects.map((project, index) => (
              <button
                key={project.number}
                type="button"
                className={`project-style-chip${index === activeIndex ? ' is-active' : ''}`}
                aria-pressed={index === activeIndex}
                onClick={() => goToSlide(index)}
              >
                {project.style}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        className="project-carousel-viewport"
        ref={viewportRef}
        role="group"
        aria-label="Гортайте проєкти студії"
        tabIndex={0}
        onScroll={updateActiveSlide}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
      >
        <div className="project-carousel-track" ref={trackRef}>
          {projects.map((project, index) => (
            <article
              className="project-slide"
              key={project.number}
              role="group"
              aria-roledescription="слайд"
              aria-label={`${index + 1} з ${projects.length}: ${project.name}`}
            >
              <a className="project-card" href="#contact">
                <div className="project-image-wrap">
                  <Image src={project.image} alt={project.alt} fill sizes="(max-width: 760px) 88vw, 72vw" />
                  <span className="project-number">{project.number}</span>
                  <span className="project-style">{project.style}</span>
                  <span className="project-arrow" aria-hidden="true"><ArrowUpRight /></span>
                </div>
                <div className="project-meta">
                  <div><h3>{project.name}</h3><p>{project.type}</p></div>
                  <span>{project.area}</span>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>

      <div className="project-carousel-controls">
        <span className="project-carousel-count" aria-hidden="true">
          {String(activeIndex + 1).padStart(2, '0')} <span>/</span> {String(projects.length).padStart(2, '0')}
        </span>
        <div className="project-carousel-dots" role="group" aria-label="Обрати проєкт">
          {projects.map((project, index) => (
            <button
              className={`project-carousel-dot${index === activeIndex ? ' is-active' : ''}`}
              key={project.number}
              type="button"
              aria-label={`Перейти до проєкту ${index + 1}: ${project.name}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
        <div className="project-carousel-arrows">
          <button
            className="project-carousel-arrow"
            type="button"
            aria-label="Попередній проєкт"
            disabled={activeIndex === 0}
            onClick={() => goToSlide(activeIndex - 1)}
          >
            <ArrowLeft aria-hidden="true" />
          </button>
          <button
            className="project-carousel-arrow"
            type="button"
            aria-label="Наступний проєкт"
            disabled={activeIndex === projects.length - 1}
            onClick={() => goToSlide(activeIndex + 1)}
          >
            <ArrowRight aria-hidden="true" />
          </button>
        </div>
        <span className="sr-only" aria-live="polite" aria-atomic="true">
          Проєкт {activeIndex + 1} з {projects.length}: {projects[activeIndex]?.name}
        </span>
      </div>
    </section>
  )
}
