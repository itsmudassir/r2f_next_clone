'use client'

import { useState, useEffect } from 'react'

export default function InterchangesList({ productId, productUrl }) {
  const [interchanges, setInterchanges] = useState([])
  const [relatedParts, setRelatedParts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('interchanges')

  useEffect(() => {
    if (productId || productUrl) {
      fetchInterchanges()
    }
  }, [productId, productUrl])

  const fetchInterchanges = async () => {
    setLoading(true)
    setError(null)

    try {
      // Use productId or productUrl as id_codes
      const idCodes = productId || productUrl || ''
      
      const response = await fetch(
        `/api/interchanges?req_type=intpage&id_codes=${encodeURIComponent(idCodes)}&dummy=no`
      )
      
      const data = await response.json()

      if (data.success) {
        setInterchanges(data.data.interchanges || [])
        setRelatedParts(data.data.related_parts || data.data.products || [])
      } else {
        setError(data.error?.message || 'Failed to load interchanges')
      }
    } catch (err) {
      console.error('Interchanges error:', err)
      setError('Failed to load interchange parts')
    } finally {
      setLoading(false)
    }
  }

  if (!productId && !productUrl) {
    return null
  }

  return (
    <div style={{
      backgroundColor: '#fff',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '20px',
      marginTop: '24px'
    }}>
      <h2 style={{
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '20px'
      }}>
        Interchange Parts & Related Items
      </h2>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '2px solid #e0e0e0',
        marginBottom: '20px'
      }}>
        <button
          onClick={() => setActiveTab('interchanges')}
          style={{
            padding: '12px 24px',
            border: 'none',
            backgroundColor: 'transparent',
            fontWeight: activeTab === 'interchanges' ? '600' : '400',
            color: activeTab === 'interchanges' ? '#000' : '#666',
            borderBottom: activeTab === 'interchanges' ? '2px solid #000' : 'none',
            marginBottom: '-2px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Interchanges ({interchanges.length})
        </button>
        <button
          onClick={() => setActiveTab('related')}
          style={{
            padding: '12px 24px',
            border: 'none',
            backgroundColor: 'transparent',
            fontWeight: activeTab === 'related' ? '600' : '400',
            color: activeTab === 'related' ? '#000' : '#666',
            borderBottom: activeTab === 'related' ? '2px solid #000' : 'none',
            marginBottom: '-2px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Related Parts ({relatedParts.length})
        </button>
      </div>

      {/* Content */}
      {loading && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '40px',
          color: '#666'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid #f0f0f0',
              borderTopColor: '#666',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 16px'
            }} />
            <p>Loading interchange parts...</p>
          </div>
        </div>
      )}

      {error && (
        <div style={{
          padding: '20px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '4px',
          color: '#dc2626'
        }}>
          <p style={{ fontWeight: '500', marginBottom: '8px' }}>Error</p>
          <p>{error}</p>
          <button
            onClick={fetchInterchanges}
            style={{
              marginTop: '12px',
              padding: '8px 16px',
              backgroundColor: '#dc2626',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div>
          {activeTab === 'interchanges' && (
            <div>
              {interchanges.length === 0 ? (
                <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
                  No interchange parts found
                </p>
              ) : (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {interchanges.map((part, index) => (
                    <PartCard key={index} part={part} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'related' && (
            <div>
              {relatedParts.length === 0 ? (
                <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
                  No related parts found
                </p>
              ) : (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {relatedParts.map((part, index) => (
                    <PartCard key={index} part={part} />
                  ))}
                </div>
              )}
            </div>
          )}
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

// Part card component
function PartCard({ part }) {
  return (
    <div style={{
      padding: '16px',
      border: '1px solid #e0e0e0',
      borderRadius: '6px',
      backgroundColor: '#f9f9f9',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
      e.currentTarget.style.transform = 'translateY(-1px)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = 'none'
      e.currentTarget.style.transform = 'translateY(0)'
    }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>
            {part.part_number || part.id || part.sku || 'Unknown Part'}
          </h4>
          {part.brand && (
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '4px' }}>
              Brand: {part.brand}
            </p>
          )}
          {part.title && (
            <p style={{ fontSize: '14px', color: '#333' }}>
              {part.title}
            </p>
          )}
        </div>
        {part.price && (
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '20px', fontWeight: '600', color: '#dc2626' }}>
              ${part.price}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}