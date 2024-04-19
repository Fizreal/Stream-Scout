import { streamIcons } from '@/utils/object-maps'
import { useUser } from '@/context/UserContext'
import { Content } from '@/types'
import Image from 'next/image'

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

  return (
    <div>
      <Image
        src={`https://image.tmdb.org/t/p/original${content.poster}`}
        alt={content.title}
        width={300}
        height={450}
      />
      <div>
        <h3>
          {content.title} <span>{content.releaseYear}</span>
        </h3>
        {countryAvailability?.availability.length ? (
          <p></p>
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
        <p>{content.overview}</p>
      </div>
    </div>
  )
}

export default SearchCard
