import Image from 'next/image'
import { Quote, Star } from 'lucide-react'
import { findProject } from '@/lib/projects'

const testimonials = [
  {
    projectId: 'pushkinska',
    author: 'Олена та Андрій',
    role: 'Власники квартири',
    quote:
      'Боялися, що історичний будинок принесе сюрпризи з бюджетом. Студія одразу заклала резерв на стіни та перекриття, і фінальна сума вийшла навіть на 3% меншою за кошторис. Ліпнину відновили так, що гості думають — вона тут з 1900-х.',
    facts: [
      { label: 'Термін', value: '5 місяців' },
      { label: 'Бюджет', value: '−3% від кошторису' },
    ],
  },
  {
    projectId: 'japandi',
    author: 'Марина К.',
    role: 'Живе в Польщі',
    quote:
      'Весь ремонт пройшов, поки я була за кордоном. Щоп’ятниці отримувала фотозвіт і відео, а всі закупівлі — з чеками. Приїхала на готову квартиру, де залишилося тільки розкласти речі.',
    facts: [
      { label: 'Формат', value: 'Дистанційно' },
      { label: 'Термін', value: '4 місяці' },
    ],
  },
  {
    projectId: 'dinner-eight',
    author: 'Ігор Савченко',
    role: 'Власник квартири',
    quote:
      'Найбільше цінував, що не довелося шукати будівельників. Бригада працювала акуратно, а дизайнер щотижня перевіряв об’єкт. Ар-деко виглядає точно як на візуалізації.',
    facts: [
      { label: 'Бригада', value: 'Партнер студії' },
      { label: 'Термін', value: '3,5 місяці' },
    ],
  },
  {
    projectId: 'slow-coffee',
    author: 'Дмитро та Юля',
    role: 'Засновники кав’ярні',
    quote:
      'Відкрилися на два тижні раніше запланованого. Зонування продумали так, що в обід ніхто не заважає один одному, а посадка зросла на 30% у тій самій площі.',
    facts: [
      { label: 'Запуск', value: 'на 2 тижні раніше' },
      { label: 'Посадка', value: '+30% місць' },
    ],
  },
]

export function TestimonialsSection() {
  const [featured, ...rest] = testimonials
  const featuredProject = findProject(featured.projectId)

  return (
    <section className="testimonials section-shell" id="reviews" aria-labelledby="testimonials-title">
      <header className="testimonials-head">
        <div>
          <p className="eyebrow section-kicker">06 / Відгуки клієнтів</p>
          <h2 id="testimonials-title">Історії людей, які <em>вже живуть</em> у наших інтер’єрах</h2>
        </div>
        <div className="testimonials-rating" aria-label="Середня оцінка 4,9 з 5 за 86 відгуками">
          <span className="testimonials-score">4,9</span>
          <span className="testimonials-stars" aria-hidden="true">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} />
            ))}
          </span>
          <span className="testimonials-count">86 відгуків · Google</span>
        </div>
      </header>

      {featuredProject && (
        <article className="testimonial-featured">
          <figure className="testimonial-featured-media">
            <Image src={featuredProject.image} alt={featuredProject.alt} fill sizes="(max-width: 1000px) 100vw, 46vw" />
            <figcaption>
              <span>Проєкт {featuredProject.number}</span>
              <strong>{featuredProject.name}</strong>
              <span>{featuredProject.type} · {featuredProject.area}</span>
            </figcaption>
          </figure>
          <div className="testimonial-featured-body">
            <Quote className="testimonial-quote-icon" aria-hidden="true" />
            <blockquote>
              <p>{featured.quote}</p>
            </blockquote>
            <dl className="testimonial-facts">
              {featured.facts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
            <p className="testimonial-author">
              <strong>{featured.author}</strong>
              <span>{featured.role}</span>
            </p>
          </div>
        </article>
      )}

      <ul className="testimonial-list">
        {rest.map((item) => {
          const project = findProject(item.projectId)
          if (!project) return null
          return (
            <li className="testimonial-card" key={item.author}>
              <div className="testimonial-card-project">
                <span className="testimonial-card-thumb">
                  <Image src={project.image} alt="" fill sizes="64px" />
                </span>
                <span>
                  <strong>{project.name}</strong>
                  <span>{project.style} · {project.area}</span>
                </span>
              </div>
              <blockquote>
                <p>{item.quote}</p>
              </blockquote>
              <dl className="testimonial-facts">
                {item.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="testimonial-author">
                <strong>{item.author}</strong>
                <span>{item.role}</span>
              </p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
