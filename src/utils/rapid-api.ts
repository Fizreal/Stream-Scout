import axios from 'axios'
import { Profile, BrowseFilters, Country } from '@/types'

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

export const TitleDetails = async (type: string, id: string) => {
  const response = await RAPID_API.get(`get?tmdb_id=${type}/${id}`)
  return response.data.result
}

export const FilterSearch = async (user: Profile, data: BrowseFilters) => {
  let services = '&services=' + user.subscriptions.join(',')
  let genres = data.genres.length ? '&genres=' + data.genres.join(',') : ''
  let keyword = data.keyword ? '&keyword=' + data.keyword : ''
  let minYear = data.minYear ? '&min_year=' + data.minYear : ''
  let maxYear = data.maxYear ? '&max_year=' + data.maxYear : ''
  let cursor = data.cursor ? '&cursor=' + data.cursor : ''
  let contentType = '&show_type=' + data.contentType

  const response = await RAPID_API.get(
    `search/filters?country=${user.country}&order_by=popularity_alltime&desc=true&genres_relation=or${services}${genres}${keyword}${minYear}${maxYear}${cursor}${contentType}`
  )
  return response.data
}

export const Countries = async () => {
  const response = await RAPID_API.get('countries')
  const countries: Country[] = Object.values(response.data.result).map(
    (country: any) => {
      return {
        name: country.name,
        countryCode: country.countryCode,
        services: Object.values(country.services).map((service: any) => {
          return {
            name: service.name,
            id: service.id,
            image: service.images.lightThemeImage
          }
        })
      }
    }
  )

  return countries
}
