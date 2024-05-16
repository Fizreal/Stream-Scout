import { useUser } from '@/context/UserContext'
import { Watched } from '@/types'
import WatchedCard from '../cards/WatchedCard'

const WatchedSection = () => {
  const { user } = useUser()

  return (
    <div className="flex flex-col gap-6 p-8 w-full max-w-3xl fadeIn">
      {user?.watched.length ? (
        user.watched.map((watched) => (
          <WatchedCard key={watched._id} watched={watched} />
        ))
      ) : (
        <p>No watched content</p>
      )}
    </div>
  )
}

export default WatchedSection
