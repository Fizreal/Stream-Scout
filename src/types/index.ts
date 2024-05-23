export type Watched = {
  _id: string
  content: Content
  liked: boolean
  disliked: boolean
  mood: string
}

export type PublicProfile = {
  username: string
  _id: string
  userId: string
  country: string
}

export type Watchlist = {
  _id: string
  owners: PublicProfile[]
  name: string
  list: {
    content: Content
    order: number
  }[]
}

export type Invitation = {
  _id: string
  watchlist: {
    _id: string
    owners: PublicProfile[]
    name: string
    list: string[]
  }
  requester: PublicProfile
}

export type Friend = {
  _id: string
  recipient: PublicProfile
  status: number
}

export type Profile = {
  user: string
  country: string
  subscriptions: string[]
  username: string
  friends: Friend[]
  watched: Watched[]
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
  backdrop: string
  poster: string
  overview: string
  rating: number
  _id: string
  likes: number
  dislikes: number
  runtime?: number
  seasons?: [
    {
      air_date: string
      episode_count: number
      name: string
      overview: string
      poster: string
      season_number: number
      rating: number
    }
  ]
}

export type BrowseFilters = {
  keyword: string
  genres: string[]
  minYear: number
  maxYear: number
  contentType: string
  cursor: string
}

export type ProfileForm = {
  username?: string
  country: string
  subscriptions: string[]
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
