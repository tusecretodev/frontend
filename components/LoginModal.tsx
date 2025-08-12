import { useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { FiX, FiEye, FiEyeOff, FiUser, FiLogIn, FiUserPlus } from 'react-icons/fi'

interface LoginModalProps {
  onClose: () => void
  onLogin: (username: string) => void
}

export default function LoginModal({ onClose, onLogin }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const endpoint = isLogin ? 'https://api.tusecreto.net/api/auth/login' : 'https://api.tusecreto.net/api/auth/register'
      const response = await axios.post(endpoint, { username, password })
      
      Cookies.set('token', response.data.token, { expires: 7 })
      Cookies.set('username', username, { expires: 7 })
      
      onLogin(username)
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error en la autenticación')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-gray-dark border border-gray-medium rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            {isLogin ? (
              <>
                <FiLogIn size={24} className="animate-pulse" />
                Iniciar Sesión
              </>
            ) : (
              <>
                <FiUserPlus size={24} className="animate-bounce" />
                Crear Cuenta
              </>
            )}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-light hover:text-white transition-all duration-300 hover:rotate-90"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              Usuario
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-medium border border-gray-light rounded-lg px-3 py-2 text-white placeholder-gray-light focus:outline-none focus:border-white"
              placeholder="Ingresa tu usuario"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-medium border border-gray-light rounded-lg px-3 py-2 pr-10 text-white placeholder-gray-light focus:outline-none focus:border-white"
                placeholder="Ingresa tu contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-light hover:text-white"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-2 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-105"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                Cargando...
              </>
            ) : (
              <>
                {isLogin ? (
                  <>
                    <FiLogIn size={16} className="group-hover:translate-x-1 transition-transform" />
                    Iniciar Sesión
                  </>
                ) : (
                  <>
                    <FiUserPlus size={16} className="group-hover:scale-110 transition-transform" />
                    Crear Cuenta
                  </>
                )}
              </>
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-gray-light hover:text-white transition-colors text-sm"
          >
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-light text-center">
          <p>No solicitamos email ni información personal.</p>
          <p>Tu anonimato está garantizado.</p>
        </div>
      </div>
    </div>
  )
}