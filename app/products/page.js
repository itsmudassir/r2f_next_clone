'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [activeFilter, setActiveFilter] = useState('Refine Search')
  const [filterSearch, setFilterSearch] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize] = useState(20)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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

  // Fetch products from API
  const fetchProducts = async (search = '', page = 0) => {
    setLoading(true)
    try {
      const url = search 
        ? `/api/search?refine_search=${encodeURIComponent(search)}&hitsSize=${pageSize}&from=${page * pageSize}`
        : `/api/search?hitsSize=${pageSize}&from=${page * pageSize}`
      
      const response = await fetch(url)
      const result = await response.json()
      
      if (result.success && result.data) {
        // Extract products from the API response - RIGHT2FIX uses hits.hits structure
        let productData = []
        if (result.data.hits?.hits) {
          productData = result.data.hits.hits.map(hit => ({
            _id: hit._id,
            ...hit._source?.detail_single,
            images: hit._source?.images || [],
            stores: hit._source?.stores || []
          }))
        } else {
          productData = result.data.products || result.data.items || []
        }
        setProducts(productData)
        setTotalResults(result.data.hits?.total?.value || result.data.total || result.pagination?.total || productData.length)
      } else {
        setProducts([])
        setTotalResults(0)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
      setTotalResults(0)
    } finally {
      setLoading(false)
    }
  }

  // Fetch products on mount and when search changes
  useEffect(() => {
    const search = searchParams.get('search') || searchQuery
    fetchProducts(search, currentPage)
  }, [searchParams, currentPage])

  // Handle search
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      fetchProducts(searchQuery, 0)
      setCurrentPage(0)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#000', color: '#fff', position: 'relative' }}>
        <div style={{ 
          padding: '10px 20px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: isMobile ? '10px' : '20px' 
        }}>
          <Link href="/" style={{ 
            fontSize: isMobile ? '16px' : '20px', 
            fontWeight: 'bold',
            color: '#fff',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            flexShrink: 0
          }}>
            <svg width={isMobile ? "24" : "30"} height={isMobile ? "24" : "30"} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g transform="translate(10, 15)">
                <path d="M25 30 Q15 20 15 10 Q15 5 20 5 Q25 5 25 10 L25 15 L35 15 L35 10 Q35 5 40 5 Q45 5 45 10 Q45 20 35 30 L30 35 L50 55 Q55 60 50 65 Q45 70 40 65 L20 45 L25 30 Z" 
                      fill="white" 
                      stroke="white" 
                      strokeWidth="2"/>
                <circle cx="30" cy="20" r="3" fill="black"/>
              </g>
            </svg>
            {!isMobile && <span>RIGHT</span>}
            {!isMobile && <span style={{ marginLeft: '8px' }}>2 FIX</span>}
          </Link>
          <div style={{ flex: 1, maxWidth: isMobile ? '100%' : '400px' }}>
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
                  transform: 'translateY(-50%)'
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
                placeholder="Search"
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 35px',
                  borderRadius: '4px',
                  border: 'none',
                  fontSize: '14px',
                  backgroundColor: '#f5f5f5'
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* Mobile Filter Button */}
        {isMobile && (
          <button
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            style={{
              position: 'fixed',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#000',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '25px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '500',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
          </button>
        )}

        {/* Filter Container */}
        <div style={{
          display: 'flex',
          width: isMobile ? '100%' : (activeFilter !== null ? '560px' : '280px'),
          backgroundColor: '#f8f8f8',
          borderRight: '1px solid #e0e0e0',
          flexShrink: 0,
          position: isMobile ? 'fixed' : 'relative',
          top: isMobile ? 0 : 'auto',
          left: isMobile ? 0 : 'auto',
          height: isMobile ? '100vh' : '100%',
          zIndex: isMobile ? 999 : 'auto',
          transform: isMobile ? (showMobileFilter ? 'translateX(0)' : 'translateX(-100%)') : 'none',
          transition: 'all 0.3s ease-in-out',
          overflow: 'hidden'
        }}>
          {/* Left Sidebar with Categories */}
          <aside style={{ 
            width: '280px',
            backgroundColor: '#f8f8f8', 
            borderRight: '1px solid #e0e0e0',
            flexShrink: 0,
            overflowY: 'auto',
            height: '100%'
          }}>
          <div style={{ padding: '16px' }}>
            <div style={{ 
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <button style={{ 
                fontSize: '14px', 
                color: '#dc2626',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: 0
              }}>Clear All</button>
              {isMobile && (
                <button
                  onClick={() => setShowMobileFilter(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              )}
            </div>
            
            {/* Filter Categories */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {filterCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveFilter(category)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '12px 16px',
                      border: 'none',
                      borderBottom: '1px solid #e0e0e0',
                      cursor: 'pointer',
                      backgroundColor: activeFilter === category ? '#000' : '#fff',
                      color: activeFilter === category ? '#fff' : '#000',
                      fontWeight: activeFilter === category ? '500' : '400',
                      fontSize: isMobile ? '14px' : '15px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (activeFilter !== category) {
                        e.target.style.backgroundColor = '#f5f5f5'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeFilter !== category) {
                        e.target.style.backgroundColor = '#fff'
                      }
                    }}
                  >
                    {category}
                  </button>
                ))}
            </div>
          </div>
        </aside>

        {/* Right Panel - Shows when category is selected */}
        {activeFilter && (
          <div style={{
            width: '280px',
            backgroundColor: '#fff',
            padding: '16px',
            borderLeft: '1px solid #e0e0e0',
            height: '100%',
            overflowY: 'auto'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              marginBottom: '16px' 
            }}>
              <h3 style={{ fontWeight: '600', fontSize: '18px' }}>{activeFilter}</h3>
              <button style={{ 
                fontSize: '14px', 
                color: '#dc2626',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}>Clear</button>
            </div>
            
            {/* Category specific content */}
            {activeFilter === 'Categories' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Category</label>
                  <select style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    backgroundColor: '#fff',
                    fontSize: '14px'
                  }}>
                    <option value="">Select Category</option>
                    <option value="oil">Oil, Fluids and Chemicals</option>
                    <option value="body">Body & Brackets</option>
                    <option value="flanges">Flanges and Hangers</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Subcategory</label>
                  <select style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    backgroundColor: '#fff',
                    fontSize: '14px'
                  }}>
                    <option value="">Select Subcategory</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Part name</label>
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
                        transform: 'translateY(-50%)'
                      }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search here"
                      style={{
                        width: '100%',
                        padding: '8px 12px 8px 35px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Default search box for other filters */}
            {activeFilter !== 'Categories' && (
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
                    transform: 'translateY(-50%)'
                  }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  placeholder="Type here..."
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 35px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: '#f8f8f8'
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <main style={{ 
        flex: 1, 
        padding: isMobile ? '16px' : '24px', 
        backgroundColor: '#fff'
      }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '1px solid #e0e0e0'
          }}>
            <h1 style={{ fontSize: '20px', fontWeight: '600' }}>Result: {totalResults}</h1>
            <button style={{ 
              color: '#dc2626',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '14px'
            }}>Clear All</button>
          </div>


          {loading ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: '300px' 
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '3px solid #f0f0f0',
                  borderTopColor: '#000',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  margin: '0 auto 16px'
                }} />
                <p>Loading products...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              color: '#666'
            }}>
              <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>No products found</h2>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {products.map((product, index) => {
                const productId = product._id || product.id_codes || product.id || product.sku || index;
                return (
                <Link 
                  key={productId}
                  href={`/product/${productId}`}
                  style={{
                    display: 'block',
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: isMobile ? '12px' : '16px',
                    transition: 'box-shadow 0.3s',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    color: 'inherit'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                >
                <div style={{ display: 'flex', gap: isMobile ? '12px' : '16px', flexDirection: isMobile ? 'column' : 'row' }}>
                  <div style={{
                    width: isMobile ? '100%' : '192px',
                    height: isMobile ? '200px' : '192px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {product.images?.[0] ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.title || 'Product'}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.parentElement.innerHTML = '<span style="color: #9ca3af">Product Image</span>'
                        }}
                      />
                    ) : (
                      <span style={{ color: '#9ca3af' }}>Product Image</span>
                    )}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: 'bold', fontSize: '18px' }}>
                      {product.mpn || product.id || product.sku || product.part_number || `Item ${index + 1}`}
                    </h3>
                    <p style={{ fontWeight: '600', marginTop: '4px' }}>
                      {product.brand_name || product.brand || product.manufacturer || 'Unknown Brand'}
                    </p>
                    
                    <div style={{ marginTop: '8px', fontSize: '14px' }}>
                      <p style={{ marginBottom: '4px' }}>
                        <span style={{ color: '#6b7280' }}>Title:</span> {product.title || product.name || product.description || 'No title'}
                      </p>
                      {(product.categories || product.category) && (
                        <p style={{ marginBottom: '4px' }}>
                          <span style={{ color: '#6b7280' }}>Categories:</span> 
                          {Array.isArray(product.categories) ? product.categories.join(' > ') : (product.category || product.categories)}
                        </p>
                      )}
                      <p style={{ marginBottom: '4px' }}>
                        <span style={{ color: '#6b7280' }}>Stores:</span> {product.store || product.vendor || 'Multiple stores'}
                      </p>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                        <span style={{ fontWeight: '600' }}>{(product.avg_of_avg_ratings || product.rating || 0).toFixed(1)}</span>
                        <div style={{ display: 'flex' }}>
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} style={{ width: '16px', height: '16px', color: '#d1d5db' }} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span style={{ color: '#6b7280' }}>({product.sum_reviews || product.reviews || 0} reviews)</span>
                      </div>
                      
                      <div style={{ marginTop: '12px' }}>
                        <span style={{
                          fontWeight: '500',
                          color: product.inStock ? '#10b981' : '#ef4444'
                        }}>
                          {product.availability || product.inStock !== false ? 'In stock' : 'Out of stock'}
                        </span>
                        <p style={{
                          fontSize: '24px',
                          fontWeight: 'bold',
                          color: '#ef4444',
                          marginTop: '4px'
                        }}>${product.min_price || product.price || product.cost || '0.00'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
              );
              })}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalResults > pageSize && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '16px',
              marginTop: '40px',
              paddingTop: '20px',
              borderTop: '1px solid #e0e0e0'
            }}>
              <button
                onClick={() => {
                  const newPage = Math.max(0, currentPage - 1)
                  setCurrentPage(newPage)
                  fetchProducts(searchQuery, newPage)
                }}
                disabled={currentPage === 0}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  backgroundColor: currentPage === 0 ? '#f5f5f5' : '#fff',
                  cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                  opacity: currentPage === 0 ? 0.5 : 1
                }}
              >
                Previous
              </button>
              
              <span style={{ fontSize: '14px', color: '#666' }}>
                Page {currentPage + 1} of {Math.ceil(totalResults / pageSize)}
              </span>
              
              <button
                onClick={() => {
                  const newPage = currentPage + 1
                  setCurrentPage(newPage)
                  fetchProducts(searchQuery, newPage)
                }}
                disabled={(currentPage + 1) * pageSize >= totalResults}
                style={{
                  padding: '8px 16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  backgroundColor: (currentPage + 1) * pageSize >= totalResults ? '#f5f5f5' : '#fff',
                  cursor: (currentPage + 1) * pageSize >= totalResults ? 'not-allowed' : 'pointer',
                  opacity: (currentPage + 1) * pageSize >= totalResults ? 0.5 : 1
                }}
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}