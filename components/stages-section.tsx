'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const stages = [
  {
    title: 'Знайомство, обміри та ТЗ',
    short: 'Обміри й бриф',
    image: '/images/stages/stage-1.png',
    alt: 'Дизайнер вимірює стіну лазерним далекоміром у порожній квартирі',
    points: [
      'Дизайнер виїжджає на об’єкт, робить точні заміри всіх стін, висот, вікон і комунікацій (або замовляє лазерне 3D-сканування).',
      'Замовник заповнює анкету (бриф): описує свій спосіб життя, склад сім’ї, побажання щодо стилю, необхідну техніку та орієнтовний бюджет на ремонт.',
    ],
  },
  {
    title: 'Планувальне рішення',
    short: 'Зонування',
    image: '/images/stages/stage-2.png',
    alt: 'Ескізи планувань квартири з варіантами розстановки меблів',
    points: [
      'Розробляються 2–4 варіанти зонування приміщення та розстановки меблів.',
      'На цьому етапі закладається ергономіка: чи зручно відкриватимуться двері, чи достатньо місця для проходу, де стоятиме пральна машина тощо.',
    ],
  },
  {
    title: 'Стильова концепція',
    short: 'Мудборди',
    image: '/images/stages/stage-3.png',
    alt: 'Мудборд зі зразками тканин, каменю, дерева та фарби',
    points: [
      'Дизайнер підбирає референси (приклади), кольорову гаму, основні матеріали та текстури для кожної кімнати, щоб узгодити загальний настрій інтер’єру.',
    ],
  },
  {
    title: '3D-візуалізація',
    short: 'Візуалізація',
    image: '/images/stages/stage-4.png',
    alt: 'Фотореалістична візуалізація вітальні з бежевим диваном і травертиновим столиком',
    points: [
      'Створюються фотореалістичні зображення майбутнього інтер’єру.',
      'Це дозволяє замовнику побачити, як поєднуються кольори, меблі та освітлення ще до початку витрат на ремонт.',
    ],
  },
  {
    title: 'Робоча документація',
    short: 'Креслення',
    image: '/images/stages/stage-5.png',
    alt: 'Альбом технічних креслень квартири з планами електрики та освітлення',
    points: [
      'Готується альбом технічних креслень для будівельників: плани демонтажу та монтажу перегородок.',
      'Схеми розташування розеток, вимикачів, світильників і сантехніки, плани підлоги, стелі та розкладки плитки.',
    ],
  },
]

const pad = (n: number) => String(n).padStart(2, '0')

export function StagesSection() {
  const [active, setActive] = useState(0)
  const stage = stages[active]
  const progress = ((active + 1) / stages.length) * 100

  const go = (delta: number) => setActive((current) => (current + delta + stages.length) % stages.length)

  return (
    <section className="stages section-shell" id="stages" aria-labelledby="stages-title">
      <header className="stages-head">
        <div>
          <p className="eyebrow section-kicker">Етапи роботи</p>
          <h2 id="stages-title">П’ять кроків<br />до вашого <em>інтер’єру.</em></h2>
        </div>
        <p className="stages-lead">Кожен етап завершується погодженням — ви точно знаєте, що отримаєте, ще до початку ремонту.</p>
      </header>

      <div className="stages-body">
        <div className="stages-nav" role="tablist" aria-label="Етапи роботи" style={{ '--stage-progress': `${progress}%` } as React.CSSProperties}>
          <span className="stages-rail" aria-hidden="true" />
          {stages.map((item, index) => (
            <button
              key={item.title}
              type="button"
              role="tab"
              id={`stage-tab-${index}`}
              aria-selected={index === active}
              aria-controls="stage-panel"
              className={`stage-tab${index === active ? ' is-active' : ''}${index < active ? ' is-done' : ''}`}
              onClick={() => setActive(index)}
            >
              <span className="stage-tab-dot" aria-hidden="true" />
              <span className="stage-tab-num">{pad(index + 1)}</span>
              <span className="stage-tab-text">
                <span className="stage-tab-title">{item.title}</span>
                <span className="stage-tab-short">{item.short}</span>
              </span>
            </button>
          ))}
        </div>

        <article className="stage-panel" id="stage-panel" role="tabpanel" aria-labelledby={`stage-tab-${active}`}>
          <div className="stage-media" key={stage.image}>
            <Image src={stage.image} alt={stage.alt} fill sizes="(max-width: 1000px) 100vw, 55vw" className="stage-image" />
            <span className="stage-counter">{pad(active + 1)} <i>/ {pad(stages.length)}</i></span>
          </div>
          <div className="stage-content" key={stage.title}>
            <span className="stage-big-num" aria-hidden="true">{pad(active + 1)}</span>
            <div className="stage-copy">
              <h3>{stage.title}</h3>
              <ul>
                {stage.points.map((point) => <li key={point}>{point}</li>)}
              </ul>
            </div>
            <div className="stage-controls">
              <button type="button" onClick={() => go(-1)} aria-label="Попередній етап"><ArrowLeft aria-hidden="true" /></button>
              <button type="button" onClick={() => go(1)} aria-label="Наступний етап"><ArrowRight aria-hidden="true" /></button>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
