import Image from 'next/image'
import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react'
import { ConsultationForm } from '@/components/consultation-form'
import { PriceCalculator } from '@/components/price-calculator'

const projects = [
  {
    number: '01',
    name: 'Теплий мінімалізм',
    type: 'Квартира · Київ',
    area: '86 м²',
    image: '/project-apartment.png',
    alt: 'Світла вітальня з дубовою підлогою, дерев’яним столом і м’яким денним світлом',
    className: 'project-card project-card-tall',
  },
  {
    number: '02',
    name: 'Дім серед тиші',
    type: 'Приватний будинок · Львівщина',
    area: '142 м²',
    image: '/project-house.png',
    alt: 'Спальня заміського будинку в теплих природних відтінках',
    className: 'project-card project-card-offset',
  },
  {
    number: '03',
    name: 'Кава і повільні ранки',
    type: 'Кав’ярня · Львів',
    area: '74 м²',
    image: '/project-cafe.png',
    alt: 'Інтер’єр кав’ярні зі світлою штукатуркою та бордовою м’якою лавою',
    className: 'project-card project-card-wide',
  },
]

const services = [
  {
    number: '01',
    title: 'Планувальне рішення',
    detail: 'Функціональні сценарії, розміщення меблів і 2 варіанти планування.',
    price: 'від 900 ₴ / м²',
  },
  {
    number: '02',
    title: 'Повний дизайн-проєкт',
    detail: 'Від концепції та візуалізацій до креслень для реалізації.',
    price: 'від 2 400 ₴ / м²',
  },
  {
    number: '03',
    title: 'Авторський супровід',
    detail: 'Дбайливо ведемо проєкт на будівництві й допомагаємо з вибором.',
    price: 'від 18 000 ₴ / місяць',
  },
  {
    number: '04',
    title: 'Консультація',
    detail: 'Зустріч онлайн або в студії: розберемо ваш простір і запит.',
    price: '2 500 ₴ / 90 хв',
  },
]

export function StudioLanding() {
  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Тихо — на початок сторінки">
          тихо<span>.</span>
          <small>студія інтер’єру</small>
        </a>
        <nav className="main-nav" aria-label="Головна навігація">
          <a href="#projects">Проєкти</a>
          <a href="#services">Послуги</a>
          <a href="#calculator">Калькулятор</a>
          <a href="#about">Про студію</a>
        </nav>
        <a className="header-contact" href="#contact">
          Обговорити проєкт <ArrowUpRight aria-hidden="true" />
        </a>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> Київ · Україна · Працюємо всюди</p>
          <h1 id="hero-title">Простір,<br />у якому <em>добре</em><br />бути собою.</h1>
          <div className="hero-bottom">
            <p>Створюємо інтер’єри, що відчуваються вашими — у кожній деталі, фактурі й ранковому промені.</p>
            <a className="round-link" href="#projects" aria-label="Перейти до проєктів">
              <ArrowDownRight aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <Image
            src="/studio-hero.png"
            alt="Сонячна вітальня у природній палітрі з м’яким диваном і скульптурним столиком"
            fill
            priority
            sizes="(max-width: 760px) 100vw, 55vw"
            className="hero-image"
          />
          <div className="image-caption"><span>01 / 03</span><span>Квартира на Подолі · 2025</span></div>
          <span className="hero-stamp" aria-hidden="true">простір<br />для життя</span>
        </div>
        <div className="hero-index"><span>Інтер’єри з відчуттям дому</span><span>01 — 04</span></div>
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
        <div className="studio-note"><span>Тихо — простір із сенсом</span><span>Заснована у 2018</span><span>Київ · Львів · всюди</span></div>
      </section>

      <section className="projects section-shell" id="projects" aria-labelledby="projects-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow section-kicker">02 / Обране</p>
            <h2 id="projects-title">Простори, що<br /><em>розповідають.</em></h2>
          </div>
          <p className="section-heading-note">Кожен проєкт починається з розмови<br />і закінчується відчуттям «це моє».</p>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <a className={project.className} href="#contact" key={project.number}>
              <div className="project-image-wrap">
                <Image src={project.image} alt={project.alt} fill sizes="(max-width: 760px) 100vw, 45vw" />
                <span className="project-number">{project.number}</span>
                <span className="project-arrow" aria-hidden="true"><ArrowUpRight /></span>
              </div>
              <div className="project-meta">
                <div><h3>{project.name}</h3><p>{project.type}</p></div>
                <span>{project.area}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="services section-shell" id="services" aria-labelledby="services-title">
        <div className="services-intro">
          <p className="eyebrow section-kicker">03 / Як допомагаємо</p>
          <h2 id="services-title">Від першої<br />ідеї до <em>втілення.</em></h2>
          <p className="services-copy">Можна почати з одного кроку — ми підберемо формат саме під ваш простір і темп.</p>
          <a className="text-link" href="#contact">Підібрати послугу <ArrowRight aria-hidden="true" /></a>
        </div>
        <div className="service-list">
          {services.map((service) => (
            <a className="service-row" href="#contact" key={service.number}>
              <span className="service-number">{service.number}</span>
              <div className="service-description"><h3>{service.title}</h3><p>{service.detail}</p></div>
              <span className="service-price">{service.price}</span>
              <ArrowUpRight className="service-arrow" aria-hidden="true" />
            </a>
          ))}
          <p className="price-note">* Остаточна вартість залежить від площі та складу робіт.</p>
        </div>
      </section>

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
        <a className="wordmark footer-wordmark" href="#top">тихо<span>.</span><small>студія інтер’єру</small></a>
        <p>Створено з увагою до життя.</p>
        <a className="back-top" href="#top">На початок <ArrowUpRight aria-hidden="true" /></a>
        <span className="copyright">© 2025 Тихо</span>
      </footer>
    </main>
  )
}
