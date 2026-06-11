import { Icon } from './Icon'
import { api } from './api'
import { Brand, DoctorThumb } from './Shared'

const patientMenu = [
  ['patient-dashboard', 'grid', 'Dashboard'],
  ['patient-appointments', 'calendar', 'Appointments'],
  ['patient-doctors', 'user', 'Doctors'],
  ['patient-detail', 'records', 'Prescriptions'],
  ['patient-records', 'records', 'Medical Records'],
  ['patient-reminder', 'pill', 'Medications'],
  ['patient-sos', 'bell', 'Emergency SOS'],
  ['patient-notifications', 'bell', 'Notifications'],
  ['patient-bmi', 'chart', 'BMI Calculator'],
  ['patient-profile', 'user', 'Profile Settings'],
  ['patient-settings', 'settings', 'Settings'],
]

const adminMenu = [
  ['admin-dashboard', 'grid', 'Dashboard'],
  ['admin-users', 'users', 'Users'],
  ['admin-doctors', 'user', 'Doctors'],
  ['admin-appointments', 'calendar', 'Appointments'],
  ['admin-blogs', 'records', 'CMS Management'],
  ['admin-reports', 'chart', 'Reports & Feedback'],
  ['admin-settings', 'settings', 'Settings'],
]

export function DashboardShell({ active, admin = false, children, onNavigate }) {
  const menu = admin ? adminMenu : patientMenu
  const dashboardPage = admin ? 'admin-dashboard' : 'patient-dashboard'
  const user = api.getStoredSession()?.user

  return (
    <div className="app-dashboard-shell">
      <aside className="app-sidebar">
        <Brand onNavigate={() => onNavigate(dashboardPage)} />
        {admin && <small className="panel-label">Admin Panel</small>}
        <nav>
          {menu.map(([page, icon, label]) => (
            <button className={active === page ? 'active' : ''} type="button" key={page} onClick={() => onNavigate(page)}>
              <Icon name={icon} /> {label}
            </button>
          ))}
        </nav>
        <div className="sidebar-help">
          <DoctorThumb name={admin ? user?.name || 'Admin User' : 'Need Help'} />
          <div>
            <strong>{admin ? user?.name || 'Admin User' : 'Need Help?'}</strong>
            <p>{admin ? user?.role || 'Healthcare Provider' : 'Our support team is here to help you.'}</p>
            <button type="button" onClick={() => onNavigate(admin ? 'logout' : 'contact')}>{admin ? 'Log Out' : 'Contact Support'}</button>
          </div>
        </div>
      </aside>
      <section className="app-workspace">
        <TopBar admin={admin} onNavigate={onNavigate} />
        {children}
      </section>
    </div>
  )
}

export function TopBar({ admin = false, onNavigate }) {
  const user = api.getStoredSession()?.user
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      onNavigate(admin ? 'admin-doctors' : 'patient-doctors')
    }
  }
  return (
    <header className="dash-topbar has-back">
      <button className="top-back-button" type="button" onClick={() => onNavigate('back')}><Icon name="arrow-left" /> Back</button>
      <label><Icon name="search" /><input placeholder={admin ? 'Search users, doctors, appointments...' : 'Search doctors, services, medicines...'} onKeyDown={handleSearch} /></label>
      <button type="button" aria-label="Notifications" onClick={() => onNavigate(admin ? 'admin-reports' : 'patient-notifications')}><Icon name="bell" /><span>{admin ? '6' : '3'}</span></button>
      <button className="top-user top-user-button" type="button" onClick={() => onNavigate(admin ? 'admin-dashboard' : 'patient-profile')}><DoctorThumb name={user?.name || (admin ? 'Admin User' : 'Patient')} /><strong>{user?.name || (admin ? 'Admin User' : 'Patient')}<small>{user?.role || (admin ? 'Healthcare Provider' : 'Patient')}</small></strong></button>
    </header>
  )
}

export function MetricCard({ icon, title, value, note, tone = 'blue' }) {
  return (
    <article className={`metric-card ${tone}`}>
      <span><Icon name={icon} /></span>
      <div><p>{title}</p><strong>{value}</strong><small>{note}</small></div>
    </article>
  )
}

export function DataCard({ title, children, action, onAction }) {
  return (
    <section className="dash-card">
      <div className="dash-card-head"><h2>{title}</h2>{action && <button type="button" onClick={onAction}>{action}</button>}</div>
      {children}
    </section>
  )
}

export function MiniTable({ rows, columns }) {
  return (
    <div className="mini-table">
      {columns && <div className="mini-table-head">{columns.map((col) => <span key={col}>{col}</span>)}</div>}
      {rows.map((row) => (
        <div className="mini-row" key={row.join('-')}>
          {row.map((cell) => <span key={cell}>{cell}</span>)}
        </div>
      ))}
    </div>
  )
}

export function BottomNav({ active, onNavigate }) {
  const items = [
    ['patient-dashboard', 'grid', 'Dashboard'],
    ['patient-appointments', 'calendar', 'Appointments'],
    ['patient-records', 'records', 'Records'],
    ['patient-notifications', 'bell', 'Messages'],
    ['patient-profile', 'user', 'Profile'],
  ]

  return (
    <nav className="mobile-bottom-nav">
      {items.map(([page, icon, label]) => (
        <button className={active === page ? 'active' : ''} type="button" key={page} onClick={() => onNavigate(page)}>
          <Icon name={icon} /><span>{label}</span>
        </button>
      ))}
    </nav>
  )
}
