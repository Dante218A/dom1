import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { drawings, exampleProject, visualizations, workScope } from '@/lib/design-example'

export const metadata: Metadata = {
  title: 'Приклади дизайн-проєкту — huge world of design',
  description:
    'Приклад дизайн-проєкту інтер’єру: 3D-візуалізації, робочі креслення та повний опис робіт, які ви отримуєте від студії huge world of design.',
}

export default function DesignExamplePage() {
  return (
    <main>
      <SiteHeader />

      <section className="service-page section-shell example-page" aria-labelledby="example-title">
        <nav className="breadcrumbs" aria-label="Навігаційний ланцюжок">
          <Link href="/">Головна</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Приклади проєкту</span>
        </nav>

        <header className="example-hero">
          <div>
            <p className="eyebrow">Приклад дизайн-проєкту</p>
            <h1 id="example-title">
              Що ви отримуєте <em>в альбомі проєкту</em>
            </h1>
            <p className="service-page-lead">
              Показуємо реальну структуру нашого дизайн-проєкту на прикладі квартири: від фотореалістичних
              візуалізацій до креслень, за якими будівельники виконують ремонт.
            </p>
          </div>
          <dl className="example-meta">
            <div className="example-meta-title">
              <dt>Об’єкт</dt>
              <dd>{exampleProject.title}</dd>
            </div>
            {exampleProject.meta.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </header>

        <nav className="example-tabs" aria-label="Розділи прикладу">
          <a href="#vizualizatsii">01 Візуалізації</a>
          <a href="#kreslennia">02 Креслення</a>
          <a href="#opys-robit">03 Опис робіт</a>
        </nav>

        <section id="vizualizatsii" className="example-block" aria-labelledby="viz-title">
          <div className="example-block-head">
            <p className="eyebrow">01 / Візуалізації</p>
            <h2 id="viz-title">Ви бачите інтер’єр ще до ремонту</h2>
          </div>
          <div className="example-viz-grid">
            {visualizations.map((item, index) => (
              <figure key={item.src} className={index === 0 ? 'example-viz example-viz--wide' : 'example-viz'}>
                <div className="example-viz-media">
                  <Image src={item.src} alt={`3D-візуалізація: ${item.title}`} fill sizes="(max-width: 900px) 100vw, 60vw" />
                </div>
                <figcaption>
                  <strong>{item.title}</strong>
                  <span>{item.note}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section id="kreslennia" className="example-block" aria-labelledby="drawings-title">
          <div className="example-block-head">
            <p className="eyebrow">02 / Креслення</p>
            <h2 id="drawings-title">Робоча документація для будівельників</h2>
            <p>У повному альбомі — 25–40 аркушів. Нижче кілька з них.</p>
          </div>
          <div className="example-drawings">
            {drawings.map((item) => (
              <figure key={item.src} className="example-drawing">
                <div className="example-drawing-media">
                  <Image src={item.src} alt={`Креслення: ${item.title}`} fill sizes="(max-width: 900px) 100vw, 33vw" />
                </div>
                <figcaption>
                  <span className="example-drawing-code">{item.code}</span>
                  <strong>{item.title}</strong>
                  <span>{item.note}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section id="opys-robit" className="example-block" aria-labelledby="scope-title">
          <div className="example-block-head">
            <p className="eyebrow">03 / Опис робіт</p>
            <h2 id="scope-title">Повний перелік того, що входить у проєкт</h2>
          </div>
          <ol className="example-scope">
            {workScope.map((group, index) => (
              <li key={group.stage} className="example-scope-row">
                <span className="example-scope-index">{String(index + 1).padStart(2, '0')}</span>
                <h3>{group.stage}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>
                      <Check aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        <aside className="example-cta" aria-label="Замовити проєкт">
          <div>
            <h2>Хочете такий самий альбом для свого простору?</h2>
            <p>Розрахуйте вартість або напишіть нам — підготуємо пропозицію під вашу площу.</p>
          </div>
          <div className="example-cta-actions">
            <Link className="text-link" href="/#calculator">Калькулятор</Link>
            <a className="pill-button" href="/#contact">
              Обговорити проєкт <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </aside>

        <Link className="text-link service-back" href="/">
          <ArrowLeft aria-hidden="true" /> На головну
        </Link>
      </section>
      <SiteFooter />
    </main>
  )
}
