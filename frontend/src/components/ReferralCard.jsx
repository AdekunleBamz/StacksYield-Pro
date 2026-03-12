import { HiClipboard, HiShare } from 'react-icons/hi2'
import { FaXTwitter, FaTelegram, FaWhatsapp } from 'react-icons/fa6'
import toast from 'react-hot-toast'

const ReferralCard = ({ address, referrals, earnings }) => {
  const referralLink = `${window.location.origin}/?ref=${address}`
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
    toast.success('Referral link copied!')
  }

  const shareOnX = () => {
    const text = `Join me on StacksYield Pro and earn up to 25% APY on your STX! 🚀\n\n${referralLink}`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank')
  }

  const shareOnTelegram = () => {
    const text = `Join me on StacksYield Pro and earn up to 25% APY on your STX! 🚀`
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`, '_blank')
  }

  const shareOnWhatsApp = () => {
    const text = `Join me on StacksYield Pro and earn up to 25% APY on your STX! 🚀 ${referralLink}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="glass-card rounded-2xl p-8 relative overflow-hidden group border border-white/5 hover:border-stacks-purple/30 transition-all duration-500">
      {/* Glow Effect */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-stacks-purple/10 rounded-full blur-3xl group-hover:bg-stacks-purple/20 transition-all duration-700" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-stacks-purple/20 flex items-center justify-center">
            <HiShare className="w-6 h-6 text-stacks-purple" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-display text-white">Share & Earn</h3>
            <p className="text-gray-400 text-xs mt-0.5">Earn 0.25% of all fees from your referrals</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Total Referrals</p>
            <p className="text-2xl font-bold text-white tracking-tight">{referrals}</p>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Total Earnings</p>
            <p className="text-2xl font-bold text-vault-conservative tracking-tight">{earnings} <span className="text-xs">STX</span></p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input 
              readOnly 
              value={referralLink}
              className="w-full bg-[#1A1A1C] border border-white/5 rounded-xl px-4 py-3 text-xs font-mono text-gray-400 focus:outline-none pr-12"
            />
            <button 
              onClick={copyToClipboard}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-stacks-gray hover:bg-stacks-purple transition-colors group/btn"
              title="Copy link"
            >
              <HiClipboard className="w-4 h-4 text-gray-400 group-hover/btn:text-white" />
            </button>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={shareOnX}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-black border border-white/10 hover:bg-white/5 transition-colors text-white text-xs font-bold"
            >
              <FaXTwitter className="w-4 h-4" />
              Post
            </button>
            <button 
              onClick={shareOnTelegram}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#24A1DE]/10 border border-[#24A1DE]/20 hover:bg-[#24A1DE]/20 transition-colors text-[#24A1DE] text-xs font-bold"
            >
              <FaTelegram className="w-4 h-4" />
              Send
            </button>
            <button 
              onClick={shareOnWhatsApp}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-colors text-[#25D366] text-xs font-bold"
            >
              <FaWhatsapp className="w-4 h-4" />
              Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReferralCard
