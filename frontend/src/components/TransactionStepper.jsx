import React from 'react'
import { HiCheck, HiClock, HiArrowRight } from 'react-icons/hi2'

export const TransactionStepper = ({ currentStep = 0, steps = [] }) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {/* Progress Line Background */}
        <div className="absolute left-0 top-[18px] w-full h-[3px] bg-white/5 z-0 rounded-full" />
        
        {/* Progress Line Active */}
        <div 
          className="absolute left-0 top-[18px] h-[3px] bg-gradient-to-r from-stacks-purple to-stacks-orange transition-all duration-700 ease-in-out z-0 rounded-full shadow-[0_0_10px_rgba(85,70,255,0.3)]" 
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, i) => {
          const isCompleted = i < currentStep
          const isActive = i === currentStep
          const isUpcoming = i > currentStep

          return (
            <div key={i} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-9 h-9 rounded-xl flex items-center justify-center border-2 transition-all duration-500 ${
                  isCompleted 
                    ? 'bg-stacks-purple border-stacks-purple text-white shadow-xl shadow-stacks-purple/20 scale-100' 
                    : isActive 
                      ? 'bg-[#1A1A1C] border-stacks-purple text-stacks-purple shadow-[0_0_15px_rgba(85,70,255,0.2)] scale-110 z-20' 
                      : 'bg-[#1A1A1C] border-white/10 text-gray-600 scale-90'
                }`}
              >
                {isCompleted ? (
                  <HiCheck className="w-5 h-5 stroke-[3]" />
                ) : isActive ? (
                  <div className="relative flex items-center justify-center">
                    <HiClock className="w-5 h-5 animate-spin-slow" />
                    <span className="absolute inset-0 rounded-full border-2 border-stacks-purple animate-ping opacity-20" />
                  </div>
                ) : (
                  <span className="text-[10px] font-black">{i + 1}</span>
                )}
              </div>
              <div className="absolute top-10 whitespace-nowrap text-center">
                <p className={`text-[10px] uppercase font-bold tracking-widest ${
                  isActive ? 'text-stacks-purple' : 'text-gray-500'
                }`}>
                  {step.label}
                </p>
                {isActive && (
                  <p className="text-[10px] text-gray-400 mt-0.5 animate-pulse">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

