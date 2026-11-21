export type ObjectType = {
  slug: string
  title: string
  description: string
  coefficient: number
}

export type ObjectCategory = {
  slug: string
  title: string
  intro: string
  types: ObjectType[]
}

export const objectCategories: ObjectCategory[] = [
  {
    slug: 'zhytlovi',
    title: 'Житлові приміщення',
    intro: 'Головний фокус — комфорт, індивідуальність власників, затишок та зручність у побуті.',
    types: [
      {
        slug: 'novobudova',
        title: 'Квартира в новобудові',
        description: 'Вільне планування: проєктуємо все з нуля — від перегородок до розведення комунікацій.',
        coefficient: 1,
      },
      {
        slug: 'vtorynne-zhytlo',
        title: 'Квартира на вторинному ринку',
        description: 'Враховуємо несучі стіни, старі комунікації та розробляємо план демонтажу.',
        coefficient: 1.1,
      },
      {
        slug: 'smart-kvartyra',
        title: 'Смарт-квартира та студія',
        description: 'Максимальна ергономіка, продумане зонування та меблі-трансформери.',
        coefficient: 1.15,
      },
      {
        slug: 'budynok',
        title: 'Будинок, котедж, таунхаус',
        description: 'Кілька поверхів, сходи, каміни, котельні та прив’язка до ландшафту за вікном.',
        coefficient: 1.25,
      },
      {
        slug: 'okremi-zony',
        title: 'Окрема зона або кімната',
        description: 'Кухня-вітальня, дитяча, ванна кімната чи гардеробна.',
        coefficient: 1.2,
      },
    ],
  },
  {
    slug: 'komertsiini',
    title: 'Комерційні приміщення',
    intro: 'Дизайн працює на бізнес: приваблює клієнтів, відображає бренд і відповідає будівельним та пожежним нормам.',
    types: [
      {
        slug: 'horeca',
        title: 'HoReCa',
        description: 'Кав’ярні, ресторани, бари, готелі: атмосфера, світло, акустика й технологія кухні.',
        coefficient: 1.35,
      },
      {
        slug: 'ofisy',
        title: 'Офіси та коворкінги',
        description: 'Продуктивність, акустичний комфорт, ергономічні робочі місця та зони відпочинку.',
        coefficient: 1.1,
      },
      {
        slug: 'ryteil',
        title: 'Ритейл',
        description: 'Магазини, шоуруми, бутики: світло для товару, навігація покупців, фотогенічні зони.',
        coefficient: 1.25,
      },
      {
        slug: 'krasa-ta-zdorovia',
        title: 'Краса та здоров’я',
        description: 'Салони, барбершопи, стоматології, фітнес: санітарія, вентиляція, світло робочих зон.',
        coefficient: 1.3,
      },
      {
        slug: 'osvitni-prostory',
        title: 'Освітні та культурні простори',
        description: 'Приватні садочки, мовні школи, студії танців, виставкові зали.',
        coefficient: 1.2,
      },
    ],
  },
  {
    slug: 'investytsii',
    title: 'Нерухомість під інвестиції',
    intro: 'Напрям на межі житлового та комерційного дизайну — для оренди чи перепродажу.',
    types: [
      {
        slug: 'flipinh-ta-houmsteidzhynh',
        title: 'Фліпінг та хоумстейджинг',
        description: 'Привабливий інтер’єр для широкої аудиторії за обмежений бюджет і стислі терміни, з довговічними матеріалами.',
        coefficient: 0.85,
      },
    ],
  },
]

export function objectHref(slug: string) {
  return `/obiekty/${slug}`
}

export function findObjectType(slug: string) {
  for (const category of objectCategories) {
    const type = category.types.find((item) => item.slug === slug)
    if (type) return { category, type }
  }
  return null
}
