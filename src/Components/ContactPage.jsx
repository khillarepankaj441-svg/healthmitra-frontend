import { useState } from 'react'
import { api } from './api'
import { Icon } from './Icon'
import { SimpleHero } from './Shared'

export function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [status, setStatus] = useState('')
  const info = [
    ['map', 'Our Address', '123, Health Street, Medical District, New Delhi, India - 110001'],
    ['phone', 'Phone Number', '+91 98765 43210\n+91 11 4567 8900'],
    ['mail', 'Email Address', 'support@healthmitra.com\ninfo@healthmitra.com'],
    ['calendar', 'Working Hours', 'Monday - Saturday: 9:00 AM - 8:00 PM\nSunday: 10:00 AM - 4:00 PM'],
  ]

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setStatus('')
  }

  const submit = async (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      setStatus('Please fill out all required fields.')
      return
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    if (!emailOk) {
      setStatus('Please enter a valid email address.')
      return
    }
    try {
      await api.contact(form)
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
      setStatus('Message sent successfully.')
    } catch (error) {
      setStatus(error.message)
    }
  }

  return (
    <>
      <SimpleHero
        badge="Get In Touch"
        title="We're Here to Help You"
        text="Have a question, suggestion, or need support? Our team is ready to assist you. Reach out to us anytime!"
        art="contact"
      />

      <section className="contact-layout">
        <form className="contact-form" onSubmit={submit}>
          <h2>Send Us a Message</h2>
          <div className="form-grid">
            <label><Icon name="user" /><input onChange={(event) => update('name', event.target.value)} placeholder="Your Name" value={form.name} /></label>
            <label><Icon name="mail" /><input onChange={(event) => update('email', event.target.value)} placeholder="Email Address" type="email" value={form.email} /></label>
            <label><Icon name="phone" /><input onChange={(event) => update('phone', event.target.value)} placeholder="Phone Number" value={form.phone} /></label>
            <label><Icon name="heart" /><input onChange={(event) => update('subject', event.target.value)} placeholder="Subject" value={form.subject} /></label>
          </div>
          <label className="message-box"><Icon name="records" /><textarea onChange={(event) => update('message', event.target.value)} placeholder="Your Message" value={form.message}></textarea></label>
          {status && <p className={status.includes('success') ? 'form-message success' : 'form-message'}>{status}</p>}
          <button className="primary-button" type="submit"><Icon name="send" /> Send Message</button>
          <p><Icon name="shield" /> We respect your privacy. Your information is safe with us.</p>
        </form>

        <aside className="contact-info">
          <h2>Contact Information</h2>
          {info.map(([icon, title, text]) => (
            <div className="contact-info-item" key={title}>
              <span><Icon name={icon} /></span>
              <div>
                <h3>{title}</h3>
                {text.split('\n').map((line) => <p key={line}>{line}</p>)}
              </div>
            </div>
          ))}
        </aside>
      </section>

      <section className="map-section">
        <div className="map-card">
          <h3>Find Us Here</h3>
          <p>We are conveniently located in the heart of the city, easily accessible by road and public transport.</p>
          <button className="outline-button" type="button"><Icon name="send" /> Get Directions</button>
        </div>
        <div className="map-pin"><Icon name="map" /><strong>HealthMitra</strong><span>Healthcare Center</span></div>
      </section>

      <section className="support-strip">
        <span><Icon name="headset" /></span>
        <div><h2>Need immediate assistance?</h2><p>Our support team is available 24/7 to help you.</p></div>
        <button className="outline-button" type="button">Chat with Us</button>
      </section>
    </>
  )
}
