import { Friend } from '@/types'
import FriendCard from '@/components/cards/FriendCard'

const InvitationSection = ({ friends }: { friends: Friend[] }) => {
  const received = friends.filter((friend) => friend.status === 1)
  const sent = friends.filter((friend) => friend.status === 2)

  return (
    <div className="flex flex-col items-center gap-2 w-full fadeIn">
      <h2 className="text-2xl text-BaseLight my-1">Manage friend requests</h2>
      <div className="flex flex-col items-center w-full gap-2 max-w-lg">
        <h3 className="text-2xl text-AccentLight my-1">Received</h3>
        <div>
          {received.length === 0 ? (
            <p className="text-BaseLight">No outstanding friend requests</p>
          ) : (
            received.map((friend) => (
              <FriendCard friend={friend} key={friend._id} />
            ))
          )}
        </div>
      </div>
      <div className="flex flex-col items-center w-full gap-2 max-w-lg">
        <h3 className="text-2xl text-AccentLight my-1">Sent</h3>
        <div className="flex flex-col gap-2">
          {sent.length === 0 ? (
            <p className="text-BaseLight">No pending friend requests</p>
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
