import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const nav = [
  { to: '/dashboard',  label: 'Dashboard',  icon: '⊞' },
  { to: '/clientes',   label: 'Clientes',   icon: '👤' },
  { to: '/vehiculos',  label: 'Vehículos',  icon: '🚗' },
  { to: '/reservas',   label: 'Reservas',   icon: '📋' },
]

export default function Layout({ children }) {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ——— Sidebar ——— */}
      <aside className="w-64 flex-shrink-0 bg-dark-800 border-r border-dark-600/50 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-dark-600/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-lg shadow-lg shadow-brand-500/30">🚗</div>
            <div>
              <p className="font-display font-bold text-white text-sm leading-none">RentaCar</p>
              <p className="text-dark-300 text-xs mt-0.5">Sistema de Gestión</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {nav.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20'
                    : 'text-dark-300 hover:text-slate-200 hover:bg-dark-700/60'
                }`
              }
            >
              <span className="text-base">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-dark-600/50">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 text-xs font-bold">
              {usuario?.nombre?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-slate-200 text-xs font-semibold truncate">{usuario?.nombre} {usuario?.apellido}</p>
              <p className="text-dark-300 text-xs truncate">{usuario?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20">
            <span>↩</span> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ——— Main ——— */}
      <main className="flex-1 overflow-y-auto bg-dark-900">
        {children}
      </main>
    </div>
  )
}
