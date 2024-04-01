export type Profile = {
  user: string
  country: string
  subscriptions: string[]
  username: string
  // friends
  _id: string
}

export type StreamingInfo = {
  country: string
  availability: {
    addon?: string
    leaving?: string
    link?: string
    service: string
    streamingType: string
  }[]
}

export type Content = {
  title: string
  tmdbId: string
  streamingInfo: StreamingInfo[]
  genres: string[]
  releaseYear: number
  streamingValidated:
    | { lastUpdated: Date; validated: boolean }
    | { validated: boolean }
  type: string
  runtime: number
  backdrop: string
  poster: string
  overview: string
  rating: number
  _id?: string
}

export type FilterData = {
  showType: string
  genres: string[]
  keyword: string
  minYear: number
  maxYear: number
  cursor?: string
}

export type Service = {
  id: string
  name: string
  image: string
}

export type Country = {
  countryCode: string
  name: string
  services: Service[]
}
