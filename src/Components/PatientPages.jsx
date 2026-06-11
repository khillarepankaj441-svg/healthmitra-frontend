import { useEffect, useState } from 'react'
import { api } from './api'
import { DashboardShell, DataCard, MetricCard, MiniTable } from './AppShell'
import { Icon } from './Icon'
import { DoctorThumb } from './Shared'

const appts = [
  ['Dr. Priya Sharma', 'Cardiologist', '20 May 2024', '10:30 AM', 'Confirmed'],
  ['Dr. Amit Verma', 'General Physician', '24 May 2024', '04:00 PM', 'Confirmed'],
  ['Dr. Neha Gupta', 'Dermatologist', '28 May 2024', '11:00 AM', 'Upcoming'],
]

const records = [
  ['Blood_Test_Report_May2024.pdf', 'Lab Report', '20 May 2024', 'Rahul Verma'],
  ['XRay_Chest_May2024.pdf', 'Scan / Image', '18 May 2024', 'Rahul Verma'],
  ['Prescription_DrPriya_May2024.pdf', 'Prescription', '16 May 2024', 'Rahul Verma'],
  ['MRI_Brain_Apr2024.jpg', 'Scan / Image', '28 Apr 2024', 'Rahul Verma'],
  ['ECG_Report_Apr2024.pdf', 'Lab Report', '25 Apr 2024', 'Rahul Verma'],
]

const meds = [
  ['Paracetamol 650mg', '1 Tablet', 'Everyday', '9:00 AM', 'Active'],
  ['Amoxicillin 500mg', '1 Capsule', 'Every 12 hours', '9:00 AM, 9:00 PM', 'Active'],
  ['Vitamin D3 60K', '1 Tablet', 'Every Sunday', '8:00 AM', 'Active'],
  ['Metformin 500mg', '1 Tablet', 'Everyday', '8:00 PM', 'Paused'],
  ['Levothyroxine 50mcg', '1 Tablet', 'Everyday', '6:00 AM', 'Active'],
]

export function PatientDashboardPage({ onNavigate }) {
  const user = api.getStoredSession()?.user
  const [overview, setOverview] = useState({ appointments: [], records: [], reminders: [], notifications: [] })
  const actionMap = {
    'Book Appointment': 'patient-appointments',
    'Consult Online': 'patient-doctors',
    'Upload Reports': 'patient-records',
    'Order Medicines': 'patient-reminder',
    'View Prescriptions': 'patient-detail',
    'Health Records': 'patient-records',
  }

  useEffect(() => {
    Promise.allSettled([api.appointments(), api.records(), api.reminders(), api.notifications()]).then(([appointments, recordsData, reminders, notifications]) => {
      setOverview({
        appointments: appointments.status === 'fulfilled' ? appointments.value : [],
        records: recordsData.status === 'fulfilled' ? recordsData.value : [],
        reminders: reminders.status === 'fulfilled' ? reminders.value : [],
        notifications: notifications.status === 'fulfilled' ? notifications.value : [],
      })
    })
  }, [])

  return (
    <DashboardShell active="patient-dashboard" onNavigate={onNavigate}>
      <div className="dash-title"><h1>Welcome back, {user?.name || 'Patient'}!</h1><p>Here's your health overview for today.</p></div>
      <div className="metric-grid four">
        <MetricCard icon="heart" title="Heart Rate" value="72 bpm" note="Normal" />
        <MetricCard icon="pill" title="Blood Pressure" value="120/80" note="Normal" tone="green" />
        <MetricCard icon="records" title="Weight" value="70 kg" note="Healthy" tone="purple" />
        <MetricCard icon="chart" title="Steps (Today)" value="6,842" note="Goal: 10,000" tone="orange" />
      </div>
      <div className="dash-two">
        <DataCard title="Upcoming Appointments" action="View all" onAction={() => onNavigate('patient-appointments')}>
          <AppointmentList items={overview.appointments} />
          <button className="outline-button full" type="button" onClick={() => onNavigate('patient-appointments')}><Icon name="calendar" /> Book New Appointment</button>
        </DataCard>
        <DataCard title="Notifications" action="View all" onAction={() => onNavigate('patient-notifications')}>
          <InfoList items={overview.notifications.length ? overview.notifications.slice(0, 4).map((item) => item.message) : ['No notifications yet. Book appointments, upload records or calculate BMI to see updates here.']} />
        </DataCard>
      </div>
      <DataCard title="Quick Actions">
        <div className="quick-actions">
          {Object.entries(actionMap).map(([item, page]) => <button type="button" key={item} onClick={() => onNavigate(page)}><Icon name="calendar" /><strong>{item}</strong><small>Open {item.toLowerCase()}</small></button>)}
        </div>
      </DataCard>
      <div className="dash-two compact">
        <DataCard title="Health Tip of the Day"><p>A healthy outside starts from the inside. Eat well, stay active, and get enough sleep.</p></DataCard>
        <DataCard title="Recent Lab Report"><MiniTable rows={overview.records.length ? overview.records.slice(0, 1).map((item) => [item.fileName, item.date, item.type]) : [['-', '-', 'No uploaded reports yet']]} /></DataCard>
      </div>
    </DashboardShell>
  )
}

export function PatientProfilePage({ onNavigate }) {
  const user = api.getStoredSession()?.user || {}
  const [saved, setSaved] = useState('')
  const [profile, setProfile] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    role: user.role || 'Patient',
    dateOfBirth: '',
    bloodGroup: '',
    gender: '',
    maritalStatus: '',
    emergencyContact: '',
    address: '',
  })
  const update = (field, value) => setProfile((current) => ({ ...current, [field]: value }))

  useEffect(() => {
    api.profile().then(({ profile: savedProfile }) => {
      setProfile((current) => ({ ...current, ...savedProfile }))
    }).catch(() => {})
  }, [])

  const saveProfile = async () => {
    if (!profile.name.trim() || !profile.email.trim() || !/^\d{10}$/.test(String(profile.phone).replace(/\D/g, '').slice(-10))) {
      setSaved('Please provide a valid name, email, and 10-digit phone number.')
      return
    }
    try {
      const { profile: savedProfile } = await api.updateProfile(profile)
      const session = api.getStoredSession()
      if (session) {
        api.setStoredSession({ ...session, user: { ...session.user, ...savedProfile } })
      }
      setProfile((current) => ({ ...current, ...savedProfile }))
      setSaved('Profile saved successfully.')
    } catch (error) {
      setSaved(error.message)
    }
  }

  return (
    <DashboardShell active="patient-profile" onNavigate={onNavigate}>
      <div className="dash-title"><h1>My Profile</h1><p>Dashboard &gt; Profile</p></div>
      <section className="profile-hero-card">
        <DoctorThumb name={profile.name || 'Patient'} />
        <div><h2>{profile.name || 'Your Name'} <span>Verified</span></h2><p>{profile.email || 'No email saved'}</p><p>{profile.phone || 'No phone saved'}</p><p>{profile.role}</p></div>
        <button className="outline-button" type="button" onClick={() => setSaved('You can edit the fields below and save changes.')}>Edit Profile</button>
      </section>
      <div className="tabs-row">{['Personal Information', 'Account Settings', 'Privacy & Security', 'Notifications', 'Preferences'].map((t, i) => <button className={i === 0 ? 'active' : ''} type="button" key={t}>{t}</button>)}</div>
      <div className="dash-two profile-grid">
        <DataCard title="Personal Information">
          <div className="form-grid profile-form">
            <label><span>Full Name</span><input onChange={(event) => update('name', event.target.value)} value={profile.name} /></label>
            <label><span>Email Address</span><input onChange={(event) => update('email', event.target.value)} value={profile.email} /></label>
            <label><span>Date of Birth</span><input onChange={(event) => update('dateOfBirth', event.target.value)} value={profile.dateOfBirth} /></label>
            <label><span>Blood Group</span><input onChange={(event) => update('bloodGroup', event.target.value)} value={profile.bloodGroup} /></label>
            <label><span>Gender</span><input onChange={(event) => update('gender', event.target.value)} value={profile.gender} /></label>
            <label><span>Marital Status</span><input onChange={(event) => update('maritalStatus', event.target.value)} value={profile.maritalStatus} /></label>
            <label><span>Phone Number</span><input onChange={(event) => update('phone', event.target.value)} value={profile.phone} /></label>
            <label><span>Emergency Contact</span><input onChange={(event) => update('emergencyContact', event.target.value)} value={profile.emergencyContact} /></label>
          </div>
          <label className="wide-field"><span>Address</span><input onChange={(event) => update('address', event.target.value)} value={profile.address} /></label>
          <button className="primary-button save-button" type="button" onClick={saveProfile}>Save Changes</button>
          {saved && <p className={saved.includes('success') ? 'form-message success' : 'form-message'}>{saved}</p>}
        </DataCard>
        <DataCard title="Profile Completion">
          <div className="progress-line"><span style={{ width: '80%' }}></span></div>
          <InfoList items={['Personal Information - Completed', 'Contact Details - Completed', 'Medical Information - Completed', 'Insurance Details - Pending']} />
        </DataCard>
      </div>
    </DashboardShell>
  )
}

export function PatientAppointmentsPage({ onNavigate }) {
  const [items, setItems] = useState(appts)
  const [appointmentMessage, setAppointmentMessage] = useState('')

  useEffect(() => {
    api.appointments().then((data) => {
      setItems(data.map((item) => [item.doctor, item.specialty, item.date, item.time, item.status]))
    }).catch(() => {})
  }, [])

  const addAppointment = async (payload) => {
    try {
      const created = await api.createAppointment(payload)
      setItems((current) => [[created.doctor, created.specialty, created.date, created.time, created.status], ...current])
      setAppointmentMessage('Appointment booked successfully.')
    } catch (error) {
      setAppointmentMessage(error.message)
    }
  }

  return (
    <DashboardShell active="patient-appointments" onNavigate={onNavigate}>
      <div className="dash-title with-button"><div><h1>Appointments</h1><p>Book, manage and view your appointments</p></div><button className="primary-button" type="button" onClick={() => onNavigate('patient-doctors')}>+ Book New Appointment</button></div>
      <div className="metric-grid four">
        <MetricCard icon="calendar" title="Upcoming" value="2" note="Appointments" />
        <MetricCard icon="shield" title="Completed" value="8" note="Appointments" tone="green" />
        <MetricCard icon="bell" title="Cancelled" value="1" note="Appointments" tone="orange" />
        <MetricCard icon="calendar" title="Total" value="11" note="Appointments" tone="purple" />
      </div>
      <div className="dash-layout-side">
        <DataCard title="Upcoming">
          <AppointmentCards items={items} onNavigate={onNavigate} />
        </DataCard>
        <aside className="side-stack">
          <DataCard title="Book Appointment"><AppointmentBookingForm onSave={addAppointment} />{appointmentMessage && <p className={appointmentMessage.includes('success') ? 'form-message success' : 'form-message'}>{appointmentMessage}</p>}</DataCard>
          <DataCard title="Need Help?"><p>Talk to our support team to book your appointment.</p><button className="outline-button full" type="button" onClick={() => onNavigate('contact')}>Contact Support</button></DataCard>
        </aside>
      </div>
    </DashboardShell>
  )
}

export function AppointmentDetailPage({ onNavigate }) {
  const [status, setStatus] = useState('Confirmed')

  return (
    <DashboardShell active="patient-detail" onNavigate={onNavigate}>
      <div className="dash-title with-button"><div><h1>Appointment Details</h1><p>Appointment &gt; Appointment Details</p></div><div><button className="outline-button" type="button" onClick={() => onNavigate('patient-appointments')}>Reschedule</button><button className="danger-button" type="button" onClick={() => setStatus('Cancelled')}>Cancel Appointment</button></div></div>
      <section className="appointment-detail-hero">
        <DoctorThumb name="Dr. Priya Sharma" /><div><h2>Dr. Priya Sharma</h2><p>Cardiologist</p><strong>* 4.8 (120 Reviews)</strong><p>MBBS, MD (Cardiology)</p></div>
        <div><p>Appointment ID</p><strong>APT12560</strong><p>Date & Time</p><strong>20 May 2024, Monday<br />10:30 AM</strong></div>
        <div><p>Status</p><b className={status === 'Cancelled' ? 'status danger' : 'status ok'}>{status}</b><p>Your appointment is {status.toLowerCase()}.</p></div>
      </section>
      <div className="tabs-row"><button className="active" type="button">Overview</button><button type="button">Prescription</button><button type="button">Notes</button><button type="button">Documents</button></div>
      <div className="dash-three">
        <DataCard title="Appointment Information"><MiniTable rows={[['Reason for Visit', 'Chest pain and shortness of breath'], ['Patient Name', 'Rahul Verma'], ['Payment Status', 'Paid ₹800'], ['Booked On', '12 May 2024, 09:15 AM']]} /></DataCard>
        <DataCard title="Doctor Details"><InfoList items={['Experience 12+ Years', 'Specialization Cardiologist', 'Education MBBS, MD', 'Languages English, Hindi']} /></DataCard>
        <DataCard title="Prescription"><p>Issued on 20 May 2024</p><div className="file-pill">Prescription_12560.pdf <Icon name="records" /></div><button className="outline-button full" type="button" onClick={() => onNavigate('patient-records')}>View Prescription Details</button></DataCard>
      </div>
      <DataCard title="Doctor Notes"><p>Patient complains of mild chest discomfort and shortness of breath. Advised ECG and blood tests. Follow up after 1 week.</p></DataCard>
    </DashboardShell>
  )
}

export function MedicalRecordsPage({ onNavigate }) {
  const [items, setItems] = useState(records)
  const [message, setMessage] = useState('')
  const [file, setFile] = useState(null)

  useEffect(() => {
    api.records().then((data) => {
      setItems(data.map((item) => [item.fileName, item.type, item.date, item.uploadedBy]))
    }).catch(() => {})
  }, [])

  return (
    <DashboardShell active="patient-records" onNavigate={onNavigate}>
      <div className="dash-title with-button"><div><h1>Medical Records</h1><p>Upload, view and manage your medical records securely</p></div><button className="primary-button" type="button" onClick={async () => {
        if (!file) {
          setMessage('Please choose a PDF, JPG or PNG report first.')
          return
        }
        try {
          const created = await api.uploadRecord(file)
          setItems((current) => [[created.fileName, created.type, created.date, created.uploadedBy], ...current])
          setFile(null)
          setMessage('Report uploaded successfully.')
        } catch (error) {
          setMessage(error.message)
        }
      }}>Upload New Report</button></div>
      <div className="metric-grid four"><MetricCard icon="records" title="Total Records" value={items.length} note="All time" /><MetricCard icon="records" title="Lab Reports" value={items.filter((row) => row[1] === 'Lab Report').length} note="Reports" tone="green" /><MetricCard icon="records" title="Scans & Images" value={items.filter((row) => row[1] === 'Scan / Image').length} note="Reports" tone="purple" /><MetricCard icon="records" title="Other Documents" value={items.filter((row) => !['Lab Report', 'Scan / Image'].includes(row[1])).length} note="Documents" tone="orange" /></div>
      <label className="upload-zone"><Icon name="records" /><h2>{file ? file.name : 'Upload Your Report'}</h2><p>Choose PDF, JPG or PNG file</p><input hidden type="file" accept=".pdf,image/jpeg,image/png" onChange={(event) => {
        setFile(event.target.files?.[0] || null)
        setMessage('')
      }} /></label>
      {message && <p className={message.includes('success') ? 'form-message success' : 'form-message'}>{message}</p>}
      <DataCard title="Records"><MiniTable columns={['File Name', 'Type', 'Date Uploaded', 'Uploaded By']} rows={items} /></DataCard>
    </DashboardShell>
  )
}

export function ReminderPage({ onNavigate }) {
  const [items, setItems] = useState(meds)
  const [status, setStatus] = useState('')

  useEffect(() => {
    api.reminders().then((data) => {
      setItems(data.map((item) => [item.medicine, item.dose, item.frequency, item.time, item.status]))
    }).catch(() => {})
  }, [])

  const addReminder = async (payload) => {
    try {
      const created = await api.createReminder(payload)
      setItems((current) => [[created.medicine, created.dose, created.frequency, created.time, created.status], ...current])
      setStatus('Reminder saved.')
    } catch (error) {
      setStatus(error.message)
    }
  }

  return (
    <DashboardShell active="patient-reminder" onNavigate={onNavigate}>
      <div className="dash-title with-button"><div><h1>Medicine Reminder</h1><p>Manage your medicines and never miss a dose</p></div><button className="primary-button" type="button">+ Add Reminder</button></div>
      <div className="metric-grid four"><MetricCard icon="pill" title="Total Reminders" value="7" note="All medicines" /><MetricCard icon="shield" title="Active Reminders" value="6" note="Currently active" tone="green" /><MetricCard icon="bell" title="Due Today" value="3" note="Upcoming doses" tone="orange" /><MetricCard icon="bell" title="Completed Today" value="2" note="Doses taken" tone="purple" /></div>
      <div className="dash-layout-side">
        <DataCard title="Your Medicine Reminders"><MiniTable columns={['Medicine', 'Dose', 'Frequency', 'Time', 'Status']} rows={items} /></DataCard>
        <DataCard title="Add New Reminder"><ReminderForm onSave={addReminder} />{status && <p className="form-message success">{status}</p>}</DataCard>
      </div>
    </DashboardShell>
  )
}

export function BmiPage({ onNavigate }) {
  const [bmiInput, setBmiInput] = useState({ age: '34', height: '175', weight: '72' })
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [message, setMessage] = useState('')

  const getBmiLabel = (value) => value < 18.5 ? 'Underweight' : value < 25 ? 'Normal Weight' : value < 30 ? 'Overweight' : 'Obesity'
  const getAdvice = (label) => {
    if (label === 'Underweight') return 'Increase nutritious calories and consult a doctor if weight loss is sudden.'
    if (label === 'Normal Weight') return 'Great range. Maintain your routine with balanced food and activity.'
    if (label === 'Overweight') return 'Add regular walking, reduce sugary foods, and track weekly progress.'
    return 'Please consult a healthcare provider for a safe weight management plan.'
  }

  useEffect(() => {
    api.bmiHistory().then((data) => {
      setHistory(data.map((item) => ({ ...item, advice: getAdvice(item.label) })).slice(0, 5))
    }).catch(() => {})
  }, [])

  const calculateBmi = async () => {
    const age = Number(bmiInput.age)
    const height = Number(bmiInput.height)
    const weight = Number(bmiInput.weight)

    if (!age || age < 2 || age > 120 || !height || height < 50 || height > 260 || !weight || weight < 2 || weight > 350) {
      setMessage('Please enter valid age, height and weight.')
      return
    }

    const heightM = height / 100
    const value = Number((weight / (heightM * heightM)).toFixed(1))
    const label = getBmiLabel(value)
    const nextResult = { age, height, weight, value, label, advice: getAdvice(label), date: new Date().toLocaleDateString() }
    try {
      const saved = await api.saveBmi({ age, height, weight, value, label })
      const savedResult = { ...nextResult, ...saved, advice: getAdvice(saved.label) }
      setResult(savedResult)
      setHistory((current) => [savedResult, ...current].slice(0, 5))
      setMessage('BMI calculated successfully.')
    } catch (error) {
      setResult(nextResult)
      setHistory((current) => [nextResult, ...current].slice(0, 5))
      setMessage(error.message)
    }
  }

  return (
    <DashboardShell active="patient-bmi" onNavigate={onNavigate}>
      <div className="dash-title"><h1>BMI Calculator</h1><p>Check your Body Mass Index and understand your health better.</p></div>
      <div className="bmi-grid">
        <DataCard title="Enter Your Details"><div className="form-stack">{['age', 'height', 'weight'].map((field) => <label key={field}><span>{field === 'age' ? 'Age' : field === 'height' ? 'Height (cm)' : 'Weight (kg)'}</span><input onChange={(event) => {
          setBmiInput((current) => ({ ...current, [field]: event.target.value }))
          setMessage('')
        }} min="1" type="number" value={bmiInput[field]} /></label>)}<button className="primary-button full" type="button" onClick={calculateBmi}>Calculate BMI</button>{message && <p className={message.includes('success') ? 'form-message success' : 'form-message'}>{message}</p>}</div></DataCard>
        <DataCard title="Your BMI Result"><div className="bmi-gauge"><span>{result ? result.value : '--'}</span><strong>{result ? result.label : 'Calculate'}</strong></div><div className={result?.label === 'Obesity' ? 'danger-note' : 'success-box'}>{result ? result.advice : 'Enter your details and click Calculate BMI.'}</div></DataCard>
        <DataCard title="BMI Category"><InfoList items={['Underweight < 18.5', 'Normal weight 18.5 - 24.9', 'Overweight 25 - 29.9', 'Obesity > 30']} /></DataCard>
      </div>
      <DataCard title="BMI History"><MiniTable columns={['Date', 'BMI', 'Category']} rows={history.length ? history.map((item) => [item.date, item.value, item.label]) : [['-', '-', 'No calculation yet']]} /></DataCard>
    </DashboardShell>
  )
}

export function SosPage({ onNavigate }) {
  const [alertSent, setAlertSent] = useState(false)
  const [message, setMessage] = useState('')
  const sendAlert = async (alertMessage = 'Emergency alert triggered') => {
    try {
      await api.sendSos({ message: alertMessage, location: 'Shared from HealthMitra web app' })
      setAlertSent(true)
      setMessage('Emergency alert sent to your contacts and admin dashboard.')
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <DashboardShell active="patient-sos" onNavigate={onNavigate}>
      <div className="dash-title"><h1>Emergency SOS</h1><p>Quick help when you need it the most.</p></div>
      <div className="sos-grid">
        <DataCard title="Send Emergency Alert"><button className="sos-button" type="button" onClick={() => sendAlert()}>SOS<small>Tap to send alert</small></button><div className="danger-note">{alertSent ? message : 'Your location will be shared with your emergency contacts.'}</div></DataCard>
        <DataCard title="Emergency Contacts" action="Manage Contacts" onAction={() => onNavigate('patient-profile')}><InfoList items={['Anita Verma (Wife) +91 98765 43210', 'Rajesh Verma (Father) +91 98123 45678', 'Priya Verma (Sister) +91 99110 11223', 'Amit Sharma (Friend) +91 99887 76655']} /><button className="outline-button full" type="button" onClick={() => onNavigate('patient-profile')}>Add Emergency Contact</button></DataCard>
      </div>
      <div className="dash-two"><DataCard title="Quick Actions"><div className="quick-call">{['Ambulance 108', 'Police 100', 'Fire Dept. 101', 'Women Helpline 1091'].map((x) => <button type="button" key={x} onClick={() => sendAlert(x)}>{x}</button>)}</div></DataCard><DataCard title="Safety Tips"><InfoList items={['Press the SOS button only in a genuine emergency.', 'Make sure your location services are enabled.', 'Keep your emergency contacts updated.', 'Stay calm and follow the instructions.']} /></DataCard></div>
    </DashboardShell>
  )
}

export function NotificationsPage({ onNavigate }) {
  const [items, setItems] = useState([])
  const notes = ['Upcoming Appointment Reminder', 'Medicine Reminder', 'Appointment Confirmed', 'Medicine Reminder', 'System Update', 'Health Tip of the Day', 'Appointment Cancelled', 'Medicine Reminder']

  useEffect(() => {
    api.notifications().then(setItems).catch(() => setItems([]))
  }, [])

  const displayNotes = items.length > 0 ? items : notes.map((title, index) => ({ id: String(index), title, message: index % 2 ? 'Time to take your medicine.' : 'You have an appointment update.', time: index < 2 ? 'Today' : 'Yesterday' }))

  return (
    <DashboardShell active="patient-notifications" onNavigate={onNavigate}>
      <div className="dash-title"><h1>Notifications</h1><p>Stay updated with your health alerts, reminders and important updates.</p></div>
      <div className="metric-grid four"><MetricCard icon="calendar" title="Appointments" value="4" note="New" /><MetricCard icon="user" title="Reminders" value="3" note="New" tone="green" /><MetricCard icon="bell" title="System Updates" value="1" note="New" tone="orange" /><MetricCard icon="bell" title="All Notifications" value="8" note="Unread" tone="purple" /></div>
      <DataCard title="All"><div className="notification-list">{displayNotes.map((note, i) => <button className="notification-row" key={note.id} type="button" onClick={() => api.markNotificationRead(note.id).catch(() => {})}><span><Icon name={i % 2 ? 'pill' : 'calendar'} /></span><div><strong>{note.title}</strong><p>{note.message}</p></div><time>{note.time}</time></button>)}</div></DataCard>
    </DashboardShell>
  )
}

export function SettingsPage({ onNavigate, session }) {
  const admin = session?.role === 'Healthcare Provider' || session?.user?.role === 'Healthcare Provider'
  const [darkMode, setDarkMode] = useState(() => document.body.classList.contains('dark-theme'))
  const user = session?.user || api.getStoredSession()?.user || {}

  const toggleDarkMode = (enabled) => {
    setDarkMode(enabled)
    if (enabled) {
      document.body.classList.add('dark-theme')
      localStorage.setItem('healthmitra_theme', 'dark')
    } else {
      document.body.classList.remove('dark-theme')
      localStorage.setItem('healthmitra_theme', 'light')
    }
  }

  return (
    <DashboardShell active={admin ? 'admin-settings' : 'patient-settings'} admin={admin} onNavigate={onNavigate}>
      <div className="dash-title"><h1>Settings</h1><p>Manage your account preferences and app settings.</p></div>
      <div className="tabs-row">{['General', 'Account', 'Security', 'Notifications', 'Privacy', 'About'].map((t, i) => <button className={i === 0 ? 'active' : ''} type="button" key={t}>{t}</button>)}</div>
      <div className="settings-grid">
        <DataCard title="Appearance"><div className="toggle-grid"><button className={!darkMode ? 'active' : ''} type="button" onClick={() => toggleDarkMode(false)}>Light</button><button className={darkMode ? 'active' : ''} type="button" onClick={() => toggleDarkMode(true)}>Dark</button></div><InfoList items={[`Dark Mode ${darkMode ? 'enabled' : 'disabled'}`, 'App Language English', 'Font Size A']} /></DataCard>
        <DataCard title="Account Settings"><MiniTable rows={[['Full Name', user.name || '-'], ['Email Address', user.email || '-'], ['Phone Number', user.phone || '-'], ['Role', user.role || '-']]} /></DataCard>
        <DataCard title="Preferences"><InfoList items={['Data Saver Off', 'Auto-lock 5 minutes', 'Face ID / Biometric On']} /></DataCard>
        <DataCard title="Change Password"><FormStack fields={['Current Password', 'New Password', 'Confirm New Password']} button="Update Password" /></DataCard>
      </div>
    </DashboardShell>
  )
}

function AppointmentList({ items = [] }) {
  const rows = items.length ? items.map((item) => [item.doctor, item.specialty, item.date, item.time, item.status]) : appts
  return <MiniTable rows={rows} />
}

function AppointmentCards({ items = appts, onNavigate }) {
  return <div className="appointment-card-list">{items.slice(0, 2).map(([name, spec, date, time, status]) => <article key={name}><DoctorThumb name={name} /><div><h3>{name}</h3><p>{spec}</p><p>{date} | {time}</p></div><b>{status}</b><button type="button" onClick={() => onNavigate('patient-detail')}>View Details</button></article>)}</div>
}

function InfoList({ items }) {
  return <div className="info-list">{items.map((item) => <p key={item}><Icon name="shield" /> {item}</p>)}</div>
}

function FormStack({ fields, button }) {
  return <div className="form-stack">{fields.map((field) => <label key={field}><span>{field}</span><input placeholder={field} /></label>)}<button className="primary-button full" type="button">{button}</button></div>
}

function AppointmentBookingForm({ onSave }) {
  const [doctors, setDoctors] = useState([])
  const [form, setForm] = useState({ doctorId: '', date: new Date().toISOString().slice(0, 10), time: '10:30 AM' })
  const [error, setError] = useState('')
  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setError('')
  }

  useEffect(() => {
    api.doctors().then((data) => {
      setDoctors(data)
      setForm((current) => ({ ...current, doctorId: current.doctorId || data[0]?.id || '' }))
    }).catch(() => {})
  }, [])

  return (
    <form className="form-stack" onSubmit={(event) => {
      event.preventDefault()
      if (!form.doctorId || !form.date || !form.time) {
        setError('Please select a doctor, date, and time.')
        return
      }
      onSave(form)
    }}>
      <label><span>Select Doctor</span><select onChange={(event) => update('doctorId', event.target.value)} value={form.doctorId}>{doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.name} - {doctor.specialty}</option>)}</select></label>
      <label><span>Select Date</span><input min={new Date().toISOString().slice(0, 10)} onChange={(event) => update('date', event.target.value)} type="date" value={form.date} /></label>
      <label><span>Select Time</span><select onChange={(event) => update('time', event.target.value)} value={form.time}>{['10:30 AM', '12:00 PM', '02:30 PM', '04:00 PM', '06:00 PM'].map((slot) => <option key={slot}>{slot}</option>)}</select></label>
      {error && <p className="form-message">{error}</p>}
      <button className="primary-button full" type="submit">Book Appointment</button>
    </form>
  )
}

function ReminderForm({ onSave }) {
  const [form, setForm] = useState({ medicine: '', dose: '', frequency: '', time: '' })
  const [error, setError] = useState('')
  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setError('')
  }

  return (
    <form className="form-stack" onSubmit={(event) => {
      event.preventDefault()
      if (!form.medicine.trim() || !form.dose.trim() || !form.frequency.trim() || !form.time.trim()) {
        setError('Please fill out all fields.')
        return
      }
      onSave(form)
      setForm({ medicine: '', dose: '', frequency: '', time: '' })
    }}>
      {[
        ['medicine', 'Medicine Name'],
        ['dose', 'Dose'],
        ['frequency', 'Frequency'],
        ['time', 'Time'],
      ].map(([field, label]) => <label key={field}><span>{label}</span><input onChange={(event) => update(field, event.target.value)} placeholder={label} value={form[field]} /></label>)}
      {error && <p className="form-message">{error}</p>}
      <button className="primary-button full" type="submit">Save Reminder</button>
    </form>
  )
}
