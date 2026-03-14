import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-stacks-dark p-6 relative overflow-hidden">
          {/* Background Decor */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg aspect-square bg-stacks-purple/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="relative glass-card max-w-md w-full p-10 rounded-3xl border border-white/5 text-center shadow-2xl animate-fade-in-up">
            <div className="w-20 h-20 rounded-2xl bg-stacks-purple/20 flex items-center justify-center mx-auto mb-8 shadow-inner shadow-black/50">
              <svg 
                className="w-10 h-10 text-stacks-purple" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2.5} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-white mb-3 tracking-tight">System Intervention</h1>
            <p className="text-sm text-gray-500 font-bold leading-relaxed mb-8 opacity-60">
              {this.state.error?.message || 'A localized instability was detected in the component stack.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-stacks-purple py-4 rounded-xl text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-stacks-purple/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Recover Application
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
