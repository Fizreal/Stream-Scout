import { useUser } from '@/context/UserContext'
import { useMemo } from 'react'
import { Watched } from '@/types'
import WatchedCard from '../cards/WatchedCard'

const LikedSection = () => {
  const { user } = useUser()

  const likedContent = useMemo(() => {
    if (user?.watched.length) {
      return user?.watched.filter((watched) => watched.liked)
    } else {
      return []
    }
  }, [user])

  return (
    <div className="flex flex-col gap-6 p-8 max-w-3xl fadeIn">
      {likedContent.map((liked) => (
        <WatchedCard key={liked._id} watched={liked} />
      ))}
    </div>
  )
}

export default LikedSection
