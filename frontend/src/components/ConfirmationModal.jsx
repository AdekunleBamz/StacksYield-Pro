import React from 'react'
import Modal from './Modal'
import { HiExclamationTriangle } from 'react-icons/hi2'
import Button from './Button'

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmLabel = "Confirm", 
  cancelLabel = "Cancel",
  variant = "danger",
  isLoading = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center text-center p-4">
        <div className={`w-20 h-20 rounded-2xl ${variant === 'danger' ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'} flex items-center justify-center mb-8 border border-white/5 shadow-inner animate-fade-in-up`}>
          <HiExclamationTriangle className="w-10 h-10" />
        </div>
        
        <h3 className="text-xl font-black text-white mb-3 tracking-tight uppercase tracking-widest text-[10px] opacity-60">Action Required</h3>
        <p className="text-gray-400 mb-10 leading-relaxed font-bold text-sm max-w-sm">
          {message}
        </p>
        
        <div className="flex w-full gap-4">
          <button 
            onClick={onClose} 
            className="flex-1 py-4 rounded-xl font-black uppercase tracking-widest text-xs border border-white/5 bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-gray-400 hover:text-white"
            disabled={isLoading}
          >
            {cancelLabel}
          </button>
          <button 
            onClick={onConfirm} 
            className={`flex-1 py-4 rounded-xl font-black uppercase tracking-widest text-xs active:scale-95 transition-all shadow-xl ${
              variant === 'danger' 
                ? 'bg-error text-white shadow-error/20 hover:bg-error/90' 
                : 'bg-warning text-white shadow-warning/20 hover:bg-warning/90'
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmationModal
