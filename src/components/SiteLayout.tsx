'use client'

import { useState } from 'react'
import NavBar from './NavBar'
import SideBar from './SideBar'

const SiteLayout = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  const [open, setOpen] = useState(true)

  const toggleOpen = () => {
    setOpen((prev) => !prev)
  }

  const closeSideBar = () => {
    setOpen(false)
  }

  return (
    <>
      <NavBar open={open} toggleOpen={toggleOpen} />
      <main>
        <SideBar open={open} closeSideBar={closeSideBar} />
        {children}
      </main>
    </>
  )
}

export default SiteLayout
