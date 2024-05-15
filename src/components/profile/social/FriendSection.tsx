import { Friend } from '@/types'
import FriendCard from '@/components/cards/FriendCard'

const FriendSection = ({ friends }: { friends: Friend[] }) => {
  return (
    <div className="fadeIn">
      {friends.length === 0 ? (
        <p>No friends</p>
      ) : (
        friends.map((friend) => <FriendCard friend={friend} key={friend._id} />)
      )}
    </div>
  )
}

export default FriendSection
