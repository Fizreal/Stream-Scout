import { useState, useMemo } from 'react'
import { Profile, PublicProfile } from '@/types'
import { useSocket } from '@/context/SocketContext'
import { useUser } from '@/context/UserContext'
import { countryNames } from '@/utils/object-maps'
import SubmitButton from '../SubmitButton'

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
    <div className="flex flex-nowrap justify-between gap-6 w-full py-4 px-6 bg-PrimaryDark rounded-lg max-w-xs">
      <div className="flex flex-col flex-grow h-full gap-2 flex-shrink overflow-hidden">
        <h4 className="text-xl text-AccentLight truncate">
          {profile.username}
        </h4>
        <p className="text-BaseLight truncate">
          {countryNames[profile.country]}
        </p>
      </div>
      <div>
        {friendStatus === 0 && (
          <SubmitButton
            text="Add friend"
            onClick={handleSendRequest}
            loading={loading}
            disabled={false}
            style="secondaryLight"
          />
        )}
        {friendStatus === 1 && (
          <SubmitButton
            text="Accept request"
            onClick={handleAccept}
            loading={loading}
            disabled={false}
          />
        )}
        {friendStatus === 2 && (
          <SubmitButton
            text="Pending"
            disabled={true}
            loading={false}
            style="primaryDark"
          />
        )}

        {friendStatus === 3 && (
          <SubmitButton text="Friends" disabled={true} loading={false} />
        )}
      </div>
    </div>
  )
}

export default ProfileCard
