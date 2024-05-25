import { useUser } from '@/context/UserContext'
import Link from 'next/link'
import InvitationCard from '../cards/InvitationCard'
import SubmitButton from '../SubmitButton'

type WatchlistsSectionProps = {
  setShowCreateModal: (show: boolean) => void
}

const WatchlistsSection = ({ setShowCreateModal }: WatchlistsSectionProps) => {
  const { watchlists, invitations } = useUser()

  return (
    <div className="flex flex-col items-center gap-4 fadeIn w-full">
      <SubmitButton
        text={'Create Watchlist'}
        onClick={() => setShowCreateModal(true)}
        width="fit"
        disabled={false}
        loading={false}
      />
      {invitations.length !== 0 && (
        <div className="flex flex-col items-center w-full">
          <h3>Pending Invitations</h3>
          <div>
            {invitations.map((invitation) => (
              <InvitationCard key={invitation._id} invitation={invitation} />
            ))}
          </div>
        </div>
      )}
      <div className="flex flex-col items-center gap-2 w-full">
        <h3 className="text-2xl text-AccentLight my-1">My Watchlists</h3>
        {watchlists.map((watchlist) => (
          <Link
            href={`/profile/watchlist/${watchlist._id}`}
            key={watchlist._id}
            className="flex flex-col items-center gap-2 w-full max-w-xl overflow-hidden bg-PrimaryDark rounded-lg p-3  text-BaseLight"
          >
            <h4 className="w-full text-center truncate text-lg text-AccentLight">
              {watchlist.name}
            </h4>
            <div className="flex items-center w-full justify-around gap-1 overflow-hidden">
              <p>{watchlist.list.length} items in watchlist</p>
              {watchlist.owners.length > 1 ? (
                <p className="truncate">
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
