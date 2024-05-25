'use client'

import { useState, useEffect } from 'react'
import { PopularThisWeek } from '@/utils/rapid-api'
import ContentCard from '@/components/cards/ContentCard'
import { useUser } from '@/context/UserContext'
import { Content } from '@/types'
import { formatResult } from '@/utils/content-methods'
import Loading from '@/components/Loading'

const Home = () => {
  const { user } = useUser()
  const [popular, setPopular] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)

  const fetchResults = async () => {
    if (!user) return
    try {
      const data = await PopularThisWeek(user)

      const tmdbIds = new Set()

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
      return formattedData
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }

  useEffect(() => {
    if (!user) return

    const fetchPopular = async () => {
      const response = await fetchResults()
      setPopular(response.slice(0, 24))
      setLoading(false)
    }

    fetchPopular()
  }, [user])

  return (
    <section className="gap-3">
      <h2 className="text-2xl text-AccentLight">Popular this week</h2>
      <div className="flex flex-wrap justify-center gap-4 pb-3">
        {loading ? (
          <Loading />
        ) : (
          popular.map((content, idx) => (
            <ContentCard content={content} type="browse" key={idx} />
          ))
        )}
      </div>
    </section>
  )
}

export default Home
