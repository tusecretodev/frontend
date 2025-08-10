'use client'

import React from 'react'

interface UserDisplayProps {
  username: string
  className?: string
  showPrefix?: boolean // Para mostrar "por" antes del nombre
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const UserDisplay: React.FC<UserDisplayProps> = ({ 
  username, 
  className = '', 
  showPrefix = false,
  size = 'xs'
}) => {
  const isAdmin = username === 'admin'
  
  const getSizeClasses = () => {
    switch (size) {
      case 'xs':
        return 'text-xs'
      case 'sm':
        return 'text-sm'
      case 'md':
        return 'text-base'
      case 'lg':
        return 'text-lg'
      default:
        return 'text-xs'
    }
  }

  const getAdminStyles = () => {
    if (!isAdmin) return {}
    
    return {
      background: 'linear-gradient(45deg, #dc2626, #ef4444, #f87171)',
      backgroundSize: '200% 200%',
      animation: 'gradient-shift 3s ease infinite',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      fontWeight: 'bold',
      textShadow: '0 0 10px rgba(220, 38, 38, 0.3)',
      filter: 'drop-shadow(0 0 2px rgba(220, 38, 38, 0.5))'
    }
  }

  const regularStyles = {
    color: 'var(--text-secondary)'
  }

  return (
    <>
      <style jsx>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .admin-glow {
          position: relative;
        }
        
        .admin-glow::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #dc2626, #ef4444, #f87171);
          border-radius: 4px;
          opacity: 0.3;
          z-index: -1;
          animation: pulse 2s ease-in-out infinite alternate;
        }
        
        @keyframes pulse {
          0% { opacity: 0.3; }
          100% { opacity: 0.6; }
        }
      `}</style>
      
      <span 
        className={`${getSizeClasses()} ${isAdmin ? 'admin-glow' : ''} ${className}`}
        style={isAdmin ? getAdminStyles() : regularStyles}
      >
        {showPrefix && 'por '}
        {isAdmin ? 'Admin' : username}
      </span>
    </>
  )
}

export default UserDisplay
