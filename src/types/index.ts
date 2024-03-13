export type Profile = {
  user: String
  country: String
  subscription: String[]
  username: String
  // friends
  _id: String
}

export type StreamingInfo = {
  country: String
  availability: {
    addon?: String
    leaving?: String
    link?: String
    service: String
    streamingType: String
  }[]
}

export type Content = {
  title: String
  tmdbId: String
  streamingInfo: StreamingInfo[]
  genres: String[]
  releaseYear: Number
  streamingValidated:
    | { lastUpdated: Date; status: Boolean }
    | { status: Boolean }
  type: String
  runtime: Number
  backdrop: String
  poster: String
  overview: String
  rating: Number
  _id: String
} | null
