import { useUser } from '@/context/UserContext'
import { useState, useMemo } from 'react'
import WatchedCard from '../cards/WatchedCard'
import ContentFilter from '../ContentFilter'

const LikedSection = () => {
  const { user } = useUser()

  const [filters, setFilters] = useState({
    contentType: 'All',
    genre: ''
  })

  const filteredLikedContent = useMemo(() => {
    if (user?.watched.length) {
      const likedContent = user.watched.filter((watched) => watched.liked)
      let filteredLikedContent = likedContent
      if (filteredLikedContent.length && filters.contentType !== 'All') {
        if (filters.contentType === 'Movies') {
          filteredLikedContent = filteredLikedContent.filter(
            (liked) => liked.content.type === 'movie'
          )
        } else {
          filteredLikedContent = filteredLikedContent.filter(
            (liked) => liked.content.type === 'series'
          )
        }
      }
      if (filteredLikedContent.length && filters.genre) {
        filteredLikedContent = filteredLikedContent.filter((liked) =>
          liked.content.genres.includes(filters.genre)
        )
      }
      return filteredLikedContent
    } else {
      return []
    }
  }, [user, filters])

  return (
    <div className="flex flex-col items-center min-[390px]:items-end gap-6 p-8 w-full max-w-3xl fadeIn">
      <ContentFilter filters={filters} setFilters={setFilters} />
      {filteredLikedContent.map((liked) => (
        <WatchedCard key={liked._id} watched={liked} />
      ))}
    </div>
  )
}

export default LikedSection
