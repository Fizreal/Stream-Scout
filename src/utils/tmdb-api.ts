import axios from 'axios'

const BASE_URL = 'https://api.themoviedb.org/3/'

const TMDB_API = axios.create({ baseURL: BASE_URL })

TMDB_API.interceptors.request.use(
  (config) => {
    config.headers[
      'Authorization'
    ] = `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
    return config
  },
  (error) => Promise.reject(error)
)

export const MovieDetails = async (id: string) => {
  const response = await TMDB_API.get(`movie/${id}`)
  return response.data
}

export const ShowDetails = async (id: string) => {
  const response = await TMDB_API.get(`tv/${id}`)
  return response.data
}
