import { ReactNode, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiUser, FiLogOut, FiShield, FiSun, FiMoon, FiMenu, FiX, FiMessageCircle } from 'react-icons/fi'
import { SiDiscord } from 'react-icons/si'
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

      const response = await fetch('https://api.tusecreto.net/api/messages/unread-count', {
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

      await fetch('https://api.tusecreto.net/api/admin/log-email-copy', {
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
      {/* Simple Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-sm"
        style={{
          backgroundColor: theme === 'dark'
            ? 'rgba(0, 0, 0, 0.95)'
            : 'rgba(255, 255, 255, 0.95)',
          borderColor: theme === 'dark'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Image
                src={theme === 'dark' ? "/tusecreto.png" : "/tusecreto-negro.png"}
                alt="TuSecreto"
                width={100}
                height={35}
                className="h-8 w-auto"
                priority={true}
                quality={100}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md transition-colors duration-200"
                aria-label={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>

              {user ? (
                <>
                  <Link
                    href="/messages"
                    className="relative flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <FiMessageCircle size={16} />
                    <span>Mensajes</span>
                    {unreadCount > 0 && (
                      <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <FiUser size={16} />
                    <span>{user}</span>
                  </Link>

                  {user === 'admin' && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                      style={{ color: theme === 'dark' ? '#fbbf24' : '#d97706' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(217, 119, 6, 0.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      <FiShield size={16} />
                      <span>Admin</span>
                    </Link>
                  )}

                  <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>

                  <button
                    onClick={onLogout}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    style={{ color: theme === 'dark' ? '#f87171' : '#dc2626' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(248, 113, 113, 0.1)' : 'rgba(220, 38, 38, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <FiLogOut size={16} />
                    <span>Salir</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={onLogin}
                  className="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  style={{
                    backgroundColor: theme === 'dark' ? '#ffffff' : '#000000',
                    color: theme === 'dark' ? '#000000' : '#ffffff'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme === 'dark' ? '#e5e5e5' : '#374151'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = theme === 'dark' ? '#ffffff' : '#000000'
                  }}
                >
                  Iniciar Sesión
                </button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md transition-colors duration-200"
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md transition-colors duration-200"
                aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                style={{ color: 'var(--text-primary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t" style={{ borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}>
            <div className="px-4 py-3 space-y-1">
              {user ? (
                <>
                  <Link
                    href="/messages"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <FiMessageCircle size={18} />
                    <span>Mensajes</span>
                    {unreadCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <FiUser size={18} />
                    <span>{user}</span>
                  </Link>

                  {user === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                      style={{ color: theme === 'dark' ? '#fbbf24' : '#d97706' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(217, 119, 6, 0.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      <FiShield size={18} />
                      <span>Panel Admin</span>
                    </Link>
                  )}

                  <hr className="my-2 border-gray-200 dark:border-gray-700" />

                  <button
                    onClick={() => {
                      onLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 w-full text-left"
                    style={{ color: theme === 'dark' ? '#f87171' : '#dc2626' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(248, 113, 113, 0.1)' : 'rgba(220, 38, 38, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <FiLogOut size={18} />
                    <span>Cerrar Sesión</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    onLogin()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  style={{
                    backgroundColor: theme === 'dark' ? '#ffffff' : '#000000',
                    color: theme === 'dark' ? '#000000' : '#ffffff'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme === 'dark' ? '#e5e5e5' : '#374151'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = theme === 'dark' ? '#ffffff' : '#000000'
                  }}
                >
                  Iniciar Sesión
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-16">
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