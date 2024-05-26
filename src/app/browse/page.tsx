'use client'

import { Content, BrowseFilters } from '@/types'
import { useState, useEffect } from 'react'
import { useUser } from '@/context/UserContext'
import { FilterSearch } from '@/utils/rapid-api'
import { formatResult } from '@/utils/content-methods'
import ContentCard from '@/components/cards/ContentCard'
import FilterType from '@/components/browse/FilterType'
import FilterGenres from '@/components/browse/FilterGenres'
import FilterKeyword from '@/components/browse/FilterKeyword'
import FilterReleaseYear from '@/components/browse/FilterReleaseYear'
import SubmitButton from '@/components/SubmitButton'
import Loading from '@/components/Loading'

const BrowsePage = () => {
  const [currentFilters, setCurrentFilters] = useState<BrowseFilters>({
    keyword: '',
    genres: [],
    minYear: 1900,
    maxYear: new Date().getFullYear(),
    contentType: 'all',
    cursor: ''
  })

  const [searchFilters, setSearchFilters] = useState<BrowseFilters>({
    keyword: '',
    genres: [],
    minYear: 1900,
    maxYear: new Date().getFullYear(),
    contentType: 'all',
    cursor: ''
  })
  const [keyword, setKeyword] = useState('')
  const [content, setContent] = useState<Content[] | any[]>([])
  const [loading, setLoading] = useState(false)
  const [smallScreen, setSmallScreen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const { user } = useUser()

  const handleContentFilter = (contentType: string) => {
    setCurrentFilters({ ...currentFilters, contentType: contentType })
  }

  const handleGenreFilter = (genre: string) => {
    let genres = currentFilters.genres

    if (!genres.includes(genre)) {
      genres.push(genre)
    } else {
      genres = genres.filter((currentGenre) => currentGenre !== genre)
    }
    setCurrentFilters({ ...currentFilters, genres: genres })
  }

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
  }

  const handleAddKeyword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!keyword) return

    setCurrentFilters({ ...currentFilters, keyword: keyword })
    setKeyword('')
  }

  const resetFilters = () => {
    setCurrentFilters({
      keyword: '',
      genres: [],
      minYear: 1900,
      maxYear: new Date().getFullYear(),
      contentType: 'all',
      cursor: ''
    })
  }

  const fetchResults = async (filters: BrowseFilters) => {
    if (!user) return
    try {
      const data = await FilterSearch(user, filters)

      const tmdbIds = new Set()
      if (content.length > 0) {
        for (let i = 0; i < content.length; i++) {
          tmdbIds.add(content[i].tmdbId)
        }
      }

      for (let i = data.result.length - 1; i >= 0; i--) {
        if (tmdbIds.has(data.result[i].tmdbId)) {
          data.result.splice(i, 1)
        } else {
          tmdbIds.add(data.result[i].tmdbId)
        }
      }

      let formattedData = data.result.map((content: any) =>
        formatResult(content)
      )
      if (data.hasMore) {
        setSearchFilters({ ...filters, cursor: data.nextCursor })
      } else {
        setSearchFilters({ ...filters, cursor: '' })
      }
      return formattedData
    } catch (error) {
      console.error('Failed to fetch data:', error)
      return []
    }
  }

  const handleSearch = async () => {
    setLoading(true)
    setSearchFilters(currentFilters)
    const results = await fetchResults(currentFilters)
    setContent(results)
    setLoading(false)
  }

  useEffect(() => {
    setSmallScreen(window.innerWidth < 1024)
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setShowFilters(false)
        setSmallScreen(true)
      } else {
        setSmallScreen(false)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    const handleScroll = async () => {
      const isBottom =
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 450
      if (isBottom && searchFilters.cursor) {
        const results = await fetchResults(searchFilters)
        setContent([...content, ...results])
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [searchFilters])

  return (
    <section className="gap-4 -mt-6">
      <div className="flex flex-col items-center justify-center w-full bg-AccentLight/75">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-2 lg:gap-8 w-full">
          <div
            className="flex flex-col items-center w-full gap-2 lg:w-fit py-2"
            onMouseEnter={() => setShowFilters(true)}
            onMouseLeave={() => setShowFilters(false)}
          >
            {smallScreen && (
              <SubmitButton
                text="Show filters"
                disabled={false}
                loading={false}
                style="primaryDark"
                onClick={() => setShowFilters((prev) => !prev)}
                width="fit"
              />
            )}
            {(!smallScreen || showFilters) && (
              <div className="flex flex-col lg:flex-row items-center justify-center gap-3 w-full lg:w-fit lg:h-12">
                <FilterType
                  filters={currentFilters}
                  handleContentFilter={handleContentFilter}
                />
                <FilterGenres
                  filters={currentFilters}
                  handleChangeGenre={handleGenreFilter}
                />
                <FilterKeyword
                  filters={currentFilters}
                  keyword={keyword}
                  handleKeywordChange={handleKeywordChange}
                  handleAddKeyword={handleAddKeyword}
                  setFilters={setCurrentFilters}
                />
                <FilterReleaseYear
                  filters={currentFilters}
                  setFilters={setCurrentFilters}
                />
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 h-12 items-center">
            <SubmitButton
              text="Reset filters"
              disabled={false}
              loading={false}
              style="secondaryDark"
              onClick={resetFilters}
            />
            <SubmitButton
              text="Search"
              disabled={false}
              loading={loading}
              style="primaryDark"
              onClick={handleSearch}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4 pb-4">
        {content.map((item) => (
          <ContentCard key={item.tmdbId} content={item} type="browse" />
        ))}
        {loading && <Loading />}
      </div>
    </section>
  )
}
export default BrowsePage
