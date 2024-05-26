import { useState, useEffect } from 'react'
import { Friend, Profile } from '@/types'
import { useSocket } from '@/context/SocketContext'
import { useUser } from '@/context/UserContext'
import WarningModal from '../modals/WarningModal'
import SubmitButton from '../SubmitButton'
import { countryNames } from '@/utils/object-maps'

const FriendCard = ({ friend }: { friend: Friend }) => {
  const socket = useSocket()
  const { assignUser } = useUser()

  const [online, setOnline] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const handleAccept = () => {
    setLoading(true)
    socket?.emit(
      'accept friend',
      { requesterId: friend.recipient._id },
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

  const handleDeleteRequest = () => {
    setLoading(true)
    socket?.emit(
      'delete friend record',
      { requesterId: friend.recipient._id },
      ({
        success,
        updatedProfile,
        error
      }: {
        success: boolean
        updatedProfile?: Profile
        error?: string
      }) => {
        if (success && updatedProfile) {
          assignUser(updatedProfile)
        } else {
          console.log(error || 'Failed to delete friend record')
        }
        setLoading(false)
      }
    )
  }

  const handleRemove = () => {
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

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
    <div className="flex flex-nowrap justify-between gap-6 w-full py-4 px-6 bg-PrimaryDark rounded-lg max-w-xs">
      <div className="flex flex-col flex-grow h-full gap-1 flex-shrink overflow-hidden">
        <h4 className="text-xl text-AccentLight truncate">
          {friend.recipient.username}
        </h4>
        {friend.status === 3 && (
          <p
            className={
              'truncate' + (online ? ' text-AccentLight' : ' text-BaseLight')
            }
          >
            {online ? 'Online' : 'Offline'}
          </p>
        )}
        <p className="text-BaseLight truncate">
          {countryNames[friend.recipient.country]}
        </p>
      </div>
      <div className="flex flex-col items-center justify-around">
        {friend.status === 3 && (
          <SubmitButton
            text="Remove friend"
            disabled={loading}
            loading={false}
            onClick={handleRemove}
            style="secondaryLight"
          />
        )}
        {friend.status === 1 && (
          <>
            <SubmitButton
              text="Accept request"
              onClick={handleAccept}
              loading={loading}
              disabled={false}
            />
            <SubmitButton
              text="Decline request"
              onClick={handleDeleteRequest}
              loading={loading}
              disabled={false}
              style="secondaryLight"
            />
          </>
        )}
        {friend.status === 2 && (
          <SubmitButton
            text="Cancel request"
            onClick={handleDeleteRequest}
            disabled={false}
            loading={loading}
            style="secondaryLight"
          />
        )}
      </div>
      {showModal && (
        <WarningModal
          title={`Are you sure you want to remove ${friend.recipient.username} from your friendlist?`}
          closeModal={closeModal}
          affirmativeText="Remove"
          handleAffirmative={handleDeleteRequest}
        />
      )}
    </div>
  )
}

export default FriendCard
