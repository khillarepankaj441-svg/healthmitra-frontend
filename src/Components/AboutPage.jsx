import { Icon } from './Icon'
import { DoctorThumb, SectionTitle, SimpleHero, Stat } from './Shared'

export function AboutPage() {
  const team = [
    ['Rohit Sharma', 'Founder & CEO', 'Healthcare enthusiast and visionary leader.'],
    ['Anjali Verma', 'Chief Medical Officer', 'Dedicated to providing the best medical care.'],
    ['Amit Patel', 'Head of Technology', 'Passionate about building innovative solutions.'],
    ['Neha Singh', 'Head of Operations', 'Ensures smooth operations and happy patients.'],
  ]

  return (
    <>
      <SimpleHero
        badge="About Us"
        title="About"
        accent="HealthMitra"
        text="HealthMitra is your trusted healthcare companion, dedicated to making healthcare accessible, reliable and affordable for everyone. We combine technology and care to bring better health to your fingertips."
        art="doctor"
      >
        <div className="about-points">
          <span><Icon name="shield" /> Trusted by <strong>10K+ Users</strong></span>
          <span><Icon name="lock" /> Secure & <strong>Confidential</strong></span>
          <span><Icon name="headset" /> 24/7 <strong>Support</strong></span>
        </div>
      </SimpleHero>

      <section className="mission-section">
        <SectionTitle title="Our Mission & Vision" />
        <div className="mission-grid">
          <article className="mission-card blue-soft">
            <span><Icon name="target" /></span>
            <div>
              <h3>Our Mission</h3>
              <p>To make quality healthcare accessible to all by leveraging technology and innovation. We are committed to empowering people to take control of their health and live better, healthier lives.</p>
            </div>
          </article>
          <article className="mission-card green-soft">
            <span><Icon name="eye" /></span>
            <div>
              <h3>Our Vision</h3>
              <p>To be a leading digital healthcare platform that transforms the way people access, manage and experience healthcare, creating a healthier world for everyone.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="team-section">
        <SectionTitle title="Our Team" />
        <div className="team-grid">
          {team.map(([name, role, bio]) => (
            <article className="team-card" key={name}>
              <DoctorThumb name={name} />
              <div>
                <h3>{name}</h3>
                <p>{role}</p>
                <span>{bio}</span>
                <div className="social-row"><b>in</b><b>t</b><b>f</b></div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="stats-bar about-stats">
        <Stat icon="users" value="10K+" label="Happy Users" />
        <Stat icon="headset" value="500+" label="Expert Doctors" />
        <Stat icon="calendar" value="25K+" label="Appointments Booked" />
        <Stat icon="heart" value="98%" label="Patient Satisfaction" />
      </section>
    </>
  )
}
