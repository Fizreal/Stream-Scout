'use client'

import { useState, useEffect } from 'react'
import { MovieDetails, ShowDetails } from '@/utils/tmdb-api'
import Image from 'next/image'
import { Content } from '@/types'

const ContentCard = ({ content }: { content: Content }) => {
  const [contentData, setContentData] = useState<Content>(content)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTMDBData = async () => {
      let data
      if (contentData.type === 'movie') {
        data = await MovieDetails(contentData.tmdbId)
      } else {
        data = await ShowDetails(contentData.tmdbId)
      }
      setContentData({
        ...contentData,
        runtime: data.runtime,
        poster: data.poster_path,
        backdrop: data.backdrop_path,
        overview: data.overview
      })
      setLoading(false)
    }
    fetchTMDBData()
  }, [content])

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <Image
            src={`https://image.tmdb.org/t/p/original${contentData.poster}`}
            alt={contentData.title}
            width={200}
            height={300}
          />
          <h2>
            {contentData.title}
            <span>{contentData.releaseYear}</span>
          </h2>
          <p>{contentData.overview}</p>
          <div>
            <img src="" alt="Rating" />
            <p>{contentData.rating}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContentCard
