import { NextResponse } from 'next/server'

// Complete implementation of RIGHT2FIX search_pg_three API (Interchanges/Related Parts)
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  
  // Extract parameters
  const req_type = searchParams.get('req_type') || 'intpage'
  const id_codes = searchParams.get('id_codes') || searchParams.get('id') || ''
  const dummy = searchParams.get('dummy') || 'no'
  
  // Additional parameters that might be used
  const page = searchParams.get('page') || '1'
  const limit = searchParams.get('limit') || '20'
  
  if (!id_codes && req_type === 'intpage') {
    return NextResponse.json({ 
      success: false,
      error: {
        message: 'id_codes parameter is required for interchange requests',
        type: 'MISSING_PARAMETER'
      },
      data: {
        interchanges: [],
        related_parts: [],
        total_count: 0
      }
    }, { status: 400 })
  }
  
  try {
    // Build query parameters
    const queryParams = new URLSearchParams({
      req_type,
      id_codes,
      dummy
    })
    
    // Add any additional parameters passed
    searchParams.forEach((value, key) => {
      if (!['req_type', 'id_codes', 'dummy'].includes(key)) {
        queryParams.set(key, value)
      }
    })
    
    // Call RIGHT2FIX API
    const response = await fetch(
      `https://right2fixapps.com/search_pg_three?${queryParams.toString()}`,
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
      // Handle HTML or text responses
      const text = await response.text()
      
      // Try to parse as JSON first
      try {
        data = JSON.parse(text)
      } catch {
        // If not JSON, might be HTML - extract data
        data = parseHtmlResponse(text)
      }
    }
    
    // Normalize response structure
    const normalizedResponse = normalizeInterchangeData(data, {
      req_type,
      id_codes,
      page: parseInt(page),
      limit: parseInt(limit)
    })
    
    return NextResponse.json(normalizedResponse, {
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
      }
    })
    
  } catch (error) {
    console.error('Interchanges API error:', error)
    
    return NextResponse.json({
      success: false,
      error: {
        message: error.message,
        type: 'API_ERROR'
      },
      data: {
        interchanges: [],
        related_parts: [],
        total_count: 0
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
    const req_type = body.req_type || body.reqType || body.type || 'intpage'
    const id_codes = body.id_codes || body.idCodes || body.id || body.productId || ''
    const dummy = body.dummy || 'no'
    
    url.searchParams.set('req_type', req_type)
    url.searchParams.set('id_codes', id_codes)
    url.searchParams.set('dummy', dummy)
    
    // Add any additional parameters
    Object.keys(body).forEach(key => {
      if (!['req_type', 'reqType', 'type', 'id_codes', 'idCodes', 'id', 'productId', 'dummy'].includes(key)) {
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
        interchanges: [],
        related_parts: [],
        total_count: 0
      }
    }, { status: 400 })
  }
}

// Helper function to parse HTML responses (if API returns HTML)
function parseHtmlResponse(html) {
  // Basic parsing logic - would need to be enhanced based on actual response format
  const data = {
    interchanges: [],
    related_parts: [],
    products: []
  }
  
  // Look for JSON data embedded in HTML
  const jsonMatch = html.match(/<script[^>]*>window\.__INITIAL_DATA__\s*=\s*({[^<]+})<\/script>/)
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1])
    } catch (e) {
      console.error('Failed to parse embedded JSON:', e)
    }
  }
  
  return data
}

// Helper function to normalize interchange data
function normalizeInterchangeData(data, params) {
  // If data is already normalized
  if (data.success !== undefined) {
    return data
  }
  
  // Build normalized response
  const response = {
    success: true,
    request: params,
    data: {
      interchanges: [],
      related_parts: [],
      products: [],
      total_count: 0,
      page: params.page,
      limit: params.limit,
      has_more: false
    }
  }
  
  // Handle different data structures
  if (Array.isArray(data)) {
    response.data.products = data
    response.data.total_count = data.length
  } else if (data.interchanges) {
    response.data.interchanges = data.interchanges
    response.data.total_count = data.interchanges.length
  } else if (data.products) {
    response.data.products = data.products
    response.data.total_count = data.total || data.products.length
  } else if (data.items) {
    response.data.products = data.items
    response.data.total_count = data.total || data.items.length
  }
  
  // Copy any additional fields
  Object.keys(data).forEach(key => {
    if (!['interchanges', 'products', 'items', 'total'].includes(key)) {
      response.data[key] = data[key]
    }
  })
  
  // Calculate pagination
  if (response.data.total_count > (params.page * params.limit)) {
    response.data.has_more = true
  }
  
  return response
}