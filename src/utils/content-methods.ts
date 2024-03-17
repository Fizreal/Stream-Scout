import { Content, StreamingInfo } from '@/types'
import { format } from 'path'

export const formatStreamingInfo = (streamingInfo: any): StreamingInfo[] => {
  let formattedInfo: StreamingInfo[] = []

  for (const [key, value] of Object.entries(streamingInfo)) {
    let country = String(key)
    let availability = Array.isArray(value)
      ? value.map((stream: any) => {
          return {
            service: stream.service,
            streamingType: stream.streamingType,
            link: stream.link,
            addon: stream.addon,
            leaving: stream.leaving
          }
        })
      : []

    let subscriptionAvailability = availability.filter(
      (service) => service.streamingType === 'subscription'
    )

    if (subscriptionAvailability.length > 0) {
      formattedInfo.push({
        country: country,
        availability: subscriptionAvailability
      })
    }
  }

  return formattedInfo
}

export const formatResult = (content: any): Content => {
  let formattedGenres =
    content.genres.length > 0
      ? content.genres.map((genre: { id: number; name: string }) => genre.name)
      : []

  return {
    title: content.title,
    tmdbId: content.tmdbId,
    streamingInfo: formatStreamingInfo(content.streamingInfo),
    genres: formattedGenres,
    releaseYear: content.type === 'movie' ? content.year : content.firstAirYear,
    streamingValidated: { status: false },
    type: content.type,
    runtime: 0,
    backdrop: '',
    poster: '',
    overview: '',
    rating: 0,
    _id: ''
  }
}
