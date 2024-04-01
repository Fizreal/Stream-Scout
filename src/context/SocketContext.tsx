'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { io, Socket } from 'socket.io-client'
import { useUser } from './UserContext'
import { useRouter } from 'next/navigation'
import { BASE_URL } from '@/utils/auth'

type SocketContextType = Socket | null

const SocketContext = createContext<SocketContextType>(null)

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { assignUser, setLoadingState } = useUser()
  const router = useRouter()

  const [socket, setSocket] = useState<Socket | null>(null)
  const [token, setToken] = useState<string>('')

  useEffect(() => {
    if (!token) {
      return
    }
    const newSocket = io(BASE_URL, {
      auth: { token }
    })

    newSocket.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`)
    })

    setSocket(newSocket)
    newSocket.on('connected', (profile) => {
      if (profile && profile.user) {
        assignUser(profile)
      }
      setLoadingState(false)
    })

    return () => {
      newSocket.close()
    }
  }, [token])

  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem('token')
      if (newToken) {
        setToken(newToken)
      } else {
        setLoadingState(false)
      }
    }
    handleStorageChange()
    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  )
}
