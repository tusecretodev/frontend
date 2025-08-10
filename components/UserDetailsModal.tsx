import { useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { 
  FiX, FiUser, FiActivity, FiShield, FiGlobe, FiMonitor, FiClock, 
  FiEye, FiHeart, FiMessageCircle, FiFlag, FiWifi, FiAlertTriangle,
  FiCheckCircle, FiXCircle, FiMapPin, FiSmartphone, FiCalendar, FiTrendingUp
} from 'react-icons/fi'
import UserDisplay from './UserDisplay'

interface UserDetails {
  basic: {
    username: string
    isAdmin: boolean
    isBanned: boolean
    createdAt: string
  }
  content: {
    secretsCount: number
    commentsCount: number
    likesGiven: number
    reportsGiven: number
    reportsReceived: number
    totalViews: number
    totalLikes: number
  }
  technical: {
    uniqueIPs: number
    ips: string[]
    userAgents: number
    fingerprints: number
    lastIP: string
    lastActivity: string
  }
  security: {
    vpnAttempts: number
    riskScore: number
    suspiciousActivity: string[]
    accountAge: number
  }
  activity: {
    totalLogs: number
    byType: Record<string, number>
    byHour: Record<string, number>
    recentSecrets: Array<{
      id: string
      title: string
      createdAt: string
      views: number
      likes: number
      comments: number
    }>
  }
  fingerprinting: {
    uniqueFingerprints: any[]
    devices: any[]
    browsers: any[]
    locations: any[]
  }
  timeline: Array<{
    id: string
    type: string
    timestamp: string
    ip: string
    vpnDetected: boolean
    confidence: number
    userAgent: string
    additionalInfo: any
  }>
}

interface UserDetailsModalProps {
  username: string
  onClose: () => void
  onBanUser: (username: string) => void
  onUnbanUser: (username: string) => void
}

export default function UserDetailsModal({ username, onClose, onBanUser, onUnbanUser }: UserDetailsModalProps) {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'security' | 'technical' | 'activity' | 'timeline'>('overview')

  useEffect(() => {
    fetchUserDetails()
  }, [username])

  const fetchUserDetails = async () => {
    try {
      const token = Cookies.get('token')
      const response = await axios.get(`/api/admin/users/${username}/details`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUserDetails(response.data)
    } catch (error) {
      console.error('Error fetching user details:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-500'
    if (score < 70) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getRiskBadge = (score: number) => {
    if (score < 30) return { label: 'Bajo', color: 'bg-green-500/20 text-green-500' }
    if (score < 70) return { label: 'Medio', color: 'bg-yellow-500/20 text-yellow-500' }
    return { label: 'Alto', color: 'bg-red-500/20 text-red-500' }
  }

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'secret_creation': return <FiEye className="text-blue-500" />
      case 'user_registration': return <FiUser className="text-green-500" />
      case 'user_login': return <FiShield className="text-purple-500" />
      case 'vpn_attempt_blocked': return <FiFlag className="text-red-500" />
      case 'fingerprint_submit': return <FiWifi className="text-orange-500" />
      default: return <FiActivity className="text-gray-500" />
    }
  }

  const getActivityTypeLabel = (type: string) => {
    switch (type) {
      case 'secret_creation': return 'Secreto Creado'
      case 'user_registration': return 'Registro'
      case 'user_login': return 'Login'
      case 'vpn_attempt_blocked': return 'VPN Bloqueado'
      case 'fingerprint_submit': return 'Fingerprint'
      default: return type
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
        <div className="rounded-lg p-8 border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: 'var(--accent-primary)' }}></div>
            <span style={{ color: 'var(--text-primary)' }}>Cargando detalles del usuario...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!userDetails) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
        <div className="rounded-lg p-8 border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
          <div className="text-center">
            <FiXCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Error al cargar usuario</h3>
            <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>No se pudieron cargar los detalles del usuario</p>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    )
  }

  const risk = getRiskBadge(userDetails.security.riskScore)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999] p-4">
      <div 
        className="rounded-lg w-full max-w-6xl max-h-[85vh] border overflow-hidden relative"
        style={{ 
          backgroundColor: 'var(--bg-primary)', 
          borderColor: 'var(--border-primary)',
          marginTop: '4rem' // Espacio para la navbar
        }}
      >
        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: 'var(--border-primary)' }}>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                style={{
                  backgroundColor: userDetails.basic.isBanned ? '#ef4444' : 'var(--accent-primary)',
                  color: userDetails.basic.isBanned ? '#ffffff' : 'var(--text-on-accent)'
                }}
              >
                {userDetails.basic.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    <UserDisplay username={userDetails.basic.username} size="lg" />
                  </h2>
                  {userDetails.basic.isBanned && (
                    <span className="px-3 py-1 rounded-full text-sm bg-red-500/20 text-red-500 font-medium">
                      BANEADO
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${risk.color}`}>
                    Riesgo {risk.label}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  <div className="flex items-center gap-1">
                    <FiCalendar size={14} />
                    Registrado hace {userDetails.security.accountAge} días
                  </div>
                  <div className="flex items-center gap-1">
                    <FiGlobe size={14} />
                    {userDetails.technical.uniqueIPs} IPs únicas
                  </div>
                  <div className="flex items-center gap-1">
                    <FiActivity size={14} />
                    {userDetails.activity.totalLogs} actividades
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {userDetails.basic.isBanned ? (
                <button
                  onClick={() => onUnbanUser(userDetails.basic.username)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
                  style={{
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    color: '#22c55e',
                    border: '1px solid rgba(34, 197, 94, 0.2)'
                  }}
                >
                  <FiCheckCircle size={16} />
                  Desbanear
                </button>
              ) : (
                <button
                  onClick={() => onBanUser(userDetails.basic.username)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    border: '1px solid rgba(239, 68, 68, 0.2)'
                  }}
                >
                  <FiXCircle size={16} />
                  Banear
                </button>
              )}
              
              <button
                onClick={onClose}
                className="p-2 rounded-lg transition-colors hover:rotate-90"
                style={{ color: 'var(--text-secondary)' }}
              >
                <FiX size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b" style={{ borderColor: 'var(--border-primary)' }}>
          <div className="flex overflow-x-auto">
            {[
              { id: 'overview', label: 'Resumen', icon: FiUser },
              { id: 'security', label: 'Seguridad', icon: FiShield },
              { id: 'technical', label: 'Técnico', icon: FiMonitor },
              { id: 'activity', label: 'Actividad', icon: FiActivity },
              { id: 'timeline', label: 'Timeline', icon: FiClock }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-300 border-b-2 ${
                  activeTab === id ? 'border-current' : 'border-transparent'
                }`}
                style={{
                  color: activeTab === id ? 'var(--accent-primary)' : 'var(--text-secondary)'
                }}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)]">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Estadísticas de Contenido */}
              <div className="rounded-lg p-4 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <FiEye className="text-blue-500" />
                  Estadísticas de Contenido
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">{userDetails.content.secretsCount}</div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Secretos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">{userDetails.content.commentsCount}</div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Comentarios</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-500">{userDetails.content.likesGiven}</div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Likes Dados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-500">{userDetails.content.totalViews}</div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Vistas Totales</div>
                  </div>
                </div>
              </div>

              {/* Información de Seguridad */}
              <div className="rounded-lg p-4 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <FiShield className="text-orange-500" />
                  Análisis de Seguridad
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--text-secondary)' }}>Puntuación de Riesgo</span>
                    <span className={`font-bold ${getRiskColor(userDetails.security.riskScore)}`}>
                      {userDetails.security.riskScore}/100
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--text-secondary)' }}>Intentos VPN</span>
                    <span className="font-bold text-red-500">{userDetails.security.vpnAttempts}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--text-secondary)' }}>IPs Únicas</span>
                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{userDetails.technical.uniqueIPs}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: 'var(--text-secondary)' }}>Dispositivos</span>
                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{userDetails.fingerprinting.devices.length}</span>
                  </div>
                </div>
                
                {userDetails.security.suspiciousActivity.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2 text-red-500">Actividad Sospechosa:</h4>
                    <ul className="text-sm space-y-1">
                      {userDetails.security.suspiciousActivity.map((activity, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <FiAlertTriangle size={12} className="text-red-500" />
                          <span style={{ color: 'var(--text-secondary)' }}>{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Secretos Recientes */}
              {userDetails.activity.recentSecrets.length > 0 && (
                <div className="lg:col-span-2 rounded-lg p-4 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <FiEye className="text-blue-500" />
                    Secretos Recientes
                  </h3>
                  <div className="space-y-3">
                    {userDetails.activity.recentSecrets.map(secret => (
                      <div key={secret.id} className="flex justify-between items-center p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
                        <div>
                          <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{secret.title}</div>
                          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {new Date(secret.createdAt).toLocaleDateString('es-ES')}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                            <FiEye size={14} /> {secret.views}
                          </span>
                          <span className="flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                            <FiHeart size={14} /> {secret.likes}
                          </span>
                          <span className="flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                            <FiMessageCircle size={14} /> {secret.comments}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Análisis de Riesgo */}
              <div className="rounded-lg p-4 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <FiTrendingUp className="text-red-500" />
                  Análisis de Riesgo Detallado
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
                    <div className={`text-3xl font-bold ${getRiskColor(userDetails.security.riskScore)}`}>
                      {userDetails.security.riskScore}
                    </div>
                    <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Puntuación de Riesgo</div>
                  </div>
                  <div className="text-center p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
                    <div className="text-3xl font-bold text-red-500">{userDetails.security.vpnAttempts}</div>
                    <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Intentos VPN</div>
                  </div>
                  <div className="text-center p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
                    <div className="text-3xl font-bold text-orange-500">{userDetails.security.accountAge}</div>
                    <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Días de Cuenta</div>
                  </div>
                </div>
                
                {userDetails.security.suspiciousActivity.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3 text-red-500">Actividades Sospechosas Detectadas:</h4>
                    <div className="space-y-2">
                      {userDetails.security.suspiciousActivity.map((activity, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                          <FiAlertTriangle className="text-red-500" />
                          <span style={{ color: 'var(--text-primary)' }}>{activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* IPs Utilizadas */}
              <div className="rounded-lg p-4 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <FiGlobe className="text-blue-500" />
                  Direcciones IP Utilizadas ({userDetails.technical.uniqueIPs})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {userDetails.technical.ips.map((ip, index) => (
                    <div key={index} className="p-3 rounded-lg border font-mono text-sm" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}>
                      {ip}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'technical' && (
            <div className="space-y-6">
              {/* Dispositivos */}
              {userDetails.fingerprinting.devices.length > 0 && (
                <div className="rounded-lg p-4 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <FiSmartphone className="text-green-500" />
                    Dispositivos Detectados ({userDetails.fingerprinting.devices.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userDetails.fingerprinting.devices.map((device, index) => (
                      <div key={index} className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{device.platform}</div>
                          <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-500">
                            {device.usageCount} usos
                          </span>
                        </div>
                        <div className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                          <div>Cores: {device.cores}</div>
                          <div>Idioma: {device.language}</div>
                          <div>Último: {new Date(device.lastSeen).toLocaleDateString('es-ES')}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navegadores */}
              {userDetails.fingerprinting.browsers.length > 0 && (
                <div className="rounded-lg p-4 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <FiMonitor className="text-purple-500" />
                    Navegadores Utilizados ({userDetails.fingerprinting.browsers.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userDetails.fingerprinting.browsers.map((browser, index) => (
                      <div key={index} className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{browser.name}</div>
                          <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-500">
                            {browser.usageCount} usos
                          </span>
                        </div>
                        <div className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                          <div>Versiones: {browser.versions.join(', ')}</div>
                          <div>Último: {new Date(browser.lastSeen).toLocaleDateString('es-ES')}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Ubicaciones */}
              {userDetails.fingerprinting.locations.length > 0 && (
                <div className="rounded-lg p-4 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <FiMapPin className="text-orange-500" />
                    Zonas Horarias Detectadas ({userDetails.fingerprinting.locations.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userDetails.fingerprinting.locations.map((location, index) => (
                      <div key={index} className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{location.timezone}</div>
                          <span className="text-xs px-2 py-1 rounded bg-orange-500/20 text-orange-500">
                            {location.usageCount} usos
                          </span>
                        </div>
                        <div className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                          <div>Offset: {location.offset} min</div>
                          <div>Último: {new Date(location.lastSeen).toLocaleDateString('es-ES')}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-6">
              {/* Resumen de Actividad */}
              <div className="rounded-lg p-4 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <FiActivity className="text-blue-500" />
                  Resumen de Actividad
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(userDetails.activity.byType).map(([type, count]) => (
                    <div key={type} className="text-center p-3 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
                      <div className="flex justify-center mb-2">
                        {getActivityTypeIcon(type)}
                      </div>
                      <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{count}</div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{getActivityTypeLabel(type)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actividad por Hora */}
              <div className="rounded-lg p-4 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <FiClock className="text-green-500" />
                  Distribución por Hora
                </h3>
                <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                  {Array.from({length: 24}, (_, i) => {
                    const count = userDetails.activity.byHour[i.toString()] || 0
                    const maxCount = Math.max(...Object.values(userDetails.activity.byHour))
                    const intensity = count / Math.max(maxCount, 1)
                    
                    return (
                      <div key={i} className="text-center">
                        <div 
                          className="w-full h-8 rounded mb-1 border flex items-center justify-center text-xs font-medium"
                          style={{ 
                            backgroundColor: count > 0 ? `rgba(59, 130, 246, ${0.1 + intensity * 0.8})` : 'var(--bg-primary)',
                            borderColor: 'var(--border-primary)',
                            color: count > 0 ? '#3b82f6' : 'var(--text-secondary)'
                          }}
                        >
                          {count}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {i.toString().padStart(2, '0')}h
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <FiClock className="text-blue-500" />
                Timeline de Actividad (Últimas 50 actividades)
              </h3>
              
              <div className="space-y-3">
                {userDetails.timeline.map((event, index) => (
                  <div key={event.id} className="flex gap-4 p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                    <div className="flex-shrink-0">
                      {getActivityTypeIcon(event.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                          {getActivityTypeLabel(event.type)}
                        </h4>
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {new Date(event.timestamp).toLocaleString('es-ES')}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <div>IP: <span className="font-mono">{event.ip}</span></div>
                        {event.vpnDetected && (
                          <div className="text-red-500">
                            VPN Detectado ({event.confidence}%)
                          </div>
                        )}
                      </div>
                      
                      {event.additionalInfo && Object.keys(event.additionalInfo).length > 0 && (
                        <div className="mt-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          {event.additionalInfo.secretTitle && (
                            <div>Secreto: {event.additionalInfo.secretTitle}</div>
                          )}
                          {event.additionalInfo.vpnReason && (
                            <div>Razón VPN: {event.additionalInfo.vpnReason}</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}