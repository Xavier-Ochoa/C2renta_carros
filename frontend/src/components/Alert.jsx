export default function Alert({ tipo = 'error', mensaje, onClose }) {
  const estilos = {
    error:   'bg-red-500/10 border-red-500/30 text-red-400',
    success: 'bg-green-500/10 border-green-500/30 text-green-400',
    info:    'bg-blue-500/10 border-blue-500/30 text-blue-400',
  }
  const iconos = { error: '✕', success: '✓', info: 'ℹ' }

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm ${estilos[tipo]} fade-in`}>
      <span className="font-bold">{iconos[tipo]}</span>
      <span className="flex-1">{mensaje}</span>
      {onClose && <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity">&times;</button>}
    </div>
  )
}
