import Link from 'next/link'

const NavBar = () => {
  return (
    <nav className="bg-PrimaryDark flex justify-center items-center sm:justify-start shadow-lg h-12">
      <Link href="/">
        <h1>Tonight's Options</h1>
      </Link>
    </nav>
  )
}

export default NavBar
