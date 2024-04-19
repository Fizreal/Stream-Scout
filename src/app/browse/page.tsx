'use client'

import { Content } from '@/types'
import { useState, useEffect } from 'react'
import { useUser } from '@/context/UserContext'
import { FilterSearch } from '@/utils/rapid-api'
import { formatResult } from '@/utils/content-methods'
import { genreNames } from '@/utils/object-maps'
import ContentCard from '@/components/cards/ContentCard'
import SubmitButton from '@/components/SubmitButton'

type Filters = {
  keyword: string
  genres: string[]
  minYear: number
  maxYear: number
  showType: string
  cursor: string
}

const BrowsePage = () => {
  const [filters, setFilters] = useState<Filters>({
    keyword: '',
    genres: [],
    minYear: 0,
    maxYear: 0,
    showType: 'all',
    cursor: ''
  })
  const [keyword, setKeyword] = useState('')
  const [content, setContent] = useState<Content[] | any[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useUser()

  const getGenres = () => {
    let genres = []
    for (const genre in genreNames) {
      genres.push({ id: genre, name: genreNames[genre] })
    }
    return genres
  }

  const genres = getGenres()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.target.name === 'genres') {
      let genres = filters.genres
      if ((e.target as HTMLInputElement).checked) {
        genres.push(e.target.value)
      } else {
        genres = genres.filter((genre) => genre !== e.target.value)
      }
      setFilters({ ...filters, genres: genres })
    } else {
      setFilters({ ...filters, [e.target.name]: e.target.value })
    }
  }

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
  }

  const handleAddKeyword = () => {
    setFilters({ ...filters, keyword: keyword })
    setKeyword('')
  }

  const resetFilters = () => {
    setFilters({
      keyword: '',
      genres: [],
      minYear: 0,
      maxYear: 0,
      showType: 'all',
      cursor: ''
    })
  }

  const fetchResults = async () => {
    setLoading(true)
    if (!user) return
    try {
      const data = await FilterSearch(user, filters)
      let formattedData = data.result.map((content: any) =>
        formatResult(content)
      )
      setContent(formattedData)
      if (data.hasMore) {
        setFilters({ ...filters, cursor: data.cursor })
      } else {
        setFilters({ ...filters, cursor: '' })
      }
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await fetchResults()
  }

  useEffect(() => {
    const handleScroll = async () => {
      const isBottom =
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      if (isBottom && filters.cursor) {
        await fetchResults()
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>Show:</label>
          <select name="showType" onChange={handleChange}>
            <option value="all">All</option>
            <option value="movie">Movies only</option>
            <option value="series">Shows only</option>
          </select>
        </fieldset>
        <fieldset>
          <legend>Genres:</legend>
          {genres.map((genre) => (
            <label key={genre.id}>
              <input
                type="checkbox"
                name="genres"
                value={genre.id}
                onChange={handleChange}
              />
              {genre.name}
            </label>
          ))}
        </fieldset>
        <fieldset>
          <label htmlFor="">Min release year:</label>
          <input
            type="number"
            name="minYear"
            value={filters.minYear}
            onChange={handleChange}
          />
          <label htmlFor="">Max release year:</label>
          <input
            type="number"
            name="maxYear"
            value={filters.maxYear}
            onChange={handleChange}
          />
        </fieldset>
        <fieldset>
          <div>
            <div>
              <p>{filters.keyword}</p>
            </div>
          </div>
          <label>Keyword:</label>
          <input
            type="text"
            name="keyword"
            value={keyword}
            onChange={handleKeywordChange}
            placeholder="Zombies, aliens, etc."
          />
          <button onClick={handleAddKeyword}>
            {filters.keyword ? 'Replace keyword' : 'Add keyword'}
          </button>
        </fieldset>
        <SubmitButton text="Search" disabled={false} loading={loading} />
        <button onClick={resetFilters}>Reset filters</button>
      </form>
      <div className="flex flex-wrap justify-center gap-4">
        {content.map((item) => (
          <ContentCard key={item.tmdbId} content={item} type="browse" />
        ))}
        {loading && <div>Loading...</div>}
      </div>
    </main>
  )
}
export default BrowsePage
