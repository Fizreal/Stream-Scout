import { streamIcons } from '@/utils/object-maps'
import { useUser } from '@/context/UserContext'
import { Content } from '@/types'
import Image from 'next/image'
import Countries from '@/utils/services.json'

const SearchCard = ({
  content,
  handleDetails,
  loading
}: {
  content: Content
  handleDetails: () => void
  loading: boolean
}) => {
  const { user } = useUser()

  const countryAvailability = content.streamingInfo.find(
    (stream) => stream.country === user?.country
  )

  const country = Countries.find(
    (country) => country.countryCode === user?.country
  )

  return (
    <div className="relative w-full p-6 rounded shadow-lg flex gap-6 bg-PrimaryDark">
      <div onClick={handleDetails} className="cursor-pointer">
        <Image
          src={`https://image.tmdb.org/t/p/original${content.poster}`}
          alt={content.title}
          width={300}
          height={450}
          className="rounded"
        />
      </div>
      <div className="h-full w-full">
        <h3 className="text-2xl cursor-pointer" onClick={handleDetails}>
          {content.title}{' '}
          <span className="text-lg text-gray-400">({content.releaseYear})</span>
        </h3>
        {countryAvailability?.availability.length ? (
          <p>Not available for streaming in {country?.name}</p>
        ) : (
          <div>
            {countryAvailability?.availability.map((stream) => (
              <img
                src={streamIcons[stream.service]}
                alt={stream.service[0].toUpperCase() + stream.service.slice(1)}
              />
            ))}
          </div>
        )}
        <div className="flex-grow overflow-hidden">
          <p className="text-ellipsis overflow-hidden clippedOverviewSearch">
            {content.overview}
          </p>
        </div>
      </div>
    </div>
  )
}

export default SearchCard
