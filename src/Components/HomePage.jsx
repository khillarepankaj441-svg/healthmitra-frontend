import doctorHero from '../assets/doctor-hero.png'
import { doctors, features, reviews, services } from './data'
import { getDoctorPhoto } from './doctorPhotos'
import { Icon } from './Icon'
import { SectionTitle, Stat } from './Shared'

export function HomePage({ onNavigate }) {
  const topDoctors = doctors.slice(0, 4)

  return (
    <>
      <section className="hero-section" id="home">
        <div className="hero-copy">
          <span className="eyebrow"><Icon name="heart" /> Your Health, Our Priority</span>
          <h1>Complete Healthcare Solution for <span>You & Your Family</span></h1>
          <p>Book appointments, manage health records, set medicine reminders and stay healthy with HealthMitra.</p>
          <div className="hero-buttons">
            <button className="primary-button" type="button">Book Appointment</button>
            <button className="outline-button" type="button" onClick={() => onNavigate('services')}>Explore Services <span>{'->'}</span></button>
          </div>
          <div className="trust-row">
            <span><Icon name="users" /> Trusted by 10K+ Users</span>
            <span><Icon name="shield" /> Secure & Confidential</span>
            <span><Icon name="headset" /> 24/7 Support</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-orbit"></div>
          <img src={doctorHero} alt="Smiling doctor for HealthMitra healthcare service" />
          <div className="floating-card card-appointments"><Icon name="calendar" /><strong>12</strong><span>Appointments<br />This Month</span></div>
          <div className="floating-card card-reminders"><Icon name="pill" /><strong>3</strong><span>Medicine Reminder<br />Today</span></div>
          <div className="floating-card card-score"><Icon name="heart" /><strong>85%</strong><span>Health Score<br />Good</span></div>
          <div className="floating-card card-reports"><Icon name="records" /><strong>8</strong><span>Reports<br />Available</span></div>
        </div>
      </section>

      <section className="services-section" id="services">
        <SectionTitle title="Our Services" />
        <div className="service-grid">
          {services.map(([icon, color, title, text, action]) => (
            <article className="service-card" key={title}>
              <span className={`service-icon ${color}`}><Icon name={icon} /></span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
                  <button type="button" onClick={() => onNavigate(title === 'Book Appointment' ? 'login' : 'services')}>{action} <span>{'->'}</span></button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="content-row">
        <div className="why-panel">
          <h2>Why Choose HealthMitra?</h2>
          <div className="feature-grid">
            {features.map(([icon, title, text]) => (
              <div className="feature-item" key={title}>
                <span><Icon name={icon} /></span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="doctors-panel" id="doctors">
          <div className="section-head">
            <h2>Top Doctors</h2>
            <button type="button" onClick={() => onNavigate('doctors')}>View All Doctors <span>{'->'}</span></button>
          </div>
          <div className="doctor-grid">
            {topDoctors.map((doctor) => {
              const [name, specialty, experience, , , rating] = doctor
              const photo = getDoctorPhoto(doctor)
              return (
              <article className="doctor-card" key={name}>
                <div className="doctor-photo">
                  <img src={photo} alt={`${name} profile`} />
                </div>
                <h3>{name}</h3>
                <p>{specialty}</p>
                <div><span>{experience}</span><strong>* {rating}</strong></div>
              </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="testimonials-head">
          <SectionTitle title="What Our Users Say" />
          <div className="slider-buttons">
            <button type="button" aria-label="Previous testimonial">{'<'}</button>
            <button type="button" aria-label="Next testimonial">{'>'}</button>
          </div>
        </div>
        <div className="testimonial-layout">
          <div className="review-grid">
            {reviews.map(([name, city, quote]) => (
              <article className="review-card" key={name}>
                <div className="stars">*****</div>
                <p>{quote}</p>
                <div className="review-user">
                  <span>{name.charAt(0)}</span>
                  <div>
                    <strong>{name}</strong>
                    <small>{city}</small>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <aside className="cta-card">
            <h2>Take Control of Your Health Today!</h2>
            <p>Join thousands of users who trust HealthMitra for their healthcare needs.</p>
            <button className="white-button" type="button" onClick={() => onNavigate('doctors')}>Get Started Now <span>{'->'}</span></button>
          </aside>
        </div>
      </section>

      <section className="stats-bar">
        <Stat icon="users" value="10K+" label="Happy Users" />
        <Stat icon="user" value="500+" label="Expert Doctors" />
        <Stat icon="chart" value="20+" label="Specializations" />
        <Stat icon="phone" value="24/7" label="Support" />
      </section>
    </>
  )
}
