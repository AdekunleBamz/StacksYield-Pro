import React from 'react'
import { HiCheck, HiClock, HiArrowRight } from 'react-icons/hi2'

const TransactionStepper = ({ currentStep = 0, steps = [] }) => {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {/* Progress Line Background */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-stacks-gray z-0" />
        
        {/* Progress Line Active */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-stacks-purple transition-all duration-500 z-0" 
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, i) => {
          const isCompleted = i < currentStep
          const isActive = i === currentStep
          const isUpcoming = i > currentStep

          return (
            <div key={i} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-stacks-purple border-stacks-purple text-white shadow-lg shadow-stacks-purple/20' 
                    : isActive 
                      ? 'bg-stacks-gray border-stacks-purple text-stacks-purple animate-pulse' 
                      : 'bg-stacks-gray border-stacks-gray text-gray-500'
                }`}
              >
                {isCompleted ? (
                  <HiCheck className="w-5 h-5" />
                ) : isActive ? (
                  <HiClock className="w-5 h-5" />
                ) : (
                  <span className="text-xs font-bold">{i + 1}</span>
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

export default TransactionStepper
