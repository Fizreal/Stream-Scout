'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useUser } from '@/context/UserContext'

const Redirect = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useUser()
  const authToken = localStorage.getItem('token')

  useEffect(() => {
    if (!authToken && pathname !== '/signup') {
      router.push('/login')
    } else if (authToken && !user && pathname !== '/login/registration') {
      router.push('/login/registration')
    }
  }, [authToken, user, router])

  return null
}

export default Redirect
