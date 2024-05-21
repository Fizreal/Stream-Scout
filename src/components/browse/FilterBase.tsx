'use client'

import { useState, useEffect } from 'react'

type FilterBaseProps = {
  title: string
  children: React.ReactNode
}

const FilterBase = ({ title, children }: FilterBaseProps) => {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div
      onMouseEnter={() => setShowFilters(true)}
      onMouseLeave={() => setShowFilters(false)}
      className="relative z-20 lg:h-12 w-full lg:w-auto"
    >
      <button
        className={
          'flex justify-center items-center gap-2 h-12 p-2 lg:rounded-md w-full transition-all duration-300 cursor-pointer' +
          (showFilters ? ' bg-PrimaryDark/50' : ' ')
        }
        onClick={() => setShowFilters((prev) => !prev)}
      >
        <p>{title}</p>
        <img
          src="/arrow.svg"
          alt="Arrow"
          className={
            'transition-all duration-300 h-4' +
            (showFilters ? ' -rotate-90' : ' rotate-90')
          }
        />
      </button>
      {showFilters && children}
    </div>
  )
}

export default FilterBase
