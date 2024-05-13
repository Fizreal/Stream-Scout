import { Friend } from '@/types'
import FriendCard from '@/components/cards/FriendCard'

const InvitationSection = ({ friends }: { friends: Friend[] }) => {
  return (
    <div>
      <h2>Manage friend requests</h2>
      <div>
        <h3>Received</h3>
        {friends
          .filter((friend) => friend.status === 1)
          .map((friend) => (
            <FriendCard friend={friend} key={friend._id} />
          ))}
      </div>
      <div>
        <h3>Sent</h3>
        {friends
          .filter((friend) => friend.status === 2)
          .map((friend) => (
            <FriendCard friend={friend} key={friend._id} />
          ))}
      </div>
    </div>
  )
}
export default InvitationSection
