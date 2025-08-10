import { ReactNode, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiUser, FiLogOut, FiShield, FiSun, FiMoon, FiMenu, FiX, FiMessageCircle } from 'react-icons/fi'
import { SiDiscord } from 'react-icons/si'
import { FiGlobe } from 'react-icons/fi'
import { useTheme } from '../contexts/ThemeContext'
import Cookies from 'js-cookie'


interface LayoutProps {
  children: ReactNode
  user: string | null
  onLogin: () => void
  onLogout: () => void
}

export default function Layout({ children, user, onLogin, onLogout }: LayoutProps) {
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [showWarningModal, setShowWarningModal] = useState(false)

  // Función para obtener el conteo de mensajes no leídos
  const fetchUnreadCount = async () => {
    if (!user) return

    try {
      const token = Cookies.get('token')
      if (!token) return

      const response = await fetch('/api/messages/unread-count', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUnreadCount(data.unreadCount)
      }
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  }

  useEffect(() => {
    if (!user) {
      setUnreadCount(0)
      return
    }

    fetchUnreadCount()
    
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchUnreadCount, 30000)
    
    return () => clearInterval(interval)
  }, [user])

  // Función para enviar log de copia de email
  const logEmailCopy = async () => {
    try {
      const token = Cookies.get('token')
      const username = Cookies.get('username')
      
      // Preparar datos para el log
      const logData = {
        action: 'support_email_copied',
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        user: username || null,
        additionalInfo: {
          language: navigator.language,
          platform: navigator.platform,
          screen: {
            width: screen.width,
            height: screen.height
          },
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        }
      }

      // Enviar al backend
      const headers: any = {
        'Content-Type': 'application/json'
      }
      
      // Agregar token si existe
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      await fetch('/api/admin/log-email-copy', {
        method: 'POST',
        headers,
        body: JSON.stringify(logData)
      })
      
      console.log('📧 Email copy logged successfully')
    } catch (error) {
      console.error('Error logging email copy:', error)
    }
  }

  // Función para mostrar advertencia
  const showWarning = async () => {
    // Registrar el evento antes de mostrar la advertencia
    await logEmailCopy()
    
    setShowWarningModal(true)
    setTimeout(() => {
      setShowWarningModal(false)
    }, 8000)
  }

  // Función para manejar clic en email de soporte
  const handleSupportEmailClick = () => {
    const email = 'soporte@tusecreto.net'
    
    // Copiar al portapapeles
    navigator.clipboard.writeText(email).then(() => {
      showWarning()
    }).catch(err => {
      console.error('Error copiando email:', err)
      showWarning()
    })
  }

  // Detectar copia del email por cualquier método (Ctrl+C, menú contextual, etc.)
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      const selection = window.getSelection()
      const selectedText = selection?.toString().trim()
      
      // Si el texto seleccionado contiene el email de soporte
      if (selectedText && selectedText.includes('soporte@tusecreto.net')) {
        e.preventDefault()
        
        // Copiar el email limpio al portapapeles
        navigator.clipboard.writeText('soporte@tusecreto.net').then(() => {
          showWarning()
        }).catch(() => {
          showWarning()
        })
      }
    }

    // Agregar event listener para detectar copia
    document.addEventListener('copy', handleCopy)
    
    // Cleanup
    return () => {
      document.removeEventListener('copy', handleCopy)
    }
  }, [])
  
  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>

      
      {/* Floating Header */}
      <header className="fixed top-2 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl px-3 md:px-4 floating-header">
        <div 
          className="backdrop-blur-xl rounded-2xl border shadow-2xl transition-all duration-500 hover:shadow-3xl hover-lift animate-float"
          style={{
            backgroundColor: theme === 'dark' 
              ? 'rgba(0, 0, 0, 0.85)' 
              : 'rgba(255, 255, 255, 0.95)',
            borderColor: theme === 'dark' 
              ? 'rgba(255, 255, 255, 0.15)' 
              : 'rgba(0, 0, 0, 0.12)',
            boxShadow: theme === 'dark'
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.08), 0 8px 32px rgba(0, 0, 0, 0.5)'
              : '0 25px 50px -12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.08), 0 8px 32px rgba(0, 0, 0, 0.15)'
          }}
        >
          <div className="flex justify-between items-center px-4 py-3">
            <Link href="/" className="flex items-center group">
              <div className="relative overflow-hidden rounded-xl p-2 transition-all duration-300 group-hover:scale-105">
                <Image 
                  src={theme === 'dark' ? "/tusecreto.png" : "/tusecreto-negro.png"} 
                  alt="TuSecreto" 
                  width={100} 
                  height={35} 
                  className="h-7 w-auto transition-all duration-300"
                  priority={true}
                  quality={100}
                  placeholder="empty"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2.5">
              <button
                onClick={toggleTheme}
                className="relative p-3 rounded-xl transition-all duration-300 hover:scale-110 group overflow-hidden"
                aria-label={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
                title={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
                style={{ 
                  backgroundColor: theme === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(0, 0, 0, 0.05)',
                  color: 'var(--text-primary)'
                }}
              >
                <div className="relative z-10">
                  {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-yellow-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              </button>
              
              {user ? (
                <>
                  <Link
                    href="/messages"
                    className="relative flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    style={{
                      backgroundColor: theme === 'dark' 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(0, 0, 0, 0.04)',
                      borderColor: theme === 'dark' 
                        ? 'rgba(255, 255, 255, 0.2)' 
                        : 'rgba(0, 0, 0, 0.12)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <div className="p-1 rounded-lg" style={{
                      backgroundColor: theme === 'dark' 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(0, 0, 0, 0.1)'
                    }}>
                      <FiMessageCircle size={14} />
                    </div>
                    <span className="font-medium text-sm">Mensajes</span>
                    
                    {unreadCount > 0 && (
                      <div 
                        className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold"
                        style={{
                          backgroundColor: '#ef4444',
                          color: 'white'
                        }}
                      >
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </div>
                    )}
                  </Link>
                  
                  <Link
                    href="/profile"
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    style={{
                      backgroundColor: theme === 'dark' 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(0, 0, 0, 0.04)',
                      borderColor: theme === 'dark' 
                        ? 'rgba(255, 255, 255, 0.2)' 
                        : 'rgba(0, 0, 0, 0.12)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <div className="p-1 rounded-lg" style={{
                      backgroundColor: theme === 'dark' 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(0, 0, 0, 0.1)'
                    }}>
                      <FiUser size={14} />
                    </div>
                    <span className="font-medium text-sm">{user}</span>
                  </Link>
                  
                  {user === 'admin' && (
                    <Link
                      href="/admin"
                      className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-lg group overflow-hidden"
                      style={{
                        backgroundColor: theme === 'dark' 
                          ? 'rgba(139, 69, 19, 0.25)' 
                          : 'rgba(255, 193, 7, 0.12)',
                        borderColor: theme === 'dark' 
                          ? 'rgba(255, 193, 7, 0.4)' 
                          : 'rgba(255, 193, 7, 0.5)',
                        color: theme === 'dark' ? '#fbbf24' : '#d97706'
                      }}
                    >
                      <div className="relative z-10 flex items-center gap-2">
                        <FiShield size={14} />
                        <span className="font-medium text-sm">Admin</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-orange-400/10 to-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    </Link>
                  )}
                  
                  <button
                    onClick={onLogout}
                    className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-lg group overflow-hidden"
                    style={{
                      backgroundColor: theme === 'dark' 
                        ? 'rgba(220, 38, 38, 0.15)' 
                        : 'rgba(220, 38, 38, 0.08)',
                      borderColor: theme === 'dark' 
                        ? 'rgba(220, 38, 38, 0.4)' 
                        : 'rgba(220, 38, 38, 0.25)',
                      color: '#dc2626'
                    }}
                  >
                    <div className="relative z-10 flex items-center gap-2">
                      <FiLogOut size={14} />
                      <span className="font-medium text-sm">Salir</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-400/10 via-red-500/10 to-red-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  </button>
                </>
              ) : (
                <button
                  onClick={onLogin}
                  className="relative overflow-hidden px-6 py-2.5 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-xl group border"
                  style={{
                    backgroundColor: theme === 'dark'
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.05)',
                    borderColor: theme === 'dark'
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'rgba(0, 0, 0, 0.15)',
                    color: 'var(--text-primary)',
                    boxShadow: theme === 'dark'
                      ? '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
                      : '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <span className="relative z-10 text-sm font-semibold">Iniciar Sesión</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-xl"></div>
                </button>
              )}
            </nav>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="relative p-3 rounded-xl transition-all duration-300 hover:scale-110 group overflow-hidden"
                style={{ 
                  backgroundColor: theme === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(0, 0, 0, 0.05)',
                  color: 'var(--text-primary)'
                }}
              >
                <div className="relative z-10">
                  {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-400/20 to-yellow-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              </button>
              
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="relative p-3 rounded-xl transition-all duration-300 hover:scale-110 group overflow-hidden"
                aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                title={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                style={{ 
                  backgroundColor: theme === 'dark' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(0, 0, 0, 0.05)',
                  color: 'var(--text-primary)'
                }}
              >
                <div className="relative z-10">
                  {mobileMenuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
                </div>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div 
            className="md:hidden mt-4 rounded-2xl border backdrop-blur-xl transition-all duration-300 animate-in slide-in-from-top-2"
            style={{
              backgroundColor: theme === 'dark' 
                ? 'rgba(0, 0, 0, 0.9)' 
                : 'rgba(255, 255, 255, 0.95)',
              borderColor: theme === 'dark' 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="p-6 space-y-4">
              {user ? (
                <>
                  <Link
                    href="/messages"
                    onClick={() => setMobileMenuOpen(false)}
                    className="relative flex items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: theme === 'dark' 
                        ? 'rgba(255, 255, 255, 0.08)' 
                        : 'rgba(0, 0, 0, 0.03)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <div className="p-2 rounded-lg" style={{
                      backgroundColor: theme === 'dark' 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(0, 0, 0, 0.1)'
                    }}>
                      <FiMessageCircle size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Mensajes</div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {unreadCount > 0 ? `${unreadCount} mensajes no leídos` : 'Ver conversaciones'}
                      </div>
                    </div>
                    
                    {unreadCount > 0 && (
                      <div 
                        className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold"
                        style={{
                          backgroundColor: '#ef4444',
                          color: 'white'
                        }}
                      >
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </div>
                    )}
                  </Link>
                  
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: theme === 'dark' 
                        ? 'rgba(255, 255, 255, 0.08)' 
                        : 'rgba(0, 0, 0, 0.03)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <div className="p-2 rounded-lg" style={{
                      backgroundColor: theme === 'dark' 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(0, 0, 0, 0.1)'
                    }}>
                      <FiUser size={18} />
                    </div>
                    <div>
                      <div className="font-medium">{user}</div>
                      <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Ver perfil</div>
                    </div>
                  </Link>
                  
                  {user === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:scale-105"
                      style={{
                        backgroundColor: theme === 'dark' 
                          ? 'rgba(139, 69, 19, 0.2)' 
                          : 'rgba(255, 193, 7, 0.1)',
                        color: theme === 'dark' ? '#fbbf24' : '#d97706'
                      }}
                    >
                      <div className="p-2 rounded-lg" style={{
                        backgroundColor: theme === 'dark' 
                          ? 'rgba(255, 193, 7, 0.2)' 
                          : 'rgba(255, 193, 7, 0.2)'
                      }}>
                        <FiShield size={18} />
                      </div>
                      <div>
                        <div className="font-medium">Panel Admin</div>
                        <div className="text-sm opacity-80">Administrar contenido</div>
                      </div>
                    </Link>
                  )}
                  
                  <button
                    onClick={() => {
                      onLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="flex items-center gap-3 p-4 rounded-xl transition-all duration-300 hover:scale-105 w-full text-left"
                    style={{
                      backgroundColor: theme === 'dark' 
                        ? 'rgba(220, 38, 38, 0.1)' 
                        : 'rgba(220, 38, 38, 0.05)',
                      color: '#dc2626'
                    }}
                  >
                    <div className="p-2 rounded-lg" style={{
                      backgroundColor: 'rgba(220, 38, 38, 0.1)'
                    }}>
                      <FiLogOut size={18} />
                    </div>
                    <div>
                      <div className="font-medium">Cerrar Sesión</div>
                      <div className="text-sm opacity-80">Salir de tu cuenta</div>
                    </div>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    onLogin()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full p-4 rounded-xl font-medium transition-all duration-300 hover:scale-105 border"
                  style={{
                    backgroundColor: theme === 'dark'
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.05)',
                    borderColor: theme === 'dark'
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'rgba(0, 0, 0, 0.15)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <div className="text-center">
                    <div className="font-semibold">Iniciar Sesión</div>
                    <div className="text-sm opacity-90">Accede a tu cuenta</div>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="relative z-10 min-h-screen pt-24">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-sm space-y-4" style={{ color: 'var(--text-secondary)' }}>
            <p>
              TuSecreto está hosteado en servidores especializados en anonimato y privacidad.
            </p>
            
            <div className="flex justify-center items-center gap-4">
              {/* Discord Button */}
              <button
                className="group relative flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #5865F2 0%, #4752C4 100%)',
                  color: '#ffffff'
                }}
                onClick={() => {
                  window.open('https://discord.gg/wy5s5tkZ', '_blank')
                }}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Discord Icon with glow effect */}
                <div className="relative z-10 p-1 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <SiDiscord size={22} className="drop-shadow-lg" />
                </div>
                
                <div className="relative z-10">
                  <span className="font-semibold text-sm tracking-wide">Discord</span>
                  <div className="text-xs opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                    Únete a la comunidad
                  </div>
                </div>
                
                {/* Animated background particles */}
                <div className="absolute top-0 left-0 w-full h-full opacity-20">
                  <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full animate-pulse"></div>
                  <div className="absolute top-3 right-2 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-300"></div>
                  <div className="absolute bottom-2 left-3 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-500"></div>
                </div>
              </button>

            </div>
            
            <p className="pt-2">
              <Link href="/terms" className="hover:underline transition-all duration-300" style={{ color: 'var(--text-primary)' }}>
                Términos y Condiciones
              </Link>
              {' • '}
              <Link href="/privacy" className="hover:underline transition-all duration-300" style={{ color: 'var(--text-primary)' }}>
                Política de Privacidad
              </Link>
            </p>
            
            <div className="pt-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
              <p className="text-xs mb-3" style={{ color: 'var(--text-tertiary)' }}>
                Para reportes y soporte técnico:
              </p>
              <div className="inline-block">
                <button
                  onClick={handleSupportEmailClick}
                  className="group relative px-4 py-2 rounded-lg border transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{ 
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-primary)',
                    color: 'var(--text-primary)'
                  }}
                  title="Haz clic para copiar el email"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="font-mono text-sm font-medium select-all">
                      soporte@tusecreto.net
                    </span>
                    <svg className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                </button>
                
                <p className="text-xs mt-2 opacity-70" style={{ color: 'var(--text-tertiary)' }}>
                  Haz clic o selecciona para copiar
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal de Advertencia */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[99999] p-4">
          <div 
            className="rounded-xl p-6 max-w-lg w-full border shadow-2xl"
            style={{ 
              backgroundColor: 'var(--bg-primary)', 
              borderColor: 'var(--border-primary)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div className="text-center">
              <div className="mb-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
                  style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                >
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Email copiado - Advertencia Legal
              </h3>
              
              <div className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-left">
                  <p className="font-medium text-red-800 dark:text-red-300">
                    <strong>AVISO IMPORTANTE:</strong>
                  </p>
                  <p className="mt-2 text-red-700 dark:text-red-400">
                    Toda acusación será investigada en profundidad. En caso de detectarse pruebas de conductas ilícitas por parte del denunciante, estas serán entregadas de forma inmediata a las autoridades competentes, sin excepción.
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setShowWarningModal(false)}
                className="px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: 'var(--text-on-accent)'
                }}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}