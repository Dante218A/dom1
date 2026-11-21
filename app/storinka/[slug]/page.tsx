import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { allSitePages, findSitePage, pageHref, standalonePages } from '@/lib/site-pages'

type PageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return allSitePages.map((page) => ({ slug: page.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const found = findSitePage(slug)
  if (!found) return {}
  return {
    title: `${found.page.title} — huge world of design`,
    description: found.page.description,
  }
}

export default async function SitePageRoute({ params }: PageProps) {
  const { slug } = await params
  const found = findSitePage(slug)
  if (!found) notFound()

  const { section, page } = found
  const related = (section ? section.pages : standalonePages).filter((item) => item.slug !== page.slug)

  return (
    <main>
      <SiteHeader />

      <section className="service-page section-shell" aria-labelledby="page-title">
        <nav className="breadcrumbs" aria-label="Навігаційний ланцюжок">
          <Link href="/">Головна</Link>
          {section && (
            <>
              <span aria-hidden="true">/</span>
              <span>{section.title}</span>
            </>
          )}
          <span aria-hidden="true">/</span>
          <span aria-current="page">{page.title}</span>
        </nav>

        <div className="service-page-hero">
          <div>
            <p className="eyebrow">{section?.title ?? 'huge world of design'}</p>
            <h1 id="page-title">{page.title}</h1>
            <p className="service-page-lead">{page.description}</p>
          </div>
          <aside className="service-page-card" aria-label="Зв’язатися зі студією">
            <span>Маєте питання?</span>
            <strong>Напишіть нам</strong>
            <p>Відповімо протягом робочого дня та підкажемо наступний крок.</p>
            <a className="pill-button" href="/#contact">
              Обговорити проєкт <ArrowRight aria-hidden="true" />
            </a>
          </aside>
        </div>

        <div className="service-page-placeholder">
          <p className="eyebrow">Скоро</p>
          <p>Розділ наповнюється. Тут з’явиться детальна інформація, фото та відповіді на часті запитання.</p>
        </div>

        {related.length > 0 && (
          <div className="service-related">
            <h2>{section ? `Також у розділі «${section.title}»` : 'Інші розділи'}</h2>
            <ul>
              {related.map((item) => (
                <li key={item.slug}>
                  <Link className="service-row" href={pageHref(item.slug)}>
                    <div className="service-description">
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </div>
                    <span className="service-arrow" aria-hidden="true"><ArrowUpRight /></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link className="text-link service-back" href="/">
          <ArrowLeft aria-hidden="true" /> На головну
        </Link>
      </section>
    </main>
  )
}
