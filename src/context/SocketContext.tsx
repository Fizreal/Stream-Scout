'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { io, Socket } from 'socket.io-client'
import { useUser } from './UserContext'
import { BASE_URL } from '@/utils/auth'
import { Profile, Watchlist } from '@/types'

type SocketContextType = Socket | null

const SocketContext = createContext<SocketContextType>(null)

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { token, setToken, assignUser, setWatchlists, setLoadingState } =
    useUser()

  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    if (!token) {
      return
    }

    const newSocket = io(BASE_URL, {
      auth: { token }
    })
    setSocket(newSocket)

    return () => {
      console.log('disconnecting')
      if (newSocket.connected) {
        newSocket.disconnect()
      }
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
  }, [])

  useEffect(() => {
    if (!socket) return

    const handleLogin = () => {
      if (socket.connected) {
        socket.emit(
          'get profile information',
          (profileInfo: { profile: Profile; watchlists: Watchlist[] }) => {
            console.log('connected', profileInfo)
            if (profileInfo.profile && profileInfo.profile.user) {
              assignUser(profileInfo.profile)
              if (profileInfo.watchlists) {
                setWatchlists(profileInfo.watchlists)
              }
            }
            setLoadingState(false)
          }
        )
      } else {
        socket.on('connect', () => {
          socket.emit(
            'get profile information',
            (profileInfo: { profile: Profile; watchlists: Watchlist[] }) => {
              if (profileInfo.profile && profileInfo.profile.user) {
                assignUser(profileInfo.profile)
                if (profileInfo.watchlists) {
                  setWatchlists(profileInfo.watchlists)
                }
              }
              setLoadingState(false)
            }
          )
        })
      }
    }
    handleLogin()

    socket.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`)
    })
  }, [socket])

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  )
}
