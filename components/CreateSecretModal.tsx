import { useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { FiX, FiEdit3, FiSend, FiAlertTriangle, FiShield, FiWifi } from 'react-icons/fi'
import { useTheme } from '../contexts/ThemeContext'
import { detectRealIP, getClientFingerprint } from '../utils/webrtcDetection'

interface CreateSecretModalProps {
  onClose: () => void
  onSecretCreated: () => void
}

export default function CreateSecretModal({ onClose, onSecretCreated }: CreateSecretModalProps) {
  const { theme } = useTheme()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [vpnBlocked, setVpnBlocked] = useState(false)
  const [webrtcResult, setWebrtcResult] = useState<any>(null)

  // Detectar WebRTC y verificar VPN al abrir modal (en segundo plano)
  useEffect(() => {
    const checkConnection = async () => {
      try {
        console.log('🔍 Iniciando detección WebRTC en segundo plano...')
        
        // Obtener fingerprint completo del cliente
        const fingerprint = await getClientFingerprint()
        setWebrtcResult(fingerprint.webrtc)
        
        console.log('📊 Fingerprint obtenido:', {
          webrtcIPs: fingerprint.webrtc.publicIPs,
          localIPs: fingerprint.webrtc.localIPs
        })
        
        // Enviar fingerprint al servidor
        await axios.post('/api/fingerprint/submit', fingerprint)
        
        // Verificar específicamente para creación de secreto
        if (fingerprint.webrtc.publicIPs.length > 0) {
          const verifyResponse = await axios.post('/api/fingerprint/verify', 
            { webrtcIPs: fingerprint.webrtc.publicIPs },
            { headers: { Authorization: `Bearer ${Cookies.get('token')}` } }
          )
          
          if (!verifyResponse.data.success) {
            setVpnBlocked(true)
            setError(verifyResponse.data.message)
          }
        }
        
      } catch (error: any) {
        console.error('Error en verificación WebRTC:', error)
        if (error.response?.status === 403) {
          setVpnBlocked(true)
          setError(error.response.data.message || 'VPN/Proxy detectado')
        }
      }
      // No se cambia vpnChecking a false aquí, se quita el estado visual
    }

    checkConnection()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Bloquear si VPN detectado
    if (vpnBlocked) {
      setError('No se puede crear el secreto: VPN/Proxy detectado')
      return
    }
    
    setLoading(true)
    setError('')

    try {
      const token = Cookies.get('token')
      await axios.post('/api/secrets', 
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      onSecretCreated()
    } catch (error: any) {
      if (error.response?.status === 403 && error.response?.data?.code === 'VPN_DETECTED') {
        setVpnBlocked(true)
        setError('🚫 VPN/Proxy detectado. Por seguridad, no se permite crear secretos con VPN activado.')
      } else {
        setError(error.response?.data?.message || 'Error al crear el secreto')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 z-[9999]">
        <div className="rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto border transition-colors duration-300 p-5" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <FiEdit3 className="animate-bounce" />
              Compartir Secreto
            </h2>
            <button
              onClick={onClose}
              className="transition-all duration-300 hover:rotate-90 hover:scale-110"
              style={{ color: 'var(--text-secondary)' }}
            >
              <FiX size={24} />
            </button>
          </div>

        {/* Bloqueo por VPN */}
        {vpnBlocked && (
          <div className="rounded-lg p-4 mb-4 border-2 border-red-500 bg-red-500/10">
            <div className="flex items-start gap-3">
              <FiWifi size={20} className="text-red-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-500 mb-2">
                  🚫 VPN/Proxy Detectado
                </h3>
                <p className="text-sm text-red-400 mb-3">
                  Por seguridad y para mantener la autenticidad de los contenidos, no se permite el uso de VPNs, proxies o redes Tor en esta plataforma.
                </p>
                <div className="text-xs text-red-300 space-y-1">
                  {webrtcResult?.publicIPs?.length > 0 && (
                    <p>• IPs detectadas: {webrtcResult.publicIPs.length}</p>
                  )}
                  <p>• Para crear secretos necesitas una conexión directa</p>
                  <p>• Desconecta cualquier VPN o proxy y recarga la página</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Título del Secreto
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none transition-colors duration-300"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-primary)',
                color: 'var(--text-primary)'
              }}
              placeholder="Un título llamativo para tu secreto"
              required
              maxLength={100}
            />
            <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
              {title.length}/100 caracteres
            </div>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              Contenido del Secreto
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none resize-none transition-colors duration-300"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-primary)',
                color: 'var(--text-primary)'
              }}
              placeholder="Comparte tu secreto aquí... Recuerda que será visible para todos los usuarios."
              required
              maxLength={2000}
            />
            <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
              {content.length}/2000 caracteres
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="rounded-lg p-4 text-sm transition-colors duration-300" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
            <h3 className="font-medium mb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <FiAlertTriangle size={18} className="animate-pulse text-yellow-400" />
              Importante:
            </h3>
            <ul className="space-y-1 text-xs">
              <li>• Tu secreto será visible públicamente</li>
              <li>• No incluyas información personal identificable</li>
              <li>• Respeta las normas de la comunidad</li>
              <li>• El contenido inapropiado será eliminado</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-primary)'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim() || !content.trim() || vpnBlocked}
              className="flex-1 py-2 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-105"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'var(--text-on-accent)'
              }}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2" style={{ borderColor: 'var(--text-on-accent)' }}></div>
                  Publicando...
                </>
              ) : (
                <>
                  <FiSend size={16} className="group-hover:translate-x-1 transition-transform" />
                  Publicar Secreto
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}