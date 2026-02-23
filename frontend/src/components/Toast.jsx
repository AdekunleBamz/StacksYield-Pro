import React, { useState, useEffect, createContext, useContext } from 'react'

const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

const Toast = ({ message, type, onClose }) => {
  const colors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    warning: 'bg-yellow-600',
    info: 'bg-blue-600'
  }

  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3`}>
      <span>{message}</span>
      <button onClick={onClose} className="hover:opacity-80">✕</button>
    </div>
  )
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info', duration = 5000) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }

  const success = (message) => addToast(message, 'success')
  const error = (message) => addToast(message, 'error')
  const warning = (message) => addToast(message, 'warning')
  const info = (message) => addToast(message, 'info')

  return (
    <ToastContext.Provider value={{ addToast, success, error, warning, info }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onClose={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export default Toast
