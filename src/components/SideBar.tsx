'use client'

import { useEffect, useRef } from 'react'
import { useUser } from '@/context/UserContext'
import { useSocket } from '@/context/SocketContext'
import Link from 'next/link'

const SideBar = ({
  open,
  closeSideBar,
  hamburgerRef
}: {
  open: boolean
  closeSideBar: () => void
  hamburgerRef: React.RefObject<HTMLDivElement>
}) => {
  const { user, logout } = useUser()
  const socket = useSocket()
  const ref = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    socket?.disconnect()
    logout()
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        !hamburgerRef.current?.contains(event.target as Node)
      ) {
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
            <li>
              <Link href={'/profile?display=watchlists'}>Watchlists</Link>
            </li>
            <li>Feed (Coming soon)</li>
            <Link href={'/profile/social'}>
              <li>Social</li>
            </Link>
            <li>Settings</li>
            <li onClick={handleLogout} className="cursor-pointer">
              Logout
            </li>
          </ul>
        </ul>
      </aside>
    )
  )
}

export default SideBar
