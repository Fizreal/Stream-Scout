import { useState, useEffect, useRef } from 'react'
import { genreNames } from '@/utils/object-maps'

type ContentFilterProps = {
  filters: {
    contentType: string
    genre: string
  }
  setFilters: (filters: { contentType: string; genre: string }) => void
}

const ContentFilter = ({ filters, setFilters }: ContentFilterProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [showFilters, setShowFilters] = useState(false)

  const genreArray = Object.values(genreNames)
  const displayTranslation: { [key: string]: number } = {
    All: 0,
    Movies: 1,
    Shows: 2
  }

  const handleContentFilter = (contentType: string) => {
    setFilters({ ...filters, contentType })
  }

  const handleGenreFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, genre: event.target.value })
  }

  const resetFilters = () => {
    setFilters({ contentType: 'All', genre: '' })
    setShowFilters(false)
  }

  useEffect(() => {
    const handleClickOutsideFilters = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowFilters(false)
      }
    }

    document.addEventListener('mouseup', handleClickOutsideFilters)
    document.addEventListener('touchend', handleClickOutsideFilters)

    return () => {
      document.removeEventListener('mouseup', handleClickOutsideFilters)
      document.removeEventListener('touchend', handleClickOutsideFilters)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="relative flex items-center justify-center min-[390px]:mr-16"
    >
      <button
        onClick={() => setShowFilters((prev) => !prev)}
        className="h-full text-AccentLight"
      >
        Filters
      </button>
      {showFilters && (
        <div className="flex flex-col items-center gap-3 absolute left-1/2 bottom-0 translate-y-full -translate-x-1/2 rounded-xl w-56 z-10 p-2 bg-BaseLight fadeIn">
          <div className="flex flex-col items-center w-full">
            <p>Content type:</p>
            <div className="relative grid grid-cols-3 w-full h-8">
              <button
                className={
                  'z-10 w-full h-full' +
                  (filters.contentType === 'All'
                    ? ' filterSelected'
                    : ' filterNotSelected')
                }
                onClick={() => handleContentFilter('All')}
              >
                All
              </button>
              <button
                className={
                  'z-10' +
                  (filters.contentType === 'Movies'
                    ? ' filterSelected'
                    : ' filterNotSelected')
                }
                onClick={() => handleContentFilter('Movies')}
              >
                Movies
              </button>
              <button
                className={
                  'z-10' +
                  (filters.contentType === 'Shows'
                    ? ' filterSelected'
                    : ' filterNotSelected')
                }
                onClick={() => handleContentFilter('Shows')}
              >
                Shows
              </button>
              <div
                className="absolute top-0 left-0 h-full w-1/3 transition-all duration-300 p-2 rounded-full bg-BaseDark"
                style={{
                  transform: `translateX(${
                    displayTranslation[filters.contentType]
                      ? displayTranslation[filters.contentType] * 100
                      : 0
                  }%)`
                }}
              ></div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <p>Genre:</p>
            <select
              onChange={handleGenreFilter}
              defaultValue={filters.genre}
              className="w-full bg-BaseDark p-1 rounded-md text-AccentLight focus:outline-none focus:ring-2 focus:ring-AccentLight focus:ring-opacity-50"
            >
              <option value="">All</option>
              {genreArray.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>
          <button onClick={resetFilters}>Reset</button>
        </div>
      )}
    </div>
  )
}

export default ContentFilter
