import { useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { FiEye, FiFlag, FiUser, FiWifi, FiShield, FiGlobe, FiClock, FiActivity } from 'react-icons/fi'

interface IPLog {
  id: string
  type: string
  ip: string
  username: string
  timestamp: string
  vpnCheck?: {
    isVPN: boolean
    confidence: number
    reason: string
  }
  clientInfo?: {
    userAgent: string
    headers: any
  }
  secretId?: string
  secretTitle?: string
}

export default function IPLogsPanel() {
  const [logs, setLogs] = useState<IPLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchIPLogs()
  }, [])

  const fetchIPLogs = async () => {
    try {
      const token = Cookies.get('token')
      const response = await axios.get('https://api.tusecreto.net/api/admin/ip-logs', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setLogs(response.data)
    } catch (error) {
      console.error('Error fetching IP logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'secret_creation': return <FiEye className="text-blue-500" />
      case 'user_registration': return <FiUser className="text-green-500" />
      case 'user_login': return <FiShield className="text-purple-500" />
      case 'vpn_attempt_blocked': return <FiFlag className="text-red-500" />
      case 'fingerprint_submit': return <FiWifi className="text-orange-500" />
      default: return <FiActivity className="text-gray-500" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'secret_creation': return 'Crear Secreto'
      case 'user_registration': return 'Registro'
      case 'user_login': return 'Login'
      case 'vpn_attempt_blocked': return 'VPN Bloqueado'
      case 'fingerprint_submit': return 'Fingerprint'
      default: return type
    }
  }

  const filteredLogs = logs.filter(log => {
    if (filter !== 'all' && log.type !== filter) return false
    if (search && !log.ip.includes(search) && !log.username.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--accent-primary)' }}></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <FiGlobe size={20} style={{ color: 'var(--text-primary)' }} />
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Logs de IP - {filteredLogs.length} registros
          </h3>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border text-sm"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-primary)'
            }}
          >
            <option value="all">Todos los tipos</option>
            <option value="secret_creation">Secretos</option>
            <option value="user_registration">Registros</option>
            <option value="user_login">Logins</option>
            <option value="vpn_attempt_blocked">VPN Bloqueados</option>
            <option value="fingerprint_submit">Fingerprints</option>
          </select>
          
          <input
            type="text"
            placeholder="Buscar IP o usuario..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 rounded-lg border text-sm min-w-[200px]"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-primary)'
            }}
          />
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg p-3 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>VPNs Bloqueados</div>
          <div className="text-xl font-bold text-red-500">
            {logs.filter(l => l.type === 'vpn_attempt_blocked').length}
          </div>
        </div>
        <div className="rounded-lg p-3 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Secretos Creados</div>
          <div className="text-xl font-bold text-blue-500">
            {logs.filter(l => l.type === 'secret_creation').length}
          </div>
        </div>
        <div className="rounded-lg p-3 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Registros</div>
          <div className="text-xl font-bold text-green-500">
            {logs.filter(l => l.type === 'user_registration').length}
          </div>
        </div>
        <div className="rounded-lg p-3 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>IPs Únicas</div>
          <div className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {new Set(logs.map(l => l.ip)).size}
          </div>
        </div>
      </div>

      {/* Lista de logs */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
            No hay logs que coincidan con los filtros
          </div>
        ) : (
          filteredLogs.slice(0, 100).map((log) => (
            <div 
              key={log.id}
              className="rounded-lg p-4 border transition-all duration-300 hover:scale-[1.01]"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-primary)'
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--bg-primary)' }}>
                    {getTypeIcon(log.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {getTypeLabel(log.type)}
                      </span>
                      {log.vpnCheck?.isVPN && (
                        <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-500 font-medium">
                          VPN
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <div>
                        <span className="font-medium">IP:</span> {log.ip}
                      </div>
                      <div>
                        <span className="font-medium">Usuario:</span> {log.username}
                      </div>
                      
                      {log.secretTitle && (
                        <div className="sm:col-span-2">
                          <span className="font-medium">Secreto:</span> {log.secretTitle}
                        </div>
                      )}
                      
                      {log.vpnCheck && (
                        <div className="sm:col-span-2">
                          <span className="font-medium">VPN:</span> 
                          <span className={log.vpnCheck.isVPN ? 'text-red-400' : 'text-green-400'}>
                            {' '}{log.vpnCheck.isVPN ? 'DETECTADO' : 'LIMPIO'} ({log.vpnCheck.confidence}%)
                          </span>
                          {log.vpnCheck.reason && (
                            <span className="text-xs block text-gray-400 mt-1">
                              {log.vpnCheck.reason}
                            </span>
                          )}
                        </div>
                      )}
                      
                      {log.clientInfo?.userAgent && (
                        <div className="sm:col-span-2">
                          <span className="font-medium">UA:</span> 
                          <span className="text-xs break-all">
                            {' '}{log.clientInfo.userAgent.substring(0, 80)}...
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-right" style={{ color: 'var(--text-tertiary)' }}>
                  <div className="flex items-center gap-1">
                    <FiClock size={12} />
                    {new Date(log.timestamp).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {filteredLogs.length > 100 && (
        <div className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
          Mostrando los primeros 100 resultados de {filteredLogs.length}
        </div>
      )}
    </div>
  )
}