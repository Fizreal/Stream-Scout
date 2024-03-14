import axios from 'axios'
import { Profile, StreamingInfo, FilterData } from '@/types'

const BASE_URL = 'https://streaming-availability.p.rapidapi.com/'

const RAPID_API = axios.create({ baseURL: BASE_URL })

RAPID_API.interceptors.request.use(
  (config) => {
    config.headers['X-RapidAPI-Key'] = process.env.NEXT_PUBLIC_RAPIDAPI_KEY
    config.headers['X-RapidAPI-Host'] = process.env.NEXT_PUBLIC_RAPIDAPI_HOST
    return config
  },
  (error) => Promise.reject(error)
)

export const TitleSearch = async (user: Profile, query: string) => {
  const response = await RAPID_API.get(
    `search/title?country=${user.country}&title=${query}`
  )
  return response.data
}

export const TitleDetails = async (id: string) => {
  const response = await RAPID_API.get(`get/?tmdb_id=${id}`)
  return response.data
}

export const FilterSearch = async (user: Profile, data: FilterData) => {
  let services = '&services=' + user.subscription.join(',')
  let genres = data.genres.length ? '&genres=' + data.genres.join(',') : ''
  let keyword = data.keyword ? '&keyword=' + data.keyword : ''
  let minYear = data.minYear ? '&min_year=' + data.minYear : ''
  let maxYear = data.maxYear ? '&max_year=' + data.maxYear : ''
  let cursor = data.cursor ? '&cursor=' + data.cursor : ''
  let showType = '&type=' + data.showType

  const response = await RAPID_API.get(
    `search/filters?country=${user.country}&order_by=popularity_alltime&desc=true&genres_relation=or${services}${genres}${keyword}${minYear}${maxYear}${cursor}${showType}`
  )
  return response.data
}
