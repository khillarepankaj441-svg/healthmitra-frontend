import { useState } from 'react'
import { api } from './api'
import { Icon } from './Icon'
import { Brand, DoctorThumb } from './Shared'

export function LoginPage({ onNavigate }) {
  return (
    <main className="auth-page">
      <header><Brand onNavigate={onNavigate} /><div className="auth-header-actions"><button className="auth-back-button" type="button" onClick={() => onNavigate('back')}><Icon name="arrow-left" /> Back</button><p>Don't have an account? <button type="button" onClick={() => onNavigate('signup')}>Sign Up</button></p></div></header>
      <section className="auth-layout login-layout">
        <aside className="auth-visual-panel">
          <h1>Welcome Back!</h1>
          <p>Login to your HealthMitra account and take charge of your health.</p>
          {[
            ['calendar', 'Book Appointments', 'Schedule with top doctors'],
            ['records', 'Access Medical Records', 'View and manage your reports'],
            ['pill', 'Medicine Reminders', 'Never miss your medicines'],
          ].map(([icon, title, text]) => <FeatureLine icon={icon} title={title} text={text} key={title} />)}
          <DoctorThumb name="Login Doctor" />
        </aside>
        <AuthCard mode="login" onNavigate={onNavigate} />
      </section>
      <footer className="auth-footer"><span><Icon name="shield" /> Secure & Confidential</span><span><Icon name="lock" /> Your data is 100% safe</span><span><Icon name="users" /> Trusted by 10K+ users</span></footer>
    </main>
  )
}

export function SignupPage({ onNavigate }) {
  return (
    <main className="auth-page">
      <header><Brand onNavigate={onNavigate} /><div className="auth-header-actions"><button className="auth-back-button" type="button" onClick={() => onNavigate('back')}><Icon name="arrow-left" /> Back</button><p>Already have an account? <button type="button" onClick={() => onNavigate('login')}>Login</button></p></div></header>
      <section className="auth-layout signup-layout">
        <aside className="auth-visual-panel">
          <h1>Join HealthMitra</h1>
          <p>Create your account and take the first step towards a healthier you.</p>
          {[
            ['shield', 'Secure & Confidential', 'Your data is safe with us'],
            ['user', 'Access Expert Care', 'Connect with top doctors'],
            ['calendar', 'Book Appointments', 'Schedule appointments easily'],
            ['records', 'Manage Your Health', 'Keep track of your health records'],
          ].map(([icon, title, text]) => <FeatureLine icon={icon} title={title} text={text} key={title} />)}
          <DoctorThumb name="Signup Doctor" />
        </aside>
        <AuthCard mode="signup" onNavigate={onNavigate} />
      </section>
    </main>
  )
}

function FeatureLine({ icon, title, text }) {
  return (
    <div className="auth-feature"><span><Icon name={icon} /></span><div><strong>{title}</strong><small>{text}</small></div></div>
  )
}

function AuthCard({ mode, onNavigate }) {
  const signup = mode === 'signup'
  const [role, setRole] = useState('Patient')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    accepted: false,
    remember: false,
  })

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setMessage('')
  }

  const submit = async (event) => {
    event.preventDefault()
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    const strongPassword = form.password.length >= 8 && /[A-Za-z]/.test(form.password) && /\d/.test(form.password)

    if (!emailOk) {
      setMessage('Please enter a valid email address.')
      return
    }

    if (!strongPassword) {
      setMessage('Password must be at least 8 characters and include a number.')
      return
    }

    if (signup) {
      const phoneDigits = form.phone.replace(/\D/g, '').slice(-10)
      if (!form.name.trim() || !/^\d{10}$/.test(phoneDigits)) {
        setMessage('Please enter your full name and a valid 10 digit phone number.')
        return
      }

      if (form.password !== form.confirmPassword) {
        setMessage('Password and confirm password do not match.')
        return
      }
    }

    try {
      setSubmitting(true)
      if (signup) {
        const phoneDigits = form.phone.replace(/\D/g, '').slice(-10)
        await api.signup({
          email: form.email,
          name: form.name,
          password: form.password,
          phone: phoneDigits,
          role,
        })
        setMessage('Account created. Please login to continue.')
        window.setTimeout(() => onNavigate('login'), 700)
        return
      } else {
        const result = await api.login({ email: form.email, password: form.password, role })
        api.setStoredSession(result)
        setRole(result.user.role)
      }
      const nextRole = signup ? role : api.getStoredSession()?.user?.role
      setMessage(`${nextRole || 'Patient'} access verified.`)
      onNavigate(nextRole === 'Healthcare Provider' ? 'admin-dashboard' : 'patient-dashboard')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="auth-card" onSubmit={submit} noValidate>
      <span className="auth-card-icon"><Icon name={signup ? 'user' : 'lock'} /></span>
      <h2>{signup ? 'Create Your Account' : 'Login'}</h2>
      <p>{signup ? 'Sign up to get started with HealthMitra' : 'Welcome back! Please login to continue.'}</p>
      <div className="role-block">
        <h3>{signup ? 'Select Your Role' : 'Login As'}</h3>
        <div className="role-grid">
          {['Patient', 'Doctor', 'Healthcare Provider'].map((item, index) => (
            <button className={item === role ? 'active' : ''} type="button" key={item} onClick={() => {
              setRole(item)
              update('role', item)
            }}><Icon name={index === 1 ? 'user' : 'shield'} /><strong>{item}</strong><small>{index === 0 ? 'Book appointments and manage your health' : 'Provide care and manage patients'}</small></button>
          ))}
        </div>
      </div>
      <div className={signup ? 'auth-fields two-col' : 'auth-fields'}>
        {signup && <Input icon="user" label="Full Name" placeholder="Enter your full name" value={form.name} onChange={(value) => update('name', value)} autoComplete="name" />}
        <Input icon="mail" label="Email Address" placeholder="Enter your email" type="email" value={form.email} onChange={(value) => update('email', value)} autoComplete="email" />
        {signup && <Input icon="phone" label="Phone Number" placeholder="Enter your phone number" type="tel" value={form.phone} onChange={(value) => update('phone', value)} autoComplete="tel" />}
        <Input icon="lock" label="Password" placeholder={signup ? 'Create a password' : 'Enter your password'} type="password" value={form.password} onChange={(value) => update('password', value)} autoComplete={signup ? 'new-password' : 'current-password'} />
        {signup && <Input icon="lock" label="Confirm Password" placeholder="Confirm your password" type="password" value={form.confirmPassword} onChange={(value) => update('confirmPassword', value)} autoComplete="new-password" wide />}
      </div>
      <div className="auth-options"><label><input type="checkbox" checked={signup ? form.accepted : form.remember} onChange={(event) => update(signup ? 'accepted' : 'remember', event.target.checked)} /> {signup ? 'I agree to the Terms & Conditions and Privacy Policy' : 'Remember Me'}</label>{!signup && <button type="button" onClick={() => setMessage('Password reset link sent in demo mode.')}>Forgot Password?</button>}</div>
      {message && <p className={message.includes('verified') || message.includes('sent') || message.includes('created') ? 'form-message success' : 'form-message'}>{message}</p>}
      <button className="primary-button auth-submit" disabled={submitting} type="submit">{submitting ? 'Please wait...' : signup ? 'Create Account' : 'Login'} <span>{'->'}</span></button>
      <div className="auth-divider"><span>{signup ? 'or sign up with' : 'or continue with'}</span></div>
      <div className="social-login"><button type="button" onClick={() => setMessage('Google login is not connected in this local demo.')}>Google</button><button type="button" onClick={() => setMessage('Facebook login is not connected in this local demo.')}>Facebook</button><button type="button" onClick={() => setMessage('Apple login is not connected in this local demo.')}>Apple</button></div>
      <p className="auth-switch">{signup ? 'Already have an account?' : "Don't have an account?"} <button type="button" onClick={() => onNavigate(signup ? 'login' : 'signup')}>{signup ? 'Login' : 'Sign Up'}</button></p>
    </form>
  )
}

function Input({ icon, label, placeholder, type = 'text', value, onChange, autoComplete, wide = false }) {
  return (
    <label className={wide ? 'wide' : ''}><span>{label}</span><div><Icon name={icon} /><input autoComplete={autoComplete} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} type={type} value={value} /></div></label>
  )
}
