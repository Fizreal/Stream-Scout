import { Friend } from '@/types'
import FriendCard from '@/components/cards/FriendCard'

const InvitationSection = ({ friends }: { friends: Friend[] }) => {
  const received = friends.filter((friend) => friend.status === 1)
  const sent = friends.filter((friend) => friend.status === 2)

  return (
    <div className="fadeIn">
      <h2>Manage friend requests</h2>
      <div>
        <h3>Received</h3>
        <div>
          {received.length === 0 ? (
            <p>No outstanding friend requests</p>
          ) : (
            received.map((friend) => (
              <FriendCard friend={friend} key={friend._id} />
            ))
          )}
        </div>
      </div>
      <div>
        <h3>Sent</h3>
        <div>
          {sent.length === 0 ? (
            <p>No pending friend requests</p>
          ) : (
            sent.map((friend) => (
              <FriendCard friend={friend} key={friend._id} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
export default InvitationSection
