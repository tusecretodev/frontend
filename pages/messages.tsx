import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import Layout from '../components/Layout'
import BanScreen from '../components/BanScreen'
import SEO from '../components/SEO'
import { FiMessageCircle, FiSend, FiUser, FiSearch, FiAlertTriangle, FiTrash2, FiEye } from 'react-icons/fi'
import { useTheme } from '../contexts/ThemeContext'

interface Message {
  id: string
  sender: string
  receiver: string
  content: string
  createdAt: string
  isRead: boolean
}

interface Conversation {
  user: string
  lastMessage: Message
  unreadCount: number
}

export default function Messages() {
  const { theme } = useTheme()
  const [user, setUser] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearch, setShowSearch] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showBanScreen, setShowBanScreen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = Cookies.get('token')
    const username = Cookies.get('username')
    
    if (!token || !username) {
      router.push('/')
      return
    }
    
    setUser(username)
    checkBanStatus()
    fetchConversations()
    
    // Si hay un parámetro user en la URL, abrir esa conversación
    if (router.query.user && typeof router.query.user === 'string') {
      setSelectedConversation(router.query.user)
      fetchMessages(router.query.user)
    }
  }, [router.query])

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

  const fetchConversations = async () => {
    try {
      const token = Cookies.get('token')
      if (!token) return

      const response = await fetch('/api/messages/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setConversations(data)
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (otherUser: string) => {
    try {
      const token = Cookies.get('token')
      if (!token) return

      const response = await fetch(`/api/messages/conversation/${otherUser}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(data)
        
        // Marcar mensajes como leídos
        const unreadMessages = data.filter((msg: Message) => 
          msg.receiver === user && !msg.isRead
        )
        
        for (const msg of unreadMessages) {
          await markAsRead(msg.id)
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const markAsRead = async (messageId: string) => {
    try {
      const token = Cookies.get('token')
      if (!token) return

      await fetch(`/api/messages/${messageId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    try {
      const token = Cookies.get('token')
      if (!token) return

      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiver: selectedConversation,
          content: newMessage.trim()
        })
      })

      if (response.ok) {
        setNewMessage('')
        fetchMessages(selectedConversation)
        fetchConversations()
      } else {
        const error = await response.json()
        alert(error.message || 'Error enviando mensaje')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Error enviando mensaje')
    }
  }

  const searchUsers = async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([])
      return
    }

    try {
      const token = Cookies.get('token')
      if (!token) return

      const response = await fetch(`/api/profiles/search/${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setSearchResults(data)
      }
    } catch (error) {
      console.error('Error searching users:', error)
    }
  }

  const startConversation = (username: string) => {
    setSelectedConversation(username)
    setShowSearch(false)
    setSearchQuery('')
    setSearchResults([])
    fetchMessages(username)
  }

  const reportMessage = async (messageId: string) => {
    const reason = prompt('¿Por qué quieres reportar este mensaje?')
    if (!reason) return

    try {
      const token = Cookies.get('token')
      if (!token) return

      const response = await fetch(`/api/messages/${messageId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      })

      if (response.ok) {
        alert('Mensaje reportado exitosamente')
      } else {
        const error = await response.json()
        alert(error.message || 'Error reportando mensaje')
      }
    } catch (error) {
      console.error('Error reporting message:', error)
      alert('Error reportando mensaje')
    }
  }

  const handleLogin = () => {
    router.push('/')
  }

  const handleLogout = () => {
    Cookies.remove('token')
    Cookies.remove('username')
    router.push('/')
  }

  useEffect(() => {
    if (searchQuery) {
      const timeoutId = setTimeout(() => {
        searchUsers(searchQuery)
      }, 300)
      return () => clearTimeout(timeoutId)
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  if (showBanScreen) {
    return <BanScreen />
  }

  if (loading) {
    return (
      <Layout user={user} onLogin={handleLogin} onLogout={handleLogout}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>Cargando mensajes...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <>
      <SEO
        title="Mensajes Privados Anónimos"
        description="Envía y recibe mensajes privados de forma completamente anónima. Conecta con otros usuarios sin revelar tu identidad."
        keywords="mensajes anónimos, chat privado, mensajería segura, comunicación anónima"
        url="https://secretos.tusecreto.net/messages"
        noindex={true}
      />
      <Layout user={user} onLogin={handleLogin} onLogout={handleLogout}>
      <div className="min-h-screen pt-24 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[80vh]">
            
            {/* Lista de conversaciones */}
            <div 
              className="rounded-2xl border p-6 overflow-hidden"
              style={{
                backgroundColor: theme === 'dark' 
                  ? 'rgba(0, 0, 0, 0.3)' 
                  : 'rgba(255, 255, 255, 0.9)',
                borderColor: theme === 'dark' 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.1)'
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Conversaciones
                </h2>
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="p-2 rounded-lg transition-colors duration-200"
                  style={{
                    backgroundColor: theme === 'dark' 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(0, 0, 0, 0.05)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <FiSearch size={16} />
                </button>
              </div>

              {showSearch && (
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Buscar usuarios..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border transition-colors duration-200"
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
                  
                  {searchResults.length > 0 && (
                    <div 
                      className="mt-2 rounded-lg border max-h-48 overflow-y-auto"
                      style={{
                        backgroundColor: theme === 'dark' 
                          ? 'rgba(0, 0, 0, 0.5)' 
                          : 'rgba(255, 255, 255, 0.95)',
                        borderColor: theme === 'dark' 
                          ? 'rgba(255, 255, 255, 0.1)' 
                          : 'rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      {searchResults.map((searchUser) => (
                        <button
                          key={searchUser.username}
                          onClick={() => startConversation(searchUser.username)}
                          className="w-full p-3 text-left hover:bg-opacity-50 transition-colors duration-200"
                          style={{
                            backgroundColor: 'transparent',
                            color: 'var(--text-primary)'
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                              style={{
                                backgroundColor: theme === 'dark' 
                                  ? 'rgba(255, 255, 255, 0.1)' 
                                  : 'rgba(0, 0, 0, 0.1)'
                              }}
                            >
                              <FiUser size={14} />
                            </div>
                            <div>
                              <p className="font-medium">{searchUser.username}</p>
                              {searchUser.bio && (
                                <p className="text-xs opacity-60">{searchUser.bio}</p>
                              )}
                              {!searchUser.allowPrivateMessages && (
                                <p className="text-xs text-red-500">No acepta mensajes</p>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2 overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="text-center py-8">
                    <FiMessageCircle size={48} className="mx-auto mb-4 opacity-30" />
                    <p style={{ color: 'var(--text-secondary)' }}>No tienes conversaciones aún</p>
                    <p className="text-sm opacity-60">Busca usuarios para empezar a chatear</p>
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <button
                      key={conversation.user}
                      onClick={() => {
                        setSelectedConversation(conversation.user)
                        fetchMessages(conversation.user)
                      }}
                      className={`w-full p-4 rounded-lg text-left transition-all duration-200 ${
                        selectedConversation === conversation.user 
                          ? 'ring-2 ring-blue-500' 
                          : ''
                      }`}
                      style={{
                        backgroundColor: selectedConversation === conversation.user
                          ? theme === 'dark' 
                            ? 'rgba(59, 130, 246, 0.1)' 
                            : 'rgba(59, 130, 246, 0.05)'
                          : theme === 'dark' 
                            ? 'rgba(255, 255, 255, 0.05)' 
                            : 'rgba(0, 0, 0, 0.02)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor: theme === 'dark' 
                                ? 'rgba(255, 255, 255, 0.1)' 
                                : 'rgba(0, 0, 0, 0.1)'
                            }}
                          >
                            <FiUser size={16} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{conversation.user}</p>
                            <p className="text-sm opacity-60 truncate">
                              {conversation.lastMessage.content}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs opacity-60">
                            {new Date(conversation.lastMessage.createdAt).toLocaleDateString()}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <span 
                              className="inline-block w-5 h-5 rounded-full text-xs font-bold text-white text-center leading-5"
                              style={{ backgroundColor: '#ef4444' }}
                            >
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Área de chat */}
            <div 
              className="lg:col-span-2 rounded-2xl border overflow-hidden flex flex-col"
              style={{
                backgroundColor: theme === 'dark' 
                  ? 'rgba(0, 0, 0, 0.3)' 
                  : 'rgba(255, 255, 255, 0.9)',
                borderColor: theme === 'dark' 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.1)'
              }}
            >
              {selectedConversation ? (
                <>
                  {/* Header del chat */}
                  <div 
                    className="p-4 border-b"
                    style={{
                      borderColor: theme === 'dark' 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: theme === 'dark' 
                            ? 'rgba(255, 255, 255, 0.1)' 
                            : 'rgba(0, 0, 0, 0.1)'
                        }}
                      >
                        <FiUser size={16} />
                      </div>
                      <div>
                        <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                          {selectedConversation}
                        </h3>
                        <button
                          onClick={() => router.push(`/profiles/${selectedConversation}`)}
                          className="text-sm opacity-60 hover:opacity-100 transition-opacity"
                        >
                          Ver perfil
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mensajes */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === user ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg relative group ${
                            message.sender === user
                              ? 'bg-blue-500 text-white'
                              : theme === 'dark'
                                ? 'bg-gray-700 text-white'
                                : 'bg-gray-100 text-black'
                          }`}
                        >
                          <p className="break-words">{message.content}</p>
                          <p 
                            className={`text-xs mt-1 opacity-70 ${
                              message.sender === user ? 'text-right' : 'text-left'
                            }`}
                          >
                            {new Date(message.createdAt).toLocaleTimeString()}
                            {message.sender === user && (
                              <span className="ml-2">
                                {message.isRead ? <FiEye size={12} /> : '●'}
                              </span>
                            )}
                          </p>
                          
                          {message.sender !== user && (
                            <button
                              onClick={() => reportMessage(message.id)}
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded"
                              style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                color: 'var(--text-primary)'
                              }}
                            >
                              <FiAlertTriangle size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input para nuevo mensaje */}
                  <div 
                    className="p-4 border-t"
                    style={{
                      borderColor: theme === 'dark' 
                        ? 'rgba(255, 255, 255, 0.1)' 
                        : 'rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Escribe un mensaje..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        maxLength={500}
                        className="flex-1 px-4 py-2 rounded-lg border transition-colors duration-200"
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
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <FiSend size={16} />
                      </button>
                    </div>
                    <p className="text-xs opacity-60 mt-1">
                      {newMessage.length}/500 caracteres
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <FiMessageCircle size={64} className="mx-auto mb-4 opacity-30" />
                    <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      Selecciona una conversación
                    </h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      Elige una conversación existente o busca un usuario para comenzar a chatear
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
    </>
  )
}