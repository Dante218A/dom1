import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { serviceCategories, serviceHref } from '@/lib/services'
import { objectCategories, objectHref } from '@/lib/objects'
import { allSitePages, pageHref } from '@/lib/site-pages'

export const metadata: Metadata = {
  title: 'Пошук — huge world of design',
  description: 'Пошук послуг, типів об’єктів і розділів сайту.',
}

type SearchProps = { searchParams: Promise<{ q?: string }> }

type Result = { href: string; title: string; description: string; group: string }

const index: Result[] = [
  ...serviceCategories.flatMap((category) =>
    category.items.map((item) => ({ href: serviceHref(item.slug), title: item.title, description: item.description, group: 'Послуги' })),
  ),
  ...objectCategories.flatMap((category) =>
    category.types.map((type) => ({ href: objectHref(type.slug), title: type.title, description: type.description, group: 'Об’єкти' })),
  ),
  ...allSitePages.map((page) => ({ href: pageHref(page.slug), title: page.title, description: page.description, group: 'Розділи' })),
]

export default async function SearchPage({ searchParams }: SearchProps) {
  const { q = '' } = await searchParams
  const query = q.trim().toLowerCase().slice(0, 80)
  const results = query
    ? index.filter((item) => `${item.title} ${item.description}`.toLowerCase().includes(query))
    : []

  return (
    <main>
      <SiteHeader />
      <section className="service-page section-shell" aria-labelledby="search-title">
        <div>
          <p className="eyebrow">Пошук</p>
          <h1 id="search-title" className="search-page-title">
            {query ? `«${q.trim().slice(0, 80)}»` : 'Що шукаємо?'}
          </h1>
          <p className="service-page-lead">
            {query ? `Знайдено результатів: ${results.length}` : 'Введіть запит у полі пошуку вгорі сторінки.'}
          </p>
        </div>

        {query && results.length === 0 && (
          <div className="service-page-placeholder">
            <p className="eyebrow">Нічого не знайдено</p>
            <p>Спробуйте інше слово, наприклад «квартира», «3D» чи «консультація».</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="service-related">
            <ul>
              {results.map((item) => (
                <li key={item.href}>
                  <Link className="service-row" href={item.href}>
                    <div className="service-description">
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </div>
                    <span className="service-price">{item.group}</span>
                    <span className="service-arrow" aria-hidden="true"><ArrowUpRight /></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </main>
  )
}
