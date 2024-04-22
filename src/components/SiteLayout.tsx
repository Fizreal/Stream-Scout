'use client'

import { useState, useRef } from 'react'
import NavBar from './NavBar'
import SideBar from './SideBar'

const SiteLayout = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  const [open, setOpen] = useState(false)
  const hamburgerRef = useRef<HTMLDivElement>(null)

  const toggleOpen = () => {
    setOpen((prev) => !prev)
  }

  const closeSideBar = () => {
    setOpen(false)
  }

  return (
    <>
      <NavBar open={open} toggleOpen={toggleOpen} hamburgerRef={hamburgerRef} />
      <main>
        <SideBar
          open={open}
          closeSideBar={closeSideBar}
          hamburgerRef={hamburgerRef}
        />
        {children}
      </main>
    </>
  )
}

export default SiteLayout
