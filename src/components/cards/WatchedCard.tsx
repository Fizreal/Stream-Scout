import { streamIcons } from '@/utils/object-maps'
import { useUser } from '@/context/UserContext'
import { useSocket } from '@/context/SocketContext'
import { Watched, Profile, Content } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import Countries from '@/utils/services.json'

const WatchedCard = ({ watched }: { watched: Watched }) => {
  const { user, assignUser } = useUser()
  const socket = useSocket()

  const content = watched.content

  const countryAvailability = content.streamingInfo.find(
    (stream) => stream.country === user?.country
  )

  const country = Countries.find(
    (country) => country.countryCode === user?.country
  )

  const handleWatched = () => {
    socket?.emit(
      'remove from watched',
      { watchedId: watched._id },
      ({ success, profile }: { success: boolean; profile?: Profile }) => {
        if (success && profile) {
          assignUser(profile)
        }
      }
    )
  }

  const handleLike = () => {
    if (watched.liked) {
      socket?.emit(
        'unlike content',
        { id: content._id },
        ({
          success,
          profile,
          content,
          error
        }: {
          success: boolean
          profile?: Profile
          content?: Content
          error?: string
        }) => {
          if (success && profile) {
            assignUser(profile)
          }
        }
      )
    } else {
      socket?.emit(
        'like content',
        { id: content._id },
        ({
          success,
          profile,
          content,
          error
        }: {
          success: boolean
          profile?: Profile
          content?: Content
          error?: string
        }) => {
          if (success && profile) {
            assignUser(profile)
          }
        }
      )
    }
  }

  const handleDislike = () => {
    if (watched.disliked) {
      socket?.emit(
        'undislike content',
        { id: content._id },
        ({
          success,
          profile,
          content,
          error
        }: {
          success: boolean
          profile?: Profile
          content?: Content
          error?: string
        }) => {
          if (success && profile) {
            assignUser(profile)
          }
        }
      )
    } else {
      socket?.emit(
        'dislike content',
        { id: content._id },
        ({
          success,
          profile,
          content,
          error
        }: {
          success: boolean
          profile?: Profile
          content?: Content
          error?: string
        }) => {
          if (success && profile) {
            assignUser(profile)
          }
        }
      )
    }
  }

  return (
    <div className="relative w-full p-6 rounded-xl shadow-lg flex flex-col items-center min-[390px]:flex-row gap-6 bg-PrimaryDark ">
      <div className="flex-shrink-0 shadow-lg">
        <Link href={`/details/${content._id}`}>
          <Image
            src={`https://image.tmdb.org/t/p/original${content.poster}`}
            alt={content.title}
            width={150}
            height={225}
            className="rounded-t-lg"
          />
        </Link>
        <div className="w-full grid grid-cols-3 bg-BaseDark rounded-b-lg">
          <div className="flex flex-col items-center p-2 gap-1">
            <button onClick={handleWatched}>
              <Image
                src={'/checkmark.svg'}
                alt="Like"
                width={25}
                height={25}
                className="selectedSVG"
              />
            </button>
          </div>
          <div className="flex flex-col items-center p-2 gap-1">
            <button onClick={handleLike}>
              <Image
                src={'/thumb.svg'}
                alt="Like"
                width={25}
                height={25}
                className={watched.liked ? 'selectedSVG' : ''}
              />
            </button>
          </div>
          <div className="flex flex-col items-center p-2 gap-1">
            <button onClick={handleDislike}>
              <Image
                src={'/thumb.svg'}
                alt="Dislike"
                width={25}
                height={25}
                className={
                  'rotate-180' + (watched.disliked ? ' selectedSVG' : '')
                }
              />
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-grow gap-2 h-full">
        <Link href={`/details/${content._id}`}>
          <h3 className="text-2xl text-center min-[390px]:text-start">
            {content.title}{' '}
            <span className="text-lg text-gray-400">
              ({content.releaseYear})
            </span>
          </h3>
        </Link>
        <p className="text-center min-[390px]:text-start">
          {content.genres.join(', ')}
        </p>
        {countryAvailability?.availability.length ? (
          <div className="flex gap-4 max-w-full items-center overflow-auto">
            {countryAvailability.availability.map((stream) => (
              <a
                href={stream.link ? stream.link : ''}
                key={stream.service}
                target="_blank"
              >
                <img
                  src={streamIcons[stream.service]?.image}
                  alt={streamIcons[stream.service]?.name}
                />
              </a>
            ))}
          </div>
        ) : (
          <p>Not available for streaming in {country?.name}</p>
        )}
        <div className="flex-grow flex-shrink overflow-hidden">
          <p className="text-ellipsis overflow-hidden clippedOverviewSearch">
            {content.overview}
          </p>
        </div>
      </div>
    </div>
  )
}

export default WatchedCard
