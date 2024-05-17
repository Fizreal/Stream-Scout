import { useUser } from '@/context/UserContext'
import Link from 'next/link'
import InvitationCard from '../cards/InvitationCard'

type WatchlistsSectionProps = {
  setShowCreateModal: (show: boolean) => void
}

const WatchlistsSection = ({ setShowCreateModal }: WatchlistsSectionProps) => {
  const { watchlists, invitations } = useUser()

  return (
    <div className="fadeIn">
      <button onClick={() => setShowCreateModal(true)}>Create watchlist</button>
      {invitations.length !== 0 && (
        <div>
          <h3>Pending Invitations</h3>
          <div>
            {invitations.map((invitation) => (
              <InvitationCard key={invitation._id} invitation={invitation} />
            ))}
          </div>
        </div>
      )}
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
