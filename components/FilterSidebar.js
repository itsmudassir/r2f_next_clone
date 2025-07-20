'use client'

import { useState } from 'react'

const filterCategories = [
  'Availability',
  'Brands',
  'Categories',
  'Refine Search',
  'Ratings',
  'Reviews',
  'Price',
  'Stores',
  'Attributes',
  'Vehicle Application'
]

export default function FilterSidebar({ isOpen = true }) {
  const [activeFilter, setActiveFilter] = useState('Refine Search')
  const [searchQuery, setSearchQuery] = useState('')

  if (!isOpen) return null

  return (
    <div className="w-full lg:w-80 bg-white border-r border-gray-200 h-full">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button className="text-sm text-red-500 hover:underline">Clear All</button>
        </div>

        <div className="space-y-2">
          {filterCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                activeFilter === category
                  ? 'bg-gray-100 font-medium'
                  : 'hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">{activeFilter}</h3>
            <button className="text-sm text-red-500 hover:underline">Clear</button>
          </div>
          
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type here..."
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}