import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'

const modulos = [
  { label: 'Clientes',  icon: '👤', desc: 'Gestión de clientes registrados',        ruta: '/clientes',  color: 'from-blue-500/20 to-blue-600/5',  border: 'border-blue-500/20'  },
  { label: 'Vehículos', icon: '🚗', desc: 'Administración de la flota de vehículos', ruta: '/vehiculos', color: 'from-brand-500/20 to-brand-600/5', border: 'border-brand-500/20' },
  { label: 'Reservas',  icon: '📋', desc: 'Control de reservas y asignaciones',      ruta: '/reservas',  color: 'from-purple-500/20 to-purple-600/5', border: 'border-purple-500/20' },
]

export default function Dashboard() {
  const { usuario } = useAuth()
  const navigate = useNavigate()

  return (
    <Layout>
      <div className="p-8 fade-in">
        {/* Greeting */}
        <div className="mb-10">
          <p className="text-dark-300 text-sm mb-1">Panel de control</p>
          <h1 className="font-display font-bold text-3xl text-white">
            Bienvenido, <span className="text-brand-400">{usuario?.nombre}</span> 👋
          </h1>
          <p className="text-dark-300 text-sm mt-2">Selecciona un módulo para comenzar</p>
        </div>

        {/* Module cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modulos.map(({ label, icon, desc, ruta, color, border }) => (
            <button
              key={ruta}
              onClick={() => navigate(ruta)}
              className={`card p-6 text-left hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 bg-gradient-to-br ${color} border ${border} cursor-pointer group`}
            >
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="font-display font-bold text-white text-xl mb-2 group-hover:text-brand-300 transition-colors">{label}</h3>
              <p className="text-dark-300 text-sm">{desc}</p>
              <div className="mt-4 text-xs text-dark-300 group-hover:text-brand-400 transition-colors flex items-center gap-1">
                Ir al módulo <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Layout>
  )
}
