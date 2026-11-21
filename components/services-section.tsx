import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { serviceCategories, serviceHref } from '@/lib/services'

export function ServicesSection() {
  return (
    <section className="services section-shell" id="services" aria-labelledby="services-title">
      <div className="services-intro">
        <p className="eyebrow section-kicker">03 / Послуги та ціни</p>
        <h2 id="services-title">Від першої<br />ідеї до <em>втілення.</em></h2>
        <p className="services-copy">Оберіть повний проєкт або окремий етап — ми підберемо формат саме під ваш простір, бюджет і темп.</p>
        <nav className="services-toc" aria-label="Категорії послуг">
          {serviceCategories.map((category, index) => (
            <a href={`#${category.slug}`} key={category.slug}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              {category.title}
            </a>
          ))}
        </nav>
        <a className="text-link" href="#calculator">Розрахувати вартість <ArrowRight aria-hidden="true" /></a>
      </div>

      <div className="service-groups">
        {serviceCategories.map((category, index) => (
          <article className="service-group" id={category.slug} key={category.slug} aria-labelledby={`${category.slug}-title`}>
            <header className="service-group-head">
              <span className="service-group-index">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3 id={`${category.slug}-title`}>{category.title}</h3>
                <p>{category.intro}</p>
              </div>
            </header>
            <ul className="service-list">
              {category.items.map((item) => (
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
          </article>
        ))}
        <p className="price-note">* Ціни орієнтовні. Остаточна вартість залежить від площі, складності та складу робіт.</p>
      </div>
    </section>
  )
}
