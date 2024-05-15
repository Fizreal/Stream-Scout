import { Watchlist } from '@/types'
import Link from 'next/link'

const WatchlistsSection = ({ watchlists }: { watchlists: Watchlist[] }) => {
  return (
    <div className="fadeIn">
      <button>Create watchlist</button>
      <div>
        {watchlists.map((watchlist) => (
          <Link
            href={`/profile/watchlist/${watchlist._id}`}
            key={watchlist._id}
            className="flex flex-col gap-2 overflow-hidden"
          >
            <h3 className="w-full text-center truncate">{watchlist.name}</h3>
            <div className="flex flex-col gap-1">
              <p>{watchlist.list.length} items in watchlist</p>
              {watchlist.owners.length > 1 ? (
                <p className="w-full truncate">
                  Collaborators:{' '}
                  {watchlist.owners.map((owner) => owner.username).join(', ')}
                </p>
              ) : (
                <p>No collaborators</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default WatchlistsSection
