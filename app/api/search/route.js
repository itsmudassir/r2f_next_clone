import { NextResponse } from 'next/server'

// Proxy endpoint for RIGHT2FIX search API
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  
  // Build query string from search params
  const queryString = searchParams.toString()
  
  try {
    // Call RIGHT2FIX API
    const response = await fetch(
      `https://right2fixapps.com/search_pg_one?${queryString}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        }
      }
    )
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }
    
    const data = await response.json()
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch search results' },
      { status: 500 }
    )
  }
}