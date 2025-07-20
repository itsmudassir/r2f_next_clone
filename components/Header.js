'use client'

import Logo from './Logo'
import SearchBar from './SearchBar'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="hidden lg:block bg-black text-white">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>
            <div className="flex-1 max-w-2xl mx-8">
              <SearchBar />
            </div>
            <div className="w-40"></div>
          </div>
        </div>
      </div>
      
      {/* Mobile/Tablet Header */}
      <div className="lg:hidden">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col items-center space-y-4">
            <Link href="/">
              <Logo />
            </Link>
            <SearchBar />
          </div>
        </div>
      </div>
    </header>
  )
}