'use client'

import { useState, useMemo } from 'react'
import { useUser } from '@/context/UserContext'
import { useSocket } from '@/context/SocketContext'
import BaseModal from './BaseModal'
import { Friend } from '@/types'

type InviteModalProps = {
  closeModal: () => void
  watchlistId: string
}

const InviteModal = ({ closeModal, watchlistId }: InviteModalProps) => {
  const socket = useSocket()
  const { user } = useUser()

  const [invites, setInvites] = useState<Friend[]>([])

  const availableFriends = useMemo(() => {
    return user?.friends.filter(
      (friend) => !invites.includes(friend) && friend.status === 3
    )
  }, [user, invites])

  const handleInvite = () => {
    if (invites.length === 0) return

    const inviteIds = invites.map((friend) => friend.recipient._id)

    socket?.emit(
      'invite to watchlist',
      { watchlist: watchlistId, recipients: inviteIds },
      ({ success, error }: { success: boolean; error: string }) => {
        if (success) {
          closeModal()
        } else {
          console.log(error)
        }
      }
    )
  }

  return (
    <BaseModal onClick={closeModal}>
      <div className="flex flex-col items-center z-10 w-4/5 max-w-xl bg-PrimaryDark max-h-[85%] min-h-[50%] p-8 gap-4 rounded-lg">
        <h2 className="text-xl text-AccentLight">
          Invite friends to watchlist
        </h2>
        <div className="flex flex-col flex-grow items-center w-full gap-2 overflow-hidden">
          <h3 className="text-lg">Available friends:</h3>
          <div className="flex flex-col flex-grow items-center w-full gap-4 overflow-auto">
            {availableFriends?.length === 0 ? (
              <p>No available friends</p>
            ) : (
              availableFriends?.map((friend) => (
                <div
                  key={friend.recipient._id}
                  className="flex justify-between w-full"
                >
                  <p>{friend.recipient.username}</p>
                  <button
                    onClick={() => {
                      setInvites([...invites, friend])
                    }}
                  >
                    Invite
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="flex flex-col flex-grow items-center w-full gap-2 overflow-hidden">
          <h3 className="text-lg">Invites:</h3>
          <div className="flex flex-col flex-grow items-center w-full gap-4 overflow-auto">
            {invites.length === 0 ? (
              <p>No invites</p>
            ) : (
              invites.map((friend) => (
                <div
                  key={friend.recipient._id}
                  className="flex justify-between w-full"
                >
                  <p>{friend.recipient.username}</p>
                  <button
                    onClick={() => {
                      const filteredInvites = invites.filter(
                        (invite) =>
                          invite.recipient._id !== friend.recipient._id
                      )
                      setInvites([...filteredInvites])
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="flex justify-around w-full">
          <button
            onClick={closeModal}
            className="rounded-full w-32 bg-BaseDark/75 hover:bg-BaseDark hover:text-AccentLight  py-2 px-1"
          >
            Cancel
          </button>
          <button
            onClick={handleInvite}
            disabled={invites.length === 0}
            className="rounded-full w-32 border-2 border-BaseDark/75 hover:border-BaseDark hover:bg-BaseDark hover:text-AccentLight py-2 px-1 shadow-lg"
          >
            Send invites
          </button>
        </div>
      </div>
    </BaseModal>
  )
}
export default InviteModal
