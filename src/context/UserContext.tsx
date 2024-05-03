'use client'

import { createContext, useContext, useState } from 'react'
import { Profile, Watchlist } from '@/types'
import { useRouter } from 'next/navigation'

type UserContextType = {
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
  const [user, setUser] = useState<Profile | null>(null)
  const [watchlists, setWatchlists] = useState<Watchlist[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  const login = (token: string) => {
    localStorage.setItem('token', token)
  }

  const assignUser = (user: Profile) => {
    setUser(user)
  }

  const setLoadingState = (state: boolean) => {
    setLoading(state)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <UserContext.Provider
      value={{
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
