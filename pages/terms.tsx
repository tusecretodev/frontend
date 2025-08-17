import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import Layout from '../components/Layout'
import LoginModal from '../components/LoginModal'
import BanScreen from '../components/BanScreen'

export default function Terms() {
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
            <h1 className="text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Términos y Condiciones</h1>
            <div className="w-24 h-1 mx-auto mb-6" style={{ backgroundColor: 'var(--accent-primary)' }}></div>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Estos términos rigen el uso de TuSecreto. Al utilizar nuestra plataforma, aceptas cumplir con estas condiciones.
            </p>
          </div>

          {/* Content Sections */}
          <div className="grid gap-8">
          <section className="rounded-xl p-8 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
                <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>1</span>
              </div>
              <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Aceptación de los Términos</h2>
            </div>
            <p className="leading-relaxed text-lg" style={{ color: 'var(--text-secondary)' }}>
              Al acceder y utilizar TuSecreto, aceptas estar sujeto a estos términos y condiciones. 
              Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestro servicio.
            </p>
          </section>

          <section className="rounded-xl p-8 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
                <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>2</span>
              </div>
              <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Descripción del Servicio</h2>
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

          <section className="rounded-xl p-8 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
                <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>3</span>
              </div>
              <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Política sobre Menores de Edad</h2>
            </div>
            
            {/* Advertencia destacada para menores */}
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

            <div className="space-y-4">
              <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Aunque respetamos el derecho a la libre expresión y el anonimato, tenemos la 
                <strong style={{ color: 'var(--text-primary)' }}> responsabilidad legal</strong> de proteger tanto a los menores 
                como a nuestra plataforma de contenido potencialmente dañino.
              </p>
              
              <div className="rounded-lg p-4 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Marco Legal de Protección</h4>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Esta política se fundamenta en el marco legal internacional que protege los derechos de los menores 
                  y establece la responsabilidad de las plataformas digitales ante contenido potencialmente dañino, 
                  incluyendo las leyes de protección infantil y responsabilidad civil aplicables.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl p-8 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
                <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>4</span>
              </div>
              <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Contenido Prohibido</h2>
            </div>
            <div className="space-y-6">
              <p className="leading-relaxed text-lg" style={{ color: 'var(--text-secondary)' }}>
                Aunque nuestra plataforma se rige por las leyes suecas y respetamos el anonimato, 
                <strong style={{ color: 'var(--text-primary)' }}>NO nos eximimos de tomar medidas contra usuarios que publiquen:</strong>
              </p>
              <div className="grid gap-3">
                <div className="flex items-start gap-3 p-4 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                  <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#ef4444' }}></div>
                  <span style={{ color: 'var(--text-secondary)' }}>Material de explotación infantil (CP) o cualquier contenido que involucre menores</span>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                  <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#ef4444' }}></div>
                  <span style={{ color: 'var(--text-secondary)' }}>Contenido que incite a la violencia o al odio</span>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                  <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#ef4444' }}></div>
                  <span style={{ color: 'var(--text-secondary)' }}>Amenazas directas contra personas específicas</span>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                  <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#ef4444' }}></div>
                  <span style={{ color: 'var(--text-secondary)' }}>Contenido que viole las leyes suecas o internacionales</span>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                  <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: '#ef4444' }}></div>
                  <span style={{ color: 'var(--text-secondary)' }}>Spam o contenido comercial no autorizado</span>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl p-8 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
                <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>5</span>
              </div>
              <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Moderación y Sanciones</h2>
            </div>
            <div className="space-y-6">
              <p className="leading-relaxed text-lg" style={{ color: 'var(--text-secondary)' }}>
                Nos reservamos el derecho de eliminar contenido y banear usuarios que violen estos 
                términos. Los usuarios pueden reportar contenido inapropiado, y nuestro equipo de 
                moderación revisará cada reporte de manera confidencial.
              </p>
              <div className="rounded-lg p-6 border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-secondary)' }}>
                <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>⚖️ Consecuencias por Violaciones</h4>
                <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Los usuarios que violen repetidamente nuestros términos pueden ser suspendidos o baneados permanentemente.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl p-8 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
                <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>6</span>
              </div>
              <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Privacidad y Anonimato</h2>
            </div>
            <div className="space-y-6">
              <p className="leading-relaxed text-lg" style={{ color: 'var(--text-secondary)' }}>
                Tu privacidad es fundamental para nosotros. No recopilamos direcciones IP, 
                no utilizamos cookies de seguimiento, y no solicitamos información personal. 
                Solo requerimos un nombre de usuario y contraseña para la funcionalidad básica.
              </p>
              <div className="rounded-lg p-4 border-l-4" style={{ backgroundColor: 'var(--bg-primary)', borderLeftColor: 'var(--accent-primary)' }}>
                <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Almacenamiento de Datos:</strong> Almacenamos únicamente la información mínima 
                  necesaria para el funcionamiento de la plataforma y la seguridad de nuestros usuarios. 
                  Esto incluye el contenido publicado, nombres de usuario y contraseñas encriptadas. 
                  Todos los datos se almacenan de forma segura y se utilizan exclusivamente para 
                  mantener la integridad y seguridad de la plataforma.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl p-8 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
                <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>7</span>
              </div>
              <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Responsabilidad del Usuario</h2>
            </div>
            <div className="space-y-6">
              <p className="leading-relaxed text-lg" style={{ color: 'var(--text-secondary)' }}>
                Los usuarios son completamente responsables del contenido que publican. 
                TuSecreto actúa como una plataforma neutral y no se hace responsable por 
                el contenido generado por los usuarios.
              </p>
              <div className="rounded-lg p-6 border" style={{ backgroundColor: 'rgba(168, 85, 247, 0.05)', borderColor: 'rgba(168, 85, 247, 0.2)' }}>
                <h4 className="font-semibold mb-3" style={{ color: '#7c3aed' }}>📋 Responsabilidad Legal</h4>
                <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Al utilizar nuestra plataforma, aceptas que cualquier consecuencia legal 
                  derivada de tu contenido es tu responsabilidad exclusiva.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl p-8 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
                <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>8</span>
              </div>
              <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Modificaciones</h2>
            </div>
            <p className="leading-relaxed text-lg" style={{ color: 'var(--text-secondary)' }}>
              Nos reservamos el derecho de modificar estos términos en cualquier momento. 
              Los cambios serán efectivos inmediatamente después de su publicación en esta página.
            </p>
          </section>

          <section className="rounded-xl p-8 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
                <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>9</span>
              </div>
              <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Contacto</h2>
            </div>
            <div className="space-y-4">
              <p className="leading-relaxed text-lg" style={{ color: 'var(--text-secondary)' }}>
                Debido a la naturaleza anónima de nuestra plataforma, no proporcionamos 
                información de contacto directo. Todas las consultas deben realizarse a 
                través de los canales oficiales disponibles en la plataforma.
              </p>
              <div className="rounded-lg p-4 border-l-4" style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)', borderLeftColor: '#3b82f6' }}>
                <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Canales Oficiales:</strong> Utiliza los sistemas de reporte integrados en la plataforma para cualquier consulta o problema.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Section */}
        <div className="mt-16 pt-8 border-t text-center" style={{ borderColor: 'var(--border-primary)' }}>
          <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <p className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Términos y Condiciones de TuSecreto
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              <strong>Última actualización:</strong> Agosto 2025
            </p>
            <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Al continuar usando TuSecreto, aceptas estos términos y condiciones.
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