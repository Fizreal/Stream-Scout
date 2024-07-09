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
      <aside
        ref={ref}
        className={`bg-AccentLight sideBar ${open ? 'open' : ''}`}
      >
        <ul className="flex flex-col">
          <li className="py-2 px-1 my-1 text-BaseDark font-medium">
            Find something to watch
          </li>
          <ul className="flex flex-col gap-2">
            <Link
              href={'/search'}
              className="py-2 px-4 sideBarLink transition-colors text-PrimaryDark hover:text-AccentLight hover:bg-PrimaryDark/75"
              onClick={closeSideBar}
            >
              <li>Search</li>
            </Link>
            <Link
              href={'/browse'}
              className="py-2 px-4 sideBarLink transition-colors text-PrimaryDark hover:text-AccentLight hover:bg-PrimaryDark/75"
              onClick={closeSideBar}
            >
              <li>Browse</li>
            </Link>
          </ul>
          <li className="py-2 px-1 my-1 text-BaseDark font-medium mt-10">
            Profile
          </li>
          <ul className="flex flex-col gap-2 ">
            <Link
              href={'/profile?display=watchlists'}
              className="py-2 px-4 sideBarLink transition-colors text-PrimaryDark hover:text-AccentLight hover:bg-PrimaryDark/75"
              onClick={closeSideBar}
            >
              <li>Watchlists</li>
            </Link>
            <Link
              href={'/profile/social'}
              className="py-2 px-4 sideBarLink transition-colors text-PrimaryDark hover:text-AccentLight hover:bg-PrimaryDark/75"
              onClick={closeSideBar}
            >
              <li>Social</li>
            </Link>
            <Link
              href={'/profile/settings'}
              className="py-2 px-4 sideBarLink transition-colors text-PrimaryDark hover:text-AccentLight hover:bg-PrimaryDark/75"
              onClick={closeSideBar}
            >
              <li>Settings</li>
            </Link>
            <Link
              href={''}
              className="py-2 px-4 sideBarLink transition-colors text-PrimaryDark hover:text-AccentLight hover:bg-PrimaryDark/75"
              onClick={closeSideBar}
            >
              <li onClick={handleLogout}>Logout</li>
            </Link>
          </ul>
        </ul>
      </aside>
    )
  )
}

export default SideBar
