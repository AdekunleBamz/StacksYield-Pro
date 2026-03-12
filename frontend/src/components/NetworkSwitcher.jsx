import { HiGlobeAlt, HiChevronDown } from 'react-icons/hi2'

const NetworkSwitcher = ({ currentNetwork, onSwitch }) => {
  const isMainnet = currentNetwork === 'mainnet'

  return (
    <div className="flex items-center">
      <button
        onClick={() => onSwitch(isMainnet ? 'testnet' : 'mainnet')}
        className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 ${
          isMainnet 
            ? 'bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20' 
            : 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
        }`}
        aria-label={`Switch network, currently on ${currentNetwork}`}
      >
        <div className="relative">
          <HiGlobeAlt className={`w-4 h-4 transition-transform duration-500 group-hover:rotate-180`} />
          <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full border-2 border-[#1A1A1C] animate-pulse ${
            isMainnet ? 'bg-green-500' : 'bg-amber-500'
          }`} />
        </div>
        
        <div className="flex flex-col items-start leading-none">
          <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">Network</span>
          <span className="text-xs font-bold capitalize">{currentNetwork}</span>
        </div>

        <HiChevronDown className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity" />
      </button>
    </div>
  )
}

export default NetworkSwitcher
