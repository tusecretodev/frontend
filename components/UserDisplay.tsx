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
      color: '#dc2626',
      fontWeight: 'bold'
    }
  }

  const regularStyles = {
    color: 'var(--text-secondary)'
  }

  return (
    <span 
      className={`${getSizeClasses()} ${className}`}
      style={isAdmin ? getAdminStyles() : regularStyles}
    >
      {showPrefix && 'por '}
      {isAdmin ? 'Admin' : username}
    </span>
  )
}

export default UserDisplay
