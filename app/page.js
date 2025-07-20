'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SearchAutocomplete from '../components/SearchAutocomplete'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleSearch = (query) => {
    if (query) {
      window.location.href = `/products?search=${encodeURIComponent(query)}`
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column' }}>
      {/* Main centered content */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '0 20px'
      }}>
        {/* Logo */}
        <div style={{ marginBottom: isMobile ? '30px' : '40px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0px',
            fontSize: isMobile ? '32px' : '42px',
            fontWeight: '900',
            fontFamily: 'Arial Black, sans-serif',
            letterSpacing: '-1px'
          }}>
            {/* Wrench icon */}
            <svg width={isMobile ? "50" : "70"} height={isMobile ? "50" : "70"} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g transform="translate(10, 15)">
                <path d="M25 30 Q15 20 15 10 Q15 5 20 5 Q25 5 25 10 L25 15 L35 15 L35 10 Q35 5 40 5 Q45 5 45 10 Q45 20 35 30 L30 35 L50 55 Q55 60 50 65 Q45 70 40 65 L20 45 L25 30 Z" 
                      fill="black" 
                      stroke="black" 
                      strokeWidth="2"/>
                <circle cx="30" cy="20" r="3" fill="white"/>
              </g>
            </svg>
            <span style={{ marginLeft: '-5px' }}>RIGHT</span>
            <span style={{ marginLeft: '15px' }}>2 FIX</span>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ width: '100%', maxWidth: isMobile ? '90%' : '600px', marginBottom: isMobile ? '20px' : '30px' }}>
          <SearchAutocomplete 
            onSearch={handleSearch}
          />
        </div>

        {/* Tagline */}
        <p style={{ 
          fontSize: isMobile ? '16px' : '18px', 
          textAlign: 'center', 
          marginBottom: isMobile ? '60px' : '120px',
          color: '#333',
          fontWeight: '400',
          padding: isMobile ? '0 20px' : '0'
        }}>
          the right <span style={{ fontWeight: '700' }}>parts</span> at the right <span style={{ fontWeight: '700' }}>place</span> for the right <span style={{ fontWeight: '700' }}>price</span>
        </p>
      </div>

      {/* Bottom Section */}
      <div style={{ 
        position: 'relative',
        width: '100%',
        padding: '40px 20px',
        marginTop: 'auto'
      }}>
        <div style={{ 
          maxWidth: '600px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '30px'
        }}>
          {/* Filter Button */}
          <Link href="/products" style={{ 
            backgroundColor: '#000',
            color: '#fff',
            padding: isMobile ? '12px 32px' : '14px 40px',
            borderRadius: '30px',
            textDecoration: 'none',
            fontWeight: '500',
            fontSize: isMobile ? '15px' : '16px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: isMobile ? '8px' : '10px',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#000'}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
          </Link>
          
          {/* Terms link */}
          <Link href="/terms" style={{ 
            fontSize: '14px',
            color: '#666',
            textDecoration: 'none',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.color = '#000'}
          onMouseLeave={(e) => e.target.style.color = '#666'}
          >
            Terms & conditions
          </Link>
        </div>
      </div>
    </div>
  )
}