import { useEffect, useState } from 'react'
import { DashboardShell, DataCard, MetricCard, MiniTable } from './AppShell'
import { api } from './api'
import { articles } from './data'
import { DoctorThumb } from './Shared'

export function AdminDashboardPage({ onNavigate }) {
  const [stats, setStats] = useState({ users: 0, doctors: 0, appointments: 0, records: 0, reminders: 0, contacts: 0, bmi: 0, sos: 0 })

  useEffect(() => {
    api.adminStats().then(setStats).catch(() => {})
  }, [])

  return (
    <DashboardShell active="admin-dashboard" admin onNavigate={onNavigate}>
      <div className="dash-title"><h1>Admin Dashboard</h1><p>Actual platform data from signup, appointments, records, reminders and contact forms.</p></div>
      <AdminMetrics stats={stats} />
      <div className="admin-grid">
        <DataCard title="Appointments Overview"><div className="chart-line tall"></div></DataCard>
        <DataCard title="User Registrations"><div className="bar-chart"></div></DataCard>
        <DataCard title="Platform Summary"><Info rows={[`Registered Users ${stats.users}`, `Registered Doctors ${stats.doctors}`, `Appointments ${stats.appointments}`, `Medical Records ${stats.records}`, `BMI Calculations ${stats.bmi}`, `SOS Alerts ${stats.sos}`, `Contact Messages ${stats.contacts}`]} /></DataCard>
        <DataCard title="Appointments by Status"><div className="donut"></div></DataCard>
        <DataCard title="Reminder Overview"><h2>{stats.reminders}</h2><div className="chart-line"></div></DataCard>
        <DataCard title="Recent Activities"><Info rows={[stats.users ? 'Latest user data loaded' : 'No users registered yet', stats.appointments ? 'Appointments available' : 'No appointments booked yet', stats.bmi ? 'BMI data available' : 'No BMI entries yet', stats.sos ? 'SOS alerts available' : 'No SOS alerts yet']} /></DataCard>
      </div>
    </DashboardShell>
  )
}

export function AdminUsersPage({ onNavigate }) {
  const [query, setQuery] = useState('')
  const [items, setItems] = useState([])
  const filteredUsers = items.filter((user) => user.join(' ').toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    api.adminUsers().then((data) => {
      setItems(data.map((user) => [
        user.name,
        `${user.email}${user.phone ? ` / ${user.phone}` : ''}`,
        user.role,
        'Active',
        user.joinedOn ? new Date(user.joinedOn).toLocaleDateString() : '-',
      ]))
    }).catch(() => setItems([]))
  }, [])

  return (
    <DashboardShell active="admin-users" admin onNavigate={onNavigate}>
      <div className="dash-title with-button"><div><h1>Manage Users</h1><p>View all registered users from real signup data.</p></div><button className="primary-button" type="button" onClick={() => onNavigate('signup')}>+ Add New User</button></div>
      <div className="metric-grid four"><MetricCard icon="users" title="Total Users" value={items.length} note="All registered accounts" /><MetricCard icon="user" title="Patients" value={items.filter((row) => row[2] === 'Patient').length} note="Registered patients" tone="green" /><MetricCard icon="user" title="Doctors" value={items.filter((row) => row[2] === 'Doctor').length} note="Registered doctors" tone="orange" /><MetricCard icon="shield" title="Admins" value={items.filter((row) => row[2] === 'Healthcare Provider').length} note="Healthcare providers" tone="red" /></div>
      <div className="admin-filter-row"><input onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, email or phone..." value={query} /><select><option>All Roles</option></select><select><option>All Status</option></select><button className="outline-button" type="button" onClick={() => setQuery('')}>Reset</button></div>
      <DataCard title={`All Users (${filteredUsers.length})`}><MiniTable columns={['User', 'Email / Phone', 'Role', 'Status', 'Joined On']} rows={filteredUsers} /></DataCard>
    </DashboardShell>
  )
}

export function AdminAppointmentsPage({ onNavigate }) {
  const [rows, setRows] = useState([])
  const updateStatus = (status) => {
    setRows((current) => current.map((row, index) => index === 0 ? [...row.slice(0, 5), status] : row))
  }

  useEffect(() => {
    api.adminAppointments().then((data) => {
      setRows(data.map((item) => [
        item.patient || item.userId || 'Patient',
        item.doctor,
        `${item.date} ${item.time}`,
        item.specialty,
        'Not captured',
        item.status,
      ]))
    }).catch(() => setRows([]))
  }, [])

  return (
    <DashboardShell active="admin-appointments" admin onNavigate={onNavigate}>
      <div className="dash-title"><h1>Manage Appointments</h1><p>Review real appointment requests submitted through the app.</p></div>
      <div className="metric-grid five"><MetricCard icon="calendar" title="Total Appointments" value={rows.length} note="All time" /><MetricCard icon="shield" title="Approved" value={rows.filter((row) => row[5] === 'Approved').length} note="Approved" tone="green" /><MetricCard icon="bell" title="Pending Approval" value={rows.filter((row) => row[5] === 'Pending').length} note="Pending" tone="orange" /><MetricCard icon="calendar" title="Confirmed" value={rows.filter((row) => row[5] === 'Confirmed').length} note="Confirmed" tone="purple" /><MetricCard icon="sos" title="Cancelled" value={rows.filter((row) => row[5] === 'Cancelled').length} note="Cancelled" tone="red" /></div>
      <div className="admin-filter-row"><select><option>All Dates</option></select><select><option>All Doctors</option></select><select><option>All Status</option></select><button className="primary-button" type="button" onClick={() => updateStatus('Approved')}>Approve First</button></div>
      <DataCard title={`Appointments (${rows.length})`}><MiniTable columns={['Patient', 'Doctor', 'Date & Time', 'Reason', 'Payment', 'Status']} rows={rows} /></DataCard>
      <div className="dash-three"><DataCard title="Appointment History"><Info rows={[`Approved ${rows.filter((row) => row[5] === 'Approved').length}`, `Confirmed ${rows.filter((row) => row[5] === 'Confirmed').length}`, `Cancelled ${rows.filter((row) => row[5] === 'Cancelled').length}`, `Pending ${rows.filter((row) => row[5] === 'Pending').length}`]} /></DataCard><DataCard title="Appointments Over Time"><div className="chart-line"></div></DataCard><DataCard title="Top Doctors by Appointments"><Info rows={[...new Set(rows.map((row) => row[1]))].slice(0, 4).map((doctor) => `${doctor} ${rows.filter((row) => row[1] === doctor).length}`)} /></DataCard></div>
    </DashboardShell>
  )
}

export function AdminBlogsPage({ onNavigate }) {
  const [publishedOnly, setPublishedOnly] = useState(false)
  const blogRows = articles.map(([category, title], i) => [title, ['Dr. Priya Sharma', 'Dr. Amit Verma', 'Dr. Rajesh Kumar'][i % 3], category, i === 3 ? 'Draft' : 'Published', i === 3 ? '-' : '20 May 2024'])
  const visibleBlogs = publishedOnly ? blogRows.filter((row) => row[3] === 'Published') : blogRows
  return (
    <DashboardShell active="admin-blogs" admin onNavigate={onNavigate}>
      <div className="dash-title with-button"><div><h1>Manage Blogs</h1><p>Create, edit, publish and manage all blog posts.</p></div><button className="primary-button" type="button" onClick={() => setPublishedOnly((value) => !value)}>{publishedOnly ? 'Show All Blogs' : 'Show Published'}</button></div>
      <div className="metric-grid four"><MetricCard icon="calendar" title="Total Blogs" value={blogRows.length} note="Local CMS content" /><MetricCard icon="shield" title="Published" value={blogRows.filter((row) => row[3] === 'Published').length} note="Published" tone="green" /><MetricCard icon="records" title="Drafts" value={blogRows.filter((row) => row[3] === 'Draft').length} note="Drafts" tone="orange" /><MetricCard icon="sos" title="Trash" value="0" note="Deleted posts" tone="red" /></div>
      <DataCard title={`All Blogs (${visibleBlogs.length})`}><MiniTable columns={['Blog', 'Author', 'Category', 'Status', 'Published On']} rows={visibleBlogs} /></DataCard>
      <div className="dash-two"><DataCard title="Blog Categories"><Info rows={[...new Set(blogRows.map((row) => row[2]))].map((category) => `${category} ${blogRows.filter((row) => row[2] === category).length} Blogs`)} /></DataCard><DataCard title="Recent Blogs"><Info rows={blogRows.slice(0, 4).map((row) => row[0])} /></DataCard></div>
    </DashboardShell>
  )
}

export function AdminReportsPage({ onNavigate }) {
  const [stats, setStats] = useState({ contacts: 0, records: 0, bmi: 0, sos: 0 })

  useEffect(() => {
    api.adminStats().then(setStats).catch(() => {})
  }, [])

  return (
    <DashboardShell active="admin-reports" admin onNavigate={onNavigate}>
      <div className="dash-title"><h1>Reports & Feedback</h1><p>Actual contact and report counts submitted on the platform.</p></div>
      <div className="metric-grid five"><MetricCard icon="records" title="Total Feedback" value={stats.contacts} note="Contact forms" /><MetricCard icon="bell" title="BMI Entries" value={stats.bmi} note="Health calculations" tone="orange" /><MetricCard icon="chart" title="Total Reports" value={stats.records} note="Uploaded records" tone="purple" /><MetricCard icon="sos" title="SOS Alerts" value={stats.sos} note="Emergency alerts" tone="red" /><MetricCard icon="shield" title="Resolved Reports" value="0" note="No workflow yet" tone="green" /></div>
      <div className="dash-three"><DataCard title="Feedback Overview"><div className="donut"></div></DataCard><DataCard title="Reports Overview"><div className="donut red"></div></DataCard><DataCard title="Quick Actions"><Info rows={['View All Feedback', 'View All Reports', 'Emergency SOS Review']} /></DataCard></div>
    </DashboardShell>
  )
}

function AdminMetrics({ stats }) {
  return (
    <div className="metric-grid four">
      <MetricCard icon="users" title="Total Users" value={stats.users} note="Actual registered accounts" />
      <MetricCard icon="user" title="Total Doctors" value={stats.doctors} note="Doctor role accounts" tone="green" />
      <MetricCard icon="calendar" title="Total Appointments" value={stats.appointments} note="Booked appointments" tone="purple" />
      <MetricCard icon="sos" title="SOS Alerts" value={stats.sos} note="Emergency submissions" tone="orange" />
    </div>
  )
}

function Info({ rows }) {
  return <div className="info-list">{rows.map((row) => <p key={row}><DoctorThumb name={row} /> {row}</p>)}</div>
}
