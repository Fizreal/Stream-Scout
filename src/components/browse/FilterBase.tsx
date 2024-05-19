'use client'

import { useState, useEffect } from 'react'

type FilterBaseProps = {
  title: string
  children: React.ReactNode
}

const FilterBase = ({ title, children }: FilterBaseProps) => {
  const [showFilters, setShowFilters] = useState(false)
  const [smallScreen, setSmallScreen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSmallScreen(true)
      } else {
        setSmallScreen(false)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div
      onMouseEnter={() => setShowFilters(true)}
      onMouseLeave={() => setShowFilters(false)}
      className="z-10 relative"
    >
      <button onClick={() => setShowFilters((prev) => !prev)}>{title}</button>
      {(showFilters || smallScreen) && children}
    </div>
  )
}

export default FilterBase
