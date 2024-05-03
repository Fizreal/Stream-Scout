import { useState, useMemo } from 'react'
import { useUser } from '@/context/UserContext'
import { useSocket } from '@/context/SocketContext'
import { Content, Watchlist } from '@/types'
import SubmitButton from './SubmitButton'

type ListsModalProps = {
  setModalOpen: (open: boolean) => void
  content: Content
}

const ListsModal = ({ setModalOpen, content }: ListsModalProps) => {
  const socket = useSocket()
  const { watchlists, setWatchlists } = useUser()

  const [newList, setNewList] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const availableLists = useMemo(() => {
    return watchlists.filter(
      (watchlist) =>
        watchlist.list.find((item) => item.content._id === content._id) ===
        undefined
    )
  }, [watchlists, content])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewList(e.target.value)
  }

  const handleAddContent = async (watchlist: string) => {
    socket?.emit(
      'add to watchlistlist',
      { watchlist, content: content._id },
      (response: {
        success: boolean
        watchlists?: Watchlist[]
        error?: string
      }) => {
        if (response.success && response.watchlists) {
          setWatchlists(response.watchlists)
        } else if (response.error) {
          setError(response.error)
        } else {
          console.log('Failed to add to watchlist')
        }
      }
    )
  }

  const handleCreateList = async () => {
    if (loading) return

    setLoading(true)
    socket?.emit(
      'create watchlist',
      { name: newList, content: content._id },
      (response: {
        success: boolean
        watchlists?: Watchlist[]
        error?: string
      }) => {
        if (response.success && response.watchlists) {
          setWatchlists(response.watchlists)
        } else if (response.error) {
          setError(response.error)
        } else {
          setError('Failed to create watchlist')
        }
        setNewList('')
        setLoading(false)
      }
    )
  }

  return (
    <div className="fixed top-0 left-0 flex justify-center items-center h-dvh w-dvw">
      <div className="absolute top-0 left-0 h-full w-full bg-black/50"></div>
      <div>
        <h2>Add {content.title} to watchlists:</h2>
        <ul>
          {availableLists.map((watchlist) => (
            <li key={watchlist._id}>
              {!watchlist.list.find(
                (listItem) => listItem.content._id === content._id
              ) ? (
                <button
                  onClick={() => handleAddContent(watchlist._id)}
                ></button>
              ) : null}
              {watchlist.name}
            </li>
          ))}
        </ul>
        <div>
          <h3>Add to new watchlist:</h3>
          <input
            type="text"
            placeholder="Watchlist name"
            value={newList}
            onChange={handleChange}
          />
          <SubmitButton
            onClick={handleCreateList}
            text="Create"
            disabled={!loading && newList ? true : false}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}

export default ListsModal
