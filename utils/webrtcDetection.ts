// Detección de IP real usando WebRTC (bypass VPN/Proxy)
export interface WebRTCResult {
  success: boolean
  ips: string[]
  localIPs: string[]
  publicIPs: string[]
  error?: string
  timestamp: number
}

// Función principal para obtener IPs reales via WebRTC
export async function detectRealIP(): Promise<WebRTCResult> {
  return new Promise((resolve) => {
    const result: WebRTCResult = {
      success: false,
      ips: [],
      localIPs: [],
      publicIPs: [],
      timestamp: Date.now()
    }

    try {
      // Verificar soporte de WebRTC
      if (!window.RTCPeerConnection && !(window as any).webkitRTCPeerConnection && !(window as any).mozRTCPeerConnection) {
        result.error = 'WebRTC no soportado'
        resolve(result)
        return
      }

      const RTCPeerConnection = window.RTCPeerConnection || 
                               (window as any).webkitRTCPeerConnection || 
                               (window as any).mozRTCPeerConnection

      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
          { urls: 'stun:stun.cloudflare.com:3478' },
          { urls: 'stun:stun.nextcloud.com:443' }
        ]
      })

      const ips = new Set<string>()
      const timeout = setTimeout(() => {
        pc.close()
        processIPs()
      }, 3000) // Timeout de 3 segundos

      // Capturar candidatos ICE
      pc.onicecandidate = (ice) => {
        if (ice.candidate) {
          const candidate = ice.candidate.candidate
          const ipMatch = candidate.match(/([0-9]{1,3}\.){3}[0-9]{1,3}/)
          
          if (ipMatch) {
            const ip = ipMatch[0]
            ips.add(ip)
            console.log('🔍 WebRTC IP detectada:', ip)
          }
        }
      }

      // Crear data channel para forzar conexión
      pc.createDataChannel('ip-detection')

      // Crear offer
      pc.createOffer().then(offer => {
        pc.setLocalDescription(offer)
      }).catch(error => {
        console.error('Error creating WebRTC offer:', error)
        clearTimeout(timeout)
        result.error = error.message
        resolve(result)
      })

      const processIPs = () => {
        clearTimeout(timeout)
        
        const allIPs = Array.from(ips)
        result.ips = allIPs
        result.success = allIPs.length > 0

        // Clasificar IPs
        allIPs.forEach(ip => {
          if (isPrivateIP(ip)) {
            result.localIPs.push(ip)
          } else {
            result.publicIPs.push(ip)
          }
        })

        console.log('🌐 WebRTC Detection Result:', {
          total: allIPs.length,
          public: result.publicIPs.length,
          local: result.localIPs.length
        })

        resolve(result)
      }

      // Fallback si no hay candidatos en 3 segundos
      setTimeout(processIPs, 3000)

    } catch (error) {
      result.error = error instanceof Error ? error.message : 'Error desconocido'
      resolve(result)
    }
  })
}

// Verificar si una IP es privada
function isPrivateIP(ip: string): boolean {
  const privateRanges = [
    /^10\./,                      // 10.0.0.0/8
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // 172.16.0.0/12
    /^192\.168\./,                // 192.168.0.0/16
    /^127\./,                     // 127.0.0.0/8 (localhost)
    /^169\.254\./,                // 169.254.0.0/16 (link-local)
    /^0\./,                       // 0.0.0.0/8
    /^224\./,                     // 224.0.0.0/4 (multicast)
    /^255\./                      // 255.0.0.0/8 (broadcast)
  ]
  
  return privateRanges.some(range => range.test(ip))
}

// Detectar múltiples técnicas de fingerprinting
export async function getClientFingerprint() {
  const webrtc = await detectRealIP()
  
  const fingerprint = {
    webrtc,
    browser: {
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      hardwareConcurrency: navigator.hardwareConcurrency
    },
    screen: {
      width: screen.width,
      height: screen.height,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight
    },
    timezone: {
      offset: new Date().getTimezoneOffset(),
      zone: Intl.DateTimeFormat().resolvedOptions().timeZone
    },
    canvas: getCanvasFingerprint(),
    webgl: getWebGLFingerprint(),
    audio: await getAudioFingerprint(),
    timestamp: Date.now()
  }

  return fingerprint
}

// Canvas fingerprinting
function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return 'no-canvas'
    
    canvas.width = 200
    canvas.height = 50
    
    // Dibujar texto con diferentes fuentes y colores
    ctx.textBaseline = 'top'
    ctx.font = '14px Arial'
    ctx.fillStyle = '#f60'
    ctx.fillRect(125, 1, 62, 20)
    ctx.fillStyle = '#069'
    ctx.fillText('TuSecreto 🤫', 2, 15)
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)'
    ctx.fillText('Fingerprint Test', 4, 30)
    
    return canvas.toDataURL().substring(22, 82) // Hash parcial
  } catch {
    return 'canvas-error'
  }
}

// WebGL fingerprinting
function getWebGLFingerprint(): string {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    
    if (!gl) return 'no-webgl'
    
    // Cast to WebGLRenderingContext for TypeScript
    const webgl = gl as WebGLRenderingContext
    const debugInfo = webgl.getExtension('WEBGL_debug_renderer_info')
    if (debugInfo) {
      const vendor = webgl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
      const renderer = webgl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      return `${vendor}|${renderer}`.substring(0, 50)
    }
    
    return 'webgl-limited'
  } catch {
    return 'webgl-error'
  }
}

// Audio fingerprinting
async function getAudioFingerprint(): Promise<string> {
  try {
    if (!window.AudioContext && !(window as any).webkitAudioContext) {
      return 'no-audio'
    }
    
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioCtx.createOscillator()
    const analyser = audioCtx.createAnalyser()
    const gain = audioCtx.createGain()
    const scriptProcessor = audioCtx.createScriptProcessor(4096, 1, 1)
    
    gain.gain.value = 0 // Silenciar
    oscillator.type = 'triangle'
    oscillator.frequency.value = 10000
    
    oscillator.connect(analyser)
    analyser.connect(scriptProcessor)
    scriptProcessor.connect(gain)
    gain.connect(audioCtx.destination)
    
    oscillator.start()
    
    return new Promise((resolve) => {
      let hash = 0
      
      scriptProcessor.onaudioprocess = (event) => {
        const data = event.inputBuffer.getChannelData(0)
        for (let i = 0; i < data.length; i++) {
          hash += Math.abs(data[i])
        }
        
        oscillator.stop()
        audioCtx.close()
        resolve(hash.toString(36).substring(0, 20))
      }
      
      setTimeout(() => {
        try { oscillator.stop() } catch {}
        try { audioCtx.close() } catch {}
        resolve('audio-timeout')
      }, 1000)
    })
  } catch {
    return 'audio-error'
  }
}

// Hook de React para usar la detección
export function useWebRTCDetection() {
  const [result, setResult] = React.useState<WebRTCResult | null>(null)
  const [loading, setLoading] = React.useState(false)
  
  const detect = async () => {
    setLoading(true)
    try {
      const webrtcResult = await detectRealIP()
      setResult(webrtcResult)
      return webrtcResult
    } finally {
      setLoading(false)
    }
  }
  
  return { result, loading, detect }
}

// Importar React para el hook
import React from 'react'