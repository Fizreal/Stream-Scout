'use client'

import { useState, useEffect } from 'react'
import { MovieDetails, ShowDetails } from '@/utils/tmdb-api'
import Image from 'next/image'
import { Content } from '@/types'
import { useRouter } from 'next/navigation'
import { useSocket } from '@/context/SocketContext'

const ContentCard = ({ content }: { content: Content }) => {
  const socket = useSocket()
  const router = useRouter()

  const [contentData, setContentData] = useState<Content>(content)
  const [loading, setLoading] = useState(true)
  const [detailsLoading, setDetailsLoading] = useState(false)

  const handleDetails = () => {
    setDetailsLoading(true)
    socket?.emit(
      'create content',
      contentData,
      (content: Content) => {
        router.push(`/content/${content._id}`)
      },
      (errorMessage: string) => {
        console.error(errorMessage)
        setDetailsLoading(false)
      }
    )
  }

  useEffect(() => {
    const fetchTMDBData = async () => {
      try {
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
          overview: data.overview,
          rating: Math.round(data.vote_average * 10) / 10
        })
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch data:', error)
        setLoading(false)
      }
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
          <button onClick={handleDetails} disabled={detailsLoading}>
            {detailsLoading ? 'Loading...' : 'See Details'}
          </button>
        </div>
      )}
    </div>
  )
}

export default ContentCard
