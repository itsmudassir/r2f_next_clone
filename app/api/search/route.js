import { NextResponse } from 'next/server'

// Complete implementation of RIGHT2FIX search_pg_one API
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  
  // Extract and validate parameters based on actual API usage
  const refine_search = searchParams.get('refine_search') || searchParams.get('search') || ''
  const hitsSize = parseInt(searchParams.get('hitsSize') || searchParams.get('size') || '20')
  const from = parseInt(searchParams.get('from') || searchParams.get('offset') || '0')
  
  // Additional parameters that might be used
  const sort = searchParams.get('sort') || ''
  const filter = searchParams.get('filter') || ''
  
  try {
    // Build query parameters exactly as RIGHT2FIX expects
    const queryParams = new URLSearchParams()
    
    // Always include hitsSize and from
    queryParams.set('hitsSize', hitsSize.toString())
    queryParams.set('from', from.toString())
    
    // Only add refine_search if there's a search query
    if (refine_search) {
      queryParams.set('refine_search', refine_search)
    }
    
    // Add any additional parameters from the original request
    searchParams.forEach((value, key) => {
      if (!['refine_search', 'search', 'hitsSize', 'size', 'from', 'offset'].includes(key)) {
        queryParams.set(key, value)
      }
    })
    
    // Build the URL - note the empty parameter before hitsSize
    const apiUrl = refine_search 
      ? `https://right2fixapps.com/search_pg_one?${queryParams.toString()}`
      : `https://right2fixapps.com/search_pg_one?&${queryParams.toString()}`
    
    // Call RIGHT2FIX API with full headers
    const response = await fetch(apiUrl, {
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
    })
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }
    
    const contentType = response.headers.get('content-type')
    let data
    
    // Handle different response types
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      // Handle non-JSON responses
      const text = await response.text()
      try {
        data = JSON.parse(text)
      } catch {
        // If not JSON, return structured error
        return NextResponse.json({
          success: false,
          error: {
            message: 'Invalid response format from API',
            type: 'PARSE_ERROR'
          },
          data: {
            products: [],
            total: 0,
            page: Math.floor(from / hitsSize) + 1,
            pageSize: hitsSize,
            hasMore: false
          }
        })
      }
    }
    
    // Normalize response structure
    const normalizedResponse = {
      success: true,
      query: refine_search,
      pagination: {
        from,
        size: hitsSize,
        page: Math.floor(from / hitsSize) + 1,
        total: data.total || 0,
        hasMore: data.hasMore || false
      },
      data: data
    }
    
    // Add caching headers
    return NextResponse.json(normalizedResponse, {
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate',
      }
    })
    
  } catch (error) {
    console.error('Search API error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        message: error.message,
        type: 'API_ERROR'
      },
      query: refine_search,
      pagination: {
        from,
        size: hitsSize,
        page: Math.floor(from / hitsSize) + 1,
        total: 0,
        hasMore: false
      },
      data: {
        products: [],
        total: 0
      }
    }, { status: 500 })
  }
}

// POST method for compatibility
export async function POST(request) {
  try {
    const body = await request.json()
    
    // Create URL with parameters from body
    const url = new URL(request.url)
    
    // Map common parameter variations
    const search = body.refine_search || body.search || body.query || body.q || ''
    const size = body.hitsSize || body.size || body.limit || 20
    const offset = body.from || body.offset || body.skip || 0
    
    if (search) {
      url.searchParams.set('refine_search', search)
    }
    url.searchParams.set('hitsSize', size.toString())
    url.searchParams.set('from', offset.toString())
    
    // Add any additional parameters
    Object.keys(body).forEach(key => {
      if (!['refine_search', 'search', 'query', 'q', 'hitsSize', 'size', 'limit', 'from', 'offset', 'skip'].includes(key)) {
        url.searchParams.set(key, body[key])
      }
    })
    
    // Call the GET handler
    return GET(new Request(url))
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: {
        message: 'Invalid request body',
        type: 'REQUEST_ERROR'
      },
      data: {
        products: [],
        total: 0
      }
    }, { status: 400 })
  }
}