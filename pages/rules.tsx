import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import Layout from '../components/Layout'
import LoginModal from '../components/LoginModal'
import BanScreen from '../components/BanScreen'

export default function Rules() {
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
            <h1 className="text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Reglas de TuSecreto</h1>
            <div className="w-24 h-1 mx-auto mb-6" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Normativas, términos y políticas de privacidad que rigen el uso de nuestra plataforma anónima.
            </p>
          </div>

          {/* Content Sections */}
          <div className="grid gap-8">
            
            {/* Contenido Prohibido - Sección Principal */}
            <section className="rounded-xl p-8 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
                  <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>⚠️</span>
                </div>
                <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Contenido Estrictamente Prohibido</h2>
              </div>
              <div className="space-y-6">
                <p className="leading-relaxed text-lg" style={{ color: 'var(--text-secondary)' }}>
                  Aunque nuestra plataforma se rige por las leyes suecas y respetamos el anonimato, 
                  <strong style={{ color: 'var(--text-primary)' }}>NO toleramos y tomaremos medidas inmediatas contra usuarios que publiquen:</strong>
                </p>
                <div className="grid gap-3">
                  <div className="flex items-start gap-3 p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--accent-primary)', borderWidth: '2px' }}>
                    <div className="w-3 h-3 rounded-full mt-1" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Material de explotación infantil (child porn) o cualquier contenido que involucre menores de edad</span>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-secondary)' }}>
                    <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                    <span style={{ color: 'var(--text-secondary)' }}>Contenido que incite a la violencia o al odio</span>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-secondary)' }}>
                    <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                    <span style={{ color: 'var(--text-secondary)' }}>Amenazas directas contra personas específicas</span>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-secondary)' }}>
                    <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                    <span style={{ color: 'var(--text-secondary)' }}>Contenido que viole las leyes suecas o internacionales</span>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-secondary)' }}>
                    <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                    <span style={{ color: 'var(--text-secondary)' }}>Spam o contenido comercial no autorizado</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Advertencia para Menores */}
            <section className="rounded-xl p-8 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
                  <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>🔞</span>
                </div>
                <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Advertencia para Menores de Edad</h2>
              </div>
              
              <div className="rounded-xl p-6 mb-6 border-2" style={{ 
                backgroundColor: 'var(--bg-primary)', 
                borderColor: 'var(--accent-primary)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>⚠️ ADVERTENCIA IMPORTANTE PARA MENORES DE EDAD</h3>
                    <div className="space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <p className="font-semibold">
                        Si eres menor de 18 años y planeas compartir contenido ofensivo, ilegal o que pueda comprometernos legalmente, 
                        <span className="underline">DEBES RETIRARTE INMEDIATAMENTE</span> de esta plataforma.
                      </p>
                      <p>
                        <strong>Consecuencias por incumplimiento:</strong>
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Bloqueo permanente de la cuenta</li>
                        <li>Reporte a autoridades competentes</li>
                        <li>Acciones legales contra el menor y sus tutores legales</li>
                        <li>Notificación a instituciones educativas si es aplicable</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Descripción del Servicio */}
            <section className="rounded-xl p-8 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
                  <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>ℹ️</span>
                </div>
                <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>¿Qué es TuSecreto?</h2>
              </div>
              <div className="space-y-4">
                <p className="leading-relaxed text-lg" style={{ color: 'var(--text-secondary)' }}>
                  TuSecreto es una plataforma anónima que permite a los usuarios compartir secretos, 
                  comentar y reaccionar a contenido de forma completamente anónima.
                </p>
                <div className="rounded-lg p-4 border-l-4" style={{ backgroundColor: 'var(--bg-primary)', borderLeftColor: 'var(--accent-primary)' }}>
                  <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Compromiso de Privacidad:</strong> No recopilamos información personal identificable como emails o datos personales.
                  </p>
                </div>
              </div>
            </section>

            {/* Privacidad y Datos */}
            <section className="rounded-xl p-8 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
                  <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>🔒</span>
                </div>
                <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Privacidad y Protección de Datos</h2>
              </div>
              <div className="space-y-6">
                <p className="leading-relaxed text-lg" style={{ color: 'var(--text-secondary)' }}>
                  Tu privacidad es fundamental para nosotros. TuSecreto está diseñado desde cero para proteger tu anonimato 
                  y operamos bajo el principio de "privacidad por diseño".
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
                      <span style={{ color: 'var(--text-secondary)' }}>Direcciones IP o datos de ubicación</span>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                      <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
                      <span style={{ color: 'var(--text-secondary)' }}>Información personal identificable</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg p-4 border-l-4" style={{ backgroundColor: 'var(--bg-primary)', borderLeftColor: 'var(--accent-primary)' }}>
                  <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Almacenamiento de Datos:</strong> Solo almacenamos la información mínima 
                    necesaria para el funcionamiento de la plataforma: contenido publicado, nombres de usuario y contraseñas encriptadas. 
                    Todos los datos se almacenan de forma segura en servidores ubicados en Suecia.
                  </p>
                </div>
              </div>
            </section>

            {/* Moderación y Sanciones */}
            <section className="rounded-xl p-8 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
                  <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>⚖️</span>
                </div>
                <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Moderación y Sanciones</h2>
              </div>
              <div className="space-y-6">
                <p className="leading-relaxed text-lg" style={{ color: 'var(--text-secondary)' }}>
                  Nos reservamos el derecho de eliminar contenido y banear usuarios que violen estas 
                  reglas. Los usuarios pueden reportar contenido inapropiado, y nuestro equipo de 
                  moderación revisará cada reporte de manera confidencial.
                </p>
                <div className="rounded-lg p-6 border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-secondary)' }}>
                  <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Consecuencias por Violaciones</h4>
                  <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Los usuarios que violen repetidamente nuestras reglas pueden ser suspendidos o baneados permanentemente. 
                    Las violaciones graves (como contenido ilegal) resultarán en baneos inmediatos y reporte a las autoridades correspondientes.
                  </p>
                </div>
              </div>
            </section>

            {/* Responsabilidad del Usuario */}
            <section className="rounded-xl p-8 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
                  <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>📋</span>
                </div>
                <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Responsabilidad del Usuario</h2>
              </div>
              <div className="space-y-6">
                <p className="leading-relaxed text-lg" style={{ color: 'var(--text-secondary)' }}>
                  Los usuarios son completamente responsables del contenido que publican. 
                  TuSecreto actúa como una plataforma neutral y no se hace responsable por 
                  el contenido generado por los usuarios.
                </p>
                <div className="rounded-lg p-6 border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-secondary)' }}>
                  <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Responsabilidad Legal</h4>
                  <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Al utilizar nuestra plataforma, aceptas que cualquier consecuencia legal 
                    derivada de tu contenido es tu responsabilidad exclusiva. Al acceder y utilizar TuSecreto, 
                    aceptas estar sujeto a estas reglas y condiciones.
                  </p>
                </div>
              </div>
            </section>

            {/* Modificaciones */}
            <section className="rounded-xl p-8 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
                  <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>📝</span>
                </div>
                <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Modificaciones de las Reglas</h2>
              </div>
              <p className="leading-relaxed text-lg" style={{ color: 'var(--text-secondary)' }}>
                Nos reservamos el derecho de modificar estas reglas en cualquier momento. 
                Los cambios serán efectivos inmediatamente después de su publicación en esta página. 
                Es responsabilidad del usuario revisar periódicamente estas reglas.
              </p>
            </section>
          </div>

          {/* Footer Section */}
          <div className="mt-16 pt-8 border-t text-center" style={{ borderColor: 'var(--border-primary)' }}>
            <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Reglas de TuSecreto
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                <strong>Última actualización:</strong> Enero 2025
              </p>
              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Al continuar usando TuSecreto, aceptas cumplir con estas reglas y condiciones.
                </p>
              </div>
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