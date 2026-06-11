const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:4000/api'
const SESSION_KEY = 'healthmitra-session'

function getSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null')
  } catch {
    return null
  }
}

function setSession(session) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY)
}

async function request(path, options = {}) {
  const session = getSession()
  const headers = { ...options.headers }
  const isFormData = options.body instanceof FormData

  if (!isFormData) {
    headers['Content-Type'] = 'application/json'
  }

  if (session?.token) {
    headers.Authorization = `Bearer ${session.token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers,
    ...options,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error || 'Request failed')
  }

  return data
}

export const api = {
  getStoredSession: getSession,
  setStoredSession: setSession,
  clearStoredSession: clearSession,
  login(payload) {
    return request('/auth/login', { method: 'POST', body: JSON.stringify(payload) })
  },
  signup(payload) {
    return request('/auth/signup', { method: 'POST', body: JSON.stringify(payload) })
  },
  profile() {
    return request('/profile')
  },
  updateProfile(payload) {
    return request('/profile', { method: 'PUT', body: JSON.stringify(payload) })
  },
  doctors(params = {}) {
    return request(`/doctors?${new URLSearchParams(params)}`)
  },
  articles(params = {}) {
    return request(`/articles?${new URLSearchParams(params)}`)
  },
  appointments() {
    return request('/appointments')
  },
  createAppointment(payload) {
    return request('/appointments', { method: 'POST', body: JSON.stringify(payload) })
  },
  records() {
    return request('/records')
  },
  uploadRecord(file) {
    const formData = new FormData()
    formData.append('report', file)
    return request('/records/upload', { method: 'POST', body: formData })
  },
  reminders() {
    return request('/reminders')
  },
  createReminder(payload) {
    return request('/reminders', { method: 'POST', body: JSON.stringify(payload) })
  },
  bmiHistory() {
    return request('/bmi')
  },
  saveBmi(payload) {
    return request('/bmi', { method: 'POST', body: JSON.stringify(payload) })
  },
  sendSos(payload) {
    return request('/sos', { method: 'POST', body: JSON.stringify(payload) })
  },
  notifications() {
    return request('/notifications')
  },
  markNotificationRead(id) {
    return request(`/notifications/${encodeURIComponent(id)}/read`, { method: 'POST' })
  },
  contact(payload) {
    return request('/contact', { method: 'POST', body: JSON.stringify(payload) })
  },
  adminUsers() {
    return request('/admin/users')
  },
  adminStats() {
    return request('/admin/stats')
  },
  adminAppointments() {
    return request('/admin/appointments')
  },
  adminSos() {
    return request('/admin/sos')
  },
}
