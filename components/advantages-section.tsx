import { ArrowRight, CalendarCheck, FileSignature, HardHat, Ruler, ShieldCheck, Wallet } from 'lucide-react'

const advantages = [
  {
    icon: Wallet,
    title: 'Дотримання бюджету',
    text: 'Кошторис складаємо до старту ремонту й фіксуємо в договорі. Відхилення — не більше ±5%, і кожна зміна погоджується з вами письмово.',
    proof: '±5% до кошторису',
  },
  {
    icon: HardHat,
    title: 'Перевірені будівельники',
    text: 'Працюємо з бригадами, з якими реалізували десятки об’єктів в Одесі. Ви не шукаєте підрядників — ми відповідаємо за їхню роботу.',
    proof: '6 бригад-партнерів',
  },
  {
    icon: FileSignature,
    title: 'Офіційний договір',
    text: 'Склад робіт, терміни, вартість і гарантії прописані в договорі. Оплата поетапно — тільки за погоджений результат.',
    proof: 'Оплата за етапами',
  },
  {
    icon: CalendarCheck,
    title: 'Чіткі терміни',
    text: 'Графік робіт розписаний по тижнях. Щотижня надсилаємо фотозвіт з об’єкта, тож ви бачите прогрес, навіть перебуваючи за кордоном.',
    proof: 'Щотижневі фотозвіти',
  },
  {
    icon: Ruler,
    title: 'Авторський нагляд',
    text: 'Дизайнер приїжджає на об’єкт на ключових етапах і перевіряє, щоб усе виконувалось точно за кресленнями та візуалізацією.',
    proof: 'Від заміру до декору',
  },
  {
    icon: ShieldCheck,
    title: 'Гарантія на роботи',
    text: 'Даємо гарантію на виконані роботи та допомагаємо з гарантійними випадками по меблях і техніці від наших постачальників.',
    proof: '24 місяці гарантії',
  },
]

const promises = [
  'Знижки постачальників до 15% передаємо вам',
  'Один менеджер на весь проєкт — без зіпсованого телефону',
  'Закупівлі з чеками та звітом по кожній позиції',
]

export function AdvantagesSection() {
  return (
    <section className="advantages section-shell" id="advantages" aria-labelledby="advantages-title">
      <div className="advantages-intro">
        <p className="eyebrow section-kicker">Чому з нами спокійно</p>
        <h2 id="advantages-title">Зручно, прозоро <em>і безпечно</em> — на кожному кроці</h2>
        <p className="advantages-lead">
          Ремонт не має бути стресом. Ми беремо на себе контроль бюджету, підрядників і термінів, а вам залишаємо приємні рішення.
        </p>
        <ul className="advantages-promises">
          {promises.map((promise) => (
            <li key={promise}>{promise}</li>
          ))}
        </ul>
        <a className="pill-button" href="#contact">
          Отримати консультацію <ArrowRight aria-hidden="true" />
        </a>
      </div>

      <ul className="advantages-grid">
        {advantages.map(({ icon: Icon, title, text, proof }) => (
          <li className="advantage-card" key={title}>
            <span className="advantage-icon" aria-hidden="true">
              <Icon />
            </span>
            <h3>{title}</h3>
            <p>{text}</p>
            <span className="advantage-proof">{proof}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
