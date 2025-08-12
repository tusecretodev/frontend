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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>Política de Privacidad</h1>
        
        <div className="max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>1. Compromiso con la Privacidad</h2>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              En TuSecreto, la privacidad no es solo una característica, es nuestro principio fundamental. 
              Esta política explica cómo protegemos tu anonimato y qué información (mínima) procesamos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>2. Información que NO Recopilamos</h2>
            <div className="rounded-lg p-6 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
              <h3 className="text-lg font-medium mb-3" style={{ color: '#10b981' }}>✅ Garantías de Privacidad</h3>
              <ul className="list-disc list-inside space-y-2" style={{ color: 'var(--text-secondary)' }}>
                <li><strong style={{ color: 'var(--text-primary)' }}>NO</strong> recopilamos direcciones de correo electrónico</li>
                <li><strong style={{ color: 'var(--text-primary)' }}>NO</strong> almacenamos direcciones IP</li>
                <li><strong style={{ color: 'var(--text-primary)' }}>NO</strong> utilizamos cookies de seguimiento</li>
                <li><strong style={{ color: 'var(--text-primary)' }}>NO</strong> recopilamos información personal identificable</li>
                <li><strong style={{ color: 'var(--text-primary)' }}>NO</strong> utilizamos servicios de análitica de terceros</li>
                <li><strong style={{ color: 'var(--text-primary)' }}>NO</strong> compartimos datos con terceros</li>
                <li><strong style={{ color: 'var(--text-primary)' }}>NO</strong> tenemos integración con redes sociales</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>3. Información Mínima que Procesamos</h2>
            <p className="leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              Para el funcionamiento básico de la plataforma, únicamente procesamos:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4" style={{ color: 'var(--text-secondary)' }}>
              <li><strong style={{ color: 'var(--text-primary)' }}>Nombre de usuario:</strong> Elegido por ti, puede ser completamente ficticio</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Contraseña:</strong> Almacenada con hash seguro, nunca en texto plano</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Contenido publicado:</strong> Secretos y comentarios que eliges compartir</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Metadatos básicos:</strong> Fechas de publicación y contadores públicos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>4. Hosting y Jurisdicción</h2>
            <p className="leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              TuSecreto está hosteado en servidores especializados en privacidad y anonimato, 
              operando bajo estrictas leyes de protección de datos internacionales.
            </p>
            <div className="rounded-lg p-6 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
              <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--text-primary)' }}>Características del Hosting:</h3>
              <ul className="list-disc list-inside space-y-2" style={{ color: 'var(--text-secondary)' }}>
                <li>Servidores especializados en privacidad</li>
                <li>Opera bajo leyes internacionales de protección de datos</li>
                <li>No requiere información personal para servicios</li>
                <li>Infraestructura centrada en el anonimato</li>
                <li>Protección avanzada contra seguimiento</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>5. Seguridad de Datos</h2>
            <p className="leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              Implementamos las siguientes medidas de seguridad:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4" style={{ color: 'var(--text-secondary)' }}>
              <li><strong style={{ color: 'var(--text-primary)' }}>Cifrado HTTPS</strong> en todas las comunicaciones</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Hashing seguro</strong> de contraseñas con bcrypt</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Almacenamiento local</strong> sin bases de datos externas</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Código fuente</strong> auditado regularmente</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Servidores configurados</strong> con las mejores prácticas de seguridad</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>6. Cookies y Almacenamiento Local</h2>
            <p className="leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              Utilizamos únicamente cookies esenciales para el funcionamiento:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4" style={{ color: 'var(--text-secondary)' }}>
              <li><strong style={{ color: 'var(--text-primary)' }}>Token de sesión:</strong> Para mantener tu sesión activa</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Nombre de usuario:</strong> Para personalizar la interfaz</li>
            </ul>
            <p className="leading-relaxed mt-4" style={{ color: 'var(--text-secondary)' }}>
              Estas cookies se eliminan automáticamente cuando cierras sesión o expiran en 7 días.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>7. Retención de Datos</h2>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Los datos se mantienen únicamente mientras sean necesarios para el funcionamiento 
              de la plataforma. Los usuarios pueden eliminar su cuenta y todo su contenido 
              en cualquier momento sin necesidad de justificación.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>8. Transparencia Total</h2>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              A diferencia de otras plataformas, en TuSecreto no hay letra pequeña. 
              Lo que ves es lo que obtienes: anonimato real, sin seguimiento, sin recopilación 
              de datos personales, sin monetización de tu información.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>9. Derechos del Usuario</h2>
            <p className="leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              Aunque operamos con datos mínimos, tienes derecho a:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4" style={{ color: 'var(--text-secondary)' }}>
              <li>Eliminar tu cuenta y todo tu contenido</li>
              <li>Modificar o eliminar tus publicaciones</li>
              <li>Acceder a la información que tenemos (que es mínima)</li>
              <li>Reportar contenido inapropiado de forma anónima</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>10. Cambios en la Política</h2>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Cualquier cambio en esta política será comunicado claramente en la plataforma. 
              Nunca realizaremos cambios que comprometan el anonimato o la privacidad sin 
              notificación previa.
            </p>
          </section>

          <div className="rounded-lg p-6 mt-8 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
            <h3 className="text-lg font-medium mb-3" style={{ color: '#10b981' }}>🔒 Resumen de Privacidad</h3>
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Datos recopilados:</strong> Solo usuario, contraseña (hasheada) y contenido público
            </p>
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Seguimiento:</strong> Cero seguimiento, sin analytics
            </p>
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Terceros:</strong> Sin compartir datos con terceros
            </p>
            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Jurisdicción:</strong> Leyes de privacidad suecas
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Última actualización:</strong> Agosto 2024
            </p>
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