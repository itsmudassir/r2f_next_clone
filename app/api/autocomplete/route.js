import { NextResponse } from 'next/server'

// Complete implementation of RIGHT2FIX search_completion API
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')
  
  if (!search) {
    return NextResponse.json({ 
      success: true,
      query: '',
      suggestions: [],
      count: 0 
    })
  }
  
  try {
    // Call RIGHT2FIX autocomplete API with full headers
    const response = await fetch(
      `https://right2fixapps.com/search_completion?search=${encodeURIComponent(search)}`,
      {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://right2fix.com/',
          'Origin': 'https://right2fix.com',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        }
      }
    )
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }
    
    const contentType = response.headers.get('content-type')
    let data
    
    // Handle different response types
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      // If response is plain text, parse it
      const text = await response.text()
      try {
        data = JSON.parse(text)
      } catch {
        // If not JSON, assume it's a list of suggestions
        data = text.split('\n').filter(Boolean)
      }
    }
    
    // Normalize response format
    let normalizedResponse
    
    if (Array.isArray(data)) {
      // If data is array, it's direct suggestions
      normalizedResponse = {
        success: true,
        query: search,
        suggestions: data.map(item => {
          if (typeof item === 'string') {
            return {
              text: item,
              value: item,
              type: 'search'
            }
          }
          return item
        }),
        count: data.length
      }
    } else if (data.suggestions) {
      // If data has suggestions property
      normalizedResponse = {
        success: true,
        query: search,
        suggestions: data.suggestions,
        count: data.suggestions.length,
        ...data // Include any additional fields
      }
    } else {
      // Fallback format
      normalizedResponse = {
        success: true,
        query: search,
        suggestions: [],
        count: 0,
        data: data
      }
    }
    
    // Add response headers for CORS if needed
    return NextResponse.json(normalizedResponse, {
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate',
      }
    })
    
  } catch (error) {
    console.error('Autocomplete API error:', error)
    
    // Return structured error response
    return NextResponse.json({
      success: false,
      query: search,
      suggestions: [],
      count: 0,
      error: {
        message: error.message,
        type: 'API_ERROR'
      }
    }, { 
      status: 200 // Return 200 to prevent client errors
    })
  }
}

// POST method for compatibility
export async function POST(request) {
  try {
    const body = await request.json()
    const search = body.search || body.query || body.q
    
    // Create a new request with search params
    const url = new URL(request.url)
    url.searchParams.set('search', search || '')
    
    // Call the GET handler
    return GET(new Request(url))
  } catch (error) {
    return NextResponse.json({
      success: false,
      suggestions: [],
      count: 0,
      error: {
        message: 'Invalid request body',
        type: 'REQUEST_ERROR'
      }
    }, { status: 400 })
  }
}