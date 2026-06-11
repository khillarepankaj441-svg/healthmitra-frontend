import { useEffect, useRef, useState } from 'react'
import './App.css'
import './dark-theme.css'
import {
  AdminAppointmentsPage,
  AdminBlogsPage,
  AdminDashboardPage,
  AdminReportsPage,
  AdminUsersPage,
} from './components/AdminPages'
import { AboutPage } from './components/AboutPage'
import { api } from './components/api'
import { LoginPage, SignupPage } from './components/AuthPages'
import { BlogsPage } from './components/BlogsPage'
import { ContactPage } from './components/ContactPage'
import { DoctorsPage } from './components/DoctorsPage'
import { FaqPage } from './components/FaqPage'
import { HomePage } from './components/HomePage'
import {
  AppointmentDetailPage,
  BmiPage,
  MedicalRecordsPage,
  NotificationsPage,
  PatientAppointmentsPage,
  PatientDashboardPage,
  PatientProfilePage,
  ReminderPage,
  SettingsPage,
  SosPage,
} from './components/PatientPages'
import { HealthHeader } from './components/Shared'
import { Icon } from './components/Icon'

const pageComponents = {
  home: HomePage,
  services: HomePage,
  doctors: DoctorsPage,
  'patient-doctors': DoctorsPage,
  'admin-doctors': DoctorsPage,
  blogs: BlogsPage,
  about: AboutPage,
  faq: FaqPage,
  contact: ContactPage,
  login: LoginPage,
  signup: SignupPage,
  'patient-dashboard': PatientDashboardPage,
  'patient-profile': PatientProfilePage,
  'patient-appointments': PatientAppointmentsPage,
  'patient-detail': AppointmentDetailPage,
  'patient-records': MedicalRecordsPage,
  'patient-reminder': ReminderPage,
  'patient-bmi': BmiPage,
  'patient-sos': SosPage,
  'patient-notifications': NotificationsPage,
  'patient-settings': SettingsPage,
  'admin-settings': SettingsPage,
  'admin-dashboard': AdminDashboardPage,
  'admin-users': AdminUsersPage,
  'admin-appointments': AdminAppointmentsPage,
  'admin-blogs': AdminBlogsPage,
  'admin-reports': AdminReportsPage,
}

const fullScreenPages = new Set([
  'login',
  'signup',
  'patient-dashboard',
  'patient-doctors',
  'patient-profile',
  'patient-appointments',
  'patient-detail',
  'patient-records',
  'patient-reminder',
  'patient-bmi',
  'patient-sos',
  'patient-notifications',
  'patient-settings',
  'admin-dashboard',
  'admin-doctors',
  'admin-users',
  'admin-appointments',
  'admin-blogs',
  'admin-reports',
  'admin-settings',
])

function App() {
  const [activePage, setActivePage] = useState('home')
  const historyRef = useRef([])
  const [session, setSession] = useState(() => {
    const stored = api.getStoredSession()
    return stored?.user ? { loggedIn: true, role: stored.user.role === 'Healthcare Provider' ? 'admin' : 'patient', user: stored.user } : { loggedIn: false, role: 'guest' }
  })
  const Page = pageComponents[activePage]

  useEffect(() => {
    const target = activePage === 'services' ? document.getElementById('services') : null
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [activePage])

  useEffect(() => {
    if (localStorage.getItem('healthmitra_theme') === 'dark') {
      document.body.classList.add('dark-theme')
    }
  }, [])

  const navigate = (page) => {
    const moveTo = (nextPage, remember = true) => {
      if (remember && nextPage !== activePage) {
        historyRef.current = [...historyRef.current, activePage].slice(-12)
      }
      setActivePage(nextPage)
      if (nextPage !== 'services') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    if (page === 'back') {
      const previous = historyRef.current.pop()
      const fallback = session.role === 'admin' ? 'admin-dashboard' : session.role === 'patient' ? 'patient-dashboard' : 'home'
      moveTo(previous || fallback, false)
      return
    }

    if (page === 'logout') {
      api.clearStoredSession()
      historyRef.current = []
      setSession({ loggedIn: false, role: 'guest' })
      setActivePage('home')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (page.startsWith('patient-')) {
      if (!api.getStoredSession()) {
        moveTo('login')
        return
      }
      setSession({ loggedIn: true, role: 'patient' })
    }

    if (page.startsWith('admin-')) {
      const stored = api.getStoredSession()
      if (!stored) {
        moveTo('login')
        return
      }
      if (stored.user.role !== 'Healthcare Provider') {
        moveTo('patient-dashboard')
        return
      }
      setSession({ loggedIn: true, role: 'admin' })
    }

    moveTo(page)
  }

  if (fullScreenPages.has(activePage)) {
    return <Page onNavigate={navigate} session={session} />
  }

  return (
    <main className="health-page">
      <div className="page-shell">
        <HealthHeader activePage={activePage} onNavigate={navigate} />
        {activePage !== 'home' && <button className="page-back-button" type="button" onClick={() => navigate('back')}><Icon name="arrow-left" /> Back</button>}
        <Page onNavigate={navigate} />
      </div>
    </main>
  )
}

export default App
