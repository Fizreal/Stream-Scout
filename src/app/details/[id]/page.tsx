'use client'

import { useEffect, useState, useMemo } from 'react'
import { useUser } from '@/context/UserContext'
import { useSocket } from '@/context/SocketContext'
import { Content } from '@/types'
import { TitleDetails } from '@/utils/rapid-api'
import { formatStreamingInfo } from '@/utils/content-methods'
import Image from 'next/image'
import { streamIcons, countryNames } from '@/utils/object-maps'
// import { notFound } from 'next/navigation'
import NotFound from './not-found'
import SubmitButton from '@/components/SubmitButton'

type Params = {
  params: {
    id: string
  }
}

const ContentDetails = ({ params }: Params) => {
  const socket = useSocket()
  const { user } = useUser()

  const [content, setContent] = useState<Content | null>(null)
  const [displayedCountry, setDisplayedCountry] = useState('')
  const [loadingContent, setLoadingContent] = useState(true)
  const [loadingStreamingDetails, setLoadingStreamingDetails] = useState(false)

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

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDisplayedCountry(e.target.value)
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
        } else {
          console.error(response.error)
        }
        setLoadingStreamingDetails(false)
      }
    )
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
        setDisplayedCountry(
          user?.country ? user.country : content.streamingInfo[0].country
        )
        setLoadingContent(false)
      }
    })
  }, [params.id, socket])

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
          <div className="flex flex-wrap md:flex-nowrap justify-center gap-4 z-10 text-white">
            <div className="min-w-[300px] shadow-lg">
              <Image
                src={`https://image.tmdb.org/t/p/original${content.poster}`}
                alt={content.title}
                width={300}
                height={450}
                className="rounded"
              />
              <div>
                {/* options: add to list, like, unlike, mark watched */}
              </div>
            </div>
            <div className="flex flex-col flex-grow gap-8 md:pt-8 p-4 bg-black/50 rounded-t-md md:bg-transparent ">
              <h2 className="text-2xl">
                {content.title}{' '}
                <span className="text-lg text-gray-400">
                  ({content.releaseYear})
                </span>
              </h2>
              <div className=" flex flex-col items-center w-full">
                <div className="flex items-center justify-between w-full">
                  <h3>Streaming options</h3>
                  <select
                    onChange={handleCountryChange}
                    defaultValue={displayedCountry}
                    className="bg-black/50 text-white rounded-md p-2 w-1/3"
                  >
                    {content.streamingInfo.map((country) => (
                      <option value={country.country} key={country.country}>
                        {countryNames[country.country]}
                      </option>
                    ))}
                  </select>
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
                      No streaming options available in{' '}
                      {countryNames[displayedCountry]}
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
          <div className="flex flex-col gap-4 w-full bg-black/50 text-white rounded-b-md md:mt-4 md:rounded-md shadow-lg pt-0 p-4 md:pt-4">
            <div>
              <h3>Synopsis</h3>
              <p className="text-wrap">{content.overview}</p>
            </div>
            <div>
              <h3>Ratings</h3>
              <div>
                <div>
                  <img src="" alt="TMDB" />
                  <p>{content.rating}</p>
                </div>
              </div>
            </div>
            <div>
              <h3>Runtime</h3>
              <p>
                {content.runtime > 60
                  ? `${Math.floor(content.runtime / 60)}h `
                  : ''}
                {content.runtime % 60}m
              </p>
            </div>
            <div>
              <h3>Genres</h3>
              <p>{genres}</p>
            </div>
          </div>
        </>
      ) : (
        <NotFound />
      )}
    </section>
  )
}

export default ContentDetails
