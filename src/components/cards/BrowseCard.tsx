import { useState, useEffect, useRef } from 'react'
import { Content } from '@/types'
import Image from 'next/image'

const BrowseCard = ({ content }: { content: Content }) => {
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
        <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>
      )}
    </div>
  )
}

export default BrowseCard
