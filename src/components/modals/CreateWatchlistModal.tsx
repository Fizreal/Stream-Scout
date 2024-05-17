'use client'

import { useState } from 'react'
import BaseModal from './BaseModal'
import { useUser } from '@/context/UserContext'
import { useSocket } from '@/context/SocketContext'
import { Watchlist } from '@/types'
import { useRouter } from 'next/navigation'

const CreateWatchlistModal = ({ closeModal }: { closeModal: () => void }) => {
  const socket = useSocket()
  const { setWatchlists } = useUser()
  const router = useRouter()

  const [newList, setNewList] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleCreateList = async (e: React.FormEvent) => {
    console.log('Creating new watchlist:', newList)
    e.preventDefault()
    if (!newList.length) return

    socket?.emit(
      'create watchlist',
      { name: newList },
      ({
        success,
        watchlists,
        error
      }: {
        success: boolean
        watchlists?: Watchlist[]
        error?: string
      }) => {
        if (success && watchlists) {
          setWatchlists(watchlists)
          // router.push(
          //   `/profile/watchlist/${watchlists[watchlists.length - 1]._id}`
          // )
        } else {
          setErrorMessage(error || 'An error occurred creating your watchlist')
        }
      }
    )
  }

  return (
    <BaseModal onClick={closeModal}>
      <div className="flex flex-col items-center z-10 w-4/5 max-w-md bg-PrimaryDark max-h-[50%] p-8 gap-4 rounded-lg">
        <h2 className="w-full text-center text-lg text-AccentLight">
          Create new watchlist:
        </h2>
        <form
          className="flex flex-col items-center w-full gap-4"
          onSubmit={handleCreateList}
        >
          <input
            type="text"
            placeholder="New watchlist name"
            value={newList}
            onChange={(e) => setNewList(e.target.value)}
            className="w-full max-w-60 p-2 bg-PrimaryDark rounded border border-AccentLight text-white focus:outline-none focus:ring-2 focus:ring-AccentLight focus:border-transparent"
          />

          <button
            disabled={newList.length === 0}
            className="rounded-full w-32 bg-BaseDark/75 hover:bg-BaseDark hover:text-AccentLight py-2 px-1 mt-2 focus:outline-none focus:ring-2 focus:ring-AccentLight focus:border-transparent"
          >
            Create
          </button>
        </form>
      </div>
    </BaseModal>
  )
}

export default CreateWatchlistModal
