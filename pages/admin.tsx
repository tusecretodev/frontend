import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Cookies from 'js-cookie'
import { FiTrash2, FiEye, FiFlag, FiUser, FiMessageCircle, FiShield, FiTrendingUp, FiUsers, FiAlertTriangle, FiCheckCircle, FiXCircle, FiBell, FiGlobe, FiMail } from 'react-icons/fi'
import Layout from '../components/Layout'
import LoginModal from '../components/LoginModal'
import AnnouncementManager from '../components/AnnouncementManager'
import IPLogsPanel from '../components/IPLogsPanel'
import UserDetailsModal from '../components/UserDetailsModal'

interface Secret {
  id: string
  title: string
  content: string
  author: string
  createdAt: string
  views: number
  likes: number
  comments: number
  reports: number
}

interface User {
  username: string
  createdAt: string
  secretsCount: number
  commentsCount: number
  likesGiven: number
  uniqueIPs: number
  vpnAttempts: number
  totalLogs: number
  lastActivity: string | null
  lastIP: string | null
  riskScore: number
  deviceCount: number
  accountAge: number
  isBanned: boolean
}

interface Report {
  id: string
  secretId: string
  secretTitle: string
  reportedBy: string
  reason: string
  createdAt: string
  status: 'pending' | 'resolved' | 'dismissed'
}

export default function AdminPanel() {
  const router = useRouter()
  const [user, setUser] = useState<string | null>(null)
  const [showLogin, setShowLogin] = useState(false)
  const [activeTab, setActiveTab] = useState<'secrets' | 'users' | 'reports' | 'message-reports' | 'email-logs' | 'announcements' | 'iplogs'>('secrets')
  const [secrets, setSecrets] = useState<Secret[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [messageReports, setMessageReports] = useState<any[]>([])
  const [emailLogs, setEmailLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalSecrets: 0,
    totalUsers: 0,
    totalReports: 0,
    pendingReports: 0
  })

  useEffect(() => {
    const token = Cookies.get('token')
    const username = Cookies.get('username')
    
    if (!token || username !== 'admin') {
      router.push('/')
      return
    }
    
    setUser(username)
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      const token = Cookies.get('token')
      const headers = { Authorization: `Bearer ${token}` }
      
      const [secretsRes, usersRes, reportsRes, messageReportsRes, emailLogsRes, statsRes] = await Promise.all([
        axios.get('/api/admin/secrets', { headers }),
        axios.get('/api/admin/users', { headers }),
        axios.get('/api/admin/reports', { headers }),
        axios.get('/api/admin/message-reports', { headers }),
        axios.get('/api/admin/email-copy-logs', { headers }),
        axios.get('/api/admin/stats', { headers })
      ])
      
      setSecrets(secretsRes.data)
      setUsers(usersRes.data)
      setReports(reportsRes.data)
      setMessageReports(messageReportsRes.data)
      setEmailLogs(emailLogsRes.data.logs || [])
      setStats(statsRes.data)
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteSecret = async (secretId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este secreto?')) return
    
    try {
      const token = Cookies.get('token')
      await axios.delete(`/api/admin/secrets/${secretId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchAdminData()
    } catch (error) {
      console.error('Error deleting secret:', error)
    }
  }

  const banUser = async (username: string) => {
    const reason = prompt(`¿Cuál es la razón para banear al usuario ${username}?`)
    if (reason === null) return // Usuario canceló
    
    if (!confirm(`¿Estás seguro de que quieres banear al usuario ${username}?`)) return
    
    try {
      const token = Cookies.get('token')
      await axios.post(`/api/admin/users/${username}/ban`, {
        reason: reason || 'No se especificó una razón'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchAdminData()
    } catch (error) {
      console.error('Error banning user:', error)
    }
  }

  const unbanUser = async (username: string) => {
    try {
      const token = Cookies.get('token')
      await axios.post(`/api/admin/users/${username}/unban`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchAdminData()
    } catch (error) {
      console.error('Error unbanning user:', error)
    }
  }

  const resolveReport = async (reportId: string, action: 'resolve' | 'dismiss') => {
    try {
      const token = Cookies.get('token')
      await axios.post(`/api/admin/reports/${reportId}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchAdminData()
    } catch (error) {
      console.error('Error resolving report:', error)
    }
  }

  const resolveMessageReport = async (reportId: string, action: 'approve' | 'reject' | 'delete_message') => {
    const reason = action !== 'approve' ? prompt('Motivo de la decisión (opcional):') : ''
    
    try {
      const token = Cookies.get('token')
      await axios.patch(`/api/admin/message-reports/${reportId}/resolve`, {
        action,
        reason
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchAdminData()
      alert('Reporte resuelto exitosamente')
    } catch (error) {
      console.error('Error resolving message report:', error)
      alert('Error al resolver el reporte')
    }
  }

  const handleLogin = (username: string) => {
    setUser(username)
    setShowLogin(false)
  }

  const handleLogout = () => {
    Cookies.remove('token')
    Cookies.remove('username')
    setUser(null)
    router.push('/')
  }

  if (loading) {
    return (
      <Layout user={user} onLogin={() => setShowLogin(true)} onLogout={handleLogout}>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--accent-primary)' }}></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout user={user} onLogin={() => setShowLogin(true)} onLogout={handleLogout}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div 
          className="rounded-2xl p-4 mb-6 border backdrop-blur-sm relative overflow-hidden"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-xl"
              style={{
                backgroundColor: 'var(--accent-primary)'
              }}
            >
              <FiShield size={20} style={{ color: 'var(--text-on-accent)' }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Panel de Administración
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Gestiona contenido, usuarios y reportes
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div 
            className="rounded-xl p-4 border transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)'
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <FiEye size={16} className="text-blue-500" />
              </div>
              <h3 className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Secretos</h3>
            </div>
            <p className="text-xl font-bold text-blue-500">{stats.totalSecrets}</p>
          </div>
          
          <div 
            className="rounded-xl p-4 border transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)'
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-500/20">
                <FiUsers size={16} className="text-green-500" />
              </div>
              <h3 className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Usuarios</h3>
            </div>
            <p className="text-xl font-bold text-green-500">{stats.totalUsers}</p>
          </div>
          
          <div 
            className="rounded-xl p-4 border transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)'
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <FiFlag size={16} className="text-yellow-500" />
              </div>
              <h3 className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Reportes</h3>
            </div>
            <p className="text-xl font-bold text-yellow-500">{stats.totalReports}</p>
          </div>
          
          <div 
            className="rounded-xl p-4 border transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)'
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-red-500/20">
                <FiAlertTriangle size={16} className="text-red-500" />
              </div>
              <h3 className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Pendientes</h3>
            </div>
            <p className="text-xl font-bold text-red-500">{stats.pendingReports}</p>
          </div>
        </div>

        {/* Tabs */}
        <div 
          className="rounded-xl p-1 mb-6 border"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}
        >
          <div className="flex space-x-1">
            {[
              { id: 'secrets', label: 'Secretos', icon: FiEye },
              { id: 'users', label: 'Usuarios', icon: FiUser },
              { id: 'reports', label: 'Reportes', icon: FiFlag },
              { id: 'message-reports', label: 'Mensajes', icon: FiMessageCircle },
              { id: 'email-logs', label: 'Email Logs', icon: FiMail },
              { id: 'announcements', label: 'Anuncios', icon: FiBell },
              { id: 'iplogs', label: 'IP Logs', icon: FiGlobe }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 flex-1 justify-center text-sm`}
                style={{
                  backgroundColor: activeTab === id 
                    ? 'var(--accent-primary)' 
                    : 'transparent',
                  color: activeTab === id 
                    ? 'var(--text-on-accent)' 
                    : 'var(--text-secondary)'
                }}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'secrets' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <FiEye size={18} className="text-blue-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Gestión de Secretos</h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Administra y modera el contenido</p>
              </div>
            </div>
            
            <div className="grid gap-4">
              {secrets.map((secret) => (
                <div 
                  key={secret.id} 
                  className="rounded-xl p-4 border transition-all duration-300 hover:scale-[1.01]"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-primary)'
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{
                            backgroundColor: 'var(--accent-primary)',
                            color: 'var(--text-on-accent)'
                          }}
                        >
                          {secret.author.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                            {secret.author === 'admin' ? 'Admin' : 'Anónimo'}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            {new Date(secret.createdAt).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-sm mb-3 line-clamp-2 break-words" style={{ color: 'var(--text-primary)', maxWidth: '100%', overflowWrap: 'break-word' }}>
                        {secret.content}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                          <FiEye size={12} className="text-blue-500" />
                          <span>{secret.views}</span>
                        </div>
                        <div className="flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                          <FiMessageCircle size={12} className="text-green-500" />
                          <span>{secret.comments}</span>
                        </div>
                        {secret.reports > 0 && (
                          <div className="flex items-center gap-1 text-red-500">
                            <FiFlag size={12} />
                            <span>{secret.reports}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => router.push(`/secret/${secret.id}`)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 flex items-center gap-1"
                        style={{
                          backgroundColor: 'var(--bg-primary)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border-primary)'
                        }}
                      >
                        <FiEye size={12} />
                        Ver
                      </button>
                      <button
                        onClick={() => deleteSecret(secret.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 flex items-center gap-1"
                        style={{
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          color: '#ef4444',
                          border: '1px solid rgba(239, 68, 68, 0.2)'
                        }}
                      >
                        <FiTrash2 size={12} />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-green-500/20">
                <FiUsers size={18} className="text-green-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Gestión de Usuarios</h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Administra usuarios registrados - Click para ver detalles completos</p>
              </div>
            </div>
            
            <div className="grid gap-4">
              {users.map((user) => {
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
                
                const risk = getRiskBadge(user.riskScore)
                
                return (
                  <div 
                    key={user.username} 
                    onClick={() => setSelectedUser(user.username)}
                    className="rounded-xl p-4 border transition-all duration-300 hover:scale-[1.01] cursor-pointer hover:shadow-lg"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-primary)'
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                            style={{
                              backgroundColor: user.isBanned ? '#ef4444' : 'var(--accent-primary)',
                              color: user.isBanned ? '#ffffff' : 'var(--text-on-accent)'
                            }}
                          >
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                {user.username}
                              </p>
                              {user.isBanned && (
                                <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-500 font-medium">
                                  BANEADO
                                </span>
                              )}
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${risk.color}`}>
                                Riesgo {risk.label}
                              </span>
                              {user.vpnAttempts > 0 && (
                                <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-500 font-medium">
                                  {user.vpnAttempts} VPN
                                </span>
                              )}
                            </div>
                            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                              Registrado hace {user.accountAge} días • Última actividad: {user.lastActivity ? new Date(user.lastActivity).toLocaleDateString('es-ES') : 'Nunca'}
                            </p>
                          </div>
                        </div>
                        
                        {/* Estadísticas de contenido */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                          <div className="text-center p-2 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
                            <div className="text-sm font-bold text-blue-500">{user.secretsCount}</div>
                            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Secretos</div>
                          </div>
                          <div className="text-center p-2 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
                            <div className="text-sm font-bold text-green-500">{user.commentsCount}</div>
                            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Comentarios</div>
                          </div>
                          <div className="text-center p-2 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
                            <div className="text-sm font-bold text-purple-500">{user.likesGiven}</div>
                            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Likes</div>
                          </div>
                          <div className="text-center p-2 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
                            <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{user.totalLogs}</div>
                            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Actividades</div>
                          </div>
                        </div>
                        
                        {/* Información técnica */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                          <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                            <FiGlobe size={12} className="text-blue-500" />
                            <span>{user.uniqueIPs} IPs únicas</span>
                          </div>
                          <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                            <FiShield size={12} className="text-orange-500" />
                            <span>Riesgo: {user.riskScore}/100</span>
                          </div>
                          <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                            <FiUsers size={12} className="text-green-500" />
                            <span>{user.deviceCount} dispositivos</span>
                          </div>
                        </div>
                        
                        {user.lastIP && (
                          <div className="mt-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                            Última IP: <span className="font-mono">{user.lastIP}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedUser(user.username)
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 flex items-center gap-1"
                          style={{
                            backgroundColor: 'var(--bg-primary)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-primary)'
                          }}
                        >
                          <FiEye size={12} />
                          Detalles
                        </button>
                        
                        {user.isBanned ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              unbanUser(user.username)
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 flex items-center gap-1"
                            style={{
                              backgroundColor: 'rgba(34, 197, 94, 0.1)',
                              color: '#22c55e',
                              border: '1px solid rgba(34, 197, 94, 0.2)'
                            }}
                          >
                            <FiCheckCircle size={12} />
                            Desbanear
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              banUser(user.username)
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 flex items-center gap-1"
                            style={{
                              backgroundColor: 'rgba(239, 68, 68, 0.1)',
                              color: '#ef4444',
                              border: '1px solid rgba(239, 68, 68, 0.2)'
                            }}
                          >
                            <FiXCircle size={12} />
                            Banear
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-red-500/20">
                <FiFlag size={18} className="text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Gestión de Reportes</h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Revisa y gestiona reportes</p>
              </div>
            </div>
            
            <div className="grid gap-4">
              {reports.map((report) => (
                <div 
                  key={report.id} 
                  className="rounded-xl p-4 border transition-all duration-300 hover:scale-[1.01]"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-primary)'
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor: report.status === 'pending' ? '#f59e0b' : 
                                             report.status === 'resolved' ? '#10b981' : '#ef4444'
                            }}
                          ></div>
                          <span 
                            className="px-2 py-0.5 rounded text-xs font-medium"
                            style={{
                              backgroundColor: report.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' : 
                                             report.status === 'resolved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                              color: report.status === 'pending' ? '#f59e0b' : 
                                     report.status === 'resolved' ? '#10b981' : '#ef4444'
                            }}
                          >
                            {report.status === 'pending' ? 'Pendiente' : 
                             report.status === 'resolved' ? 'Resuelto' : 'Rechazado'}
                          </span>
                        </div>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {new Date(report.createdAt).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      
                      <div className="mb-2">
                        <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Motivo:</p>
                        <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{report.reason}</p>
                      </div>
                      
                      <div className="mb-2">
                        <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Secreto:</p>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{report.secretTitle}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => router.push(`/secret/${report.secretId}`)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 flex items-center gap-1"
                        style={{
                          backgroundColor: 'var(--bg-primary)',
                          color: 'var(--text-primary)',
                          border: '1px solid var(--border-primary)'
                        }}
                      >
                        <FiEye size={12} />
                        Ver
                      </button>
                      
                      {report.status === 'pending' && (
                        <>
                          <button
                            onClick={() => resolveReport(report.id, 'resolve')}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 flex items-center gap-1"
                            style={{
                              backgroundColor: 'rgba(34, 197, 94, 0.1)',
                              color: '#22c55e',
                              border: '1px solid rgba(34, 197, 94, 0.2)'
                            }}
                          >
                            <FiCheckCircle size={12} />
                            Resolver
                          </button>
                          <button
                            onClick={() => resolveReport(report.id, 'dismiss')}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 flex items-center gap-1"
                            style={{
                              backgroundColor: 'rgba(107, 114, 128, 0.1)',
                              color: '#6b7280',
                              border: '1px solid rgba(107, 114, 128, 0.2)'
                            }}
                          >
                            <FiXCircle size={12} />
                            Desestimar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'message-reports' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-orange-500/20">
                <FiMessageCircle size={18} className="text-orange-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Reportes de Mensajes</h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Revisa y gestiona reportes de mensajes privados</p>
              </div>
            </div>
            
            <div className="grid gap-4">
              {messageReports.length === 0 ? (
                <div className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
                  <FiMessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No hay reportes de mensajes</p>
                </div>
              ) : (
                messageReports.map((report) => (
                  <div 
                    key={report.id} 
                    className="rounded-xl p-4 border transition-all duration-300 hover:scale-[1.01]"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-primary)'
                    }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-orange-500/20">
                          <FiMessageCircle size={14} className="text-orange-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                            Mensaje reportado
                          </h3>
                          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            Reportado por {report.reportedBy} • {new Date(report.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span 
                        className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          report.status === 'pending' ? 'bg-yellow-500/20 text-yellow-600' :
                          report.status === 'approved' ? 'bg-green-500/20 text-green-600' :
                          'bg-red-500/20 text-red-600'
                        }`}
                      >
                        {report.status === 'pending' ? 'Pendiente' :
                         report.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                      </span>
                    </div>
                    
                    {report.message && (
                      <div className="mb-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            <strong>De:</strong> {report.message.sender} → <strong>Para:</strong> {report.message.receiver}
                          </div>
                          <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                            {new Date(report.message.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                          "{report.message.content}"
                        </p>
                      </div>
                    )}
                    
                    <div className="mb-3">
                      <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                        Motivo del reporte:
                      </p>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {report.reason}
                      </p>
                    </div>
                    
                    {report.status === 'pending' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => resolveMessageReport(report.id, 'approve')}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 flex items-center gap-1"
                          style={{
                            backgroundColor: 'rgba(34, 197, 94, 0.1)',
                            color: '#22c55e',
                            border: '1px solid rgba(34, 197, 94, 0.2)'
                          }}
                        >
                          <FiCheckCircle size={12} />
                          Aprobar
                        </button>
                        <button
                          onClick={() => resolveMessageReport(report.id, 'delete_message')}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 flex items-center gap-1"
                          style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            border: '1px solid rgba(239, 68, 68, 0.2)'
                          }}
                        >
                          <FiTrash2 size={12} />
                          Eliminar Mensaje
                        </button>
                        <button
                          onClick={() => resolveMessageReport(report.id, 'reject')}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 flex items-center gap-1"
                          style={{
                            backgroundColor: 'rgba(107, 114, 128, 0.1)',
                            color: '#6b7280',
                            border: '1px solid rgba(107, 114, 128, 0.2)'
                          }}
                        >
                          <FiXCircle size={12} />
                          Rechazar
                        </button>
                      </div>
                    ) : (
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Resuelto por {report.resolvedBy} • {new Date(report.resolvedAt).toLocaleString()}
                        {report.adminReason && (
                          <div className="mt-1">
                            <strong>Motivo:</strong> {report.adminReason}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'email-logs' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-green-500/20">
                <FiMail size={18} className="text-green-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Logs de Email de Soporte</h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Monitorea quién copia el email de soporte y cuándo</p>
              </div>
            </div>
            
            <div className="grid gap-4">
              {emailLogs.length === 0 ? (
                <div className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
                  <FiMail size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No hay logs de email aún</p>
                </div>
              ) : (
                emailLogs.map((log) => (
                  <div 
                    key={log.id} 
                    className="rounded-xl p-4 border transition-all duration-300 hover:scale-[1.01]"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-primary)'
                    }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-green-500/20">
                          <FiMail size={14} className="text-green-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                            Email copiado
                          </h3>
                          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            {new Date(log.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <span 
                        className="px-2 py-1 rounded-lg text-xs font-medium bg-green-500/20 text-green-600"
                      >
                        Registrado
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div className="space-y-2">
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          <strong>Usuario:</strong> {log.user || 'Anónimo'}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          <strong>IP:</strong> {log.ip}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          <strong>URL:</strong> {log.url}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          <strong>Navegador:</strong> {log.additionalInfo?.platform || 'N/A'}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          <strong>Idioma:</strong> {log.additionalInfo?.language || 'N/A'}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          <strong>Resolución:</strong> {log.additionalInfo?.screen ? `${log.additionalInfo.screen.width}x${log.additionalInfo.screen.height}` : 'N/A'}
                        </div>
                      </div>
                    </div>
                    
                    {log.userAgent && (
                      <div className="mt-3 p-2 rounded-lg text-xs font-mono" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' }}>
                        <strong>User Agent:</strong> {log.userAgent}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <FiBell size={18} className="text-blue-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Gestión de Anuncios</h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Crea y gestiona anuncios para los usuarios</p>
              </div>
            </div>
            
            <AnnouncementManager />
          </div>
        )}

        {activeTab === 'iplogs' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <FiGlobe size={18} className="text-purple-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Logs de IP y Seguridad</h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Monitorea IPs, detecta VPNs y analiza patrones de acceso</p>
              </div>
            </div>
            
            <IPLogsPanel />
          </div>
        )}
      </div>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
        />
      )}
      
      {selectedUser && (
        <UserDetailsModal
          username={selectedUser}
          onClose={() => setSelectedUser(null)}
          onBanUser={(username) => {
            banUser(username)
            setSelectedUser(null)
          }}
          onUnbanUser={(username) => {
            unbanUser(username)
            setSelectedUser(null)
          }}
        />
      )}
    </Layout>
  )
}