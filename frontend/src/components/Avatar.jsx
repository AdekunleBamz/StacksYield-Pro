import React from 'react'
import { truncateAddress } from '../utils/helpers'

const Avatar = ({ address, size = 'md' }) => {
  const sizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-12 h-12' }
  
  return (
    <div className={`${sizes[size]} rounded-full bg-stacks-purple flex items-center justify-center text-white font-bold`}>
      {address ? truncateAddress(address, 2, 2).toUpperCase() : '?'}
    </div>
  )
}

export default Avatar
