'use client'

import { createContext, useContext, useState } from 'react'
import { Profile, Watchlist, Invitation } from '@/types'
import { useRouter } from 'next/navigation'

type UserContextType = {
  token: string
  user: Profile | null
  watchlists: Watchlist[]
  invitations: Invitation[]
  loading: boolean
  login: (token: string) => void
  logout: () => void
  setToken: (token: string) => void
  assignUser: (user: Profile) => void
  setWatchlists: (watchlists: Watchlist[]) => void
  setInvitations: (invitations: Invitation[]) => void
  setLoadingState: (state: boolean) => void
}

const UserContext = createContext<UserContextType>({} as UserContextType)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string>('')

  const [user, setUser] = useState<Profile | null>(null)
  const [watchlists, setWatchlists] = useState<Watchlist[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])

  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  const login = (token: string) => {
    localStorage.setItem('token', token)
    setToken(token)
  }

  const assignUser = (user: Profile) => {
    setUser(user)
  }

  const setLoadingState = (state: boolean) => {
    setLoading(state)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setToken('')
    router.push('/login')
  }

  return (
    <UserContext.Provider
      value={{
        token,
        user,
        watchlists,
        invitations,
        loading,
        login,
        logout,
        setToken,
        assignUser,
        setWatchlists,
        setInvitations,
        setLoadingState
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
