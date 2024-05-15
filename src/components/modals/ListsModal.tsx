import { useState, useRef } from 'react'
import { useUser } from '@/context/UserContext'
import { useSocket } from '@/context/SocketContext'
import { Content, Watchlist } from '@/types'
import SubmitButton from '../SubmitButton'
import BaseModal from './BaseModal'
import { useIsOverflow } from '@/hooks/useIsOverflow'

type ListsModalProps = {
  setModalOpen: (open: boolean) => void
  content: Content
}

const ListsModal = ({ setModalOpen, content }: ListsModalProps) => {
  const socket = useSocket()
  const { watchlists, setWatchlists } = useUser()

  const ref = useRef<HTMLDivElement>(null)
  const isOverflow = useIsOverflow(ref)

  const [newList, setNewList] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewList(e.target.value)
  }

  const handleAddContent = async (watchlist: string) => {
    socket?.emit(
      'add to watchlist',
      { watchlist, content: content._id },
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
        } else {
          setError(error || 'An error occurred adding to watchlist')
        }
      }
    )
  }

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault()

    if (loading || !newList) return
    setLoading(true)
    socket?.emit(
      'create watchlist',
      { name: newList, content: content._id },
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
        } else {
          setError(error || 'An error occurred creating your watchlist')
        }

        setNewList('')
        setLoading(false)
      }
    )
  }

  return (
    <BaseModal onClick={() => setModalOpen(false)}>
      <div className="flex flex-col items-center z-10 w-4/5 max-w-xl bg-BaseDark max-h-[85%] min-h-[50%] p-8 gap-4 rounded">
        <h2 className="w-full text-center text-lg text-AccentLight">
          Add {content.title} to watchlists:
        </h2>
        <div className="flex-grow overflow-y-auto w-full " ref={ref}>
          {watchlists.length > 0 && (
            <ul className="flex flex-col gap-1.5 w-full p-4 bg-PrimaryDark rounded">
              {watchlists.map((watchlist) => (
                <li
                  key={watchlist._id}
                  className="flex flex-nowrap gap-2 w-full"
                >
                  {!watchlist.list.find(
                    (listItem) => listItem.content._id === content._id
                  ) ? (
                    <button
                      onClick={() => handleAddContent(watchlist._id)}
                      aria-label="Add to watchlist"
                    >
                      <img
                        src="/addToWatchlist.svg"
                        alt="Add to watchlist"
                        className="whiteSVG"
                      />
                    </button>
                  ) : (
                    <img
                      src="/inWatchlist.svg"
                      alt="Added to watchlist"
                      className="selectedSVG"
                    />
                  )}
                  <p className="flex-grow truncate">{watchlist.name}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex flex-col w-full gap-4">
          <h3 className="text-md text-AccentLight text-center">
            Add to new watchlist:
          </h3>
          <form
            onSubmit={handleCreateList}
            className="flex flex-col gap-2 items-center"
          >
            <input
              type="text"
              placeholder="Watchlist name"
              className="w-full max-w-80 p-2 bg-PrimaryDark rounded border border-AccentLight text-white focus:outline-none focus:ring-2 focus:ring-AccentLight focus:border-transparent"
              value={newList}
              onChange={handleChange}
            />
            <SubmitButton
              text="Create"
              disabled={loading || !newList ? true : false}
              loading={loading}
            />
          </form>
        </div>
      </div>
    </BaseModal>
  )
}

export default ListsModal
