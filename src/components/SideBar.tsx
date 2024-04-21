'use client'

import { useEffect, useRef } from 'react'
import { useUser } from '@/context/UserContext'
import Link from 'next/link'

const SideBar = ({
  open,
  closeSideBar
}: {
  open: boolean
  closeSideBar: () => void
}) => {
  const { user, logout } = useUser()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        closeSideBar()
      }
    }

    document.addEventListener('mouseup', handleClickOutside)
    document.addEventListener('touchend', handleClickOutside)

    return () => {
      document.removeEventListener('mouseup', handleClickOutside)
      document.removeEventListener('touchend', handleClickOutside)
    }
  }, [])

  return (
    user && (
      <aside ref={ref} className={`bg-BaseLight sideBar ${open ? 'open' : ''}`}>
        <ul>
          <li>Find something to watch</li>
          <ul>
            <Link href={'/search'}>
              <li>Search</li>
            </Link>
            <Link href={'/browse'}>
              <li>Browse</li>
            </Link>
          </ul>
          <li>Profile</li>
          <ul>
            <li>Watchlists</li>
            <li>Feed (Coming soon)</li>
            <li>Social</li>
            <li>Settings</li>
            <li onClick={logout}>Logout</li>
          </ul>
        </ul>
      </aside>
    )
  )
}

export default SideBar
