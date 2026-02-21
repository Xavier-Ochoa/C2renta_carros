import axios from 'axios'

const api = axios.create({
  baseURL: 'https://c2renta-carrosback.vercel.app/api',
  headers: { 'Content-Type': 'application/json' }
})

// Adjunta el token automáticamente en cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ——— Auth ———
export const loginApi    = (data)       => api.post('/auth/login', data)

// ——— Clientes ———
export const getClientes    = ()         => api.get('/clientes')
export const getCliente     = (id)       => api.get(`/clientes/${id}`)
export const crearCliente   = (data)     => api.post('/clientes', data)
export const editarCliente  = (id, data) => api.put(`/clientes/${id}`, data)
export const borrarCliente  = (id)       => api.delete(`/clientes/${id}`)

// ——— Vehículos ———
export const getVehiculos    = ()         => api.get('/vehiculos')
export const getVehiculo     = (id)       => api.get(`/vehiculos/${id}`)
export const crearVehiculo   = (data)     => api.post('/vehiculos', data)
export const editarVehiculo  = (id, data) => api.put(`/vehiculos/${id}`, data)
export const borrarVehiculo  = (id)       => api.delete(`/vehiculos/${id}`)

// ——— Reservas ———
export const getReservas    = ()         => api.get('/reservas')
export const crearReserva   = (data)     => api.post('/reservas', data)
export const editarReserva  = (id, data) => api.put(`/reservas/${id}`, data)
export const borrarReserva  = (id)       => api.delete(`/reservas/${id}`)

export default api
