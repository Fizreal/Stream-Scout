'use client'

import { useEffect, useState, useMemo } from 'react'
import { useUser } from '@/context/UserContext'
import { useSocket } from '@/context/SocketContext'
import { Content, Profile, Watched } from '@/types'
import { TitleDetails } from '@/utils/rapid-api'
import { formatStreamingInfo } from '@/utils/content-methods'
import Image from 'next/image'
import { streamIcons, countryNames } from '@/utils/object-maps'
// import { notFound } from 'next/navigation'
import NotFound from './not-found'
import ListsModal from '@/components/modals/ListsModal'
import SubmitButton from '@/components/SubmitButton'

type Params = {
  params: {
    id: string
  }
}

const ContentDetails = ({ params }: Params) => {
  const socket = useSocket()
  const { user, assignUser } = useUser()

  const [content, setContent] = useState<Content | null>(null)
  const [displayedCountry, setDisplayedCountry] = useState('')
  const [displayedSeason, setDisplayedSeason] = useState<string | null>(null)
  const [watched, setWatched] = useState<Watched | null>(null)
  const [loadingContent, setLoadingContent] = useState(true)
  const [loadingStreamingDetails, setLoadingStreamingDetails] = useState(false)
  const [showListsModal, setShowListsModal] = useState(false)

  const genres = useMemo(() => {
    if (!content) return ''

    return content.genres.join(', ')
  }, [content])

  const countryStreamingInfo = useMemo(() => {
    if (!content) return []
    let countryStreamingInfo = content.streamingInfo.find(
      (stream) => stream.country === displayedCountry
    )

    return countryStreamingInfo ? countryStreamingInfo.availability : []
  }, [content, displayedCountry])

  const seasonInfo = useMemo(() => {
    if (!content || !displayedSeason) return null

    return content.seasons?.find(
      (season) => season.season_number === parseInt(displayedSeason)
    )
  }, [content, displayedSeason])

  const checkUserCountryAvailability = (content: Content) => {
    if (!content) return ''

    const userCountry = user?.country || ''

    const countryStreamingInfo = content.streamingInfo.find(
      (stream) => stream.country === userCountry
    )
    if (countryStreamingInfo && user?.country) {
      return user.country
    } else if (content.streamingInfo.length) {
      return content.streamingInfo[0].country
    } else {
      return ''
    }
  }

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDisplayedCountry(e.target.value)
  }

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDisplayedSeason(e.target.value)
  }

  const handleStreamingDetails = async () => {
    if (!content) return
    setLoadingStreamingDetails(true)
    const streamingInfo = await TitleDetails(content.type, content.tmdbId)
    const formattedInfo = formatStreamingInfo(streamingInfo.streamingInfo)
    socket?.emit(
      'update availability',
      { id: content._id, streamingInfo: formattedInfo },
      (response: { success: boolean; content?: Content; error?: string }) => {
        if (response.success && response.content) {
          setContent(response.content)
          if (!displayedCountry) {
            setDisplayedCountry(checkUserCountryAvailability(response.content))
          }
        } else {
          console.error(response.error)
        }
        setLoadingStreamingDetails(false)
      }
    )
  }

  const getUserWatched = () => {
    if (!content || !user) return

    const watched = user.watched.find(
      (watched) => watched.content._id === content._id
    )

    if (watched) {
      setWatched(watched)
    } else {
      setWatched(null)
    }
  }

  const handleWatched = () => {
    if (watched) {
      setWatched(null)
      socket?.emit(
        'remove from watched',
        { watchedId: watched._id },
        (response: { success: boolean; profile?: Profile }) => {
          if (response.success && response.profile) {
            assignUser(response.profile)
          } else {
            getUserWatched()
          }
        }
      )
    } else {
      if (!content) return

      const tempWatched = {
        _id: '',
        content: content,
        liked: false,
        disliked: false,
        mood: ''
      }
      setWatched(tempWatched)
      socket?.emit(
        'add to watched',
        { contentId: content._id },
        (response: { success: boolean; profile?: Profile }) => {
          if (response.success && response.profile) {
            assignUser(response.profile)
          } else {
            setWatched(null)
          }
        }
      )
    }
  }

  // update name of this function
  const likeCallback = (response: {
    success: boolean
    profile?: Profile
    content?: Content
    error?: string
  }) => {
    console.log(response)
    if (response.success && response.profile && response.content) {
      assignUser(response.profile)
      setContent(response.content)
    } else {
      console.error(response.error)
      getUserWatched()
    }
  }

  const updateWatched = (liked: boolean, disliked: boolean) => {
    if (watched) {
      setWatched({
        ...watched,
        liked,
        disliked
      })
    } else {
      setWatched({
        _id: '',
        content: content as Content,
        liked,
        disliked,
        mood: ''
      })
    }
  }

  const handleLike = () => {
    if (!watched?.liked) {
      updateWatched(true, false)
      socket?.emit('like content', { id: content?._id }, likeCallback)
    } else {
      updateWatched(false, false)
      socket?.emit('unlike content', { id: content?._id }, likeCallback)
    }
  }

  const handleDislike = () => {
    if (!watched?.disliked) {
      updateWatched(false, true)
      socket?.emit('dislike content', { id: content?._id }, likeCallback)
    } else {
      updateWatched(false, false)
      socket?.emit('undislike content', { id: content?._id }, likeCallback)
    }
  }

  useEffect(() => {
    if (!socket) {
      return
    }

    socket.emit('get content', { id: params.id }, (content: Content | null) => {
      if (content === null) {
        // console.log('not found')
        // notFound()
      } else {
        setContent(content)
        if (content.type === 'series' && content.seasons?.length) {
          setDisplayedSeason(content.seasons[0].season_number.toString())
        }
        setDisplayedCountry(checkUserCountryAvailability(content))
        setLoadingContent(false)
      }
    })
  }, [params.id, socket])

  useEffect(() => {
    getUserWatched()
  }, [content, user])

  return (
    <section className="relative p-8">
      {loadingContent ? (
        <p>Loading...</p>
      ) : content ? (
        <>
          <div className="absolute top-0 left-0 w-full h-96 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full z-10 contentBackdrop"></div>
            <img
              src={`https://image.tmdb.org/t/p/original${content.backdrop}`}
              alt={`${content.title} backdrop`}
              className="object-cover w-full filter h-96 blur-sm"
            />
          </div>
          <div className="flex flex-wrap min-[950px]:flex-nowrap justify-around lg:justify-start w-full gap-4 z-10 text-white">
            <div className="flex justify-center w-full min-[950px]:w-[300px] flex-shrink-0">
              <div className="w-[300px] shadow-lg">
                <Image
                  src={`https://image.tmdb.org/t/p/original${content.poster}`}
                  alt={content.title}
                  width={300}
                  height={450}
                  className="rounded-t-lg"
                />
                <div className="w-full grid grid-cols-4 bg-PrimaryDark rounded-b-lg">
                  <div className="flex flex-col items-center p-2 gap-1">
                    <button onClick={() => setShowListsModal(true)}>
                      <Image
                        src={'/bookmark.svg'}
                        alt="Add to watchlist"
                        height={25}
                        width={18.75}
                      />
                    </button>
                    <p className="text-xs">Watchlist</p>
                  </div>
                  <div className="flex flex-col items-center p-2 gap-1">
                    <button onClick={handleWatched}>
                      <Image
                        src={'/checkmark.svg'}
                        alt="Like"
                        width={25}
                        height={25}
                        className={watched ? 'selectedSVG' : ''}
                      />
                    </button>
                    <p className="text-xs">Seen</p>
                  </div>
                  <div className="flex flex-col items-center p-2 gap-1">
                    <button onClick={handleLike}>
                      <Image
                        src={'/thumb.svg'}
                        alt="Like"
                        width={25}
                        height={25}
                        className={
                          watched && watched.liked ? 'selectedSVG' : ''
                        }
                      />
                    </button>
                    <p className="text-xs">{content.likes}</p>
                  </div>
                  <div className="flex flex-col items-center p-2 gap-1">
                    <button onClick={handleDislike}>
                      <Image
                        src={'/thumb.svg'}
                        alt="Dislike"
                        width={25}
                        height={25}
                        className={
                          'rotate-180' +
                          (watched && watched.disliked ? ' selectedSVG' : '')
                        }
                      />
                    </button>
                    <p className="text-xs">{content.dislikes}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col flex-grow gap-8 max-w-2xl min-[950px]:pt-8 p-4 bg-black/50 rounded-t-md min-[950px]:bg-black/30 h-min">
              <div className="flex flex-col items-center min-[950px]:items-start w-full">
                <h2 className="text-2xl textShadow">
                  {content.title}{' '}
                  <span className="text-lg text-gray-400">
                    ({content.releaseYear})
                  </span>
                </h2>
                <p className="textShadow">{genres}</p>
              </div>
              <div className="flex flex-col items-center w-full">
                <div className="flex items-center justify-between w-full">
                  <h3>Streaming options</h3>
                  {displayedCountry && (
                    <select
                      onChange={handleCountryChange}
                      defaultValue={displayedCountry}
                      className="bg-black/50 text-white rounded-md p-2 w-1/3 md:w-auto"
                    >
                      {content.streamingInfo.map((country) => (
                        <option value={country.country} key={country.country}>
                          {countryNames[country.country]}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="flex items-center gap-4 w-full overflow-scroll">
                  {countryStreamingInfo.length ? (
                    countryStreamingInfo.map((streamingService) => (
                      <a
                        href={streamingService.link}
                        target="_blank"
                        key={streamingService.service}
                      >
                        <img
                          src={streamIcons[streamingService.service].image}
                          alt={streamIcons[streamingService.service].name}
                        />
                      </a>
                    ))
                  ) : (
                    <p>
                      {displayedCountry
                        ? `No streaming options available in
                      ${countryNames[displayedCountry]}`
                        : 'No streaming options available'}
                    </p>
                  )}
                </div>
                {!content.streamingValidated.validated && (
                  <SubmitButton
                    text="Validate streaming options"
                    disabled={false}
                    loading={loadingStreamingDetails}
                    onClick={handleStreamingDetails}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full bg-black/50 text-white rounded-b-md min-[950px]:mt-4 min-[950px]:rounded-md shadow-lg pt-0 p-4 min-[950px]:pt-4">
            <div className="flex flex-col gap-4 md:flex-row md:justify-around">
              <div>
                <h3>Ratings</h3>
                <div>
                  <div className="flex items-center gap-2">
                    <img src="/TMDB.svg" alt="TMDB" className="w-12" />
                    <p>{content.rating}</p>
                  </div>
                </div>
              </div>
              {content.type === 'movie' && content.runtime && (
                <div>
                  <h3>Runtime</h3>
                  <p>
                    {content.runtime > 60
                      ? `${Math.floor(content.runtime / 60)}h `
                      : ''}
                    {content.runtime % 60}m
                  </p>
                </div>
              )}
            </div>
            <div>
              <h3>Synopsis</h3>
              <p className="text-wrap">{content.overview}</p>
            </div>
            {content.type === 'series' && (
              <div>
                <div className="flex flex-nowrap items-center gap-4">
                  <h3>Seasons</h3>
                  {content.seasons?.length && content.seasons.length > 0 && (
                    <select
                      onChange={handleSeasonChange}
                      defaultValue={content.seasons[0].season_number}
                      className="bg-black/50 text-white rounded-md p-2"
                    >
                      {content.seasons.map((season) => (
                        <option
                          value={season.season_number}
                          key={season.season_number}
                        >
                          {season.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  {content.seasons?.length ? (
                    <>
                      {seasonInfo ? (
                        <div>
                          <h4>{seasonInfo.name}</h4>
                          <Image
                            src={`https://image.tmdb.org/t/p/original${seasonInfo.poster}`}
                            alt={seasonInfo.name}
                            width={150}
                            height={225}
                            className="rounded"
                          />
                          <p>Air date: {seasonInfo.air_date}</p>
                          <p>{seasonInfo.overview}</p>
                        </div>
                      ) : (
                        <p>No season selected</p>
                      )}
                    </>
                  ) : (
                    <p>No seasons available</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <NotFound />
      )}
      {showListsModal && content && (
        <ListsModal content={content} setModalOpen={setShowListsModal} />
      )}
    </section>
  )
}

export default ContentDetails
