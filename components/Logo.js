import React from 'react'

export default function Logo() {
  return (
    <div className="flex items-center">
      <svg className="w-8 h-8 mr-2" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 16C8 16 8 8 16 8C24 8 24 16 24 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 16L16 20L20 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="7" cy="16" r="3" stroke="currentColor" strokeWidth="2"/>
        <path d="M10 16H22" stroke="currentColor" strokeWidth="2"/>
      </svg>
      <div className="flex items-baseline">
        <span className="text-2xl font-bold">RIGHT</span>
        <span className="text-2xl font-bold ml-1">2 FIX</span>
      </div>
    </div>
  )
}