export type StudioProject = {
  id: string
  number: string
  name: string
  style: string
  type: string
  area: string
  image: string
  alt: string
}

export const projects: StudioProject[] = [
  {
    id: 'warm-minimal',
    number: '01',
    name: 'Теплий мінімалізм',
    style: 'Мінімалізм',
    type: 'Квартира · Київ',
    area: '86 м²',
    image: '/project-apartment.png',
    alt: 'Світла вітальня з дубовою підлогою, дерев’яним столом і м’яким денним світлом',
  },
  {
    id: 'japandi',
    number: '02',
    name: 'Тиша і дерево',
    style: 'Японді',
    type: 'Квартира · Одеса',
    area: '72 м²',
    image: '/images/styles/japandi.png',
    alt: 'Вітальня в стилі японді з низькими дубовими меблями, лляним диваном і паперовою лампою',
  },
  {
    id: 'pushkinska',
    number: '03',
    name: 'Квартира на Пушкінській',
    style: 'Неокласика',
    type: 'Історичний будинок · Одеса',
    area: '128 м²',
    image: '/images/styles/neoclassic.png',
    alt: 'Неокласична вітальня з ліпниною, мармуровим каміном і оксамитовими кріслами',
  },
  {
    id: 'quiet-house',
    number: '04',
    name: 'Дім серед тиші',
    style: 'Сучасний еко',
    type: 'Приватний будинок · Львівщина',
    area: '142 м²',
    image: '/project-house.png',
    alt: 'Спальня заміського будинку в теплих природних відтінках',
  },
  {
    id: 'brick-light',
    number: '05',
    name: 'Цегла і світло',
    style: 'Лофт',
    type: 'Пентхаус · Київ',
    area: '110 м²',
    image: '/images/styles/loft.png',
    alt: 'Лофт із цегляною стіною, великими вікнами в металевих рамах і шкіряним диваном',
  },
  {
    id: 'dinner-eight',
    number: '06',
    name: 'Вечеря о восьмій',
    style: 'Ар-деко',
    type: 'Квартира · Одеса',
    area: '95 м²',
    image: '/images/styles/artdeco.png',
    alt: 'Їдальня в стилі ар-деко з оксамитовими стільцями, мармуровим столом і латунними деталями',
  },
  {
    id: 'slow-coffee',
    number: '07',
    name: 'Кава і повільні ранки',
    style: 'Комерційний',
    type: 'Кав’ярня · Львів',
    area: '74 м²',
    image: '/project-cafe.png',
    alt: 'Інтер’єр кав’ярні зі світлою штукатуркою та бордовою м’якою лавою',
  },
]

export function findProject(id: string) {
  return projects.find((project) => project.id === id)
}
