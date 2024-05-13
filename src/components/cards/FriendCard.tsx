import { useState, useEffect } from 'react'
import { Friend } from '@/types'
import { useSocket } from '@/context/SocketContext'
import { useUser } from '@/context/UserContext'

const FriendCard = ({ friend }: { friend: Friend }) => {
  const socket = useSocket()
  const { assignUser } = useUser()

  const [online, setOnline] = useState(false)

  const handleCancelRequest = () => {}

  const handleAccept = () => {}

  const handleDecline = () => {}

  const handleRemove = () => {}

  useEffect(() => {
    if (socket && friend.status === 3) {
      socket.emit(
        'check online',
        { id: friend.recipient.userId },
        ({ online }: { online: boolean }) => {
          setOnline(online)
        }
      )
    }
  }, [socket, friend])

  return (
    <div>
      <div>
        <h4>{friend.recipient.username}</h4>
        <p>{friend.recipient.country}</p>
      </div>
      <div>
        {friend.status === 3 && (
          <button onClick={handleRemove}>Remove friend</button>
        )}
        {friend.status === 1 && (
          <>
            <button onClick={handleAccept}>Accept request</button>
            <button onClick={handleDecline}>Decline request</button>
          </>
        )}
        {friend.status === 2 && (
          <button onClick={handleCancelRequest}>Cancel request</button>
        )}
      </div>
    </div>
  )
}

export default FriendCard
