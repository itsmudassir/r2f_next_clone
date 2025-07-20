'use client'

import { useState } from 'react'
import SearchAutocomplete from '@/components/SearchAutocomplete'
import InterchangesList from '@/components/InterchangesList'

export default function ApiDemoPage() {
  const [selectedProduct, setSelectedProduct] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)

  // Handle search selection
  const handleSearch = async (query) => {
    setLoading(true)
    try {
      // Fetch search results using the search API
      const response = await fetch(`/api/search?refine_search=${encodeURIComponent(query)}&hitsSize=10&from=0`)
      const data = await response.json()
      
      if (data.products || data.items) {
        setSearchResults(data.products || data.items || [])
      }
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#000', color: '#fff', padding: '20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '600' }}>RIGHT2FIX API Demo</h1>
          <p style={{ marginTop: '8px', color: '#ccc' }}>
            Testing search_completion and search_pg_three APIs
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Search Section */}
        <section style={{
          backgroundColor: '#fff',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
            1. Search Completion API Test
          </h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Type to see autocomplete suggestions from the search_completion endpoint
          </p>
          
          <div style={{ maxWidth: '600px' }}>
            <SearchAutocomplete onSearch={handleSearch} />
          </div>

          {/* Search Results */}
          {loading && (
            <div style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
              Loading search results...
            </div>
          )}

          {!loading && searchResults.length > 0 && (
            <div style={{ marginTop: '30px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
                Search Results ({searchResults.length} items)
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {searchResults.slice(0, 5).map((product, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '16px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      backgroundColor: selectedProduct === product.id ? '#f0f0f0' : '#fff',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => setSelectedProduct(product.id || product.sku || `product-${index}`)}
                    onMouseEnter={(e) => {
                      if (selectedProduct !== product.id) {
                        e.currentTarget.style.backgroundColor = '#f9f9f9'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedProduct !== product.id) {
                        e.currentTarget.style.backgroundColor = '#fff'
                      }
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <h4 style={{ fontWeight: '600' }}>
                          {product.id || product.sku || 'Unknown ID'}
                        </h4>
                        <p style={{ color: '#666', fontSize: '14px' }}>
                          {product.title || product.name || 'No title'}
                        </p>
                        {product.brand && (
                          <p style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                            Brand: {product.brand}
                          </p>
                        )}
                      </div>
                      {product.price && (
                        <p style={{ fontWeight: '600', color: '#dc2626' }}>
                          ${product.price}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: '12px', fontSize: '14px', color: '#666' }}>
                Click on a product to see its interchanges
              </p>
            </div>
          )}
        </section>

        {/* Interchanges Section */}
        <section style={{
          backgroundColor: '#fff',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
            2. Interchanges API Test (search_pg_three)
          </h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            {selectedProduct 
              ? `Showing interchanges for product: ${selectedProduct}`
              : 'Select a product from search results to see its interchanges'
            }
          </p>

          {selectedProduct ? (
            <InterchangesList productId={selectedProduct} />
          ) : (
            <div style={{
              padding: '40px',
              textAlign: 'center',
              backgroundColor: '#f9f9f9',
              borderRadius: '6px',
              color: '#666'
            }}>
              <p>No product selected</p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>
                Search for a product above and click on it to view interchanges
              </p>
            </div>
          )}
        </section>

        {/* API Documentation Link */}
        <div style={{
          marginTop: '40px',
          padding: '20px',
          backgroundColor: '#f0f0f0',
          borderRadius: '6px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#666' }}>
            For API documentation, see{' '}
            <a href="/api-documentation.md" style={{ color: '#0066cc' }}>
              api-documentation.md
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}