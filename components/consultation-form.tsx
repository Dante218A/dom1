'use client'

import { useState, type FormEvent } from 'react'
import { ArrowUpRight, Check } from 'lucide-react'

const contactEmail = 'hello@tykho.studio'

export function ConsultationForm() {
  const [notice, setNotice] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') ?? '').trim()
    const phone = String(formData.get('phone') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const projectType = String(formData.get('projectType') ?? '').trim()
    const message = String(formData.get('message') ?? '').trim()
    const subject = encodeURIComponent(`Запит на консультацію — ${name}`)
    const body = encodeURIComponent(
      [`Ім’я: ${name}`, `Телефон: ${phone}`, `Email: ${email || 'не вказано'}`, `Тип проєкту: ${projectType || 'не вказано'}`, '', message].join('\n'),
    )

    setNotice('Відкриваємо поштову програму з підготовленою заявкою.')
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`
  }

  return (
    <form className="consultation-form" onSubmit={handleSubmit}>
      <p className="form-heading">Кілька слів про ваш проєкт</p>
      <label className="form-field">
        <span>Як до вас звертатись <i>*</i></span>
        <input name="name" autoComplete="name" placeholder="Ваше ім’я" required />
      </label>
      <div className="form-row">
        <label className="form-field">
          <span>Телефон <i>*</i></span>
          <input name="phone" type="tel" autoComplete="tel" placeholder="+380" required />
        </label>
        <label className="form-field">
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" placeholder="name@email.com" />
        </label>
      </div>
      <label className="form-field">
        <span>Що плануємо?</span>
        <select name="projectType" defaultValue="">
          <option value="" disabled>Оберіть тип проєкту</option>
          <option>Квартира</option>
          <option>Приватний будинок</option>
          <option>Комерційний простір</option>
          <option>Поки не визначились</option>
        </select>
      </label>
      <label className="form-field">
        <span>Коротко про ваш задум</span>
        <textarea name="message" rows={2} placeholder="Площа, місто, побажання — усе, що вже знаєте" />
      </label>
      <button className="submit-button" type="submit">
        Надіслати заявку <ArrowUpRight aria-hidden="true" />
      </button>
      <p className="form-privacy">Натискаючи кнопку, ви погоджуєтесь на обробку контактних даних для зв’язку з вами.</p>
      {notice && <p className="form-notice" role="status"><Check aria-hidden="true" />{notice}</p>}
    </form>
  )
}
