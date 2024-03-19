'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { io, Socket } from 'socket.io-client'
import { useUser } from './UserContext'
import { useRouter } from 'next/navigation'

type SocketContextType = Socket | null

const SocketContext = createContext<SocketContextType>(null)

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { assignUser } = useUser()
  const router = useRouter()

  const [socket, setSocket] = useState<Socket | null>(null)
  const [token, setToken] = useState<string>('')

  useEffect(() => {
    if (!token) {
      return
    }
    console.log('socket')
    const newSocket = io('http://localhost:3001', {
      auth: { token }
    })
    setSocket(newSocket)
    newSocket.on('connected', (profile) => {
      if (profile) {
        assignUser(profile)
        router.push('/')
      } else {
        router.push('/login/registration')
      }
    })

    return () => {
      newSocket.close()
    }
  }, [token])

  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem('token')
      console.log('newToken', newToken)
      if (newToken) {
        setToken(newToken)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  )
}
