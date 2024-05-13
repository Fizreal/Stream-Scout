import { useState, useMemo } from 'react'
import { PublicProfile } from '@/types'
import { useSocket } from '@/context/SocketContext'
import { useUser } from '@/context/UserContext'

const FriendCard = ({ profile }: { profile: PublicProfile }) => {
  const socket = useSocket()
  const { user, assignUser } = useUser()

  const [online, setOnline] = useState(false)

  const handleSendRequest = () => {}

  const handleAccept = () => {}

  const friendStatus = useMemo(() => {
    if (user?.friends) {
      const friend = user.friends.find(
        (friend) => friend.recipient._id === profile._id
      )
      if (friend) {
        return friend.status
      }
    }
    return 0
  }, [user, profile])

  return (
    <div>
      <div>
        <h4>{profile.username}</h4>
        <p>{profile.country}</p>
      </div>
      <div>
        {friendStatus === 0 && (
          <button onClick={handleSendRequest}>Add friend</button>
        )}
        {friendStatus === 1 && (
          <button onClick={handleAccept}>Accept request</button>
        )}
        {friendStatus === 2 && <button disabled>Pending</button>}
        {friendStatus === 3 && <button disabled>Friends</button>}
      </div>
    </div>
  )
}

export default FriendCard
