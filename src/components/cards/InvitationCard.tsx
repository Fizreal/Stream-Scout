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
    <div>
      <div>
        <h4>
          Invited to {invitation.watchlist.name} by{' '}
          {invitation.requester.username}
        </h4>
        <p>{invitation.watchlist.list.length} in watchlist</p>
      </div>
      <div>
        <button onClick={handleAccept}>Accept</button>
        <button onClick={handleDecline}>Decline</button>
      </div>
    </div>
  )
}

export default InvitationCard
