import { useSocket } from '@/context/SocketContext'
import { useUser } from '@/context/UserContext'
import { Invitation } from '@/types'

const InvitationCard = ({ invitation }: { invitation: Invitation }) => {
  const socket = useSocket()
  const { invitations, setInvitations } = useUser()

  const handleAccept = () => {
    socket?.emit(
      'accept invitation',
      { invitation: invitation._id },
      ({ success }: { success: boolean }) => {
        if (success) {
          const updatedInvitations = invitations.filter(
            (inv) => inv._id !== invitation._id
          )
          setInvitations(updatedInvitations)
        }
      }
    )
  }

  const handleDecline = () => {
    socket?.emit(
      'decline invitation',
      { invitation: invitation._id },
      ({ success }: { success: boolean }) => {
        if (success) {
          const updatedInvitations = invitations.filter(
            (inv) => inv._id !== invitation._id
          )
          setInvitations(updatedInvitations)
        }
      }
    )
  }

  return (
    <div className="flex w-full max-w-lg gap-2 p-2 bg-PrimaryDark text-BaseLight">
      <div className="flex flex-col flex-grow gap-1">
        <h4 className="w-full text-wrap text-lg text-AccentLight">
          Invited to {invitation.watchlist.name} by{' '}
          {invitation.requester.username}
        </h4>
        <p className="w-full text-wrap">
          {invitation.watchlist.list.length} items in watchlist
        </p>
      </div>
      <div className="flex flex-col justify-around flex-shrink-0 h-full">
        <button
          onClick={handleAccept}
          className="w-full px-2 py-1 bg-PrimaryDark/75 hover:bg-PrimaryDark hover:text-AccentLight"
        >
          Accept
        </button>
        <button
          onClick={handleDecline}
          className="w-full px-2 py-1 border-2 border-PrimaryDark hover:bg-PrimaryDark hover:text-AccentLight"
        >
          Decline
        </button>
      </div>
    </div>
  )
}

export default InvitationCard
