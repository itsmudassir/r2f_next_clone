'use client'

import { useState, useEffect, useRef } from 'react'

export default function SearchAutocomplete({ onSearch }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const debounceTimer = useRef(null)
  const inputRef = useRef(null)

  // Fetch suggestions from API
  const fetchSuggestions = async (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) {
      setSuggestions([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/autocomplete?search=${encodeURIComponent(searchTerm)}`)
      const data = await response.json()
      
      if (data.success && data.suggestions) {
        setSuggestions(data.suggestions)
      } else {
        setSuggestions([])
      }
    } catch (error) {
      console.error('Autocomplete error:', error)
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  // Handle input change with debouncing
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    if (query.length >= 2) {
      debounceTimer.current = setTimeout(() => {
        fetchSuggestions(query)
      }, 300)
    } else {
      setSuggestions([])
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [query])

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          selectSuggestion(suggestions[selectedIndex])
        } else {
          handleSearch()
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  // Select a suggestion
  const selectSuggestion = (suggestion) => {
    const value = typeof suggestion === 'string' ? suggestion : suggestion.text || suggestion.value
    setQuery(value)
    setShowSuggestions(false)
    setSelectedIndex(-1)
    if (onSearch) {
      onSearch(value)
    }
  }

  // Handle search
  const handleSearch = () => {
    if (onSearch && query) {
      onSearch(query)
    }
    setShowSuggestions(false)
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div style={{ position: 'relative' }}>
        <svg 
          width="16" 
          height="16" 
          fill="none" 
          stroke="#999" 
          viewBox="0 0 24 24"
          style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none'
          }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowSuggestions(true)
            setSelectedIndex(-1)
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => {
            // Delay to allow clicking on suggestions
            setTimeout(() => setShowSuggestions(false), 200)
          }}
          placeholder="Search for parts..."
          style={{
            width: '100%',
            padding: '10px 40px 10px 35px',
            borderRadius: '4px',
            border: '1px solid #e0e0e0',
            fontSize: '14px',
            backgroundColor: '#fff',
            outline: 'none'
          }}
        />
        
        {loading && (
          <div style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)'
          }}>
            <div style={{
              width: '16px',
              height: '16px',
              border: '2px solid #f0f0f0',
              borderTopColor: '#666',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }} />
          </div>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '4px',
          backgroundColor: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          maxHeight: '300px',
          overflowY: 'auto',
          zIndex: 1000
        }}>
          {suggestions.map((suggestion, index) => {
            const text = typeof suggestion === 'string' ? suggestion : suggestion.text || suggestion.value
            const isSelected = index === selectedIndex

            return (
              <div
                key={index}
                onClick={() => selectSuggestion(suggestion)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#f5f5f5' : '#fff',
                  borderBottom: index < suggestions.length - 1 ? '1px solid #f0f0f0' : 'none',
                  fontSize: '14px',
                  color: '#333',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f5f5f5'
                  setSelectedIndex(index)
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.target.style.backgroundColor = '#fff'
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg 
                    width="14" 
                    height="14" 
                    fill="none" 
                    stroke="#666" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>{text}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}