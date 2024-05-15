import { useState, useMemo } from 'react'
import { Profile, PublicProfile } from '@/types'
import { useSocket } from '@/context/SocketContext'
import { useUser } from '@/context/UserContext'
import { countryNames } from '@/utils/object-maps'

const ProfileCard = ({ profile }: { profile: PublicProfile }) => {
  const socket = useSocket()
  const { user, assignUser } = useUser()

  const [loading, setLoading] = useState(false)

  const handleSendRequest = () => {
    setLoading(true)
    socket?.emit(
      'add friend',
      { recipientId: profile._id },
      ({
        success,
        updatedProfile
      }: {
        success: boolean
        updatedProfile: Profile
      }) => {
        if (success) {
          assignUser(updatedProfile)
        } else {
          console.log('Failed to send friend request')
        }
        setLoading(false)
      }
    )
  }

  const handleAccept = () => {
    setLoading(true)
    socket?.emit(
      'accept friend',
      { requesterId: profile._id },
      ({
        success,
        updatedProfile
      }: {
        success: boolean
        updatedProfile: Profile
      }) => {
        if (success) {
          assignUser(updatedProfile)
        } else {
          console.log('Failed to accept friend request')
        }
        setLoading(false)
      }
    )
  }

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
    <div className="flex flex-nowrap w-full h-40 p-4">
      <div className="flex flex-col flex-grow h-full gap-2">
        <h4>{profile.username}</h4>
        <p>{countryNames[profile.country]}</p>
      </div>
      <div className="h-full">
        {friendStatus === 0 && (
          <button onClick={handleSendRequest} disabled={loading}>
            {loading ? 'Loading...' : 'Add friend'}
          </button>
        )}
        {friendStatus === 1 && (
          <button onClick={handleAccept} disabled={loading}>
            {loading ? 'Loading...' : 'Accept request'}
          </button>
        )}
        {friendStatus === 2 && <button disabled>Pending</button>}
        {friendStatus === 3 && <button disabled>Friends</button>}
      </div>
    </div>
  )
}

export default ProfileCard
