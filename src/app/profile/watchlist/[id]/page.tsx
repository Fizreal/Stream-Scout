'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import { useSocket } from '@/context/SocketContext'
import { Watchlist } from '@/types'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const WatchlistDetail = () => {
  const { watchlists, setWatchlists } = useUser()
  const socket = useSocket()

  const { id } = useParams<{ id: string }>()
  const [watchlist, setWatchlist] = useState<Watchlist | null>(null)

  const handleUpdateWatchlist = (param: any) => {
    if (!socket || !watchlist) return

    const sourceIndex = param.source.index
    const destinationIndex = param.destination?.index

    if (destinationIndex === undefined || sourceIndex === destinationIndex)
      return

    const updatedList = [...watchlist.list]
    const [removed] = updatedList.splice(sourceIndex, 1)
    updatedList.splice(destinationIndex, 0, removed)

    if (sourceIndex < destinationIndex) {
      for (let i = sourceIndex; i <= destinationIndex; i++) {
        updatedList[i].order = i
      }
    } else {
      for (let i = destinationIndex; i <= sourceIndex; i++) {
        updatedList[i].order = i
      }
    }

    const updatedWatchlist = { ...watchlist, list: updatedList }
    setWatchlist(updatedWatchlist)

    socket.emit('reorder watchlist', { watchlist: updatedWatchlist }, () =>
      console.log('Reordered watchlist')
    )
  }

  useEffect(() => {
    const getWatchlist = () => {
      const watchlist = watchlists.find((watchlist) => watchlist._id === id)
      const orderedList = watchlist?.list.sort((a, b) => a.order - b.order)

      if (watchlist) {
        if (!orderedList) return
        watchlist.list = orderedList
        setWatchlist(watchlist)
      }
    }

    getWatchlist()
  }, [id, watchlists])

  return (
    <div>
      {watchlist ? (
        <DragDropContext
          onDragEnd={(param) => {
            handleUpdateWatchlist(param)
          }}
        >
          <h2>{watchlist.name}</h2>
          <p>{watchlist.owners.map((owner) => owner.username).join(', ')}</p>
          <Droppable droppableId="droppable-1">
            {(provided, snapshot) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {watchlist.list.map((item, index) => (
                  <Draggable
                    key={item.content._id}
                    draggableId={`draggable-${item.content._id}`}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef} {...provided.draggableProps}>
                        <img src="" alt="Drag" {...provided.dragHandleProps} />
                        <p>{item.content.title}</p>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <p>Watchlist not found</p>
      )}
    </div>
  )
}

export default WatchlistDetail
