'use client'

import Link from 'next/link'
import { useState, type ChangeEvent } from 'react'
import { ArrowUpRight, Check, Ruler } from 'lucide-react'
import { objectCategories, objectHref } from '@/lib/objects'
import { formatUsd, serviceCategories, serviceHref, serviceRates, type ServiceItem } from '@/lib/services'

const allServices = serviceCategories.flatMap((category) => category.items)
const defaultSelection = serviceCategories[0].items.map((item) => item.slug)

const quantityLabels = {
  visit: { label: 'Кількість виїздів', suffix: 'виїзд.', max: 99 },
  hour: { label: 'Кількість годин', suffix: 'год', max: 999 },
  meeting: { label: 'Кількість зустрічей', suffix: 'зустр.', max: 99 },
  percent: { label: 'Бюджет закупівель', suffix: '$', max: 9_999_999 },
} as const

type QuantityUnit = keyof typeof quantityLabels

function isQuantityUnit(unit: string): unit is QuantityUnit {
  return unit in quantityLabels
}

export function PriceCalculator() {
  const [areaInput, setAreaInput] = useState('86')
  const [categorySlug, setCategorySlug] = useState(objectCategories[0].slug)
  const [typeSlug, setTypeSlug] = useState(objectCategories[0].types[0].slug)
  const [selected, setSelected] = useState<string[]>(defaultSelection)
  const [quantities, setQuantities] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      Object.entries(serviceRates)
        .filter(([, rate]) => rate.defaultQuantity !== undefined)
        .map(([slug, rate]) => [slug, String(rate.defaultQuantity)]),
    ),
  )

  const selectedCategory = objectCategories.find((category) => category.slug === categorySlug) ?? objectCategories[0]
  const selectedType = selectedCategory.types.find((type) => type.slug === typeSlug) ?? selectedCategory.types[0]
  const area = Math.min(300, Math.max(20, Number(areaInput) || 20))
  const selectedItems = allServices.filter((item) => selected.includes(item.slug))
  const needsArea = selectedItems.some((item) => serviceRates[item.slug].unit === 'area')
  const allSelected = selected.length === allServices.length

  function quantityOf(slug: string) {
    return Math.max(0, Number(quantities[slug]) || 0)
  }

  function lineFor(item: ServiceItem) {
    const { rate, unit } = serviceRates[item.slug]
    if (unit === 'area') {
      const adjusted = Math.round(rate * selectedType.coefficient * 2) / 2
      return { cost: Math.round(adjusted * area), detail: `${area} м² × ${formatUsd(adjusted)}` }
    }
    if (unit === 'fixed') return { cost: rate, detail: 'Фіксована вартість' }
    const quantity = quantityOf(item.slug)
    if (unit === 'percent') {
      return { cost: Math.round((quantity * rate) / 100), detail: `${rate}% від ${formatUsd(quantity)}` }
    }
    return { cost: rate * quantity, detail: `${quantity} × ${formatUsd(rate)}` }
  }

  const lines = selectedItems.map((item) => ({ item, ...lineFor(item) }))
  const total = lines.reduce((sum, line) => sum + line.cost, 0)

  function toggle(slug: string) {
    setSelected((current) => (current.includes(slug) ? current.filter((value) => value !== slug) : [...current, slug]))
  }

  function toggleGroup(slugs: string[]) {
    setSelected((current) => {
      const everyChecked = slugs.every((slug) => current.includes(slug))
      return everyChecked
        ? current.filter((slug) => !slugs.includes(slug))
        : [...current, ...slugs.filter((slug) => !current.includes(slug))]
    })
  }

  function toggleAll() {
    setSelected(allSelected ? [] : allServices.map((item) => item.slug))
  }

  function handleQuantityChange(slug: string, max: number, event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value.replace(/\D/g, '')
    if (value === '' || Number(value) <= max) setQuantities((current) => ({ ...current, [slug]: value }))
  }

  function handleAreaChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    if (value === '' || /^\d{1,3}$/.test(value)) setAreaInput(value)
  }

  return (
    <section className="price-calculator section-shell" id="calculator" aria-labelledby="calculator-title">
      <div className="calculator-intro">
        <p className="eyebrow section-kicker">04 / Орієнтир за вартістю</p>
        <h2 id="calculator-title">Порахуємо<br />ваш <em>простір.</em></h2>
        <p>Оберіть тип об’єкта та потрібні послуги — окремі пункти або все разом. Калькулятор одразу покаже прорахунок кожного пункту і загальну суму.</p>
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

        <div className="calculator-step">
          <div className="calc-services-head">
            <span className="calculator-label" id="calc-services-label">03 · Послуги</span>
            <button type="button" className="calc-select-all" onClick={toggleAll} aria-pressed={allSelected}>
              {allSelected ? 'Зняти всі' : 'Обрати всі'}
            </button>
          </div>

          <div className="calc-groups" role="group" aria-labelledby="calc-services-label">
            {serviceCategories.map((category, index) => {
              const slugs = category.items.map((item) => item.slug)
              const checkedCount = slugs.filter((slug) => selected.includes(slug)).length
              const groupChecked = checkedCount === slugs.length
              return (
                <fieldset className="calc-group" key={category.slug}>
                  <legend className="sr-only">{category.title}</legend>
                  <div className="calc-group-head">
                    <span className="calc-group-index">{String(index + 1).padStart(2, '0')}</span>
                    <span className="calc-group-title">{category.title}</span>
                    <label className={`calc-group-toggle${groupChecked ? ' is-checked' : ''}`}>
                      <input
                        type="checkbox"
                        checked={groupChecked}
                        ref={(element) => {
                          if (element) element.indeterminate = checkedCount > 0 && !groupChecked
                        }}
                        onChange={() => toggleGroup(slugs)}
                      />
                      <span className="calc-box" aria-hidden="true"><Check /></span>
                      Усі
                    </label>
                  </div>

                  <ul className="calc-items">
                    {category.items.map((item) => {
                      const isChecked = selected.includes(item.slug)
                      const { unit } = serviceRates[item.slug]
                      const quantity = isQuantityUnit(unit) ? quantityLabels[unit] : null
                      return (
                        <li className={`calc-item${isChecked ? ' is-checked' : ''}`} key={item.slug}>
                          <label className="calc-item-main">
                            <input type="checkbox" checked={isChecked} onChange={() => toggle(item.slug)} />
                            <span className="calc-box" aria-hidden="true"><Check /></span>
                            <span className="calc-item-copy">
                              <span className="calc-item-title">{item.title}</span>
                              <span className="calc-item-description">{item.description}</span>
                            </span>
                            <span className="calc-item-price">{item.price}</span>
                          </label>
                          <div className="calc-item-footer">
                            {isChecked && quantity && (
                              <label className="calc-qty">
                                <span>{quantity.label}</span>
                                <span className="calc-qty-field">
                                  <input
                                    type="text"
                                    inputMode="numeric"
                                    value={quantities[item.slug] ?? ''}
                                    onChange={(event) => handleQuantityChange(item.slug, quantity.max, event)}
                                  />
                                  <span>{quantity.suffix}</span>
                                </span>
                              </label>
                            )}
                            <Link className="calc-item-link" href={serviceHref(item.slug)}>
                              Про послугу <ArrowUpRight aria-hidden="true" />
                            </Link>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </fieldset>
              )
            })}
          </div>
        </div>

        {needsArea && (
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
                  onBlur={() => setAreaInput(String(area))}
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

        <div className="calc-breakdown" aria-live="polite">
          <div className="calc-breakdown-head">
            <span className="calculator-label">Прорахунок</span>
            <span className="calc-breakdown-type">{selectedType.title}</span>
          </div>
          {lines.length === 0 ? (
            <p className="calc-breakdown-empty">Оберіть хоча б одну послугу, щоб побачити прорахунок.</p>
          ) : (
            <ul className="calc-lines">
              {lines.map((line) => (
                <li key={line.item.slug}>
                  <span className="calc-line-title">{line.item.title}</span>
                  <span className="calc-line-detail">{line.detail}</span>
                  <span className="calc-line-cost">{formatUsd(line.cost)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="calculator-result" aria-live="polite" aria-atomic="true">
          <div className="calculator-result-copy">
            <p>Разом орієнтовно</p>
            <strong>{lines.length ? `≈ ${formatUsd(total)}` : '—'}</strong>
            <span>{lines.length} {lines.length === 1 ? 'послуга' : lines.length < 5 && lines.length > 1 ? 'послуги' : 'послуг'} · {selectedType.title}</span>
          </div>
          <a className="calculator-cta" href="#contact" aria-label="Обговорити розрахунок із дизайнером">
            <span>Обговорити розрахунок</span><ArrowUpRight aria-hidden="true" />
          </a>
        </div>
        <p className="calculator-disclaimer">Це попередня оцінка. Ціни в доларах США за ринком Одеси; оплата можлива в гривнях за курсом НБУ на день платежу. Точна вартість залежить від складу робіт і обговорюється після знайомства з проєктом.</p>
      </div>
    </section>
  )
}
