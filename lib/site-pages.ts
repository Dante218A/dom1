export type SitePage = {
  slug: string
  title: string
  description: string
}

export type SiteSection = {
  slug: string
  title: string
  intro: string
  pages: SitePage[]
}

export const siteSections: SiteSection[] = [
  {
    slug: 'pro-nas',
    title: 'Про нас',
    intro: 'Хто ми, як працюємо і чому нам довіряють.',
    pages: [
      { slug: 'pro-studiiu', title: 'Про студію', description: 'Історія, підхід і цінності huge world of design.' },
      { slug: 'komanda', title: 'Команда', description: 'Дизайнери, архітектори та менеджери проєктів.' },
      { slug: 'yak-my-pratsiuiemo', title: 'Як ми працюємо', description: 'Етапи від першої зустрічі до здачі об’єкта.' },
      { slug: 'harantii', title: 'Гарантії та договір', description: 'Фіксовані терміни, вартість і відповідальність.' },
    ],
  },
  {
    slug: 'tsiny',
    title: 'Ціни',
    intro: 'Орієнтовна вартість для різних типів об’єктів.',
    pages: [
      { slug: 'tsiny-kvartyra', title: 'Дизайн квартири', description: 'від $30 / м² за повний проєкт.' },
      { slug: 'tsiny-budynok', title: 'Дизайн будинку', description: 'від $27 / м² з фасадами й ландшафтом.' },
      { slug: 'tsiny-komertsiia', title: 'Комерційні приміщення', description: 'від $22 / м² для HoReCa, офісів, ритейлу.' },
      { slug: 'pakety', title: 'Пакети послуг', description: 'Базовий, стандарт і преміум — що входить.' },
    ],
  },
  {
    slug: 'kalkuliatory',
    title: 'Калькулятори',
    intro: 'Швидкий орієнтир вартості без дзвінка.',
    pages: [
      { slug: 'kalkuliator-dyzainu', title: 'Калькулятор дизайну', description: 'Вартість проєкту за площею та послугами.' },

    ],
  },
]

export const standalonePages: SitePage[] = [
  { slug: 'vidhuky', title: 'Відгуки', description: 'Що кажуть клієнти після завершення проєктів.' },
  { slug: 'aktsii', title: 'Акції', description: 'Сезонні пропозиції та знижки на послуги студії.' },
  { slug: 'oplata', title: 'Оплата', description: 'Етапи оплати, способи розрахунку та документи.' },
  { slug: 'blog', title: 'Блог', description: 'Поради щодо планування, ремонту та вибору матеріалів.' },
  { slug: 'spivpratsia', title: 'Співпраця', description: 'Для забудовників, постачальників і майстрів.' },
  { slug: 'vakansii', title: 'Вакансії', description: 'Шукаємо дизайнерів, візуалізаторів і менеджерів.' },
  { slug: 'kontakty', title: 'Контакти', description: 'Адреса студії в Одесі, телефон і месенджери.' },
]

export const pageHref = (slug: string) => `/storinka/${slug}`

export function findSitePage(slug: string) {
  for (const section of siteSections) {
    const page = section.pages.find((item) => item.slug === slug)
    if (page) return { section, page }
  }
  const page = standalonePages.find((item) => item.slug === slug)
  return page ? { section: null, page } : null
}

export const allSitePages = [...siteSections.flatMap((section) => section.pages), ...standalonePages]

export const STUDIO_PHONE = '+380 (48) 700-00-00'
export const STUDIO_PHONE_HREF = 'tel:+380487000000'
