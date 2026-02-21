import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Clientes from './pages/Clientes'
import Vehiculos from './pages/Vehiculos'
import Reservas from './pages/Reservas'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/clientes"  element={<PrivateRoute><Clientes /></PrivateRoute>} />
        <Route path="/vehiculos" element={<PrivateRoute><Vehiculos /></PrivateRoute>} />
        <Route path="/reservas"  element={<PrivateRoute><Reservas /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
