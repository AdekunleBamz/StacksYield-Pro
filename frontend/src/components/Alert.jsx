import React from 'react'

const Alert = ({ children, variant = 'info', title, onClose }) => {
  const variants = {
    info: 'bg-blue-500/10 border-blue-500/50 text-blue-200',
    success: 'bg-green-500/10 border-green-500/50 text-green-200',
    warning: 'bg-yellow-500/10 border-yellow-500/50 text-yellow-200',
    error: 'bg-red-500/10 border-red-500/50 text-red-200'
  }

  const icons = {
    info: <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    success: <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    warning: <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
    error: <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  }
  
  return (
    <div className={`
      relative border-l-4 p-4 rounded-xl flex items-start animate-in fade-in slide-in-from-left-2 duration-300
      ${variants[variant]}
    `}>
      <div className="flex-shrink-0 pt-0.5">
        {icons[variant]}
      </div>
      <div className="flex-1 min-w-0">
        {title && <h4 className="font-bold text-white mb-1 tracking-tight">{title}</h4>}
        <div className="text-sm opacity-90 leading-relaxed">{children}</div>
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          className="ml-4 flex-shrink-0 p-1 hover:bg-white/10 rounded-full transition-colors focus:outline-none"
          aria-label="Dismiss alert"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  )
}

export default Alert
