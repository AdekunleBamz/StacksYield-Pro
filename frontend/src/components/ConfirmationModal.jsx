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
      <div className="flex flex-col items-center text-center p-2">
        <div className={`w-16 h-16 rounded-full ${variant === 'danger' ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'} flex items-center justify-center mb-6`}>
          <HiExclamationTriangle className="w-8 h-8" />
        </div>
        
        <p className="text-gray-300 mb-8 leading-relaxed">
          {message}
        </p>
        
        <div className="flex w-full gap-3">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            className="flex-1"
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button 
            variant={variant} 
            onClick={onConfirm} 
            className="flex-1"
            loading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmationModal
