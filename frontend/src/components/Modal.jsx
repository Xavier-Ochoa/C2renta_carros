export default function Modal({ titulo, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      {/* Panel */}
      <div className="relative w-full max-w-lg card shadow-2xl fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-dark-600/50">
          <h2 className="font-display font-bold text-white text-lg">{titulo}</h2>
          <button onClick={onClose} className="text-dark-300 hover:text-white transition-colors text-xl leading-none">&times;</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
