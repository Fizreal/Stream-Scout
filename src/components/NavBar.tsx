import Link from 'next/link'

const NavBar = ({
  open,
  toggleOpen,
  hamburgerRef
}: {
  open: boolean
  toggleOpen: () => void
  hamburgerRef: React.RefObject<HTMLDivElement>
}) => {
  return (
    <nav className="bg-PrimaryDark flex justify-center items-center md:justify-start shadow-lg h-12">
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
      <Link href="/">
        <h1>Tonight's Options</h1>
      </Link>
    </nav>
  )
}

export default NavBar
