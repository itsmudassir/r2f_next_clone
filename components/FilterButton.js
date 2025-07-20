'use client'

export default function FilterButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M3 8h18m-9 4h9m-9 4h9m-9 4h9" />
      </svg>
      <span className="font-medium">Filter</span>
    </button>
  )
}