import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Cookies from 'js-cookie'
import { FiHeart, FiMessageCircle, FiFlag, FiEye, FiArrowLeft } from 'react-icons/fi'
import Layout from '../../components/Layout'
import LoginModal from '../../components/LoginModal'
import BanScreen from '../../components/BanScreen'
import SEO from '../../components/SEO'

interface Secret {
  id: string
  title: string
  content: string
  author: string
  createdAt: string
  views: number
  likes: number
  userLiked?: boolean
}

interface Comment {
  id: string
  content: string
  author: string
  createdAt: string
}

export default function SecretPage() {
  const router = useRouter()
  const { id } = router.query
  const [secret, setSecret] = useState<Secret | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [user, setUser] = useState<string | null>(null)
  const [submittingComment, setSubmittingComment] = useState(false)
  const [likingSecret, setLikingSecret] = useState(false)
  const [showBanScreen, setShowBanScreen] = useState(false)

  useEffect(() => {
    const token = Cookies.get('token')
    if (token) {
      setUser(Cookies.get('username') || null)
      checkBanStatus()
    }
  }, [])

  useEffect(() => {
    if (id) {
      fetchSecret()
      fetchComments()
    }
  }, [id])

  const fetchSecret = async () => {
    try {
      const token = Cookies.get('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const response = await axios.get(`/api/secrets/${id}`, { headers })
      setSecret(response.data)
    } catch (error) {
      console.error('Error fetching secret:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/secrets/${id}/comments`)
      setComments(response.data)
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

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

  const handleLike = async () => {
    if (!user) {
      setShowLogin(true)
      return
    }

    setLikingSecret(true)
    try {
      const token = Cookies.get('token')
      await axios.post(`/api/secrets/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchSecret()
    } catch (error) {
      console.error('Error liking secret:', error)
    } finally {
      setLikingSecret(false)
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setShowLogin(true)
      return
    }

    if (!newComment.trim()) return

    setSubmittingComment(true)
    try {
      const token = Cookies.get('token')
      await axios.post(`/api/secrets/${id}/comments`, 
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setNewComment('')
      fetchComments()
      fetchSecret() // Para actualizar el contador de comentarios
    } catch (error) {
      console.error('Error posting comment:', error)
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleReport = async () => {
    if (!user) {
      setShowLogin(true)
      return
    }

    if (confirm('¿Estás seguro de que quieres reportar este secreto?')) {
      try {
        const token = Cookies.get('token')
        await axios.post(`/api/secrets/${id}/report`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
        alert('Secreto reportado correctamente')
      } catch (error) {
        console.error('Error reporting secret:', error)
        alert('Error al reportar el secreto')
      }
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

  if (loading) {
    return (
      <Layout user={user} onLogin={() => setShowLogin(true)} onLogout={handleLogout}>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--text-primary)' }}></div>
        </div>
      </Layout>
    )
  }

  // Si el usuario está baneado, mostrar SOLO la pantalla de ban
  if (showBanScreen) {
    return <BanScreen onClose={() => setShowBanScreen(false)} />
  }

  if (!secret) {
    return (
      <Layout user={user} onLogin={() => setShowLogin(true)} onLogout={handleLogout}>
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Secreto no encontrado</h1>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: 'var(--text-on-accent)'
            }}
          >
            Volver al inicio
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <>
      <SEO
        title={secret.title}
        description={`${secret.content.substring(0, 150)}...`}
        keywords={`secreto anónimo, ${secret.title}, confesión privada, anonimato`}
        url={`https://secretos.tusecreto.net/secret/${secret.id}`}
        type="article"
        publishedTime={secret.createdAt}
        author="Anónimo"
      />
      <Layout user={user} onLogin={() => setShowLogin(true)} onLogout={handleLogout}>
        <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 transition-colors mb-6"
          style={{ color: 'var(--text-secondary)' }}
        >
          <FiArrowLeft size={20} />
          Volver a secretos
        </button>

        <article className="border rounded-lg p-8 mb-8 max-w-full overflow-hidden transition-colors duration-300" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
          <h1 className="text-3xl font-bold mb-4 break-words" style={{ color: 'var(--text-primary)' }}>{secret.title}</h1>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <FiEye size={16} />
                {secret.views} vistas
              </span>
              <span className="whitespace-nowrap">por {secret.author === 'admin' ? 'admin' : 'Anónimo'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">•</span>
              <span className="whitespace-nowrap">{new Date(secret.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
          </div>

          <div className="prose max-w-none mb-6 overflow-hidden">
            <p className="text-lg leading-relaxed whitespace-pre-wrap break-words" style={{ color: 'var(--text-primary)' }}>{secret.content}</p>
          </div>

          <div className="flex items-center justify-between pt-6 border-t" style={{ borderColor: 'var(--border-primary)' }}>
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                disabled={likingSecret}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: secret.userLiked ? '#dc2626' : 'var(--bg-primary)',
                  color: secret.userLiked ? '#ffffff' : 'var(--text-secondary)',
                  border: `1px solid ${secret.userLiked ? '#dc2626' : 'var(--border-primary)'}`
                }}
              >
                <FiHeart size={18} fill={secret.userLiked ? 'currentColor' : 'none'} />
                {secret.likes}
              </button>
              
              <span className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <FiMessageCircle size={18} />
                {comments.length} comentarios
              </span>
            </div>

            <button
              onClick={handleReport}
              className="flex items-center gap-2 transition-colors hover:text-red-400"
              style={{ color: 'var(--text-secondary)' }}
            >
              <FiFlag size={16} />
              Reportar
            </button>
          </div>
        </article>

        {/* Comentarios */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Comentarios ({comments.length})</h2>

          {user ? (
            <form onSubmit={handleComment} className="border rounded-lg p-6 transition-colors duration-300" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe tu comentario..."
                rows={3}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none resize-none mb-4 transition-colors duration-300"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-primary)',
                  color: 'var(--text-primary)'
                }}
                maxLength={500}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  {newComment.length}/500 caracteres
                </span>
                <button
                  type="submit"
                  disabled={submittingComment || !newComment.trim()}
                  className="px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: 'var(--accent-primary)',
                    color: 'var(--text-on-accent)'
                  }}
                >
                  {submittingComment ? 'Enviando...' : 'Comentar'}
                </button>
              </div>
            </form>
          ) : (
            <div className="border rounded-lg p-6 text-center transition-colors duration-300" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
              <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>Inicia sesión para comentar</p>
              <button
                onClick={() => setShowLogin(true)}
                className="px-6 py-2 rounded-lg font-medium transition-colors"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: 'var(--text-on-accent)'
                }}
              >
                Iniciar Sesión
              </button>
            </div>
          )}

          {comments.length === 0 ? (
            <div className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
              <p>No hay comentarios aún</p>
              <p className="text-sm">Sé el primero en comentar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="border rounded-lg p-6 transition-colors duration-300" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{comment.author === 'admin' ? 'admin' : 'Anónimo'}</span>
                    <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                      {new Date(comment.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap break-words" style={{ color: 'var(--text-secondary)' }}>{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </section>
        </div>

        {showLogin && (
          <LoginModal
            onClose={() => setShowLogin(false)}
            onLogin={handleLogin}
          />
        )}
      </Layout>
    </>
  )
}