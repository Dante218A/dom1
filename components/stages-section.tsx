'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Clock, FileCheck } from 'lucide-react'

type Stage = {
  title: string
  short: string
  duration: string
  result: string
  image: string
  alt: string
  steps: { title: string; text: string }[]
}

const stages: Stage[] = [
  {
    title: 'Знайомство, обміри та ТЗ',
    short: 'Обміри й бриф',
    duration: '1–3 дні',
    result: 'Обмірний план і заповнений бриф',
    image: '/images/stages/stage-1.png',
    alt: 'Дизайнер вимірює стіну лазерним далекоміром у порожній квартирі',
    steps: [
      { title: 'Зустріч на об’єкті', text: 'Знайомимось, обговорюємо задачі, оглядаємо приміщення.' },
      { title: 'Точні обміри', text: 'Заміряємо стіни, висоти, вікна й комунікації або робимо лазерне 3D-сканування.' },
      { title: 'Бриф', text: 'Ви описуєте спосіб життя, склад сім’ї, стиль, потрібну техніку та орієнтовний бюджет.' },
    ],
  },
  {
    title: 'Планувальне рішення',
    short: 'Зонування',
    duration: '5–7 днів',
    result: 'Затверджене планування з меблями',
    image: '/images/stages/stage-2.png',
    alt: 'Ескізи планувань квартири з варіантами розстановки меблів',
    steps: [
      { title: '2–4 варіанти', text: 'Пропонуємо кілька сценаріїв зонування та розстановки меблів.' },
      { title: 'Ергономіка', text: 'Перевіряємо проходи, відкривання дверей, місця для техніки та зберігання.' },
      { title: 'Погодження', text: 'Доопрацьовуємо обраний варіант і фіксуємо фінальне планування.' },
    ],
  },
  {
    title: 'Стильова концепція',
    short: 'Мудборди',
    duration: '5–7 днів',
    result: 'Мудборди для кожної кімнати',
    image: '/images/stages/stage-3.png',
    alt: 'Мудборд зі зразками тканин, каменю, дерева та фарби',
    steps: [
      { title: 'Референси', text: 'Збираємо приклади інтер’єрів, що передають ваш настрій.' },
      { title: 'Палітра й матеріали', text: 'Підбираємо кольори, текстури, камінь, дерево, тканини.' },
      { title: 'Мудборди', text: 'Збираємо концепцію по кожній кімнаті та погоджуємо її з вами.' },
    ],
  },
  {
    title: '3D-візуалізація',
    short: 'Візуалізація',
    duration: '2–4 тижні',
    result: 'Фотореалістичні ракурси всіх приміщень',
    image: '/images/stages/stage-4.png',
    alt: 'Фотореалістична візуалізація вітальні з бежевим диваном і травертиновим столиком',
    steps: [
      { title: '3D-модель', text: 'Будуємо точну модель простору з меблями та освітленням.' },
      { title: 'Ракурси', text: 'Готуємо фотореалістичні зображення кожної кімнати.' },
      { title: 'Правки', text: 'Коригуємо кольори й деталі, доки результат вам не сподобається.' },
    ],
  },
  {
    title: 'Робоча документація',
    short: 'Креслення',
    duration: '2–3 тижні',
    result: 'Альбом креслень для будівельників',
    image: '/images/stages/stage-5.png',
    alt: 'Альбом технічних креслень квартири з планами електрики та освітлення',
    steps: [
      { title: 'Будівельні плани', text: 'Плани демонтажу та монтажу перегородок, підлоги та стелі.' },
      { title: 'Інженерні схеми', text: 'Розетки, вимикачі, світильники, сантехніка, розкладка плитки.' },
      { title: 'Передача альбому', text: 'Видаємо готовий альбом і пояснюємо його вашій бригаді.' },
    ],
  },
]

const pad = (n: number) => String(n).padStart(2, '0')

export function StagesSection() {
  const [active, setActive] = useState(0)
  const stage = stages[active]
  const progress = (active / (stages.length - 1)) * 100

  const go = (delta: number) => setActive((current) => (current + delta + stages.length) % stages.length)

  return (
    <section className="stages section-shell" id="stages" aria-labelledby="stages-title">
      <header className="stages-head">
        <div>
          <p className="eyebrow section-kicker">04 / Етапи роботи</p>
          <h2 id="stages-title">П’ять кроків<br />до вашого <em>інтер’єру.</em></h2>
        </div>
        <p className="stages-lead">Кожен етап завершується погодженням — ви точно знаєте, що отримаєте, ще до початку ремонту.</p>
      </header>

      <div
        className="stages-map"
        role="tablist"
        aria-label="Схема етапів роботи"
        style={{ '--stage-progress': `${progress}%` } as React.CSSProperties}
      >
        <span className="stages-map-rail" aria-hidden="true" />
        {stages.map((item, index) => {
          const state = index === active ? ' is-active' : index < active ? ' is-done' : ''
          return (
            <button
              key={item.title}
              type="button"
              role="tab"
              id={`stage-tab-${index}`}
              aria-selected={index === active}
              aria-controls="stage-panel"
              className={`stage-node${state}`}
              onClick={() => setActive(index)}
            >
              <span className="stage-node-dot" aria-hidden="true">
                {index < active ? <Check /> : pad(index + 1)}
              </span>
              <span className="stage-node-title">{item.short}</span>
              <span className="stage-node-time">{item.duration}</span>
            </button>
          )
        })}
      </div>

      <article className="stage-panel" id="stage-panel" role="tabpanel" aria-labelledby={`stage-tab-${active}`}>
        <div className="stage-media" key={stage.image}>
          <Image src={stage.image} alt={stage.alt} fill sizes="(max-width: 1000px) 100vw, 45vw" className="stage-image" />
          <span className="stage-counter">{pad(active + 1)} <i>/ {pad(stages.length)}</i></span>
        </div>

        <div className="stage-content" key={stage.title}>
          <div className="stage-copy">
            <p className="stage-step-label">Етап {pad(active + 1)}</p>
            <h3>{stage.title}</h3>
          </div>

          <ol className="stage-flow" aria-label={`Покрокова схема: ${stage.title}`}>
            {stage.steps.map((step, index) => (
              <li key={step.title} className="stage-flow-item">
                <span className="stage-flow-marker" aria-hidden="true">{index + 1}</span>
                <div>
                  <p className="stage-flow-title">{step.title}</p>
                  <p className="stage-flow-text">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <dl className="stage-meta">
            <div>
              <dt><Clock aria-hidden="true" /> Термін</dt>
              <dd>{stage.duration}</dd>
            </div>
            <div>
              <dt><FileCheck aria-hidden="true" /> Результат</dt>
              <dd>{stage.result}</dd>
            </div>
          </dl>

          <div className="stage-controls">
            <button type="button" onClick={() => go(-1)} aria-label="Попередній етап"><ArrowLeft aria-hidden="true" /></button>
            <button type="button" onClick={() => go(1)} aria-label="Наступний етап"><ArrowRight aria-hidden="true" /></button>
          </div>
        </div>
      </article>
    </section>
  )
}
