import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Only apply to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const url = request.nextUrl.clone()
    
    // Get the real client IP from Cloudflare headers
    const clientIP = 
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      request.ip ||
      'unknown'

    // Create new headers to pass to the API
    const requestHeaders = new Headers(request.headers)
    
    // Set multiple headers to ensure the real IP gets through
    requestHeaders.set('x-real-ip', clientIP)
    requestHeaders.set('x-client-ip', clientIP)
    requestHeaders.set('x-original-ip', clientIP)
    
    // Preserve existing x-forwarded-for or add the client IP
    const existingForwarded = request.headers.get('x-forwarded-for')
    if (existingForwarded) {
      requestHeaders.set('x-forwarded-for', `${clientIP}, ${existingForwarded}`)
    } else {
      requestHeaders.set('x-forwarded-for', clientIP)
    }

    console.log(`🌐 [Middleware] Client IP: ${clientIP}`)
    console.log(`🔍 [Middleware] CF-Connecting-IP: ${request.headers.get('cf-connecting-ip')}`)
    console.log(`📡 [Middleware] X-Forwarded-For: ${request.headers.get('x-forwarded-for')}`)

    // Create the new request with updated headers
    return NextResponse.rewrite(url, {
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
