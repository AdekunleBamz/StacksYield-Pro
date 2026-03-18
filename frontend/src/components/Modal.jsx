import React, { useEffect } from 'react'

export const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])
  
  if (!isOpen) return null
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in" 
        onClick={onClose} 
      />
      <div className="relative w-full max-w-lg glass-card rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl animate-fade-in-up scale-[0.98] transition-transform duration-300 hover:scale-100">
        <div className="flex justify-between items-center mb-6">
          <h3 id="modal-title" className="text-xl md:text-2xl font-black gradient-text">
            {title}
          </h3>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/10 rounded-xl transition-all active:scale-90"
            aria-label="Close modal"
          >
            <HiXMark className="w-6 h-6 text-gray-400" />
          </button>
        </div>
        <div className="modal-content text-gray-300">
          {children}
        </div>
      </div>
    </div>
  )
}

