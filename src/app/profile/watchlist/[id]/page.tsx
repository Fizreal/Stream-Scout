'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import { useSocket } from '@/context/SocketContext'
import { Watchlist } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import ContentFilter from '@/components/ContentFilter'
import WatchlistOptions from '@/components/WatchlistOptions'
import WarningModal from '@/components/modals/WarningModal'
import InviteModal from '@/components/modals/InviteModal'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { streamIcons, countryNames } from '@/utils/object-maps'
import { list } from 'postcss'

const WatchlistDetail = () => {
  const { watchlists, setWatchlists, user } = useUser()
  const socket = useSocket()
  const router = useRouter()

  const { id } = useParams<{ id: string }>()

  const [watchlist, setWatchlist] = useState<Watchlist | null>(null)
  const [leaveModal, setLeaveModal] = useState(false)
  const [inviteModal, setInviteModal] = useState(false)
  const [filters, setFilters] = useState({
    contentType: 'All',
    genre: ''
  })

  const filtering = useMemo(() => {
    return !(filters.contentType === 'All' && filters.genre === '')
  }, [filters])

  const filteredWatchlist = useMemo(() => {
    if (watchlist) {
      let filteredList = watchlist.list
      if (filtering) {
        if (filters.contentType !== 'All') {
          if (filters.contentType === 'Movies') {
            filteredList = filteredList.filter(
              (item) => item.content.type === 'movie'
            )
          } else {
            filteredList = filteredList.filter(
              (item) => item.content.type === 'series'
            )
          }
        }
        if (filters.genre) {
          filteredList = filteredList.filter((item) =>
            item.content.genres.includes(filters.genre)
          )
        }
      }
      return filteredList
    } else {
      return []
    }
  }, [watchlist, filters])

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

  const handleLeaveWatchlist = () => {
    if (!socket || !watchlist) return

    socket.emit(
      'leave watchlist',
      { watchlist: watchlist._id },
      ({ success }: { success: boolean }) => {
        if (success) {
          const updatedWatchlists = watchlists.filter((list) => list._id !== id)
          setWatchlists(updatedWatchlists)
          router.push('/profile?display=watchlists')
        } else {
          console.log('Error leaving watchlist')
          setLeaveModal(false)
        }
      }
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
    <section className="gap-2">
      {watchlist ? (
        <>
          <DragDropContext
            onDragEnd={(param) => {
              handleUpdateWatchlist(param)
            }}
          >
            <div className="relative flex justify-center w-full max-w-4xl">
              <div className="flex flex-col items-center gap-1 min-[390px]:items-end w-full max-w-3xl px-8">
                <h2 className="text-2xl text-AccentLight w-full px-6 lg:px-0 text-center truncate">
                  {watchlist.name}
                </h2>
                <p className="text-white w-full text-center">
                  <span className="text-lg">Collaborators:</span>{' '}
                  {watchlist.owners.map((owner) => owner.username).join(', ')}
                </p>
                <ContentFilter filters={filters} setFilters={setFilters} />
              </div>
              <WatchlistOptions
                showInviteModal={() => setInviteModal(true)}
                showLeaveModal={() => setLeaveModal(true)}
              />
            </div>

            <Droppable droppableId="droppable-1">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-col rounded-lg bg-PrimaryDark shadow-lg p-8 gap-4 w-full sm:w-4/5 max-w-3xl"
                >
                  {filteredWatchlist.map((item, index) => (
                    <Draggable
                      key={item.content._id}
                      draggableId={`draggable-${item.content._id}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex gap-4 bg-BaseDark background-blur rounded-md shadow-lg overflow-hidden w-full sm:h-[212px] p-2"
                        >
                          <div className="flex items-center w-6 sm:w-12 h-full flex-shrink-0">
                            <img
                              src="/dragIcon.svg"
                              alt="Drag"
                              {...(filtering ? {} : provided.dragHandleProps)}
                              className={
                                'aspect-square selectedSVG w-full' +
                                (filtering ? ' opacity-25' : '')
                              }
                            />
                          </div>
                          <Link
                            href={`/details/${item.content._id}`}
                            className="flex items-center h-full w-24 sm:w-32 flex-shrink-0"
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
                                <p className="w-full text-wrap">
                                  {user?.country
                                    ? `Not streaming options in
                              ${countryNames[user?.country]}`
                                    : 'Not streaming options in your country'}
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
          {inviteModal && (
            <InviteModal
              closeModal={() => setInviteModal(false)}
              watchlistId={watchlist._id}
            />
          )}
          {leaveModal && (
            <WarningModal
              title={`Are you sure you want to ${
                watchlist.owners.length === 1 ? 'delete' : 'leave'
              } this watchlist?`}
              closeModal={() => setLeaveModal(false)}
              affirmativeText={
                watchlist.owners.length === 1 ? 'Delete' : 'Leave'
              }
              handleAffirmative={handleLeaveWatchlist}
            />
          )}
        </>
      ) : (
        <p>Watchlist not found</p>
      )}
    </section>
  )
}

export default WatchlistDetail
