'use client'

import { useState } from 'react'

export default function ApiTestPage() {
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState({})

  // Test search_pg_one API
  const testSearchApi = async (scenario) => {
    setLoading(prev => ({ ...prev, [scenario]: true }))
    
    let url
    switch (scenario) {
      case 'initial':
        url = '/api/search?hitsSize=20&from=0'
        break
      case 'search':
        url = '/api/search?refine_search=brake%20pads&hitsSize=20&from=0'
        break
      case 'pagination':
        url = '/api/search?refine_search=oil%20filter&hitsSize=10&from=20'
        break
    }

    try {
      const response = await fetch(url)
      const data = await response.json()
      setResults(prev => ({ ...prev, [`search_${scenario}`]: data }))
    } catch (error) {
      setResults(prev => ({ ...prev, [`search_${scenario}`]: { error: error.message } }))
    } finally {
      setLoading(prev => ({ ...prev, [scenario]: false }))
    }
  }

  // Test search_completion API
  const testAutocompleteApi = async (query) => {
    setLoading(prev => ({ ...prev, autocomplete: true }))
    
    try {
      const response = await fetch(`/api/autocomplete?search=${encodeURIComponent(query)}`)
      const data = await response.json()
      setResults(prev => ({ ...prev, autocomplete: data }))
    } catch (error) {
      setResults(prev => ({ ...prev, autocomplete: { error: error.message } }))
    } finally {
      setLoading(prev => ({ ...prev, autocomplete: false }))
    }
  }

  // Test search_pg_three API
  const testInterchangesApi = async (productId) => {
    setLoading(prev => ({ ...prev, interchanges: true }))
    
    try {
      const response = await fetch(`/api/interchanges?req_type=intpage&id_codes=${productId}&dummy=no`)
      const data = await response.json()
      setResults(prev => ({ ...prev, interchanges: data }))
    } catch (error) {
      setResults(prev => ({ ...prev, interchanges: { error: error.message } }))
    } finally {
      setLoading(prev => ({ ...prev, interchanges: false }))
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        RIGHT2FIX API Test Suite
      </h1>

      {/* search_pg_one Tests */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
          1. search_pg_one API Tests
        </h2>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={() => testSearchApi('initial')}
            disabled={loading.initial}
            style={{
              padding: '8px 16px',
              backgroundColor: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: loading.initial ? 'not-allowed' : 'pointer',
              opacity: loading.initial ? 0.5 : 1
            }}
          >
            Test Initial Load
          </button>
          
          <button
            onClick={() => testSearchApi('search')}
            disabled={loading.search}
            style={{
              padding: '8px 16px',
              backgroundColor: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: loading.search ? 'not-allowed' : 'pointer',
              opacity: loading.search ? 0.5 : 1
            }}
          >
            Test Search (brake pads)
          </button>
          
          <button
            onClick={() => testSearchApi('pagination')}
            disabled={loading.pagination}
            style={{
              padding: '8px 16px',
              backgroundColor: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: loading.pagination ? 'not-allowed' : 'pointer',
              opacity: loading.pagination ? 0.5 : 1
            }}
          >
            Test Pagination
          </button>
        </div>

        {['initial', 'search', 'pagination'].map(scenario => (
          results[`search_${scenario}`] && (
            <div key={scenario} style={{ marginBottom: '16px' }}>
              <h3 style={{ fontWeight: '600' }}>
                {scenario.charAt(0).toUpperCase() + scenario.slice(1)} Results:
              </h3>
              <pre style={{
                backgroundColor: '#f5f5f5',
                padding: '12px',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '12px'
              }}>
                {JSON.stringify(results[`search_${scenario}`], null, 2)}
              </pre>
            </div>
          )
        ))}
      </section>

      {/* search_completion Tests */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
          2. search_completion API Test
        </h2>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input
            type="text"
            id="autocompleteInput"
            placeholder="Type to test autocomplete..."
            style={{
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              flex: 1,
              maxWidth: '300px'
            }}
          />
          <button
            onClick={() => {
              const input = document.getElementById('autocompleteInput')
              testAutocompleteApi(input.value)
            }}
            disabled={loading.autocomplete}
            style={{
              padding: '8px 16px',
              backgroundColor: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: loading.autocomplete ? 'not-allowed' : 'pointer',
              opacity: loading.autocomplete ? 0.5 : 1
            }}
          >
            Test Autocomplete
          </button>
        </div>

        {results.autocomplete && (
          <div>
            <h3 style={{ fontWeight: '600' }}>Autocomplete Results:</h3>
            <pre style={{
              backgroundColor: '#f5f5f5',
              padding: '12px',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '12px'
            }}>
              {JSON.stringify(results.autocomplete, null, 2)}
            </pre>
          </div>
        )}
      </section>

      {/* search_pg_three Tests */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
          3. search_pg_three (Interchanges) API Test
        </h2>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input
            type="text"
            id="productIdInput"
            placeholder="Enter product ID (e.g., 39278)"
            defaultValue="39278"
            style={{
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              flex: 1,
              maxWidth: '300px'
            }}
          />
          <button
            onClick={() => {
              const input = document.getElementById('productIdInput')
              testInterchangesApi(input.value)
            }}
            disabled={loading.interchanges}
            style={{
              padding: '8px 16px',
              backgroundColor: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: loading.interchanges ? 'not-allowed' : 'pointer',
              opacity: loading.interchanges ? 0.5 : 1
            }}
          >
            Test Interchanges
          </button>
        </div>

        {results.interchanges && (
          <div>
            <h3 style={{ fontWeight: '600' }}>Interchanges Results:</h3>
            <pre style={{
              backgroundColor: '#f5f5f5',
              padding: '12px',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '12px'
            }}>
              {JSON.stringify(results.interchanges, null, 2)}
            </pre>
          </div>
        )}
      </section>

      {/* API Summary */}
      <section style={{
        backgroundColor: '#f0f0f0',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
          API Implementation Summary
        </h2>
        <ul style={{ marginLeft: '20px' }}>
          <li><strong>/api/search</strong> - Proxies to search_pg_one</li>
          <li><strong>/api/autocomplete</strong> - Proxies to search_completion</li>
          <li><strong>/api/interchanges</strong> - Proxies to search_pg_three</li>
        </ul>
        <p style={{ marginTop: '12px', fontSize: '14px', color: '#666' }}>
          All APIs include proper error handling, response normalization, and support both GET and POST methods.
        </p>
      </section>
    </div>
  )
}