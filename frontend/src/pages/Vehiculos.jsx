import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import Alert from '../components/Alert'
import { useAuth } from '../context/AuthContext'
import { getVehiculos, crearVehiculo, editarVehiculo, borrarVehiculo } from '../services/api'

const TIPOS = ['sedan', 'SUV', 'camioneta', 'deportivo', 'van', 'otro']
const FORM_VACIO = { marca: '', modelo: '', anio_fabricacion: '', placa: '', color: '', tipo_vehiculo: 'sedan', kilometraje: '', descripcion: '' }

export default function Vehiculos() {
  const { usuario } = useAuth()
  const [vehiculos, setVehiculos]     = useState([])
  const [cargando, setCargando]       = useState(true)
  const [modal, setModal]             = useState(null)
  const [seleccionado, setSeleccionado] = useState(null)
  const [form, setForm]               = useState(FORM_VACIO)
  const [alerta, setAlerta]           = useState(null)
  const [guardando, setGuardando]     = useState(false)
  const [busqueda, setBusqueda]       = useState('')

  const cargar = async () => {
    try {
      const { data } = await getVehiculos()
      setVehiculos(data.vehiculos || [])
    } catch { setAlerta({ tipo: 'error', msg: 'Error al cargar vehículos' }) }
    finally { setCargando(false) }
  }

  useEffect(() => { cargar() }, [])

  const abrirCrear = () => { setForm(FORM_VACIO); setModal('crear') }
  const abrirEditar = (v) => {
    setSeleccionado(v)
    setForm({
      marca: v.marca, modelo: v.modelo, anio_fabricacion: v.anio_fabricacion,
      placa: v.placa, color: v.color, tipo_vehiculo: v.tipo_vehiculo,
      kilometraje: v.kilometraje, descripcion: v.descripcion || ''
    })
    setModal('editar')
  }
  const abrirEliminar = (v) => { setSeleccionado(v); setModal('eliminar') }
  const cerrar = () => { setModal(null); setSeleccionado(null) }

  const handleGuardar = async (e) => {
    e.preventDefault()
    setGuardando(true)
    try {
      const payload = { ...form, anio_fabricacion: Number(form.anio_fabricacion), kilometraje: Number(form.kilometraje) }
      if (modal === 'crear') await crearVehiculo(payload)
      else await editarVehiculo(seleccionado._id, payload)
      setAlerta({ tipo: 'success', msg: modal === 'crear' ? 'Vehículo creado correctamente' : 'Vehículo actualizado correctamente' })
      cerrar(); cargar()
    } catch (err) {
      setAlerta({ tipo: 'error', msg: err.response?.data?.msg || 'Error al guardar vehículo' })
    } finally { setGuardando(false) }
  }

  const handleEliminar = async () => {
    setGuardando(true)
    try {
      await borrarVehiculo(seleccionado._id)
      setAlerta({ tipo: 'success', msg: 'Vehículo eliminado correctamente' })
      cerrar(); cargar()
    } catch { setAlerta({ tipo: 'error', msg: 'Error al eliminar vehículo' }) }
    finally { setGuardando(false) }
  }

  const filtrados = vehiculos.filter(v =>
    `${v.marca} ${v.modelo} ${v.placa} ${v.tipo_vehiculo}`.toLowerCase().includes(busqueda.toLowerCase())
  )

  const badgeTipo = (tipo) => {
    const colores = { sedan: 'bg-blue-500/15 text-blue-400', SUV: 'bg-green-500/15 text-green-400', camioneta: 'bg-yellow-500/15 text-yellow-400', deportivo: 'bg-red-500/15 text-red-400', van: 'bg-purple-500/15 text-purple-400', otro: 'bg-dark-500 text-dark-300' }
    return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colores[tipo] || colores.otro}`}>{tipo}</span>
  }

  return (
    <Layout>
      <div className="p-8 fade-in">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-dark-300 text-sm mb-1">Bienvenido — <span className="text-brand-400">{usuario?.nombre} {usuario?.apellido}</span></p>
            <h1 className="font-display font-bold text-3xl text-white">Vehículos</h1>
            <p className="text-dark-300 text-sm mt-1">{vehiculos.length} vehículo{vehiculos.length !== 1 ? 's' : ''} registrado{vehiculos.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={abrirCrear} className="btn-primary flex items-center gap-2">
            <span className="text-lg leading-none">+</span> Nuevo vehículo
          </button>
        </div>

        {alerta && <div className="mb-6"><Alert tipo={alerta.tipo} mensaje={alerta.msg} onClose={() => setAlerta(null)} /></div>}

        <div className="mb-5">
          <input type="text" placeholder="Buscar por marca, modelo o placa..." className="input-field max-w-sm" value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        </div>

        <div className="card overflow-hidden">
          {cargando ? (
            <div className="p-12 text-center text-dark-300">Cargando...</div>
          ) : filtrados.length === 0 ? (
            <div className="p-12 text-center text-dark-300">No hay vehículos registrados</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-dark-600/50">
                  <tr>
                    {['Placa', 'Marca', 'Modelo', 'Año', 'Color', 'Tipo', 'Km', 'Acciones'].map(h => (
                      <th key={h} className="table-header">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map(v => (
                    <tr key={v._id} className="table-row">
                      <td className="table-cell font-mono text-brand-400 font-semibold text-xs">{v.placa}</td>
                      <td className="table-cell font-medium text-white">{v.marca}</td>
                      <td className="table-cell">{v.modelo}</td>
                      <td className="table-cell">{v.anio_fabricacion}</td>
                      <td className="table-cell">{v.color}</td>
                      <td className="table-cell">{badgeTipo(v.tipo_vehiculo)}</td>
                      <td className="table-cell">{v.kilometraje?.toLocaleString()} km</td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <button onClick={() => abrirEditar(v)} className="btn-edit text-xs">Editar</button>
                          <button onClick={() => abrirEliminar(v)} className="btn-danger text-xs">Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {(modal === 'crear' || modal === 'editar') && (
        <Modal titulo={modal === 'crear' ? 'Nuevo vehículo' : 'Editar vehículo'} onClose={cerrar}>
          <form onSubmit={handleGuardar} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5">Marca *</label>
                <input className="input-field" value={form.marca} onChange={e => setForm({...form, marca: e.target.value})} placeholder="Toyota" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5">Modelo *</label>
                <input className="input-field" value={form.modelo} onChange={e => setForm({...form, modelo: e.target.value})} placeholder="Corolla" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5">Placa *</label>
                <input className="input-field uppercase" value={form.placa} onChange={e => setForm({...form, placa: e.target.value.toUpperCase()})} placeholder="ABC-1234" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5">Año de fabricación *</label>
                <input type="number" className="input-field" value={form.anio_fabricacion} onChange={e => setForm({...form, anio_fabricacion: e.target.value})} placeholder="2022" min="1900" max="2026" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5">Color *</label>
                <input className="input-field" value={form.color} onChange={e => setForm({...form, color: e.target.value})} placeholder="Blanco" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-300 mb-1.5">Tipo de vehículo *</label>
                <select className="input-field" value={form.tipo_vehiculo} onChange={e => setForm({...form, tipo_vehiculo: e.target.value})}>
                  {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Kilometraje *</label>
              <input type="number" className="input-field" value={form.kilometraje} onChange={e => setForm({...form, kilometraje: e.target.value})} placeholder="15000" min="0" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Descripción</label>
              <textarea className="input-field resize-none" rows={2} value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} placeholder="Detalles adicionales..." />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-primary flex-1" disabled={guardando}>
                {guardando ? 'Guardando...' : modal === 'crear' ? 'Crear vehículo' : 'Guardar cambios'}
              </button>
              <button type="button" onClick={cerrar} className="btn-secondary">Cancelar</button>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'eliminar' && (
        <Modal titulo="Eliminar vehículo" onClose={cerrar}>
          <p className="text-slate-300 mb-2">¿Estás seguro de que deseas eliminar el vehículo:</p>
          <p className="text-white font-semibold mb-6">"{seleccionado?.marca} {seleccionado?.modelo} — {seleccionado?.placa}"</p>
          <Alert tipo="error" mensaje="Esta acción no se puede deshacer." />
          <div className="flex gap-3 mt-5">
            <button onClick={handleEliminar} className="btn-danger flex-1 py-2.5" disabled={guardando}>
              {guardando ? 'Eliminando...' : 'Sí, eliminar'}
            </button>
            <button onClick={cerrar} className="btn-secondary flex-1">Cancelar</button>
          </div>
        </Modal>
      )}
    </Layout>
  )
}
