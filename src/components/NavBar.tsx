import Link from 'next/link'
import { useUser } from '@/context/UserContext'

const NavBar = ({
  open,
  toggleOpen,
  hamburgerRef
}: {
  open: boolean
  toggleOpen: () => void
  hamburgerRef: React.RefObject<HTMLDivElement>
}) => {
  const { user } = useUser()

  return (
    <nav className="fixed top-0 left-0 bg-PrimaryDark flex justify-center items-center md:justify-start shadow-lg h-14 w-full z-20">
      {user && (
        <div
          ref={hamburgerRef}
          className={`hamburgerMenu ${open ? 'open' : ''}`}
          onClick={toggleOpen}
          aria-label={open ? 'Close side bar' : 'Open side bar'}
        >
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}
      <Link
        href={user ? '/' : '/login'}
        className="flex items-center justify-center h-full w-[200px]"
      >
        <h1 className="text-2xl text-AccentLight">Stream Scout</h1>
      </Link>
    </nav>
  )
}

export default NavBar
