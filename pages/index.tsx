import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import axios from 'axios'
import Cookies from 'js-cookie'
import { FiEye, FiHeart, FiMessageCircle, FiFlag, FiPlus, FiSearch, FiX } from 'react-icons/fi'
import Layout from '../components/Layout'
import LoginModal from '../components/LoginModal'
import CreateSecretModal from '../components/CreateSecretModal'
import Announcements from '../components/Announcements'
import BanScreen from '../components/BanScreen'
import UserDisplay from '../components/UserDisplay'
import { useTheme } from '../contexts/ThemeContext'
// import ThreeJSLoader from '../components/ThreeJSLoader' // Removido para reducir bundle size
import SEO from '../components/SEO'

interface Secret {
  id: string
  title: string
  content: string
  author: string
  authorAllowsMessages: boolean
  createdAt: string
  views: number
  likes: number
  comments: number
  preview: string
}

export default function Home() {
  const { theme } = useTheme()
  const [secrets, setSecrets] = useState<Secret[]>([])
  const [loading, setLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [showCreateSecret, setShowCreateSecret] = useState(false)
  const [user, setUser] = useState<string | null>(null)
  const [showWelcome, setShowWelcome] = useState(true)
  const [showBanScreen, setShowBanScreen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = Cookies.get('token')
    if (token) {
      setUser(Cookies.get('username') || null)
      checkBanStatus()
    }
    
    // Mostrar pantalla de bienvenida por 3 segundos
    const welcomeTimer = setTimeout(() => {
      setShowWelcome(false)
      fetchSecrets()
    }, 3000)

    return () => clearTimeout(welcomeTimer)
  }, [])

  const fetchSecrets = async () => {
    try {
      const response = await axios.get('https://api.tusecreto.net/api/secrets')
      setSecrets(response.data)
    } catch (error) {
      console.error('Error fetching secrets:', error)
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

  const handleSecretClick = (secretId: string) => {
    router.push(`/secret/${secretId}`)
  }

  const sendPrivateMessage = (e: React.MouseEvent, authorUsername: string) => {
    e.stopPropagation() // Evitar que se active el click del secreto
    
    if (!user) {
      setShowLogin(true)
      return
    }

    if (authorUsername === user) {
      alert('No puedes enviarte mensajes a ti mismo')
      return
    }

    if (authorUsername === 'admin') {
      alert('No puedes enviar mensajes al administrador')
      return
    }

    router.push(`/messages?user=${authorUsername}`)
  }

  const handleCreateSecret = () => {
    if (!user) {
      setShowLogin(true)
    } else {
      setShowCreateSecret(true)
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
  }

  const handleSecretCreated = () => {
    setShowCreateSecret(false)
    fetchSecrets()
  }

  // Filtrar secretos basado en el término de búsqueda
  const filteredSecrets = secrets.filter(secret => {
    if (!searchTerm.trim()) return true
    
    const searchLower = searchTerm.toLowerCase()
    return (
      secret.content.toLowerCase().includes(searchLower) ||
      secret.title.toLowerCase().includes(searchLower) ||
      secret.author.toLowerCase().includes(searchLower)
    )
  })

  if (showWelcome) {
    return (
      <div className="fixed inset-0 z-50 aws-loading-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
        
        {/* Main content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="text-center max-w-md mx-auto">
            
            {/* Logo container with subtle glow */}
            <div className="mb-12 relative">
              <div className="logo-wrapper">
                <div className="logo-glow-bg"></div>
                <Image 
                  src={theme === 'dark' ? "/tusecreto.png" : "/tusecreto-negro.png"} 
                  alt="TuSecreto" 
                  width={120} 
                  height={42} 
                  className="h-12 w-auto mx-auto logo-image"
                  priority={true}
                  quality={100}
                />
              </div>
            </div>

            {/* Welcome text */}
            <div className="mb-10">
              <h1 className="text-2xl font-semibold mb-3 welcome-title" style={{ color: 'var(--text-primary)' }}>
                Bienvenido a TuSecreto
              </h1>
              <p className="text-base welcome-subtitle" style={{ color: 'var(--text-secondary)' }}>
                Plataforma segura para secretos anónimos
              </p>
            </div>

            {/* AWS-style loading */}
            <div className="loading-section">
              {/* Progress bar */}
              <div className="mb-6">
                <div className="progress-container">
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                </div>
              </div>

              {/* Loading dots */}
              <div className="flex items-center justify-center space-x-1 mb-4">
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
              </div>

              {/* Status text */}
              <p className="text-sm status-text" style={{ color: 'var(--text-tertiary)' }}>
                Inicializando aplicación...
              </p>
            </div>

            {/* Security badge */}
            <div className="mt-8">
              <div className="security-badge">
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-medium">Conexión segura</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <Layout user={user} onLogin={() => setShowLogin(true)} onLogout={handleLogout}>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </Layout>
    )
  }

  // Si el usuario está baneado, mostrar SOLO la pantalla de ban
  if (showBanScreen) {
    return <BanScreen onClose={() => setShowBanScreen(false)} />
  }

  return (
    <>
      <SEO
        title="TuSecreto - Secretos Anónimos y Privados | Máxima Privacidad 2024"
        description="🔒 Descubre y comparte secretos 100% anónimos. Sin emails, sin registro, sin rastreo. La comunidad más privada de secretos. ¡Gratis y sin límites!"
        keywords="secretos anónimos, confesar secretos, plataforma privada, anonimato real, compartir secretos, comunidad anónima, secretos online, confesiones privadas, privacidad digital, sin registro, gratis"
        url="https://tusecreto.net"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "TuSecreto",
          "alternateName": "TuSecreto - Secretos Anónimos",
          "url": "https://tusecreto.net",
          "description": "Plataforma líder para compartir secretos de forma 100% anónima con máxima privacidad y seguridad.",
          "inLanguage": "es-ES",
          "isAccessibleForFree": true,
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://tusecreto.net/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          },
          "publisher": {
            "@type": "Organization",
            "name": "TuSecreto",
            "url": "https://tusecreto.net",
            "logo": {
              "@type": "ImageObject",
              "url": "https://tusecreto.net/tusecreto.png"
            }
          },
          "mainEntity": {
            "@type": "WebApplication",
            "name": "TuSecreto",
            "url": "https://tusecreto.net",
            "applicationCategory": "SocialNetworkingApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR"
            },
            "featureList": [
              "Compartir secretos anónimos",
              "100% privacidad garantizada",
              "Sin registro requerido",
              "Máxima Privacidad",
              "Comunidad activa",
              "Interfaz intuitiva"
            ]
          }
        }}
      />
      <Layout user={user} onLogin={() => setShowLogin(true)} onLogout={handleLogout}>
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-6">
          {/* Anuncios */}
          <Announcements className="mb-8" />
          
          {/* Barra de búsqueda */}
          <div className="mb-6">
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5" style={{ color: 'var(--text-tertiary)' }} />
              </div>
              <input
                type="text"
                placeholder="Buscar secretos por contenido, título o autor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 focus:scale-105"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-primary)',
                  color: 'var(--text-primary)'
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform"
                  aria-label="Limpiar búsqueda"
                  title="Limpiar búsqueda"
                >
                  <FiX className="h-5 w-5" style={{ color: 'var(--text-tertiary)' }} />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {searchTerm ? `Resultados (${filteredSecrets.length})` : 'Secretos Recientes'}
            </h1>
            <button
              onClick={handleCreateSecret}
              className="px-5 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 group text-sm"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--bg-primary)'
              }}
            >
              <FiPlus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              Compartir Secreto
            </button>
          </div>

          {filteredSecrets.length === 0 ? (
            <div className="text-center py-12 rounded-lg border transition-colors duration-300" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
              {searchTerm ? (
                <>
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="text-base mb-3" style={{ color: 'var(--text-secondary)' }}>
                    No se encontraron secretos para "<span className="font-medium" style={{ color: 'var(--text-primary)' }}>{searchTerm}</span>"
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    Intenta con otros términos de búsqueda
                  </p>
                </>
              ) : (
                <>
                  <p className="text-base mb-3" style={{ color: 'var(--text-secondary)' }}>No hay secretos aún</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Sé el primero en compartir un secreto</p>
                </>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredSecrets.map((secret) => (
                <div
                  key={secret.id}
                  onClick={() => handleSecretClick(secret.id)}
                  className="rounded-lg p-4 border transition-all duration-300 cursor-pointer hover:scale-[1.01] hover:shadow-lg max-w-full overflow-hidden"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-primary)'
                  }}
                >
                  <h2 className="text-lg font-semibold mb-2 line-clamp-2 break-words" style={{ color: 'var(--text-primary)' }}>{secret.title}</h2>
                  <p className="mb-3 line-clamp-3 break-words text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{secret.preview}</p>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 transition-colors" style={{ color: 'var(--text-secondary)' }}>
                        <FiEye size={14} className="animate-pulse" />
                        {secret.views}
                      </span>
                      <span className="flex items-center gap-1 hover:text-red-400 transition-colors">
                        <FiHeart size={14} className="hover:scale-110 transition-transform" />
                        {secret.likes}
                      </span>
                      <span className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                        <FiMessageCircle size={14} className="hover:scale-110 transition-transform" />
                        {secret.comments}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {/* Botón de mensaje privado */}
                      {user && secret.author !== 'admin' && secret.author !== user && secret.authorAllowsMessages && (
                        <button
                          onClick={(e) => sendPrivateMessage(e, secret.author)}
                          className="px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 hover:scale-105 flex items-center gap-1"
                          style={{
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            color: '#3b82f6',
                            border: '1px solid rgba(59, 130, 246, 0.2)'
                          }}
                        >
                          <FiMessageCircle size={12} />
                          Mensaje privado
                        </button>
                      )}
                      
                      {/* Enlace al perfil */}
                      {secret.author !== 'admin' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/profiles/${secret.author}`)
                          }}
                          className="hover:underline transition-colors duration-200"
                        >
                          <UserDisplay username={secret.author} showPrefix={true} />
                        </button>
                      )}
                      
                      {secret.author === 'admin' && (
                        <UserDisplay username={secret.author} showPrefix={true} />
                      )}
                      
                      <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>•</span>
                      <span className="text-xs whitespace-nowrap" style={{ color: 'var(--text-tertiary)' }}>
                        {new Date(secret.createdAt).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Layout>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
        />
      )}

      {showCreateSecret && (
        <CreateSecretModal
          onClose={() => setShowCreateSecret(false)}
          onSecretCreated={handleSecretCreated}
        />
      )}
    </>
  )
}