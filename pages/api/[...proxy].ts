import type { NextRequest } from 'next/server'

// Configure for Edge Runtime
export const runtime = 'experimental-edge'

export default async function handler(req: NextRequest) {
  try {
    // Get the API path from the URL
    const url = new URL(req.url)
    const path = url.pathname.replace('/api/', '')
    
    // Get real client IP from Cloudflare headers
    const realIP = 
      req.headers.get('cf-connecting-ip') ||
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      req.ip ||
      'unknown'

    console.log(`🌐 [Proxy] Real Client IP: ${realIP}`)
    console.log(`🔍 [Proxy] CF-Connecting-IP: ${req.headers.get('cf-connecting-ip')}`)
    console.log(`📡 [Proxy] Original X-Forwarded-For: ${req.headers.get('x-forwarded-for')}`)
    console.log(`🎯 [Proxy] Target path: /api/${path}`)

    // Create target URL
    const targetUrl = `https://belize-because-things-scroll.trycloudflare.com/api/${path}${url.search}`

    // Create headers for the backend request
    const headers = new Headers()
    
    // Copy relevant headers from original request
    req.headers.forEach((value, key) => {
      if (![
        'host', 
        'cf-connecting-ip', 
        'x-forwarded-for', 
        'x-real-ip',
        'connection'
      ].includes(key.toLowerCase())) {
        headers.set(key, value)
      }
    })

    // Set the real IP in multiple headers to ensure it gets through
    headers.set('x-original-ip', realIP)
    headers.set('x-real-ip', realIP)
    headers.set('x-client-ip', realIP)
    
    // Set X-Forwarded-For with real IP at the front
    const existingForwarded = req.headers.get('x-forwarded-for')
    if (existingForwarded) {
      headers.set('x-forwarded-for', `${realIP}, ${existingForwarded}`)
    } else {
      headers.set('x-forwarded-for', realIP)
    }

    // Preserve Cloudflare's connecting IP header
    const cfConnectingIP = req.headers.get('cf-connecting-ip')
    if (cfConnectingIP) {
      headers.set('cf-connecting-ip', cfConnectingIP)
    }

    console.log(`✅ [Proxy] Forwarding to: ${targetUrl}`)
    console.log(`✅ [Proxy] With IP headers:`, {
      'x-original-ip': realIP,
      'x-real-ip': realIP,
      'x-client-ip': realIP,
      'x-forwarded-for': headers.get('x-forwarded-for')
    })

    // Forward the request
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    })

    // Create response headers
    const responseHeaders = new Headers()
    response.headers.forEach((value, key) => {
      responseHeaders.set(key, value)
    })

    // Return the response
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    })

  } catch (error) {
    console.error('🚨 [Proxy] Error:', error)
    return new Response(JSON.stringify({
      error: 'Proxy error',
      message: 'Error connecting to backend API',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
