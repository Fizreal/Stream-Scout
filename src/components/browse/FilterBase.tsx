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
      className="relative z-10 h-12"
    >
      <button
        className={
          'flex justify-center items-center gap-2 h-full p-2' +
          (showFilters ? ' bg-PrimaryDark/50' : ' ') +
          ' rounded-md w-full transition-all duration-300 cursor-pointer'
        }
        onClick={() => setShowFilters((prev) => !prev)}
      >
        {title}{' '}
        {!smallScreen && (
          <img
            src="/arrow.svg"
            alt="Arrow"
            className={
              'transition-all duration-300 h-4' +
              (showFilters ? ' -rotate-90' : ' rotate-90')
            }
          />
        )}
      </button>
      {(showFilters || smallScreen) && children}
    </div>
  )
}

export default FilterBase
