export type ServiceItem = {
  slug: string
  title: string
  description: string
  price: string
}

export type ServiceCategory = {
  slug: string
  title: string
  intro: string
  items: ServiceItem[]
}

export const serviceCategories: ServiceCategory[] = [
  {
    slug: 'dyzain-proekt',
    title: 'Розробка дизайн-проєкту',
    intro: 'Базовий пакет документів, за яким будівельники виконують ремонт.',
    items: [
      {
        slug: 'obmiry-ta-planuvannia',
        title: 'Обміри та планування',
        description: 'Заміри приміщення, кілька варіантів розміщення меблів і перегородок з урахуванням ергономіки.',
        price: 'від 350 ₴ / м²',
      },
      {
        slug: 'kontseptsiia-ta-mudbordy',
        title: 'Концепція та мудборди',
        description: 'Підбір стилю, кольорової гами, текстур та загального настрою інтер’єру.',
        price: 'від 300 ₴ / м²',
      },
      {
        slug: '3d-vizualizatsiia',
        title: '3D-візуалізація',
        description: 'Фотореалістичні зображення майбутніх кімнат — бачите все ще до ремонту.',
        price: 'від 700 ₴ / м²',
      },
      {
        slug: 'robocha-dokumentatsiia',
        title: 'Робоча документація',
        description: 'Плани стін, схеми електрики, освітлення, сантехніки, розкладки плитки, розгортки та креслення меблів.',
        price: 'від 600 ₴ / м²',
      },
    ],
  },
  {
    slug: 'komplektatsiia',
    title: 'Комплектація об’єкта',
    intro: 'Допомога в підборі та закупівлі всього необхідного для реалізації проєкту.',
    items: [
      {
        slug: 'pidbir-materialiv-ta-mebliv',
        title: 'Підбір матеріалів та меблів',
        description: 'Плитка, паркет, фарба, світильники, дивани — у межах вашого бюджету.',
        price: 'від 250 ₴ / м²',
      },
      {
        slug: 'koshtorys-i-vidomosti',
        title: 'Кошторис і відомості',
        description: 'Таблиця з артикулами, кількістю, цінами та контактами постачальників.',
        price: 'від 8 000 ₴',
      },
      {
        slug: 'lohistyka-ta-zamovlennia',
        title: 'Логістика та замовлення',
        description: 'Контроль доставки, перевірка рахунків, робота з підрядниками та меблярами.',
        price: '7% від бюджету закупівель',
      },
    ],
  },
  {
    slug: 'avtorskyi-nahliad',
    title: 'Авторський нагляд',
    intro: 'Регулярний контроль, щоб ремонт відповідав затвердженому проєкту.',
    items: [
      {
        slug: 'vyizdy-na-obiekt',
        title: 'Виїзди на об’єкт',
        description: 'Перевірка відповідності робіт кресленням, кольорам і матеріалам.',
        price: '2 500 ₴ / виїзд',
      },
      {
        slug: 'koryhuvannia-proektu',
        title: 'Коригування проєкту',
        description: 'Оперативні зміни в кресленнях, якщо під час ремонту виникли технічні нюанси.',
        price: 'від 1 200 ₴ / год',
      },
      {
        slug: 'konsultatsiia-maistriv',
        title: 'Консультація майстрів',
        description: 'Пояснення складних вузлів будівельникам безпосередньо на місці.',
        price: '2 000 ₴ / зустріч',
      },
    ],
  },
  {
    slug: 'okremi-posluhy',
    title: 'Окремі послуги',
    intro: 'Якщо повноцінний проєкт не потрібен.',
    items: [
      {
        slug: 'razova-konsultatsiia',
        title: 'Разова консультація',
        description: 'Виїзд перед купівлею для оцінки планування або порад щодо кольорів і меблів.',
        price: '3 000 ₴ / 2 год',
      },
      {
        slug: 'planuvalne-rishennia',
        title: 'Планувальне рішення',
        description: 'Обміри та варіанти розстановки меблів і стін без візуалізацій.',
        price: 'від 450 ₴ / м²',
      },
      {
        slug: 'dekoruvannia',
        title: 'Декорування (хоумстейджинг)',
        description: 'Оновлення готового інтер’єру текстилем, картинами, світлом і декором — перед продажем чи орендою.',
        price: 'від 25 000 ₴',
      },
    ],
  },
]

export type RateUnit = 'area' | 'fixed' | 'visit' | 'hour' | 'meeting' | 'percent'

export type ServiceRate = {
  rate: number
  unit: RateUnit
  defaultQuantity?: number
}

export const serviceRates: Record<string, ServiceRate> = {
  'obmiry-ta-planuvannia': { rate: 350, unit: 'area' },
  'kontseptsiia-ta-mudbordy': { rate: 300, unit: 'area' },
  '3d-vizualizatsiia': { rate: 700, unit: 'area' },
  'robocha-dokumentatsiia': { rate: 600, unit: 'area' },
  'pidbir-materialiv-ta-mebliv': { rate: 250, unit: 'area' },
  'koshtorys-i-vidomosti': { rate: 8000, unit: 'fixed' },
  'lohistyka-ta-zamovlennia': { rate: 7, unit: 'percent', defaultQuantity: 500000 },
  'vyizdy-na-obiekt': { rate: 2500, unit: 'visit', defaultQuantity: 4 },
  'koryhuvannia-proektu': { rate: 1200, unit: 'hour', defaultQuantity: 3 },
  'konsultatsiia-maistriv': { rate: 2000, unit: 'meeting', defaultQuantity: 2 },
  'razova-konsultatsiia': { rate: 3000, unit: 'fixed' },
  'planuvalne-rishennia': { rate: 450, unit: 'area' },
  dekoruvannia: { rate: 25000, unit: 'fixed' },
}

export function serviceHref(slug: string) {
  return `/posluhy/${slug}`
}

export function findService(slug: string) {
  for (const category of serviceCategories) {
    const index = category.items.findIndex((item) => item.slug === slug)
    if (index !== -1) return { category, service: category.items[index], index }
  }
  return null
}
