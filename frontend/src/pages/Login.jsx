import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginApi } from '../services/api'
import Alert from '../components/Alert'

export default function Login() {
  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) {
      setError('Debes completar todos los campos.')
      return
    }
    setLoading(true)
    try {
      const { data } = await loginApi(form)
      login(data)
      navigate('/dashboard')
    } catch (err) {
      setError('Usuario o contraseña incorrectos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-600/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-dark-800/30 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md fade-in">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-500 shadow-2xl shadow-brand-500/40 mb-5 text-3xl">🚗</div>
          <h1 className="font-display font-bold text-3xl text-white mb-2">RentaCar</h1>
          <p className="text-dark-300 text-sm">Sistema de Gestión de Renta de Vehículos</p>
        </div>

        {/* Card */}
        <div className="card p-8 shadow-2xl">
          <h2 className="font-display font-semibold text-white text-lg mb-6">Iniciar sesión</h2>

          {error && (
            <div className="mb-5">
              <Alert tipo="error" mensaje={error} onClose={() => setError('')} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Email</label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                className="input-field"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Clave</label>
              <input
                type="password"
                placeholder="••••••••"
                className="input-field"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verificando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
