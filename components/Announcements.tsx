'use client'

import { useState, useEffect } from 'react'
import { X, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react'
import UserDisplay from './UserDisplay'

interface Announcement {
  id: string
  title: string
  content: string
  type: 'info' | 'warning' | 'success' | 'error'
  isActive: boolean
  createdAt: string
  createdBy: string
}

interface AnnouncementsProps {
  className?: string
}

const Announcements: React.FC<AnnouncementsProps> = ({ className = '' }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [dismissedAnnouncements, setDismissedAnnouncements] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnnouncements()
    // Cargar anuncios descartados del localStorage
    const dismissed = localStorage.getItem('dismissedAnnouncements')
    if (dismissed) {
      setDismissedAnnouncements(JSON.parse(dismissed))
    }
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements')
      if (response.ok) {
        const data = await response.json()
        setAnnouncements(data)
      }
    } catch (error) {
      console.error('Error fetching announcements:', error)
    } finally {
      setLoading(false)
    }
  }

  const dismissAnnouncement = (id: string) => {
    const newDismissed = [...dismissedAnnouncements, id]
    setDismissedAnnouncements(newDismissed)
    localStorage.setItem('dismissedAnnouncements', JSON.stringify(newDismissed))
  }

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />
      case 'success':
        return <CheckCircle className="w-5 h-5" />
      case 'error':
        return <AlertCircle className="w-5 h-5" />
      default:
        return <Info className="w-5 h-5" />
    }
  }

  const getAnnouncementStyles = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/50 border-yellow-200 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100'
      case 'success':
        return 'bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-700 text-green-900 dark:text-green-100'
      case 'error':
        return 'bg-red-50 dark:bg-red-900/50 border-red-200 dark:border-red-700 text-red-900 dark:text-red-100'
      default:
        return 'bg-blue-50 dark:bg-blue-900/50 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-blue-100'
    }
  }

  const visibleAnnouncements = announcements.filter(
    announcement => !dismissedAnnouncements.includes(announcement.id)
  )

  if (loading || visibleAnnouncements.length === 0) {
    return null
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {visibleAnnouncements.map((announcement) => (
        <div
          key={announcement.id}
          className={`relative rounded-lg border p-4 ${getAnnouncementStyles(announcement.type)} transition-all duration-300 hover:shadow-md`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getAnnouncementIcon(announcement.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm mb-1">
                {announcement.title}
              </h3>
              <p className="text-sm opacity-90 leading-relaxed">
                {announcement.content}
              </p>
              <div className="mt-2 text-xs opacity-70">
                <UserDisplay username={announcement.createdBy} showPrefix={true} /> • {new Date(announcement.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            <button
              onClick={() => dismissAnnouncement(announcement.id)}
              className="flex-shrink-0 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              aria-label="Descartar anuncio"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Announcements