import { useState } from 'react'
import { faqs } from './data'
import { Icon } from './Icon'
import { Brand, SimpleHero } from './Shared'

export function FaqPage({ onNavigate }) {
  const [openIndex, setOpenIndex] = useState(0)
  const categories = [
    ['grid', 'All Questions'],
    ['calendar', 'Appointments'],
    ['heart', 'Treatments'],
    ['shield', 'Billing & Insurance'],
    ['pill', 'Medications'],
    ['user', 'General Health'],
  ]

  return (
    <>
      <SimpleHero
        badge="FAQ"
        title="Frequently Asked Questions"
        text="Find answers to common questions about health, appointments, treatments and more."
        art="faq"
      />

      <section className="faq-section">
        <h2>Browse by Category</h2>
        <div className="faq-cats">
          {categories.map(([icon, label], index) => (
            <button className={index === 0 ? 'active' : ''} type="button" key={label}><Icon name={icon} /> {label}</button>
          ))}
        </div>
        <h2>All Questions</h2>
        <div className="faq-list">
          {faqs.map(([question, answer], index) => (
            <article className={index === openIndex ? 'faq-item open' : 'faq-item'} key={question}>
              <button type="button" onClick={() => setOpenIndex(index === openIndex ? -1 : index)}><h3>{question}</h3><Icon name={index === openIndex ? 'minus' : 'plus'} /></button>
              {index === openIndex && <p>{answer}</p>}
            </article>
          ))}
        </div>
      </section>

      <footer className="footer-section">
        <div>
          <Brand onNavigate={onNavigate} />
          <p>HealthMitra is your trusted healthcare companion. We are here to care for you and your family.</p>
          <div className="social-row"><b>f</b><b>t</b><b>ig</b><b>in</b><b>yt</b></div>
        </div>
        <div>
          <h3>Quick Links</h3>
          {['Home', 'Services', 'Doctors', 'Health Blogs', 'FAQs', 'Contact Us'].map((item) => <span key={item}>{item}</span>)}
        </div>
        <div>
          <h3>Our Services</h3>
          {['Book Appointment', 'Online Consultation', 'Health Checkups', 'Lab Tests', 'Medicine Reminder', 'Emergency SOS'].map((item) => <span key={item}>{item}</span>)}
        </div>
        <div>
          <h3>Support</h3>
          {['Help Center', 'Terms & Conditions', 'Privacy Policy', 'Refund Policy'].map((item) => <span key={item}>{item}</span>)}
        </div>
        <div>
          <h3>Contact Us</h3>
          <span>+91 98765 43210</span>
          <span>support@healthmitra.com</span>
          <span>123, Health Street, New Delhi, India - 110001</span>
        </div>
      </footer>
      <div className="copyright">© 2024 HealthMitra. All rights reserved.</div>
    </>
  )
}
