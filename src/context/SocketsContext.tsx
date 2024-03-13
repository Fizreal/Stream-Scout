import { useState, useEffect, createContext, useContext, use } from 'react'
import { io, Socket } from 'socket.io-client'

type SocketContextType = Socket | null

const SocketContext = createContext<SocketContextType>(null)

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token')
  )

  useEffect(() => {
    if (!token) {
      return
    }

    const newSocket = io('http://localhost:3000', {
      auth: { token }
    })
    setSocket(newSocket)
    return () => {
      newSocket.close()
    }
  }, [token])

  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem('token')
      setToken(newToken)
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
