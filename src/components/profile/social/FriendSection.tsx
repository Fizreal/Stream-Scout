import { Friend } from '@/types'
import FriendCard from '@/components/cards/FriendCard'

const FriendSection = ({ friends }: { friends: Friend[] }) => {
  return (
    <div className="flex flex-col items-center gap-2 w-full fadeIn">
      {friends.length === 0 ? (
        <p className="text-BaseLight">No friends</p>
      ) : (
        friends.map((friend) => <FriendCard friend={friend} key={friend._id} />)
      )}
    </div>
  )
}

export default FriendSection
