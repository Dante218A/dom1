import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react'
import { ConsultationForm } from '@/components/consultation-form'
import { PriceCalculator } from '@/components/price-calculator'
import { ProjectCarousel } from '@/components/project-carousel'
import { HeroPhotoCarousel } from '@/components/hero-photo-carousel'
import { HeroStamp } from '@/components/hero-stamp'
import { SiteHeader } from '@/components/site-header'
import { ServicesSection } from '@/components/services-section'
import { StagesSection } from '@/components/stages-section'

const projects = [
  {
    number: '01',
    name: 'Теплий мінімалізм',
    type: 'Квартира · Київ',
    area: '86 м²',
    image: '/project-apartment.png',
    alt: 'Світла вітальня з дубовою підлогою, дерев’яним столом і м’яким денним світлом',
  },
  {
    number: '02',
    name: 'Дім серед тиші',
    type: 'Приватний будинок · Львівщина',
    area: '142 м²',
    image: '/project-house.png',
    alt: 'Спальня заміського будинку в теплих природних відтінках',
  },
  {
    number: '03',
    name: 'Кава і повільні ранки',
    type: 'Кав’ярня · Львів',
    area: '74 м²',
    image: '/project-cafe.png',
    alt: 'Інтер’єр кав’ярні зі світлою штукатуркою та бордовою м’якою лавою',
  },
]

export function StudioLanding() {
  return (
    <main>
      <SiteHeader />

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow">Одеса · Україна · Працюємо всюди</p>
          <h1 id="hero-title">Простір,<br />у якому живе<br /><em>затишок</em></h1>
          <p className="hero-lead">
            huge world of design — студія інтер’єру, що створює теплі, продумані простори з характером. У кожній деталі, фактурі й ранковому промені.
          </p>
          <div className="hero-actions">
            <a className="pill-button" href="#contact">
              Почати проєкт <ArrowRight aria-hidden="true" />
            </a>
            <a className="round-link" href="#projects" aria-label="Переглянути проєкти">
              <ArrowDownRight aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="hero-visual-wrap">
          <HeroPhotoCarousel />
          <HeroStamp />
        </div>
      </section>

      <section className="intro section-shell" id="about" aria-labelledby="intro-title">
        <p className="eyebrow section-kicker">01 / Наш підхід</p>
        <div className="intro-content">
          <h2 id="intro-title">Дім — це не про квадратні метри. Це про <em>відчуття.</em></h2>
          <div className="intro-aside">
            <p>Ми слухаємо, як ви живете, і перетворюємо це на простір, який підтримує щодня. Спокійно, уважно, без зайвого.</p>
            <a className="text-link" href="#contact">Познайомитись зі студією <ArrowRight aria-hidden="true" /></a>
          </div>
        </div>
        <div className="studio-note"><span>Простір із сенсом</span><span>Заснована у 2018</span><span>Одеса · Україна · всюди</span></div>
      </section>

      <ProjectCarousel projects={projects} />

      <ServicesSection />

      <StagesSection />

      <PriceCalculator />

      <section className="contact-section" id="contact" aria-labelledby="contact-title">
        <div className="contact-copy">
          <p className="eyebrow contact-kicker"><span className="eyebrow-dot" /> 05 / Почнемо з розмови</p>
          <h2 id="contact-title">Маєте місце,<br />яке хочеться <em>відчути?</em></h2>
          <p className="contact-lead">Розкажіть трохи про нього — ми зв’яжемося, щоб домовитись про першу зустріч.</p>
          <div className="contact-details">
            <a href="mailto:hello@tykho.studio">hello@tykho.studio <ArrowUpRight aria-hidden="true" /></a>
            <span>Пн — Пт · 10:00–18:00</span>
          </div>
        </div>
        <div className="contact-form-wrap">
          <ConsultationForm />
        </div>
      </section>

      <footer className="site-footer">
        <a className="wordmark footer-wordmark" href="#top">huge world<small>of design</small></a>
        <p>Створено з увагою до життя.</p>
        <a className="back-top" href="#top">На початок <ArrowUpRight aria-hidden="true" /></a>
        <span className="copyright">© 2025 huge world of design</span>
      </footer>
    </main>
  )
}
