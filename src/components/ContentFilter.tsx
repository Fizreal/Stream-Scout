import { useState, useEffect, useRef } from 'react'
import { genreNames } from '@/utils/object-maps'

type ContentFilterProps = {
  formValues: {
    contentType: string
    genre: string
  }
  handleContentFilter: (contentType: string) => void
  handleGenreFilter: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const ContentFilter = ({
  formValues,
  handleContentFilter,
  handleGenreFilter
}: ContentFilterProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [showFilters, setShowFilters] = useState(false)

  const genreArray = Object.values(genreNames)
  const displayTranslation: { [key: string]: number } = {
    All: 0,
    Movies: 1,
    Shows: 2
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        if (showFilters) {
          setShowFilters(false)
        }
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
    <div ref={ref} className="relative flex items-center justify-center">
      <button
        onClick={() => setShowFilters((prev) => !prev)}
        className="h-full"
      >
        Filters
      </button>
      {showFilters && (
        <div className="absolute left-0 bottom-0 translate-y-full rounded-lg w-full">
          <p>Content type:</p>
          <div className="">
            <button
              className={
                'z-10 w-full h-full' +
                (formValues.contentType === 'All'
                  ? ' sectionSelected'
                  : ' sectionNotSelected')
              }
              onClick={() => handleContentFilter('All')}
            >
              All
            </button>
            <button
              className={
                'z-10' +
                (formValues.contentType === 'Movies'
                  ? ' sectionSelected'
                  : ' sectionNotSelected')
              }
              onClick={() => handleContentFilter('Movies')}
            >
              Movies
            </button>
            <button
              className={
                'z-10' +
                (formValues.contentType === 'Shows'
                  ? ' sectionSelected'
                  : ' sectionNotSelected')
              }
              onClick={() => handleContentFilter('Shows')}
            >
              Shows
            </button>
            <div
              className="absolute top-0 left-0 h-full w-1/3 transition-all duration-300 p-2 rounded-full bg-BaseDark"
              style={{
                transform: `translateX(${
                  displayTranslation[formValues.contentType]
                    ? displayTranslation[formValues.contentType] * 100
                    : 0
                }%)`
              }}
            ></div>
          </div>
          <p>Genre:</p>
          <select onChange={handleGenreFilter}>
            {genreArray.map((genre) => (
              <option value={genre}>{genre}</option>
            ))}
          </select>
          <button>Reset</button>
        </div>
      )}
    </div>
  )
}

export default ContentFilter
