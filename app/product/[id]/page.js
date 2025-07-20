'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import InterchangesList from '../../../components/InterchangesList'

export default function ProductDetailPage({ params }) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // For demo, fetch product details from search API
    fetchProductDetails(params.id)
  }, [params.id])

  const fetchProductDetails = async (productId) => {
    setLoading(true)
    try {
      // First try to get all products and find by ID
      const response = await fetch(`/api/search?hitsSize=100&from=0`)
      const result = await response.json()
      
      if (result.success && result.data?.hits?.hits) {
        // Find the product by _id or id_codes
        const productHit = result.data.hits.hits.find(hit => 
          hit._id === productId || 
          hit._source?.detail_single?.id_codes?.toString() === productId ||
          hit._source?.detail_single?.mpn === productId
        )
        
        if (productHit) {
          const productData = productHit._source?.detail_single || {}
          setProduct({
            id: productId,
            _id: productHit._id,
            ...productData,
            images: productHit._source?.images || [],
            stores: productHit._source?.stores || []
          })
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
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
          <p>Loading product details...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', padding: '40px', textAlign: 'center' }}>
        <h1>Product not found</h1>
        <Link href="/products" style={{ color: '#0066cc' }}>
          Back to products
        </Link>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#000', color: '#fff', padding: '16px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>
            RIGHT2FIX
          </Link>
          <Link href="/products" style={{ color: '#fff', textDecoration: 'none' }}>
            ← Back to products
          </Link>
        </div>
      </header>

      {/* Product Details */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '30px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
            {/* Images */}
            <div>
              <div style={{
                width: '100%',
                aspectRatio: '1',
                backgroundColor: '#f0f0f0',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                overflow: 'hidden'
              }}>
                {product.images?.[0] ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.title || 'Product'} 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '100%', 
                      objectFit: 'contain' 
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.parentElement.innerHTML = '<span style="color: #999">Product Image</span>'
                    }}
                  />
                ) : (
                  <span style={{ color: '#999' }}>No Image</span>
                )}
              </div>
              
              {/* Thumbnail images */}
              {product.images?.length > 1 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {product.images.slice(1, 5).map((img, idx) => (
                    <div key={idx} style={{
                      aspectRatio: '1',
                      backgroundColor: '#f0f0f0',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <img 
                        src={img} 
                        alt={`${product.title} ${idx + 2}`}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover' 
                        }}
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>
                {product.mpn || product.id || 'Unknown Part'}
              </h1>
              <p style={{ fontSize: '20px', color: '#666', marginBottom: '16px' }}>
                {product.brand_name || 'Unknown Brand'}
              </p>
              
              <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>Description</h2>
              <p style={{ marginBottom: '24px', lineHeight: '1.6' }}>
                {product.title || 'No description available'}
              </p>

              {product.category_tree && (
                <div style={{ marginBottom: '16px' }}>
                  <strong>Category:</strong> {product.category_tree}
                </div>
              )}

              <div style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#dc2626',
                marginBottom: '24px'
              }}>
                ${product.min_price || '0.00'}
              </div>

              {/* Store Links */}
              {product.stores && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Available at:</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {product.stores.map(store => (
                      <span key={store} style={{
                        padding: '6px 12px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}>
                        {store}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Ratings */}
              {(product.avg_of_avg_ratings || product.sum_reviews) && (
                <div style={{ 
                  padding: '16px', 
                  backgroundColor: '#f9f9f9', 
                  borderRadius: '6px',
                  marginBottom: '24px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                        {(product.avg_of_avg_ratings || 0).toFixed(1)}
                      </div>
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        {product.sum_reviews || 0} reviews
                      </div>
                    </div>
                    <div style={{ display: 'flex' }}>
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} style={{ 
                          width: '20px', 
                          height: '20px', 
                          color: i < Math.floor(product.avg_of_avg_ratings || 0) ? '#fbbf24' : '#e5e7eb' 
                        }} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Interchanges Section */}
        <InterchangesList 
          productId={product.id_codes || product.id || params.id} 
        />
      </main>
    </div>
  )
}