'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { io, Socket } from 'socket.io-client'
import { useUser } from './UserContext'
import { BASE_URL } from '@/utils/auth'
import { Profile, Watchlist, Invitation } from '@/types'

type SocketContextType = Socket | null

const SocketContext = createContext<SocketContextType>(null)

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    token,
    setToken,
    assignUser,
    watchlists,
    setWatchlists,
    setInvitations,
    setLoadingState
  } = useUser()

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

    socket.on('connect', () => {
      socket.emit('get profile', ({ profile }: { profile: Profile }) => {
        if (profile && profile.user) {
          assignUser(profile)
        }
        setLoadingState(false)
      })
      socket.emit(
        'get watchlists',
        ({ watchlists }: { watchlists: Watchlist[] }) => {
          setWatchlists(watchlists)
        }
      )
      socket.emit(
        'get invitations',
        ({ invitations }: { invitations: Invitation[] }) => {
          setInvitations(invitations)
        }
      )

      socket.on('profile update', ({ profile }: { profile: Profile }) => {
        assignUser(profile)
      })
      socket.on(
        'update watchlist',
        ({ watchlist }: { watchlist: Watchlist }) => {
          const watchlistIndex = watchlists.findIndex(
            (prevWatchlist) => prevWatchlist._id === watchlist._id
          )

          if (watchlistIndex !== -1) {
            const newWatchlists = [...watchlists]
            newWatchlists[watchlistIndex] = watchlist
            setWatchlists(newWatchlists)
          }
        }
      )
      socket.on(
        'update invitations',
        ({ invitations }: { invitations: Invitation[] }) => {
          setInvitations(invitations)
        }
      )
    })

    socket.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`)
    })

    return () => {
      socket.off('connect')
      socket.off('profile update')
      socket.off('update watchlist')
      socket.off('update invitations')
    }
  }, [socket])

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  )
}
