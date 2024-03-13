import { createContext, useContext, useState } from 'react'
import { Profile } from '@/types'

type UserContextType = {
  user: Profile | null
  login: (payload: { user: Profile; token: string }) => void
  logout: () => void
}

const UserContext = createContext<UserContextType>({} as UserContextType)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Profile | null>(null)

  const login = (payload: { user: Profile; token: string }) => {
    setUser(payload.user)
    localStorage.setItem('token', payload.token)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
  }

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
