'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useUser } from '@/context/UserContext'

const Redirect = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading } = useUser()
  const authToken = localStorage.getItem('token')

  useEffect(() => {
    if (loading) return

    if (!authToken && pathname !== '/signup') {
      router.push('/login')
    } else if (authToken && !user && pathname !== '/login/registration') {
      router.push('/login/registration')
    } else if (authToken && user && pathname === '/login/registration') {
      router.push('/')
    }
  }, [authToken, user, loading])

  return null
}

export default Redirect
