import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import Layout from '../components/Layout'
import LoginModal from '../components/LoginModal'
import BanScreen from '../components/BanScreen'

export default function Privacy() {
  const [showLogin, setShowLogin] = useState(false)
  const [user, setUser] = useState<string | null>(null)
  const [showBanScreen, setShowBanScreen] = useState(false)

  useEffect(() => {
    const token = Cookies.get('token')
    if (token) {
      setUser(Cookies.get('username') || null)
      checkBanStatus()
    }
  }, [])

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

  const handleLogin = (username: string) => {
    setUser(username)
    setShowLogin(false)
  }

  const handleLogout = () => {
    Cookies.remove('token')
    Cookies.remove('username')
    setUser(null)
  }

  // Si el usuario está baneado, mostrar SOLO la pantalla de ban
  if (showBanScreen) {
    return <BanScreen onClose={() => setShowBanScreen(false)} />
  }

  return (
    <Layout user={user} onLogin={() => setShowLogin(true)} onLogout={handleLogout}>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <div className="max-w-5xl mx-auto px-6 py-12">
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Política de Privacidad</h1>
              <div className="w-24 h-1 mx-auto mb-6" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Tu privacidad es nuestra prioridad. Conoce cómo protegemos tu anonimato y qué información manejamos.
              </p>
            </div>

            {/* Content Grid */}
            <div className="grid gap-8">

          <section className="rounded-xl p-8 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
                <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>1</span>
              </div>
              <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Compromiso con la Privacidad</h2>
            </div>
            <div className="space-y-4">
              <p className="leading-relaxed text-lg" style={{ color: 'var(--text-secondary)' }}>
                TuSecreto está diseñado desde cero para proteger tu anonimato. No recopilamos información personal 
                y operamos bajo el principio de "privacidad por diseño".
              </p>
            </div>
          </section>

          <section className="rounded-xl p-8 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
                <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>2</span>
              </div>
              <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Información que NO Recopilamos</h2>
            </div>
            <div className="space-y-6">
              <p className="leading-relaxed text-lg" style={{ color: 'var(--text-secondary)' }}>
                A diferencia de otras plataformas, TuSecreto NO recopila:
              </p>
              <div className="rounded-lg p-6 border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-secondary)' }}>
                <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>🚫 Datos que NUNCA recopilamos:</h3>
                <div className="grid gap-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                    <span style={{ color: 'var(--text-secondary)' }}>Direcciones de correo electrónico</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                    <span style={{ color: 'var(--text-secondary)' }}>Números de teléfono</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                    <span style={{ color: 'var(--text-secondary)' }}>Nombres reales o información de identificación</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                    <span style={{ color: 'var(--text-secondary)' }}>Direcciones físicas</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                    <span style={{ color: 'var(--text-secondary)' }}>Información de tarjetas de crédito o métodos de pago</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                    <span style={{ color: 'var(--text-secondary)' }}>Datos biométricos o de reconocimiento facial</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                    <span style={{ color: 'var(--text-secondary)' }}>Historial de navegación detallado</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                    <span style={{ color: 'var(--text-secondary)' }}>Ubicación geográfica precisa</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl p-8 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
                <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>3</span>
              </div>
              <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Información Mínima que Procesamos</h2>
            </div>
            <div className="space-y-6">
              <p className="leading-relaxed text-lg" style={{ color: 'var(--text-secondary)' }}>
                Para el funcionamiento básico de la plataforma, procesamos únicamente:
              </p>
              <div className="rounded-lg p-6 border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-secondary)' }}>
                <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>✅ Datos mínimos procesados:</h3>
                <div className="grid gap-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                    <span style={{ color: 'var(--text-secondary)' }}>Nombres de usuario anónimos (elegidos por ti)</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                    <span style={{ color: 'var(--text-secondary)' }}>Contenido de secretos y mensajes (almacenado de forma anónima)</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                    <span style={{ color: 'var(--text-secondary)' }}>Timestamps de publicación (para ordenamiento)</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                    <span style={{ color: 'var(--text-secondary)' }}>Datos técnicos básicos para prevenir spam (sin identificación personal)</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl p-8 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
                <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>4</span>
              </div>
              <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Seguridad de Datos</h2>
            </div>
            <div className="space-y-4">
              <p className="leading-relaxed text-lg" style={{ color: 'var(--text-secondary)' }}>
                Implementamos múltiples capas de seguridad para proteger la información procesada:
              </p>
              <div className="grid gap-4">
                <div className="flex items-start gap-3 p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-secondary)' }}>
                  <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                  <span style={{ color: 'var(--text-secondary)' }}>Encriptación de extremo a extremo para todas las comunicaciones</span>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-secondary)' }}>
                  <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                  <span style={{ color: 'var(--text-secondary)' }}>Servidores seguros con protección DDoS</span>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-secondary)' }}>
                  <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                  <span style={{ color: 'var(--text-secondary)' }}>Auditorías de seguridad regulares</span>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-secondary)' }}>
                  <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                  <span style={{ color: 'var(--text-secondary)' }}>Acceso restringido a datos del servidor</span>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl p-8 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
                <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>5</span>
              </div>
              <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Cookies y Almacenamiento Local</h2>
            </div>
            <div className="space-y-4">
              <p className="leading-relaxed text-lg" style={{ color: 'var(--text-secondary)' }}>
                Utilizamos cookies mínimas y almacenamiento local únicamente para:
              </p>
              <div className="grid gap-4">
                <div className="flex items-start gap-3 p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-secondary)' }}>
                  <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                  <span style={{ color: 'var(--text-secondary)' }}>Mantener tu sesión activa (token de autenticación anónimo)</span>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-secondary)' }}>
                  <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                  <span style={{ color: 'var(--text-secondary)' }}>Recordar tus preferencias de tema (claro/oscuro)</span>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-secondary)' }}>
                  <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                  <span style={{ color: 'var(--text-secondary)' }}>Funcionalidad básica del sitio web</span>
                </div>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                No utilizamos cookies de seguimiento, analytics invasivos o cookies de terceros.
              </p>
            </div>
          </section>

          <section className="rounded-xl p-8 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
                <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>6</span>
              </div>
              <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Retención de Datos</h2>
            </div>
            <div className="space-y-4">
              <p className="leading-relaxed text-lg" style={{ color: 'var(--text-secondary)' }}>
                Los datos se mantienen únicamente el tiempo necesario para el funcionamiento del servicio:
              </p>
              <div className="grid gap-4">
                <div className="flex items-start gap-3 p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-secondary)' }}>
                  <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                  <span style={{ color: 'var(--text-secondary)' }}>Secretos y mensajes: Se mantienen hasta que el usuario los elimine</span>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-secondary)' }}>
                  <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                  <span style={{ color: 'var(--text-secondary)' }}>Datos técnicos: Eliminados automáticamente después de 30 días</span>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-secondary)' }}>
                  <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                  <span style={{ color: 'var(--text-secondary)' }}>Cuentas inactivas: Eliminadas después de 1 año de inactividad</span>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl p-8 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
                <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>7</span>
              </div>
              <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Transparencia Total</h2>
            </div>
            <div className="space-y-4">
              <p className="leading-relaxed text-lg" style={{ color: 'var(--text-secondary)' }}>
                Creemos en la transparencia completa sobre nuestras prácticas de privacidad:
              </p>
              <div className="grid gap-4">
                <div className="flex items-start gap-3 p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-secondary)' }}>
                  <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                  <span style={{ color: 'var(--text-secondary)' }}>Código abierto disponible para auditoría pública</span>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-secondary)' }}>
                  <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                  <span style={{ color: 'var(--text-secondary)' }}>Reportes de transparencia regulares</span>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-secondary)' }}>
                  <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                  <span style={{ color: 'var(--text-secondary)' }}>Sin puertas traseras o accesos ocultos</span>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl p-8 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
                <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>8</span>
              </div>
              <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Derechos del Usuario</h2>
            </div>
            <div className="space-y-6">
              <p className="leading-relaxed text-lg" style={{ color: 'var(--text-secondary)' }}>
                Como usuario de TuSecreto, tienes los siguientes derechos:
              </p>
              <div className="rounded-lg p-6 border" style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
                <h3 className="text-lg font-medium mb-4" style={{ color: '#2563eb' }}>🛡️ Tus Derechos:</h3>
                <div className="grid gap-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                    <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#3b82f6' }}></div>
                    <span style={{ color: 'var(--text-secondary)' }}>Eliminar tu cuenta y todos los datos asociados en cualquier momento</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                    <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#3b82f6' }}></div>
                    <span style={{ color: 'var(--text-secondary)' }}>Solicitar información sobre qué datos procesamos (spoiler: muy pocos)</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                    <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#3b82f6' }}></div>
                    <span style={{ color: 'var(--text-secondary)' }}>Usar la plataforma completamente anónimo</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                    <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#3b82f6' }}></div>
                    <span style={{ color: 'var(--text-secondary)' }}>Reportar cualquier preocupación de privacidad</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl p-8 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
                <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>9</span>
              </div>
              <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Cambios en la Política</h2>
            </div>
            <div className="space-y-4">
              <p className="leading-relaxed text-lg" style={{ color: 'var(--text-secondary)' }}>
                Si realizamos cambios en esta política de privacidad:
              </p>
              <div className="grid gap-4">
                <div className="flex items-start gap-3 p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-secondary)' }}>
                  <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                  <span style={{ color: 'var(--text-secondary)' }}>Te notificaremos a través de un anuncio en la plataforma</span>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-secondary)' }}>
                  <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                  <span style={{ color: 'var(--text-secondary)' }}>Los cambios entrarán en vigor 30 días después del anuncio</span>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-secondary)' }}>
                  <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                  <span style={{ color: 'var(--text-secondary)' }}>Siempre mantendremos nuestro compromiso con la privacidad</span>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl p-8 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
                <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>10</span>
              </div>
              <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Contacto</h2>
            </div>
            <div className="space-y-6">
              <p className="leading-relaxed text-lg" style={{ color: 'var(--text-secondary)' }}>
                Si tienes preguntas sobre esta política de privacidad o nuestras prácticas de datos:
              </p>
              <div className="rounded-lg p-6 border" style={{ backgroundColor: 'rgba(34, 197, 94, 0.05)', borderColor: 'rgba(34, 197, 94, 0.2)' }}>
                <h3 className="text-lg font-medium mb-4" style={{ color: '#10b981' }}>📧 Canales Oficiales:</h3>
                <div className="grid gap-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                    <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#22c55e' }}></div>
                    <span style={{ color: 'var(--text-secondary)' }}>Discord: Únete a nuestro servidor oficial</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                    <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#22c55e' }}></div>
                    <span style={{ color: 'var(--text-secondary)' }}>Email: soporte@tusecreto.net</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                    <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#22c55e' }}></div>
                    <span style={{ color: 'var(--text-secondary)' }}>Formulario de contacto en la plataforma</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

            </div>

            {/* Footer */}
            <div className="mt-16 pt-8 border-t text-center" style={{ borderColor: 'var(--border-primary)' }}>
              <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Política de Privacidad de TuSecreto</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Última actualización: Agosto 2025</p>
              </div>
            </div>
          </div>
      </div>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
        />
      )}
    </Layout>
  )
}