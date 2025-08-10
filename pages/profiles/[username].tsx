import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import Layout from '../../components/Layout'
import BanScreen from '../../components/BanScreen'
import { FiUser, FiMessageCircle, FiCalendar, FiEye, FiHeart, FiMessageSquare, FiEdit3, FiSave, FiX } from 'react-icons/fi'
import { useTheme } from '../../contexts/ThemeContext'
import UserDisplay from '../../components/UserDisplay'

interface UserProfile {
  username: string
  bio: string
  allowPrivateMessages: boolean
  stats: {
    secretsCount: number
    totalViews: number
    totalLikes: number
    memberSince: string
  }
  recentSecrets: Array<{
    id: string
    title: string
    createdAt: string
    views: number
    likes: number
    comments: number
  }>
  isOwnProfile: boolean
}

interface UserSettings {
  bio: string
  allowPrivateMessages: boolean
}

export default function UserProfile() {
  const { theme } = useTheme()
  const router = useRouter()
  const { username } = router.query
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [showBanScreen, setShowBanScreen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editSettings, setEditSettings] = useState<UserSettings>({
    bio: '',
    allowPrivateMessages: true
  })

  useEffect(() => {
    const token = Cookies.get('token')
    const user = Cookies.get('username')
    
    setCurrentUser(user || null)
    
    if (user) {
      checkBanStatus()
    }
    
    if (username) {
      fetchProfile()
    }
  }, [username])

  const checkBanStatus = async () => {
    try {
      const token = Cookies.get('token')
      if (!token) return

      const response = await fetch('/api/announcements/ban-status', {
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

  const fetchProfile = async () => {
    try {
      const headers: any = {}
      const token = Cookies.get('token')
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`/api/profiles/${username}`, { headers })

      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setEditSettings({
          bio: data.bio,
          allowPrivateMessages: data.allowPrivateMessages
        })
      } else if (response.status === 404) {
        router.push('/404')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      const token = Cookies.get('token')
      if (!token) return

      const response = await fetch('/api/profiles/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editSettings)
      })

      if (response.ok) {
        setIsEditing(false)
        fetchProfile()
      } else {
        const error = await response.json()
        alert(error.message || 'Error actualizando configuraciones')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error actualizando configuraciones')
    }
  }

  const startConversation = () => {
    if (!currentUser) {
      alert('Debes iniciar sesión para enviar mensajes')
      return
    }

    if (!profile?.allowPrivateMessages) {
      alert('Este usuario no acepta mensajes privados')
      return
    }

    router.push(`/messages?user=${username}`)
  }

  const handleLogin = () => {
    router.push('/')
  }

  const handleLogout = () => {
    Cookies.remove('token')
    Cookies.remove('username')
    router.push('/')
  }

  if (showBanScreen) {
    return <BanScreen />
  }

  if (loading) {
    return (
      <Layout user={currentUser} onLogin={handleLogin} onLogout={handleLogout}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>Cargando perfil...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!profile) {
    return (
      <Layout user={currentUser} onLogin={handleLogin} onLogout={handleLogout}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Usuario no encontrado
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Este usuario no existe o ha sido suspendido
            </p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout user={currentUser} onLogin={handleLogin} onLogout={handleLogout}>
      <div className="min-h-screen pt-24 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Header del perfil */}
          <div 
            className="rounded-2xl border p-8 mb-6"
            style={{
              backgroundColor: theme === 'dark' 
                ? 'rgba(0, 0, 0, 0.3)' 
                : 'rgba(255, 255, 255, 0.9)',
              borderColor: theme === 'dark' 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="flex flex-col md:flex-row items-start gap-6">
              
              {/* Avatar y info básica */}
              <div className="flex flex-col items-center text-center">
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center mb-4"
                  style={{
                    backgroundColor: theme === 'dark' 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <FiUser size={32} style={{ color: 'var(--text-primary)' }} />
                </div>
                <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  <UserDisplay username={profile.username} size="lg" />
                </h1>
                <div className="flex items-center gap-2 text-sm opacity-60">
                  <FiCalendar size={14} />
                  <span>Miembro desde {new Date(profile.stats.memberSince).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Información del perfil */}
              <div className="flex-1">
                
                {/* Biografía */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Biografía</h3>
                    {profile.isOwnProfile && (
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="p-2 rounded-lg transition-colors duration-200"
                        style={{
                          backgroundColor: theme === 'dark' 
                            ? 'rgba(255, 255, 255, 0.1)' 
                            : 'rgba(0, 0, 0, 0.05)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        {isEditing ? <FiX size={16} /> : <FiEdit3 size={16} />}
                      </button>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <div className="space-y-4">
                      <textarea
                        value={editSettings.bio}
                        onChange={(e) => setEditSettings(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Cuéntanos sobre ti..."
                        maxLength={200}
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border transition-colors duration-200 resize-none"
                        style={{
                          backgroundColor: theme === 'dark' 
                            ? 'rgba(255, 255, 255, 0.05)' 
                            : 'rgba(255, 255, 255, 0.8)',
                          borderColor: theme === 'dark' 
                            ? 'rgba(255, 255, 255, 0.1)' 
                            : 'rgba(0, 0, 0, 0.1)',
                          color: 'var(--text-primary)'
                        }}
                      />
                      <p className="text-xs opacity-60">{editSettings.bio.length}/200 caracteres</p>
                      
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="allowMessages"
                          checked={editSettings.allowPrivateMessages}
                          onChange={(e) => setEditSettings(prev => ({ 
                            ...prev, 
                            allowPrivateMessages: e.target.checked 
                          }))}
                          className="w-4 h-4"
                        />
                        <label htmlFor="allowMessages" className="text-sm" style={{ color: 'var(--text-primary)' }}>
                          Permitir mensajes privados
                        </label>
                      </div>
                      
                      <button
                        onClick={saveSettings}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                      >
                        <FiSave size={16} />
                        Guardar cambios
                      </button>
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-secondary)' }}>
                      {profile.bio || 'Sin biografía'}
                    </p>
                  )}
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {profile.stats.secretsCount}
                    </p>
                    <p className="text-sm opacity-60">Secretos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {profile.stats.totalViews}
                    </p>
                    <p className="text-sm opacity-60">Visualizaciones</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {profile.stats.totalLikes}
                    </p>
                    <p className="text-sm opacity-60">Likes</p>
                  </div>
                </div>

                {/* Botón de mensaje */}
                {!profile.isOwnProfile && currentUser && (
                  <button
                    onClick={startConversation}
                    disabled={!profile.allowPrivateMessages}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      profile.allowPrivateMessages
                        ? 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105'
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                    style={{
                      backgroundColor: !profile.allowPrivateMessages 
                        ? theme === 'dark' 
                          ? 'rgba(255, 255, 255, 0.1)' 
                          : 'rgba(0, 0, 0, 0.05)'
                        : undefined
                    }}
                  >
                    <FiMessageCircle size={18} />
                    {profile.allowPrivateMessages ? 'Enviar mensaje privado' : 'No acepta mensajes'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Secretos recientes */}
          <div 
            className="rounded-2xl border p-6"
            style={{
              backgroundColor: theme === 'dark' 
                ? 'rgba(0, 0, 0, 0.3)' 
                : 'rgba(255, 255, 255, 0.9)',
              borderColor: theme === 'dark' 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(0, 0, 0, 0.1)'
            }}
          >
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              Secretos recientes
            </h2>

            {profile.recentSecrets.length === 0 ? (
              <div className="text-center py-12">
                <p style={{ color: 'var(--text-secondary)' }}>
                  {profile.isOwnProfile ? 'No has compartido secretos aún' : 'Este usuario no ha compartido secretos'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {profile.recentSecrets.map((secret) => (
                  <button
                    key={secret.id}
                    onClick={() => router.push(`/secret/${secret.id}`)}
                    className="w-full p-4 rounded-lg border text-left transition-all duration-200 hover:scale-[1.02]"
                    style={{
                      backgroundColor: theme === 'dark' 
                        ? 'rgba(255, 255, 255, 0.05)' 
                        : 'rgba(0, 0, 0, 0.02)',
                      borderColor: theme === 'dark' 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <h3 className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      {secret.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4 opacity-60">
                        <div className="flex items-center gap-1">
                          <FiEye size={14} />
                          <span>{secret.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiHeart size={14} />
                          <span>{secret.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiMessageSquare size={14} />
                          <span>{secret.comments}</span>
                        </div>
                      </div>
                      <span className="opacity-60">
                        {new Date(secret.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}