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
  const [loading, setLoading] = useState(true)

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

    const streamingInfo = await TitleDetails(content.type, content.tmdbId)
    const formattedInfo = formatStreamingInfo(streamingInfo.streamingInfo)
    socket?.emit(
      'update availability',
      { id: content._id, streamingInfo: formattedInfo },
      (response: { success: boolean; content?: Content; error?: string }) => {
        if (response.success && response.content) {
          setContent(response.content)
          setDisplayedCountry(
            user?.country
              ? user.country
              : response.content.streamingInfo[0].country
          )
        } else {
          console.error(response.error)
        }
      }
    )
  }

  useEffect(() => {
    if (!socket) {
      return
    }

    socket.emit('get content', { id: params.id }, (content: Content | null) => {
      console.log('ping', content)
      if (content === null) {
        // console.log('not found')
        // notFound()
      }
      setContent(content)
      setLoading(false)
    })
  }, [params.id, socket])

  return (
    <section>
      {loading ? (
        <p>Loading...</p>
      ) : content ? (
        <>
          <div>
            <div>
              <div></div>
              <img src={content.backdrop} alt={`${content.title} backdrop`} />
            </div>
            <div>
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
            <div>
              <h2>
                {content.title}{' '}
                <span className="text-lg text-gray-400">
                  ({content.releaseYear})
                </span>
              </h2>
              <div>
                <h3>Streaming options</h3>
                <select name="" id="" onChange={handleCountryChange}>
                  {content.streamingInfo.map((country) => (
                    <option
                      value={country.country}
                      selected={country.country === user?.country}
                    >
                      {countryNames[country.country]}
                    </option>
                  ))}
                </select>
                <div>
                  {countryStreamingInfo.length ? (
                    countryStreamingInfo.map((streamingService) => (
                      <a href={streamingService.link} target="_blank">
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
              </div>
              <div>
                <h3>Synopsis</h3>
                <p>{content.overview}</p>
              </div>
            </div>
            <div>
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
          </div>
        </>
      ) : (
        <NotFound />
      )}
    </section>
  )
}

export default ContentDetails
