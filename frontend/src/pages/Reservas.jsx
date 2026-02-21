import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import Alert from '../components/Alert'
import { useAuth } from '../context/AuthContext'
import { getReservas, getClientes, getVehiculos, crearReserva, editarReserva, borrarReserva } from '../services/api'

const FORM_VACIO = { codigo: '', descripcion: '', id_cliente: '', id_vehiculo: '' }

export default function Reservas() {
  const { usuario } = useAuth()
  const [reservas, setReservas]       = useState([])
  const [clientes, setClientes]       = useState([])
  const [vehiculos, setVehiculos]     = useState([])
  const [cargando, setCargando]       = useState(true)
  const [modal, setModal]             = useState(null)
  const [seleccionado, setSeleccionado] = useState(null)
  const [form, setForm]               = useState(FORM_VACIO)
  const [alerta, setAlerta]           = useState(null)
  const [guardando, setGuardando]     = useState(false)
  const [busqueda, setBusqueda]       = useState('')
  const [vistaAgrupada, setVistaAgrupada] = useState(false)

  const cargar = async () => {
    try {
      const [rRes, cRes, vRes] = await Promise.all([getReservas(), getClientes(), getVehiculos()])
      setReservas(rRes.data.reservas || [])
      setClientes(cRes.data.clientes || [])
      setVehiculos(vRes.data.vehiculos || [])
    } catch { setAlerta({ tipo: 'error', msg: 'Error al cargar datos' }) }
    finally { setCargando(false) }
  }

  useEffect(() => { cargar() }, [])

  const abrirCrear = () => { setForm(FORM_VACIO); setModal('crear') }
  const abrirEditar = (r) => {
    setSeleccionado(r)
    setForm({
      codigo: r.codigo,
      descripcion: r.descripcion || '',
      id_cliente: r.id_cliente?._id || r.id_cliente,
      id_vehiculo: r.id_vehiculo?._id || r.id_vehiculo,
    })
    setModal('editar')
  }
  const abrirEliminar = (r) => { setSeleccionado(r); setModal('eliminar') }
  const cerrar = () => { setModal(null); setSeleccionado(null) }

  const handleGuardar = async (e) => {
    e.preventDefault()
    setGuardando(true)
    try {
      if (modal === 'crear') await crearReserva(form)
      else await editarReserva(seleccionado._id, form)
      setAlerta({ tipo: 'success', msg: modal === 'crear' ? 'Reserva creada correctamente' : 'Reserva actualizada correctamente' })
      cerrar(); cargar()
    } catch (err) {
      setAlerta({ tipo: 'error', msg: err.response?.data?.msg || 'Error al guardar reserva' })
    } finally { setGuardando(false) }
  }

  const handleEliminar = async () => {
    setGuardando(true)
    try {
      await borrarReserva(seleccionado._id)
      setAlerta({ tipo: 'success', msg: 'Reserva eliminada correctamente' })
      cerrar(); cargar()
    } catch { setAlerta({ tipo: 'error', msg: 'Error al eliminar reserva' }) }
    finally { setGuardando(false) }
  }

  const filtradas = reservas.filter(r => {
    const cliente = `${r.id_cliente?.nombres || ''} ${r.id_cliente?.apellidos || ''}`
    const vehiculo = `${r.id_vehiculo?.marca || ''} ${r.id_vehiculo?.modelo || ''} ${r.id_vehiculo?.placa || ''}`
    return `${r.codigo} ${cliente} ${vehiculo}`.toLowerCase().includes(busqueda.toLowerCase())
  })

  // Agrupar por cliente
  const agrupadas = filtradas.reduce((acc, r) => {
    const key = r.id_cliente?._id || 'sin-cliente'
    const nombre = r.id_cliente ? `${r.id_cliente.nombres} ${r.id_cliente.apellidos}` : 'Sin cliente'
    if (!acc[key]) acc[key] = { nombre, cedula: r.id_cliente?.cedula, reservas: [] }
    acc[key].reservas.push(r)
    return acc
  }, {})

  return (
    <Layout>
      <div className="p-8 fade-in">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-dark-300 text-sm mb-1">Bienvenido — <span className="text-brand-400">{usuario?.nombre} {usuario?.apellido}</span></p>
            <h1 className="font-display font-bold text-3xl text-white">Reservas</h1>
            <p className="text-dark-300 text-sm mt-1">{reservas.length} reserva{reservas.length !== 1 ? 's' : ''} registrada{reservas.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={abrirCrear} className="btn-primary flex items-center gap-2">
            <span className="text-lg leading-none">+</span> Nueva reserva
          </button>
        </div>

        {alerta && <div className="mb-6"><Alert tipo={alerta.tipo} mensaje={alerta.msg} onClose={() => setAlerta(null)} /></div>}

        {/* Controls */}
        <div className="flex items-center gap-4 mb-5 flex-wrap">
          <input type="text" placeholder="Buscar por código, cliente o vehículo..." className="input-field max-w-sm" value={busqueda} onChange={e => setBusqueda(e.target.value)} />
          <div className="flex items-center gap-2 bg-dark-800 border border-dark-600/50 rounded-xl p-1">
            <button onClick={() => setVistaAgrupada(false)} className={`text-xs px-3 py-1.5 rounded-lg transition-all ${!vistaAgrupada ? 'bg-brand-500 text-white' : 'text-dark-300 hover:text-white'}`}>Lista</button>
            <button onClick={() => setVistaAgrupada(true)}  className={`text-xs px-3 py-1.5 rounded-lg transition-all ${vistaAgrupada  ? 'bg-brand-500 text-white' : 'text-dark-300 hover:text-white'}`}>Por cliente</button>
          </div>
        </div>

        {cargando ? (
          <div className="card p-12 text-center text-dark-300">Cargando...</div>
        ) : filtradas.length === 0 ? (
          <div className="card p-12 text-center text-dark-300">No hay reservas registradas</div>
        ) : vistaAgrupada ? (
          /* Vista agrupada por cliente */
          <div className="space-y-6">
            {Object.values(agrupadas).map(({ nombre, cedula, reservas: rs }) => (
              <div key={nombre} className="card overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 bg-dark-700/40 border-b border-dark-600/50">
                  <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 text-xs font-bold">{nombre[0]}</div>
                  <div>
                    <p className="text-white font-semibold text-sm">{nombre}</p>
                    {cedula && <p className="text-dark-300 text-xs">Cédula: {cedula}</p>}
                  </div>
                  <span className="ml-auto text-xs bg-brand-500/15 text-brand-400 px-2.5 py-1 rounded-full font-medium">{rs.length} reserva{rs.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-dark-600/30">
                      <tr>
                        {['Código', 'Vehículo', 'Placa', 'Descripción', 'Acciones'].map(h => <th key={h} className="table-header">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {rs.map(r => (
                        <tr key={r._id} className="table-row">
                          <td className="table-cell font-mono text-brand-400 text-xs font-semibold">{r.codigo}</td>
                          <td className="table-cell text-white">{r.id_vehiculo?.marca} {r.id_vehiculo?.modelo}</td>
                          <td className="table-cell font-mono text-xs">{r.id_vehiculo?.placa}</td>
                          <td className="table-cell text-dark-300 text-xs max-w-xs truncate">{r.descripcion || '—'}</td>
                          <td className="table-cell">
                            <div className="flex items-center gap-2">
                              <button onClick={() => abrirEditar(r)} className="btn-edit text-xs">Editar</button>
                              <button onClick={() => abrirEliminar(r)} className="btn-danger text-xs">Eliminar</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Vista lista */
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-dark-600/50">
                  <tr>
                    {['Código', 'Cliente', 'Cédula', 'Vehículo', 'Placa', 'Descripción', 'Acciones'].map(h => (
                      <th key={h} className="table-header">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtradas.map(r => (
                    <tr key={r._id} className="table-row">
                      <td className="table-cell font-mono text-brand-400 text-xs font-semibold">{r.codigo}</td>
                      <td className="table-cell text-white font-medium">{r.id_cliente?.nombres} {r.id_cliente?.apellidos}</td>
                      <td className="table-cell font-mono text-xs text-dark-300">{r.id_cliente?.cedula}</td>
                      <td className="table-cell">{r.id_vehiculo?.marca} {r.id_vehiculo?.modelo}</td>
                      <td className="table-cell font-mono text-xs">{r.id_vehiculo?.placa}</td>
                      <td className="table-cell text-dark-300 text-xs max-w-xs truncate">{r.descripcion || '—'}</td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <button onClick={() => abrirEditar(r)} className="btn-edit text-xs">Editar</button>
                          <button onClick={() => abrirEliminar(r)} className="btn-danger text-xs">Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Crear / Editar */}
      {(modal === 'crear' || modal === 'editar') && (
        <Modal titulo={modal === 'crear' ? 'Nueva reserva' : 'Editar reserva'} onClose={cerrar}>
          <form onSubmit={handleGuardar} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Código *</label>
              <input className="input-field" value={form.codigo} onChange={e => setForm({...form, codigo: e.target.value})} placeholder="RES-001" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Cliente *</label>
              <select className="input-field" value={form.id_cliente} onChange={e => setForm({...form, id_cliente: e.target.value})} required>
                <option value="">— Selecciona un cliente —</option>
                {clientes.map(c => (
                  <option key={c._id} value={c._id}>{c.nombres} {c.apellidos} — {c.cedula}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Vehículo *</label>
              <select className="input-field" value={form.id_vehiculo} onChange={e => setForm({...form, id_vehiculo: e.target.value})} required>
                <option value="">— Selecciona un vehículo —</option>
                {vehiculos.map(v => (
                  <option key={v._id} value={v._id}>{v.marca} {v.modelo} — {v.placa}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-300 mb-1.5">Descripción</label>
              <textarea className="input-field resize-none" rows={2} value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} placeholder="Detalles de la reserva..." />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-primary flex-1" disabled={guardando}>
                {guardando ? 'Guardando...' : modal === 'crear' ? 'Crear reserva' : 'Guardar cambios'}
              </button>
              <button type="button" onClick={cerrar} className="btn-secondary">Cancelar</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Eliminar */}
      {modal === 'eliminar' && (
        <Modal titulo="Eliminar reserva" onClose={cerrar}>
          <p className="text-slate-300 mb-2">¿Estás seguro de que deseas eliminar la reserva:</p>
          <p className="text-white font-semibold mb-6">"{seleccionado?.codigo}"</p>
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
