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
        <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>Términos y Condiciones</h1>
        
        <div className="max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>1. Aceptación de los Términos</h2>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Al acceder y utilizar TuSecreto, aceptas estar sujeto a estos términos y condiciones. 
              Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestro servicio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>2. Descripción del Servicio</h2>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              TuSecreto es una plataforma anónima que permite a los usuarios compartir secretos, 
              comentar y reaccionar a contenido de forma completamente anónima. No recopilamos 
              información personal identificable como emails o datos personales.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>3. Jurisdicción y Hosting</h2>
            <p className="leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              TuSecreto está hosteado en servidores especializados en anonimato y privacidad, 
              operando bajo estrictas leyes de privacidad internacionales.
            </p>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              La persona detrás de esta plataforma es completamente anónima y el dominio está 
              registrado siguiendo las mejores prácticas de privacidad disponibles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>4. Política sobre Menores de Edad</h2>
            <p className="leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              No tenemos restricciones para que menores de edad utilicen nuestra plataforma, 
              ya que respetamos el derecho a la libre expresión y el anonimato.
            </p>
            <p className="leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Sin embargo, si eres menor de edad y planeas compartir secretos ofensivos 
              o que puedan comprometernos legalmente, te pedimos gentilmente que te retires 
              de la plataforma.</strong> De lo contrario, podrías ser bloqueado y podríamos 
              tomar acciones legales contra tu persona, conforme a las leyes aplicables de 
              protección de menores y responsabilidad civil.
            </p>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Esta política se basa en el marco legal internacional que protege tanto los 
              derechos de los menores como la responsabilidad de las plataformas digitales 
              ante contenido potencialmente dañino.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>5. Contenido Prohibido</h2>
            <p className="leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              Aunque nuestra plataforma se rige por las leyes suecas y respetamos el anonimato, 
              <strong style={{ color: 'var(--text-primary)' }}>NO nos eximimos de tomar medidas contra usuarios que publiquen:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4" style={{ color: 'var(--text-secondary)' }}>
              <li>Material de explotación infantil (CP) o cualquier contenido que involucre menores</li>
              <li>Contenido que incite a la violencia o al odio</li>
              <li>Amenazas directas contra personas específicas</li>
              <li>Contenido que viole las leyes suecas o internacionales</li>
              <li>Spam o contenido comercial no autorizado</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>6. Moderación y Sanciones</h2>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Nos reservamos el derecho de eliminar contenido y banear usuarios que violen estos 
              términos. Los usuarios pueden reportar contenido inapropiado, y nuestro equipo de 
              moderación revisará cada reporte de manera confidencial.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>7. Privacidad y Anonimato</h2>
            <p className="leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              Tu privacidad es fundamental para nosotros. No recopilamos direcciones IP, 
              no utilizamos cookies de seguimiento, y no solicitamos información personal. 
              Solo requerimos un nombre de usuario y contraseña para la funcionalidad básica.
            </p>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Almacenamiento de Datos:</strong> Almacenamos únicamente la información mínima 
              necesaria para el funcionamiento de la plataforma y la seguridad de nuestros usuarios. 
              Esto incluye el contenido publicado, nombres de usuario y contraseñas encriptadas. 
              Todos los datos se almacenan de forma segura y se utilizan exclusivamente para 
              mantener la integridad y seguridad de la plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>8. Responsabilidad del Usuario</h2>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Los usuarios son completamente responsables del contenido que publican. 
              TuSecreto actúa como una plataforma neutral y no se hace responsable por 
              el contenido generado por los usuarios.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>9. Modificaciones</h2>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Nos reservamos el derecho de modificar estos términos en cualquier momento. 
              Los cambios serán efectivos inmediatamente después de su publicación en esta página.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>10. Contacto</h2>
            <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Debido a la naturaleza anónima de nuestra plataforma, no proporcionamos 
              información de contacto directo. Todas las consultas deben realizarse a 
              través del sistema de reportes interno.
            </p>
          </section>

          <div className="rounded-lg p-6 mt-8 border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Última actualización:</strong> Agosto 2024
            </p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Jurisdicción:</strong> Leyes internacionales de privacidad
            </p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Hosting:</strong> Servidores especializados en privacidad
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