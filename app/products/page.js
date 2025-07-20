'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import SearchAutocomplete from '../../components/SearchAutocomplete'

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || searchParams.get('refine_search') || '')
  const [activeFilter, setActiveFilter] = useState(searchParams.get('FilterNav') || 'Refine Search')
  const [filterSearch, setFilterSearch] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('from') || '0') / 20)
  const [pageSize] = useState(20)
  const [enabledFilters, setEnabledFilters] = useState(
    searchParams.get('enabled_filters')?.split('---').filter(Boolean) || []
  )
  const [appliedFilters, setAppliedFilters] = useState({})
  const [filterOptions, setFilterOptions] = useState({})
  const [enabledRanges, setEnabledRanges] = useState(
    searchParams.get('enabled_ranges')?.split('---').filter(Boolean) || []
  )

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const filterCategories = [
    { name: 'Availability', param: 'availability' },
    { name: 'Brands', param: 'brand_name' },
    { name: 'Categories', param: 'part_name' },
    { name: 'Refine Search', param: 'refine_search' },
    { name: 'Ratings', param: 'ratings' },
    { name: 'Reviews', param: 'reviews' },
    { name: 'Price', param: 'price' },
    { name: 'Stores', param: 'stores' },
    { name: 'Attributes', param: 'attributes' },
    { name: 'Vehicle Application', param: 'vehicle_application' }
  ]

  // Build API URL with all parameters
  const buildApiUrl = () => {
    const params = new URLSearchParams()
    
    // Add search query
    if (searchQuery) {
      params.set('refine_search', searchQuery)
    }
    
    // Add enabled filters
    if (enabledFilters.length > 0) {
      params.set('enabled_filters', enabledFilters.join('---'))
    }
    
    // Add enabled ranges
    if (enabledRanges.length > 0) {
      params.set('enabled_ranges', enabledRanges.join('---'))
    }
    
    // Add applied filters with CONCSTT suffix for certain filters
    Object.entries(appliedFilters).forEach(([key, value]) => {
      if (value) {
        // Add CONCSTT suffix for availability and brand filters
        if (['availability', 'brand_name', 'stores'].includes(key)) {
          params.set(key, value + 'CONCSTT')
        } else {
          params.set(key, value)
        }
      }
    })
    
    // Add pagination
    params.set('hitsSize', pageSize.toString())
    params.set('from', (currentPage * pageSize).toString())
    
    return `/api/search?${params.toString()}`
  }

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch(buildApiUrl())
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
        
        // Extract filter options from the response
        if (result.data['attributes bucket']) {
          const options = {}
          result.data['attributes bucket'].forEach(item => {
            const filterParam = item.parent_filter
            if (filterParam && enabledFilters.includes(filterParam)) {
              if (!options[filterParam]) {
                options[filterParam] = []
              }
              options[filterParam].push({
                value: item.label || item.key,
                count: item.doc_count || 0
              })
            }
          })
          setFilterOptions(options)
        }
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

  // Update URL with current state
  const updateURL = (updates = {}) => {
    const newParams = new URLSearchParams()
    
    // Merge current state with updates
    const state = {
      search: searchQuery,
      FilterNav: activeFilter,
      enabled_filters: enabledFilters.join('---'),
      enabled_ranges: enabledRanges.join('---'),
      from: (currentPage * pageSize).toString(),
      ...appliedFilters,
      ...updates
    }
    
    // Add all non-empty parameters to URL
    Object.entries(state).forEach(([key, value]) => {
      if (value && value !== '0' && value !== 'Refine Search') {
        newParams.set(key, value)
      }
    })
    
    router.push(`/products?${newParams.toString()}`)
  }

  // Initialize from URL parameters
  useEffect(() => {
    const search = searchParams.get('search') || searchParams.get('refine_search') || ''
    const filterNav = searchParams.get('FilterNav') || 'Refine Search'
    const from = parseInt(searchParams.get('from') || '0')
    const enabled = searchParams.get('enabled_filters')?.split('---').filter(Boolean) || []
    const ranges = searchParams.get('enabled_ranges')?.split('---').filter(Boolean) || []
    
    setSearchQuery(search)
    setActiveFilter(filterNav)
    setCurrentPage(Math.floor(from / pageSize))
    setEnabledFilters(enabled)
    setEnabledRanges(ranges)
    
    // Extract applied filters from URL
    const filters = {}
    const filterParams = ['brand_name', 'stores', 'availability', 'part_name', 'ratings_ranges', 'reviews_ranges', 'price_ranges', 'attributes', 'year']
    searchParams.forEach((value, key) => {
      if (filterParams.includes(key)) {
        filters[key] = value
      }
    })
    setAppliedFilters(filters)
  }, [searchParams])

  // Fetch products when parameters change
  useEffect(() => {
    fetchProducts()
  }, [searchQuery, enabledFilters, enabledRanges, appliedFilters, currentPage])

  // Handle filter category click
  const handleFilterClick = (filterParam) => {
    setActiveFilter(filterParam)
    
    // Toggle enabled filters
    if (filterParam !== 'refine_search') {
      const newEnabledFilters = enabledFilters.includes(filterParam)
        ? enabledFilters.filter(f => f !== filterParam)
        : [...enabledFilters, filterParam]
      
      // Add to enabled_ranges for certain filters
      let newEnabledRanges = [...enabledRanges]
      if (['brand_name', 'part_name', 'ratings_ranges', 'reviews_ranges', 'price_ranges', 'stores'].includes(filterParam)) {
        if (enabledFilters.includes(filterParam)) {
          newEnabledRanges = newEnabledRanges.filter(r => r !== filterParam)
        } else {
          newEnabledRanges.push(filterParam)
        }
      }
      
      setEnabledFilters(newEnabledFilters)
      setEnabledRanges(newEnabledRanges)
      updateURL({ 
        FilterNav: filterParam,
        enabled_filters: newEnabledFilters.join('---'),
        enabled_ranges: newEnabledRanges.join('---'),
        from: '0' // Reset pagination
      })
    } else {
      updateURL({ FilterNav: filterParam })
    }
  }

  // Handle search from autocomplete
  const handleAutocompleteSearch = (query) => {
    setSearchQuery(query)
    updateURL({ search: query, from: '0' })
  }

  // Handle refine search
  const handleRefineSearch = (e) => {
    if (e.key === 'Enter' && filterSearch) {
      setSearchQuery(filterSearch)
      updateURL({ search: filterSearch, from: '0' })
      setFilterSearch('')
    }
  }

  // Handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    updateURL({ from: (newPage * pageSize).toString() })
    window.scrollTo(0, 0)
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
            <SearchAutocomplete 
              onSearch={handleAutocompleteSearch}
              initialValue={searchQuery}
            />
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
          width: isMobile ? '100%' : (activeFilter !== 'Refine Search' ? '560px' : '280px'),
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
              <button 
                onClick={() => {
                  setAppliedFilters({})
                  setEnabledFilters([])
                  setSearchQuery('')
                  updateURL({ search: '', enabled_filters: '', from: '0' })
                }}
                style={{ 
                  fontSize: '14px', 
                  color: '#dc2626',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0
                }}
              >
                Clear All
              </button>
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
              {filterCategories.map((category) => {
                const isActive = activeFilter === category.param || enabledFilters.includes(category.param)
                return (
                  <button
                    key={category.param}
                    onClick={() => handleFilterClick(category.param)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '12px 16px',
                      border: 'none',
                      borderBottom: '1px solid #e0e0e0',
                      cursor: 'pointer',
                      backgroundColor: isActive ? '#000' : '#fff',
                      color: isActive ? '#fff' : '#000',
                      fontWeight: isActive ? '500' : '400',
                      fontSize: isMobile ? '14px' : '15px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.target.style.backgroundColor = '#f5f5f5'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.target.style.backgroundColor = '#fff'
                      }
                    }}
                  >
                    {category.name}
                  </button>
                )
              })}
            </div>
          </div>
        </aside>

        {/* Right Panel - Shows when category is selected */}
        {activeFilter && activeFilter !== 'Refine Search' && (
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
              <h3 style={{ fontWeight: '600', fontSize: '18px' }}>
                {filterCategories.find(f => f.param === activeFilter)?.name || activeFilter}
              </h3>
              <button 
                onClick={() => {
                  const newFilters = { ...appliedFilters }
                  delete newFilters[activeFilter]
                  setAppliedFilters(newFilters)
                  updateURL()
                }}
                style={{ 
                  fontSize: '14px', 
                  color: '#dc2626',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Clear
              </button>
            </div>
            
            {/* Filter content based on type */}
            {activeFilter === 'categories' ? (
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
              </div>
            ) : activeFilter === 'part_name' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Category</label>
                  <select 
                    value={appliedFilters.part_name || ''}
                    onChange={(e) => {
                      const newFilters = { ...appliedFilters }
                      if (e.target.value) {
                        newFilters.part_name = e.target.value
                      } else {
                        delete newFilters.part_name
                      }
                      setAppliedFilters(newFilters)
                      updateURL({
                        part_name: e.target.value,
                        from: '0'
                      })
                    }}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      backgroundColor: '#fff',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Select Category</option>
                    <option value="Bumper Cover Air Duct">Bumper Cover Air Duct</option>
                    <option value="Oil, Fluids and Chemicals">Oil, Fluids and Chemicals</option>
                    <option value="Body & Brackets">Body & Brackets</option>
                    <option value="Flanges and Hangers">Flanges and Hangers</option>
                  </select>
                </div>
              </div>
            ) : activeFilter === 'refine_search' ? (
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
                  onKeyPress={handleRefineSearch}
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
            ) : (
              <div>
                {/* Show filter options based on activeFilter */}
                {filterOptions[activeFilter] && filterOptions[activeFilter].length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {filterOptions[activeFilter].map((option, idx) => (
                      <label key={idx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <input
                          type="checkbox"
                          checked={appliedFilters[activeFilter] === option.value}
                          onChange={(e) => {
                            const newFilters = { ...appliedFilters }
                            if (e.target.checked) {
                              // Remove CONCSTT suffix if it exists when storing internally
                              const cleanValue = option.value.replace('CONCSTT', '')
                              newFilters[activeFilter] = cleanValue
                            } else {
                              delete newFilters[activeFilter]
                            }
                            setAppliedFilters(newFilters)
                            updateURL({
                              [activeFilter]: e.target.checked ? option.value.replace('CONCSTT', '') : '',
                              from: '0'
                            })
                          }}
                          style={{ cursor: 'pointer' }}
                        />
                        <span style={{ flex: 1 }}>{option.value}</span>
                        <span style={{ fontSize: '12px', color: '#666' }}>({option.count})</span>
                      </label>
                    ))}
                  </div>
                ) : enabledFilters.includes(activeFilter) ? (
                  <p style={{ color: '#666', fontSize: '14px' }}>
                    Loading filter options...
                  </p>
                ) : (
                  <p style={{ color: '#666', fontSize: '14px' }}>
                    No filter options available
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <main style={{ 
        flex: 1, 
        padding: isMobile ? '16px' : '24px', 
        backgroundColor: '#fff',
        marginLeft: isMobile ? 0 : (activeFilter && activeFilter !== 'Refine Search' ? '560px' : '280px')
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
            <button 
              onClick={() => {
                setAppliedFilters({})
                setEnabledFilters([])
                setSearchQuery('')
                updateURL({ search: '', enabled_filters: '', from: '0' })
              }}
              style={{ 
                color: '#dc2626',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '14px'
              }}
            >
              Clear All
            </button>
          </div>

          {/* Active filters display */}
          {(searchQuery || enabledFilters.length > 0) && (
            <div style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {searchQuery && (
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: '#e0e0e0',
                  borderRadius: '16px',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  Search: {searchQuery}
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      updateURL({ search: '' })
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px',
                      lineHeight: '1'
                    }}
                  >
                    ×
                  </button>
                </span>
              )}
              {enabledFilters.map(filter => (
                <span key={filter} style={{
                  padding: '4px 12px',
                  backgroundColor: '#e0e0e0',
                  borderRadius: '16px',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  {filterCategories.find(f => f.param === filter)?.name || filter}
                  <button
                    onClick={() => {
                      const newFilters = enabledFilters.filter(f => f !== filter)
                      const newRanges = enabledRanges.filter(r => r !== filter)
                      setEnabledFilters(newFilters)
                      setEnabledRanges(newRanges)
                      updateURL({ 
                        enabled_filters: newFilters.join('---'),
                        enabled_ranges: newRanges.join('---')
                      })
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px',
                      lineHeight: '1'
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

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
                          color: product.availability || product.inStock !== false ? '#10b981' : '#ef4444'
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
                onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
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
                onClick={() => handlePageChange(currentPage + 1)}
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