'use client'

import { createContext, useContext, useState } from 'react'
import { Profile, Watchlist } from '@/types'
import { useRouter } from 'next/navigation'

type UserContextType = {
  token: string
  setToken: (token: string) => void
  user: Profile | null
  watchlists: Watchlist[]
  loading: boolean
  login: (token: string) => void
  logout: () => void
  assignUser: (user: Profile) => void
  setWatchlists: (watchlists: Watchlist[]) => void
  setLoadingState: (state: boolean) => void
}

const UserContext = createContext<UserContextType>({} as UserContextType)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string>('')
  const [user, setUser] = useState<Profile | null>(null)
  const [watchlists, setWatchlists] = useState<Watchlist[]>([])
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
        setToken,
        user,
        watchlists,
        loading,
        login,
        logout,
        assignUser,
        setWatchlists,
        setLoadingState
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
