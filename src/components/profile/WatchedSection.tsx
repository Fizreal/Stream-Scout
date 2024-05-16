'use client'

import { useState, useMemo } from 'react'
import { useUser } from '@/context/UserContext'
import WatchedCard from '../cards/WatchedCard'
import ContentFilter from '../ContentFilter'

const WatchedSection = () => {
  const { user } = useUser()

  const [filters, setFilters] = useState({
    contentType: 'All',
    genre: ''
  })

  const filteredWatched = useMemo(() => {
    if (user?.watched.length) {
      let filteredWatched = user.watched
      if (filteredWatched.length && filters.contentType !== 'All') {
        if (filters.contentType === 'Movies') {
          filteredWatched = filteredWatched.filter(
            (liked) => liked.content.type === 'movie'
          )
        } else {
          filteredWatched = filteredWatched.filter(
            (liked) => liked.content.type === 'series'
          )
        }
      }
      if (filteredWatched.length && filters.genre) {
        filteredWatched = filteredWatched.filter((liked) =>
          liked.content.genres.includes(filters.genre)
        )
      }
      return filteredWatched
    } else {
      return []
    }
  }, [user, filters])

  return (
    <div className="flex flex-col items-center min-[390px]:items-end gap-6 p-8 w-full max-w-3xl fadeIn">
      <ContentFilter filters={filters} setFilters={setFilters} />
      {filteredWatched.map((watched) => (
        <WatchedCard key={watched._id} watched={watched} />
      ))}
    </div>
  )
}

export default WatchedSection
