import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [token, setToken]     = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const t = localStorage.getItem('token')
    const u = localStorage.getItem('usuario')
    if (t && u) {
      setToken(t)
      setUsuario(JSON.parse(u))
    }
    setCargando(false)
  }, [])

  const login = (data) => {
    setToken(data.token)
    setUsuario({ nombre: data.nombre, apellido: data.apellido, email: data.email, rol: data.rol, _id: data._id })
    localStorage.setItem('token', data.token)
    localStorage.setItem('usuario', JSON.stringify({ nombre: data.nombre, apellido: data.apellido, email: data.email, rol: data.rol, _id: data._id }))
  }

  const logout = () => {
    setToken(null)
    setUsuario(null)
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
  }

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout, cargando }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
