import doctorHero from '../assets/doctor-hero.png'
import { getDoctorPhoto } from './doctorPhotos'
import { Icon } from './Icon'

export function Brand({ onNavigate }) {
  return (
    <button className="brand brand-button" type="button" onClick={() => onNavigate('home')} aria-label="HealthMitra home">
      <span className="brand-mark"><Icon name="heart" /></span>
      <span>Health<span>Mitra</span></span>
    </button>
  )
}

export function HealthHeader({ activePage, onNavigate }) {
  const links = [
    ['home', 'Home'],
    ['services', 'Services'],
    ['doctors', 'Doctors'],
    ['blogs', 'Health Blogs'],
    ['about', 'About Us'],
    ['faq', 'FAQ'],
    ['contact', 'Contact'],
  ]

  return (
    <header className="site-header">
      <Brand onNavigate={onNavigate} />
      <nav className="nav-links" aria-label="Primary navigation">
        {links.map(([page, label]) => (
          <button className={activePage === page ? 'active' : ''} type="button" onClick={() => onNavigate(page)} key={page}>
            {label}
          </button>
        ))}
      </nav>
      <div className="header-actions">
        <button className="icon-button" type="button" aria-label="Search" onClick={() => onNavigate('doctors')}><Icon name="search" /></button>
        <button className="ghost-button" type="button" onClick={() => onNavigate('login')}>Login</button>
        <button className="primary-button small" type="button" onClick={() => onNavigate('signup')}>Sign Up</button>
      </div>
    </header>
  )
}

export function SectionTitle({ title }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      <span></span>
    </div>
  )
}

export function Stat({ icon, value, label }) {
  return (
    <div className="stat-item">
      <Icon name={icon} />
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  )
}

export function HeroArt({ type = 'doctor' }) {
  if (type === 'doctor') {
    return <img className="hero-art-img" src={doctorHero} alt="Doctor" />
  }

  return (
    <div className={`illustration illustration-${type}`} aria-hidden="true">
      <span className="blob-one"></span>
      <span className="blob-two"></span>
      <Icon name={type === 'faq' ? 'plus' : type === 'contact' ? 'mail' : 'heart'} />
      <Icon name={type === 'faq' ? 'records' : type === 'contact' ? 'headset' : 'shield'} />
    </div>
  )
}

export function SimpleHero({ badge, title, accent, text, art, children }) {
  return (
    <section className="sub-hero">
      <div className="sub-hero-copy">
        {badge && <span className="eyebrow"><Icon name="heart" /> {badge}</span>}
        <h1>{title} {accent && <span>{accent}</span>}</h1>
        <p>{text}</p>
        {children}
      </div>
      <div className="sub-hero-art">
        <HeroArt type={art} />
      </div>
    </section>
  )
}

export function DoctorThumb({ className = '', name = '', alt }) {
  const photo = name ? getDoctorPhoto({ name }) : doctorHero
  return <img className={className} src={photo} alt={alt || `${name || 'Doctor'} profile`} />
}
