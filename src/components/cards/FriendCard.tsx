import { useState, useEffect } from 'react'
import { Friend, Profile } from '@/types'
import { useSocket } from '@/context/SocketContext'
import { useUser } from '@/context/UserContext'
import WarningModal from '../modals/WarningModal'

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
        console.log(success, updatedProfile, error)
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
    <div className="flex flex-nowrap w-full h-40 p-4">
      <div className="flex flex-col flex-grow h-full gap-2">
        <h4>{friend.recipient.username}</h4>
        <p>{friend.recipient.country}</p>
      </div>
      <div className="flex flex-col items-center justify-around">
        {friend.status === 3 && (
          <button onClick={handleRemove} disabled={loading}>
            {loading ? 'Loading...' : 'Remove friend'}
          </button>
        )}
        {friend.status === 1 && (
          <>
            <button onClick={handleAccept} disabled={loading}>
              {loading ? 'Loading...' : 'Accept request'}
            </button>
            <button onClick={handleDeleteRequest} disabled={loading}>
              {loading ? 'Loading...' : 'Decline request'}
            </button>
          </>
        )}
        {friend.status === 2 && (
          <button onClick={handleDeleteRequest} disabled={loading}>
            {loading ? 'Loading...' : 'Cancel request'}
          </button>
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
