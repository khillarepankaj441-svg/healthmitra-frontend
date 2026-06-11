import { useEffect, useState } from 'react'
import { api } from './api'
import { DashboardShell, DataCard } from './AppShell'
import { doctors } from './data'
import { getDoctorPhoto } from './doctorPhotos'
import { Icon } from './Icon'
import { SimpleHero } from './Shared'

export function DoctorsPage({ onNavigate, session }) {
  const filters = ['All Specializations', 'General Physician', 'Cardiologist', 'Dermatologist', 'Neurologist', 'Pediatrician', 'Orthopedic', 'Gynecologist', 'ENT Specialist', 'Ophthalmologist']
  const [query, setQuery] = useState('')
  const [specialty, setSpecialty] = useState('All Specializations')
  const [sortBy, setSortBy] = useState('Experience')
  const [visibleDoctors, setVisibleDoctors] = useState(doctors)
  const [error, setError] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState(null)

  useEffect(() => {
    let active = true
    api.doctors({ q: query, specialty, sort: sortBy })
      .then((items) => {
        if (active) {
          setVisibleDoctors(items)
          setError('')
        }
      })
      .catch((err) => {
        if (active) setError(err.message)
      })
    return () => {
      active = false
    }
  }, [query, specialty, sortBy])

  const content = (
    <>
      {!session?.loggedIn && !selectedDoctor && (
        <SimpleHero
          title="Our Doctors"
          text="Meet our experienced and qualified doctors who are dedicated to your good health."
          art="doctor"
        />
      )}

      {selectedDoctor ? (
        <DoctorProfileView doctor={selectedDoctor} onBack={() => setSelectedDoctor(null)} onNavigate={onNavigate} />
      ) : (
        <>
          <section className="listing-toolbar">
            <label className="search-box"><Icon name="search" /><input onChange={(event) => setQuery(event.target.value)} placeholder="Search doctors by name, specialization, hospital..." value={query} /></label>
            <select aria-label="All specializations" onChange={(event) => setSpecialty(event.target.value)} value={specialty}>
              {filters.map((filter) => <option key={filter}>{filter}</option>)}
            </select>
            <select aria-label="Sort doctors" onChange={(event) => setSortBy(event.target.value)} value={sortBy}><option>Experience</option><option>Rating</option></select>
          </section>

          <section className="doctors-page-layout">
            <aside className="filter-panel">
              <div className="filter-head"><h3>Filter Doctors</h3><button type="button">Reset</button></div>
              <h4>Specialization</h4>
              {filters.map((filter, index) => (
                <label key={filter}><input checked={specialty === filter || (index === 0 && specialty === 'All Specializations')} onChange={() => setSpecialty(filter)} type="radio" name="doctor-specialty" /> {filter}</label>
              ))}
              <h4>Experience</h4>
              {['All Experience', '0-5 Years', '5-10 Years', '10+ Years'].map((item, index) => (
                <label key={item}><input name="experience" type="radio" defaultChecked={index === 0} /> {item}</label>
              ))}
              <h4>Availability</h4>
              <label><input type="checkbox" defaultChecked /> Available Today</label>
              <button className="primary-button" type="button">Apply Filters</button>
            </aside>

            <div className="doctor-list-grid">
              {error && <p className="empty-state">{error}</p>}
              {visibleDoctors.map((doctor) => (
                <DoctorProfileCard doctor={doctor} key={doctor.id || doctor[0]} onViewProfile={() => setSelectedDoctor(doctor)} />
              ))}
              {visibleDoctors.length === 0 && <p className="empty-state">No doctors match your filters.</p>}
            </div>
          </section>

          <div className="pagination-row">
            <button type="button">{'<'}</button>
            <button className="active" type="button">1</button>
            <button type="button">2</button>
            <button type="button">3</button>
            <span>...</span>
            <button type="button">10</button>
            <button type="button">{'>'}</button>
          </div>
        </>
      )}
    </>
  )

  if (session?.loggedIn) {
    const admin = session.role === 'admin'
    return (
      <DashboardShell active={admin ? 'admin-doctors' : 'patient-doctors'} admin={admin} onNavigate={onNavigate}>
        <div className="dash-title">
          <h1>Doctors</h1>
          <p>{selectedDoctor ? `Profile > ${selectedDoctor.name}` : 'Search, filter and view available doctors.'}</p>
        </div>
        {content}
      </DashboardShell>
    )
  }

  return content
}

function DoctorProfileCard({ doctor, onViewProfile }) {
  const name = doctor.name || doctor[0]
  const specialty = doctor.specialty || doctor[1]
  const experience = doctor.experience ? `${doctor.experience}+ Years Exp.` : doctor[2]
  const degree = doctor.degree || doctor[3]
  const hospital = doctor.hospital || doctor[4]
  const rating = doctor.rating || doctor[5]
  const reviews = doctor.reviews || doctor[6]
  const casesHandled = doctor.casesHandled ? `${doctor.casesHandled}+ Cases` : ''
  const photo = getDoctorPhoto(doctor)

  return (
    <article className="doctor-profile-card">
      <div className="doctor-profile-photo">
        <img src={photo} alt={`${name} profile`} />
        <span>Available</span>
      </div>
      <h3>{name}</h3>
      <span className="doctor-specialty">{specialty}</span>
      <p>{experience} <b>*</b> {degree}</p>
      {casesHandled && <p><strong>{casesHandled} Handled</strong></p>}
      <p><Icon name="map" /> {hospital}</p>
      <div className="rating-line">* {rating} ({reviews} reviews)</div>
      <button className="outline-button" type="button" onClick={onViewProfile}>View Profile</button>
    </article>
  )
}

function DoctorProfileView({ doctor, onBack, onNavigate }) {
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), time: '10:30 AM' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const name = doctor.name || doctor[0]
  const specialty = doctor.specialty || doctor[1]
  const experienceStr = doctor.experience ? doctor.experience.toString().replace('+ Years Exp.', '') : doctor[2]?.toString().replace('+ Years Exp.', '')
  const degree = doctor.degree || doctor[3]
  const hospital = doctor.hospital || doctor[4]
  const rating = doctor.rating || doctor[5]
  const reviews = doctor.reviews || doctor[6]
  const casesHandled = doctor.casesHandled || (name ? (name.length * 200 + 3000) : 0)

  const handleBook = async (e) => {
    e.preventDefault()
    if (!api.getStoredSession()?.loggedIn) {
      onNavigate('login')
      return
    }
    if (!form.date || !form.time) {
      setError('Please select a date and time.')
      return
    }
    try {
      await api.createAppointment({ doctorId: doctor.id || name, date: form.date, time: form.time })
      setSuccess('Appointment booked successfully! You can view it in your dashboard.')
      setError('')
    } catch (err) {
      setError(err.message)
      setSuccess('')
    }
  }

  return (
    <section className="doctor-profile-view">
      <button className="outline-button" style={{ marginBottom: '1.5rem' }} type="button" onClick={onBack}>
        <Icon name="arrow-left" /> Back to Doctors
      </button>
      <div className="dash-two">
        <DataCard title="Doctor Profile">
          <div className="doctor-detail-hero" style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <img src={getDoctorPhoto(doctor)} alt={name} style={{ width: '120px', height: '120px', borderRadius: '12px', objectFit: 'cover' }} />
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{name}</h2>
              <p className="doctor-specialty" style={{ color: 'var(--primary)', fontWeight: 'bold', marginBottom: '0.5rem' }}>{specialty}</p>
              <p><strong>Qualifications (Degree):</strong> {degree}</p>
              <p><strong>Experience:</strong> {experienceStr}+ Years</p>
              <p><strong>Track Record:</strong> {casesHandled}+ Successful Cases</p>
              <div className="rating-line" style={{ marginTop: '0.5rem' }}>* {rating} ({reviews} reviews)</div>
            </div>
          </div>
          <div className="doctor-bio" style={{ background: 'var(--bg-light)', padding: '1rem', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>About</h3>
            <p style={{ lineHeight: '1.5' }}>{name} is a highly skilled {specialty} with over {experienceStr} years of experience working at {hospital}. They have successfully handled over {casesHandled} cases and are known for their patient-centric approach and accurate diagnoses.</p>
          </div>
        </DataCard>
        
        <DataCard title="Book Appointment">
          <form className="form-stack" onSubmit={handleBook}>
            <label><span>Selected Doctor</span><input value={`${name} - ${specialty}`} disabled style={{ background: 'var(--bg-light)' }} /></label>
            <label><span>Select Date</span><input type="date" min={new Date().toISOString().slice(0, 10)} value={form.date} onChange={e => { setForm({...form, date: e.target.value}); setError(''); setSuccess('') }} /></label>
            <label><span>Select Time</span>
              <select value={form.time} onChange={e => { setForm({...form, time: e.target.value}); setError(''); setSuccess('') }}>
                {['10:30 AM', '12:00 PM', '02:30 PM', '04:00 PM', '06:00 PM'].map(slot => <option key={slot}>{slot}</option>)}
              </select>
            </label>
            {error && <p className="form-message">{error}</p>}
            {success && <p className="form-message success">{success}</p>}
            <button className="primary-button full" type="submit" style={{ marginTop: '1rem' }}>Confirm Appointment</button>
          </form>
        </DataCard>
      </div>
    </section>
  )
}
