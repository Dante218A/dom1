'use client'

import Link from 'next/link'
import { useState, type ChangeEvent } from 'react'
import { ArrowUpRight, Check, Ruler } from 'lucide-react'
import { objectCategories, objectHref } from '@/lib/objects'

const services = [
  {
    id: 'planning',
    name: 'Планування',
    description: '2 варіанти · від 900 ₴ / м²',
    rate: 900,
    unit: 'area',
  },
  {
    id: 'design',
    name: 'Дизайн-проєкт',
    description: 'Повний проєкт · від 2 400 ₴ / м²',
    rate: 2400,
    unit: 'area',
  },
  {
    id: 'supervision',
    name: 'Авторський супровід',
    description: 'Контроль реалізації · від 18 000 ₴ / місяць',
    rate: 18000,
    unit: 'month',
  },
  {
    id: 'consultation',
    name: 'Консультація',
    description: '90 хвилин · 2 500 ₴',
    rate: 2500,
    unit: 'fixed',
  },
] as const

const currency = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 0 })

export function PriceCalculator() {
  const [serviceId, setServiceId] = useState<(typeof services)[number]['id']>('design')
  const [areaInput, setAreaInput] = useState('86')

  const [categorySlug, setCategorySlug] = useState(objectCategories[0].slug)
  const [typeSlug, setTypeSlug] = useState(objectCategories[0].types[0].slug)

  const selectedCategory = objectCategories.find((category) => category.slug === categorySlug) ?? objectCategories[0]
  const selectedType = selectedCategory.types.find((type) => type.slug === typeSlug) ?? selectedCategory.types[0]
  const selectedService = services.find((service) => service.id === serviceId) ?? services[1]
  const area = Math.min(300, Math.max(20, Number(areaInput) || 20))
  const adjustedRate = Math.round((selectedService.rate * selectedType.coefficient) / 10) * 10
  const estimate = selectedService.unit === 'area' ? area * adjustedRate : selectedService.rate
  const formattedEstimate = currency.format(estimate)
  const estimateLabel = selectedService.unit === 'month'
    ? `від ${formattedEstimate} ₴ / місяць`
    : `${selectedService.unit === 'area' ? '≈ ' : ''}${formattedEstimate} ₴`
  const estimateDetails = selectedService.unit === 'area'
    ? `${selectedType.title} · ${area} м² × ${currency.format(adjustedRate)} ₴ / м²`
    : selectedService.unit === 'month'
      ? 'Початкова вартість за один місяць супроводу'
      : 'Фіксована вартість консультації на 90 хвилин'

  function handleAreaChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    if (value === '' || /^\d{1,3}$/.test(value)) setAreaInput(value)
  }

  function normalizeArea() {
    setAreaInput(String(area))
  }

  return (
    <section className="price-calculator section-shell" id="calculator" aria-labelledby="calculator-title">
      <div className="calculator-intro">
        <p className="eyebrow section-kicker">04 / Орієнтир за вартістю</p>
        <h2 id="calculator-title">Порахуємо<br />ваш <em>простір.</em></h2>
        <p>Оберіть категорію та тип об’єкта, послугу і площу — калькулятор покаже попередню оцінку за нашими базовими тарифами.</p>
        <div className="calculator-caption"><Ruler aria-hidden="true" /><span>Прозоро з першого кроку</span></div>
      </div>

      <div className="calculator-panel">
        <fieldset className="calculator-service-fieldset">
          <legend className="calculator-label">01 · Категорія об’єкта</legend>
          <div className="object-tabs">
            {objectCategories.map((category) => (
              <label className={`object-tab${category.slug === selectedCategory.slug ? ' is-selected' : ''}`} key={category.slug}>
                <input
                  type="radio"
                  name="calculator-category"
                  value={category.slug}
                  checked={category.slug === selectedCategory.slug}
                  onChange={() => {
                    setCategorySlug(category.slug)
                    setTypeSlug(category.types[0].slug)
                  }}
                />
                {category.title}
              </label>
            ))}
          </div>
          <p className="object-intro">{selectedCategory.intro}</p>
        </fieldset>

        <fieldset className="calculator-service-fieldset calculator-step">
          <legend className="calculator-label">02 · Тип об’єкта</legend>
          <ul className="object-types">
            {selectedCategory.types.map((type) => (
              <li className={`object-type${type.slug === selectedType.slug ? ' is-selected' : ''}`} key={type.slug}>
                <label>
                  <input
                    type="radio"
                    name="calculator-type"
                    value={type.slug}
                    checked={type.slug === selectedType.slug}
                    onChange={() => setTypeSlug(type.slug)}
                  />
                  <span className="object-type-title">{type.title}<Check aria-hidden="true" /></span>
                  <span className="object-type-description">{type.description}</span>
                </label>
                <Link className="object-type-link" href={objectHref(type.slug)} aria-label={`Детальніше: ${type.title}`}>
                  Детальніше <ArrowUpRight aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </fieldset>

        <fieldset className="calculator-service-fieldset calculator-step">
          <legend className="calculator-label">03 · Що вас цікавить?</legend>
          <div className="calculator-options">
            {services.map((service) => (
              <label className={`calculator-option${service.id === serviceId ? ' is-selected' : ''}`} key={service.id}>
                <input
                  type="radio"
                  name="calculator-service"
                  value={service.id}
                  checked={service.id === serviceId}
                  onChange={() => setServiceId(service.id)}
                />
                <span className="calculator-option-title">{service.name}<Check aria-hidden="true" /></span>
                <span className="calculator-option-description">{service.description}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {selectedService.unit === 'area' && (
          <div className="calculator-area">
            <div className="calculator-area-heading">
              <label className="calculator-label" htmlFor="calculator-area">04 · Площа приміщення</label>
              <div className="area-input-wrap">
                <input
                  id="calculator-area"
                  type="number"
                  min={20}
                  max={300}
                  step={1}
                  inputMode="numeric"
                  value={areaInput}
                  onChange={handleAreaChange}
                  onBlur={normalizeArea}
                  aria-describedby="area-hint"
                />
                <span>м²</span>
              </div>
            </div>
            <input
              className="area-slider"
              type="range"
              min={20}
              max={300}
              step={1}
              value={area}
              onChange={(event) => setAreaInput(event.target.value)}
              aria-label="Площа приміщення в квадратних метрах"
            />
            <div className="area-range-labels" id="area-hint"><span>20 м²</span><span>300 м²</span></div>
          </div>
        )}

        <div className="calculator-result" aria-live="polite" aria-atomic="true">
          <div className="calculator-result-copy">
            <p>Орієнтовна вартість</p>
            <strong>{estimateLabel}</strong>
            <span>{estimateDetails}</span>
          </div>
          <a className="calculator-cta" href="#contact" aria-label="Обговорити розрахунок із дизайнером">
            <span>Обговорити розрахунок</span><ArrowUpRight aria-hidden="true" />
          </a>
        </div>
        <p className="calculator-disclaimer">Це попередня оцінка. Точна вартість залежить від складу робіт і обговорюється після знайомства з проєктом.</p>
      </div>
    </section>
  )
}
