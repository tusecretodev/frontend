'use client'

import { useState, useEffect } from 'react'
import { Shield, MessageCircle, Calendar, User } from 'lucide-react'

interface BanInfo {
  isBanned: boolean
  reason?: string
  bannedAt?: string
  bannedBy?: string
  appealUrl?: string
}

interface BanScreenProps {
  onClose?: () => void
}

const BanScreen: React.FC<BanScreenProps> = ({ onClose }) => {
  const [banInfo, setBanInfo] = useState<BanInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkBanStatus()
  }, [])

  const checkBanStatus = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await fetch('/api/announcements/ban-status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setBanInfo(data)
      }
    } catch (error) {
      console.error('Error checking ban status:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-md w-full">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!banInfo?.isBanned) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-red-900 via-red-800 to-black z-[9999] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border-2 border-red-500">
        {/* Header */}
        <div className="bg-red-500 dark:bg-red-600 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Cuenta Suspendida</h2>
              <p className="text-red-100 text-sm">Tu acceso ha sido restringido</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Has sido baneado permanentemente de esta página
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Tu cuenta ha sido suspendida por violar nuestras normas de la comunidad.
            </p>
          </div>

          {/* Ban Details */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Razón del baneo:</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {banInfo.reason || 'No se especificó una razón'}
                </p>
              </div>
            </div>

            {banInfo.bannedAt && (
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Fecha del baneo:</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(banInfo.bannedAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            )}

            {banInfo.bannedBy && (
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Moderador:</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {banInfo.bannedBy}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Appeal Section */}
          <div className="border-t dark:border-gray-700 pt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-center">
              Si crees que este baneo es un error, puedes apelar la decisión:
            </p>
            <a
              href={banInfo.appealUrl || 'https://discord.gg/wy5s5tkZ'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Apelar en Discord
            </a>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => {
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              window.location.reload()
            }}
            className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  )
}

export default BanScreen