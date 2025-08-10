'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react'
import Cookies from 'js-cookie'

interface Announcement {
  id: string
  title: string
  content: string
  type: 'info' | 'warning' | 'success' | 'error'
  isActive: boolean
  createdAt: string
  createdBy: string
  updatedAt?: string
  updatedBy?: string
}

interface AnnouncementManagerProps {
  className?: string
}

const AnnouncementManager: React.FC<AnnouncementManagerProps> = ({ className = '' }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'info' as 'info' | 'warning' | 'success' | 'error',
    isActive: true
  })

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const token = Cookies.get('token')
      const response = await fetch('/api/admin/announcements', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = Cookies.get('token')
      const url = editingAnnouncement 
        ? `/api/admin/announcements/${editingAnnouncement.id}`
        : '/api/admin/announcements'
      
      const method = editingAnnouncement ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        fetchAnnouncements()
        resetForm()
      }
    } catch (error) {
      console.error('Error saving announcement:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este anuncio?')) {
      return
    }

    try {
      const token = Cookies.get('token')
      const response = await fetch(`/api/admin/announcements/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        fetchAnnouncements()
      }
    } catch (error) {
      console.error('Error deleting announcement:', error)
    }
  }

  const handleToggleActive = async (announcement: Announcement) => {
    try {
      const token = Cookies.get('token')
      const response = await fetch(`/api/admin/announcements/${announcement.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !announcement.isActive })
      })

      if (response.ok) {
        fetchAnnouncements()
      }
    } catch (error) {
      console.error('Error toggling announcement:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'info',
      isActive: true
    })
    setShowCreateModal(false)
    setEditingAnnouncement(null)
  }

  const startEdit = (announcement: Announcement) => {
    setFormData({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      isActive: announcement.isActive
    })
    setEditingAnnouncement(announcement)
    setShowCreateModal(true)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />
      case 'success':
        return <CheckCircle className="w-4 h-4" />
      case 'error':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Info className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'success':
        return 'text-green-600 dark:text-green-400'
      case 'error':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-blue-600 dark:text-blue-400'
    }
  }

  if (loading) {
    return (
      <div className={`animate-pulse space-y-4 ${className}`}>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Anuncios</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Anuncio
        </button>
      </div>

      {/* Lista de anuncios */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No hay anuncios creados
          </div>
        ) : (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              className={`border rounded-lg p-4 ${announcement.isActive ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'} border-gray-200 dark:border-gray-700`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={getTypeColor(announcement.type)}>
                      {getTypeIcon(announcement.type)}
                    </span>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {announcement.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      announcement.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {announcement.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    {announcement.content}
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    Creado por {announcement.createdBy} • {new Date(announcement.createdAt).toLocaleDateString('es-ES')}
                    {announcement.updatedAt && (
                      <span> • Editado {new Date(announcement.updatedAt).toLocaleDateString('es-ES')}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleToggleActive(announcement)}
                    className={`p-2 rounded-lg transition-colors ${
                      announcement.isActive
                        ? 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900'
                        : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    title={announcement.isActive ? 'Desactivar' : 'Activar'}
                  >
                    {announcement.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => startEdit(announcement)}
                    className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(announcement.id)}
                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de crear/editar */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {editingAnnouncement ? 'Editar Anuncio' : 'Crear Nuevo Anuncio'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contenido
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tipo
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="info">Información</option>
                    <option value="warning">Advertencia</option>
                    <option value="success">Éxito</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300">
                    Anuncio activo
                  </label>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    {editingAnnouncement ? 'Actualizar' : 'Crear'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnnouncementManager