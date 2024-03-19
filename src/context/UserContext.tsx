'use client'

import { createContext, useContext, useState } from 'react'
import { Profile } from '@/types'
import { useRouter } from 'next/navigation'

type UserContextType = {
  user: Profile | null
  login: (token: string) => void
  logout: () => void
  assignUser: (user: Profile) => void
}

const UserContext = createContext<UserContextType>({} as UserContextType)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Profile | null>(null)
  const router = useRouter()

  const login = (token: string) => {
    localStorage.setItem('token', token)
  }

  const assignUser = (user: Profile) => {
    setUser(user)
    router.push('/')
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <UserContext.Provider value={{ user, login, logout, assignUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
