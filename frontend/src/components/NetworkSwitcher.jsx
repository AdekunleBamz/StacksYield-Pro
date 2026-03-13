import { HiGlobeAlt, HiChevronDown } from 'react-icons/hi2'

const NetworkSwitcher = ({ currentNetwork, onSwitch }) => {
  const isMainnet = currentNetwork === 'mainnet'

  return (
    <div className="flex items-center">
      <button
        onClick={() => onSwitch(isMainnet ? 'testnet' : 'mainnet')}
        className={`group flex items-center gap-2.5 px-4 py-2 rounded-xl border transition-all duration-300 active:scale-95 ${
          isMainnet 
            ? 'bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20' 
            : 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
        }`}
        aria-label={`Switch network, currently on ${currentNetwork}`}
      >
        <div className="relative flex items-center justify-center">
          <HiGlobeAlt className={`w-5 h-5 transition-transform duration-700 group-hover:rotate-[360deg]`} />
          <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-stacks-dark animate-pulse shadow-[0_0_8px_rgba(0,0,0,0.5)] ${
            isMainnet ? 'bg-green-500' : 'bg-amber-500'
          }`} />
        </div>
        
        <div className="flex flex-col items-start leading-none pr-1">
          <span className="text-[9px] uppercase font-black tracking-widest opacity-50 mb-0.5">Network</span>
          <span className="text-xs font-black capitalize tracking-tight">{currentNetwork}</span>
        </div>
      </button>
    </div>
  )
}

export default NetworkSwitcher
