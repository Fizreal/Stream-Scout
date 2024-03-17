export type Profile = {
  user: string
  country: string
  subscription: string[]
  username: string
  // friends
  _id: string
}

export type ProfileForm = {
  username: string
  country: string
  services: string[]
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
    | { lastUpdated: Date; status: boolean }
    | { status: boolean }
  type: string
  runtime: number
  backdrop: string
  poster: string
  overview: string
  rating: number
  _id: string
}

export type FilterData = {
  showType: string
  genres: string[]
  keyword: string
  minYear: number
  maxYear: number
  cursor?: string
}
