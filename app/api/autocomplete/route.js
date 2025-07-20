import { NextResponse } from 'next/server'

// Proxy endpoint for RIGHT2FIX autocomplete API
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')
  
  if (!search) {
    return NextResponse.json({ suggestions: [] })
  }
  
  try {
    // Call RIGHT2FIX autocomplete API
    const response = await fetch(
      `https://right2fixapps.com/search_completion?search=${encodeURIComponent(search)}`,
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
    console.error('Autocomplete API error:', error)
    return NextResponse.json(
      { suggestions: [] },
      { status: 200 } // Return empty suggestions on error
    )
  }
}