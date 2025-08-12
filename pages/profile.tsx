import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import Layout from '../components/Layout'
import BanScreen from '../components/BanScreen'
import { FiEye, FiHeart, FiMessageCircle, FiCalendar, FiTrash2 } from 'react-icons/fi'
import UserDisplay from '../components/UserDisplay'

interface Secret {
  id: string
  content: string
  author: string
  createdAt: string
  views: number
  likes: number
  comments: number
}

export default function Profile() {
  const [user, setUser] = useState<string | null>(null)
  const [userSecrets, setUserSecrets] = useState<Secret[]>([])
  const [loading, setLoading] = useState(true)
  const [showBanScreen, setShowBanScreen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = Cookies.get('token')
    const username = Cookies.get('username')
    
    if (!token || !username) {
      router.push('/')
      return
    }
    
    setUser(username)
    checkBanStatus()
    fetchUserSecrets(username)
  }, [])

  const fetchUserSecrets = async (username: string) => {
    try {
      const response = await fetch(`/api/secrets?author=${username}`)
      if (response.ok) {
        const secrets = await response.json()
        setUserSecrets(secrets)
      }
    } catch (error) {
      console.error('Error fetching user secrets:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkBanStatus = async () => {
    try {
      const token = Cookies.get('token')
      if (!token) return

      const response = await fetch('https://api.tusecreto.net/api/announcements/ban-status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        if (data.isBanned) {
          setShowBanScreen(true)
        }
      }
    } catch (error) {
      console.error('Error checking ban status:', error)
    }
  }

  const deleteSecret = async (secretId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este secreto?')) {
      return
    }

    try {
      const token = Cookies.get('token')
      const response = await fetch(`/api/secrets/${secretId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setUserSecrets(userSecrets.filter(secret => secret.id !== secretId))
      } else {
        alert('Error al eliminar el secreto')
      }
    } catch (error) {
      console.error('Error deleting secret:', error)
      alert('Error al eliminar el secreto')
    }
  }

  const handleLogin = () => {
    // This will be handled by the parent component
  }

  const handleLogout = () => {
    Cookies.remove('token')
    Cookies.remove('username')
    setUser(null)
    router.push('/')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <Layout user={user} onLogin={handleLogin} onLogout={handleLogout}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>Cargando perfil...</p>
          </div>
        </div>
      </Layout>
    )
  }

  // Si el usuario está baneado, mostrar SOLO la pantalla de ban
  if (showBanScreen) {
    return <BanScreen onClose={() => setShowBanScreen(false)} />
  }

  return (
    <Layout user={user} onLogin={handleLogin} onLogout={handleLogout}>
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Profile Header */}
          <div 
            className="rounded-xl p-4 mb-6 border"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-primary)'
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: 'var(--text-on-accent)'
                }}
              >
                {user?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {user === 'admin' ? (
                    <UserDisplay username={user} size="lg" />
                  ) : (
                    user
                  )}
                </h1>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {userSecrets.length} secreto{userSecrets.length !== 1 ? 's' : ''} compartido{userSecrets.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* User Secrets */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Mis Secretos
            </h2>
            
            {userSecrets.length === 0 ? (
              <div 
                className="text-center py-8 rounded-xl border"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-primary)'
                }}
              >
                <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
                  Aún no has compartido ningún secreto
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: 'var(--accent-primary)',
                    color: 'var(--text-on-accent)'
                  }}
                >
                  Compartir mi primer secreto
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {userSecrets.map((secret) => (
                  <div
                    key={secret.id}
                    className="rounded-xl p-4 border transition-all duration-300 hover:scale-[1.01]"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderColor: 'var(--border-primary)'
                    }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        <FiCalendar size={12} />
                        <span>{new Date(secret.createdAt).toLocaleDateString('es-ES')}</span>
                      </div>
                      <button
                        onClick={() => deleteSecret(secret.id)}
                        className="p-1.5 rounded-lg transition-all duration-300 hover:scale-110 text-red-500 hover:bg-red-500/10"
                        title="Eliminar secreto"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                    
                    <p className="text-sm mb-3 leading-relaxed line-clamp-3" style={{ color: 'var(--text-primary)' }}>
                      {secret.content}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        <div className="flex items-center gap-1">
                          <FiEye size={12} />
                          <span>{secret.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiHeart size={12} />
                          <span>{secret.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiMessageCircle size={12} />
                          <span>{secret.comments}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => router.push(`/secret/${secret.id}`)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105"
                        style={{
                          backgroundColor: 'var(--accent-primary)',
                          color: 'var(--text-on-accent)'
                        }}
                      >
                        Ver detalles
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Layout>
  )
}