'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import { useSocket } from '@/context/SocketContext'
import { Watchlist } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { streamIcons, countryNames } from '@/utils/object-maps'

const WatchlistDetail = () => {
  const { watchlists, user } = useUser()
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
    <section>
      {watchlist ? (
        <DragDropContext
          onDragEnd={(param) => {
            handleUpdateWatchlist(param)
          }}
        >
          <h2>{watchlist.name}</h2>
          <p>
            Collaborators:{' '}
            {watchlist.owners.map((owner) => owner.username).join(', ')}
          </p>
          <Droppable droppableId="droppable-1">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-col rounded-lg bg-PrimaryDark p-8 gap-4 w-4/5 max-w-3xl"
              >
                {watchlist.list.map((item, index) => (
                  <Draggable
                    key={item.content._id}
                    draggableId={`draggable-${item.content._id}`}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="flex gap-4 bg-BaseDark background-blur rounded-md shadow-lg overflow-hidden w-full h-[212px]"
                      >
                        <div className="flex items-center w-12 h-full aspect-square">
                          <img
                            src="/dragIcon.svg"
                            alt="Drag"
                            {...provided.dragHandleProps}
                            className="aspect-square w-full"
                          />
                        </div>
                        <Link
                          href={`/details/${item.content._id}`}
                          className="flex items-center h-full aspect-[30/53] mx-4"
                        >
                          <Image
                            src={`https://image.tmdb.org/t/p/original${item.content.poster}`}
                            height={180}
                            width={120}
                            alt={item.content.title}
                            className="rounded-lg"
                          />
                        </Link>
                        <div className="flex flex-col justify-center gap-2 flex-grow overflow-hidden h-full">
                          <Link href={`/details/${item.content._id}`}>
                            <h3 className="text-xl w-full truncate">
                              {item.content.title}{' '}
                              <span className="text-base text-gray-400">
                                ({item.content.releaseYear})
                              </span>
                            </h3>
                          </Link>
                          <p className="w-full truncate">
                            {item.content.genres.join(', ')}
                          </p>
                          <div className="flex flex-nowrap overflow-scroll gap-2">
                            {item.content.streamingInfo.find(
                              (countryInfo) =>
                                countryInfo.country === user?.country
                            ) ? (
                              item.content.streamingInfo
                                .find(
                                  (stream) => stream.country === user?.country
                                )
                                ?.availability.map((stream) => (
                                  <a
                                    href={stream.link}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <img
                                      src={streamIcons[stream.service].image}
                                      alt={stream.service}
                                    />
                                  </a>
                                ))
                            ) : (
                              <p className="w-full truncate">
                                {user?.country
                                  ? `Not streaming options available in
                              ${countryNames[user?.country]}`
                                  : 'Not streaming options available in your country'}
                              </p>
                            )}
                          </div>
                        </div>
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
    </section>
  )
}

export default WatchlistDetail
