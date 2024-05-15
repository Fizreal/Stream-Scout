'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useUser } from '@/context/UserContext'

const Redirect = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading, token } = useUser()

  useEffect(() => {
    if (loading) return

    if (!token && pathname !== '/signup') {
      router.push('/login')
    } else if (token && !user && pathname !== '/login/registration') {
      router.push('/login/registration')
    } else if (
      token &&
      user &&
      (pathname === '/login/registration' || pathname === '/login')
    ) {
      router.push('/')
    }
  }, [token, user, loading])

  return null
}

export default Redirect
