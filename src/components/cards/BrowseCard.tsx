import { useState, useEffect, useRef } from 'react'
import { Content } from '@/types'
import Image from 'next/image'

const BrowseCard = ({
  content,
  handleDetails,
  loading
}: {
  content: Content
  handleDetails: () => void
  loading: boolean
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const handleClickOutside = (event: TouchEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsVisible(false)
    }
  }

  useEffect(() => {
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="relative rounded overflow-hidden shadow-lg"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={() => setIsVisible(true)}
    >
      <Image
        src={`https://image.tmdb.org/t/p/original${content.poster}`}
        alt={content.title}
        width={300}
        height={450}
      />
      {isVisible && (
        <div className="absolute top-0 left-0 w-full h-full bg-black/75 flex flex-col items-center justify-between p-6 gap-4 text-BaseLight">
          <h3 className="text-2xl">
            {content.title}{' '}
            <span className="text-lg text-gray-400">
              ({content.releaseYear})
            </span>
          </h3>
          <div className="flex-grow overflow-hidden">
            <p className="text-ellipsis overflow-hidden clippedOverviewBrowse">
              {content.overview}
            </p>
          </div>
          <button onClick={handleDetails}>See details</button>
        </div>
      )}
    </div>
  )
}

export default BrowseCard
