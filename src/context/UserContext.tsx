import { createContext, useContext, useState } from 'react'
import { Profile } from '@/types'
import { useRouter } from 'next/router'

type UserContextType = {
  user: Profile | null
  login: (payload: { user: Profile; token: string }) => void
  logout: () => void
}

const UserContext = createContext<UserContextType>({} as UserContextType)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Profile | null>(null)
  const router = useRouter()

  const login = (payload: { user: Profile; token: string }) => {
    setUser(payload.user)
    localStorage.setItem('token', payload.token)
    router.push('/')
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
    router.push('/')
  }

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
