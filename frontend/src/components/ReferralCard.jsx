import React from 'react'
import { truncateAddress } from '../utils/helpers'

const ReferralCard = ({ code, referrals, earnings, onShare }) => {
  return (
    <div className="bg-stacks-gray/30 border border-stacks-gray rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">Your Referral Code</h3>
      <div className="bg-stacks-dark p-4 rounded-lg mb-4">
        <p className="text-2xl font-mono text-stacks-purple text-center">{code}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-gray-400 text-sm">Referrals</p>
          <p className="text-xl font-bold text-white">{referrals}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Earnings</p>
          <p className="text-xl font-bold text-green-400">{earnings} STX</p>
        </div>
      </div>
      <button onClick={onShare} className="w-full bg-stacks-purple hover:bg-stacks-purple/80 text-white py-2 rounded-lg">
        Share Code
      </button>
    </div>
  )
}

export default ReferralCard
