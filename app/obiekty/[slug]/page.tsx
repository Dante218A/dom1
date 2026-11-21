import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { findObjectType, objectCategories, objectHref } from '@/lib/objects'
import { formatUsd } from '@/lib/services'

type PageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return objectCategories.flatMap((category) => category.types.map((type) => ({ slug: type.slug })))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const found = findObjectType(slug)
  if (!found) return {}
  return {
    title: `${found.type.title} — дизайн інтер’єру | huge world of design`,
    description: found.type.description,
  }
}

const BASE_DESIGN_RATE = 30

function designRate(coefficient: number) {
  return formatUsd(Math.round(BASE_DESIGN_RATE * coefficient))
}

export default async function ObjectTypePage({ params }: PageProps) {
  const { slug } = await params
  const found = findObjectType(slug)
  if (!found) notFound()

  const { category, type } = found
  const related = category.types.filter((item) => item.slug !== type.slug)

  return (
    <main>
      <SiteHeader />

      <section className="service-page section-shell" aria-labelledby="object-title">
        <nav className="breadcrumbs" aria-label="Навігаційний ланцюжок">
          <Link href="/">Головна</Link>
          <span aria-hidden="true">/</span>
          <Link href="/#calculator">{category.title}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{type.title}</span>
        </nav>

        <div className="service-page-hero">
          <div>
            <p className="eyebrow">{category.title}</p>
            <h1 id="object-title">{type.title}</h1>
            <p className="service-page-lead">{type.description}</p>
          </div>
          <aside className="service-page-card" aria-label="Вартість дизайн-проєкту">
            <span>Дизайн-проєкт</span>
            <strong>від {designRate(type.coefficient)} / м²</strong>
            <p>{category.intro}</p>
            <a className="pill-button" href="/#calculator">
              Розрахувати вартість <ArrowRight aria-hidden="true" />
            </a>
          </aside>
        </div>

        <div className="service-page-placeholder">
          <p className="eyebrow">Скоро</p>
          <p>Тут з’являться приклади реалізованих об’єктів цього типу, особливості проєктування та етапи роботи.</p>
        </div>

        {related.length > 0 && (
          <div className="service-related">
            <h2>Інші об’єкти: «{category.title}»</h2>
            <ul>
              {related.map((item) => (
                <li key={item.slug}>
                  <Link className="service-row" href={objectHref(item.slug)}>
                    <div className="service-description">
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </div>
                    <span className="service-price">
                      від {designRate(item.coefficient)} / м²
                    </span>
                    <span className="service-arrow" aria-hidden="true"><ArrowUpRight /></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link className="text-link service-back" href="/#calculator">
          <ArrowLeft aria-hidden="true" /> До калькулятора
        </Link>
      </section>
      <SiteFooter />
    </main>
  )
}
