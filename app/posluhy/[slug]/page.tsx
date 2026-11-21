import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { findService, serviceCategories, serviceHref } from '@/lib/services'

type PageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return serviceCategories.flatMap((category) => category.items.map((item) => ({ slug: item.slug })))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const found = findService(slug)
  if (!found) return {}
  return {
    title: `${found.service.title} — huge world of design`,
    description: found.service.description,
  }
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params
  const found = findService(slug)
  if (!found) notFound()

  const { category, service } = found
  const related = category.items.filter((item) => item.slug !== service.slug)

  return (
    <main>
      <SiteHeader />

      <section className="service-page section-shell" aria-labelledby="service-title">
        <nav className="breadcrumbs" aria-label="Навігаційний ланцюжок">
          <Link href="/">Головна</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/#${category.slug}`}>{category.title}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{service.title}</span>
        </nav>

        <div className="service-page-hero">
          <div>
            <p className="eyebrow">{category.title}</p>
            <h1 id="service-title">{service.title}</h1>
            <p className="service-page-lead">{service.description}</p>
          </div>
          <aside className="service-page-card" aria-label="Вартість послуги">
            <span>Вартість</span>
            <strong>{service.price}</strong>
            <p>Точну ціну розрахуємо після короткої розмови про ваш простір.</p>
            <a className="pill-button" href="/#contact">
              Замовити послугу <ArrowRight aria-hidden="true" />
            </a>
          </aside>
        </div>

        <div className="service-page-placeholder">
          <p className="eyebrow">Скоро</p>
          <p>Тут з’явиться детальний опис послуги, етапи роботи, приклади проєктів і відповіді на часті запитання.</p>
        </div>

        {related.length > 0 && (
          <div className="service-related">
            <h2>Також у розділі «{category.title}»</h2>
            <ul>
              {related.map((item) => (
                <li key={item.slug}>
                  <Link className="service-row" href={serviceHref(item.slug)}>
                    <div className="service-description">
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </div>
                    <span className="service-price">{item.price}</span>
                    <span className="service-arrow" aria-hidden="true"><ArrowUpRight /></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link className="text-link service-back" href="/#services">
          <ArrowLeft aria-hidden="true" /> Усі послуги
        </Link>
      </section>
    </main>
  )
}
