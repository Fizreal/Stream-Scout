'use client'

import { useState, useEffect } from 'react'
import { MovieDetails, ShowDetails } from '@/utils/tmdb-api'
import Image from 'next/image'
import BrowseCard from './BrowseCard'
import SearchCard from './SearchCard'
import { Content } from '@/types'
import { useRouter } from 'next/navigation'
import { useSocket } from '@/context/SocketContext'

const ContentCard = ({ content, type }: { content: Content; type: string }) => {
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
      (response: { success: boolean; content?: Content; error?: string }) => {
        if (response.success && response.content) {
          router.push(`/details/${response.content._id}`)
        } else {
          console.error(response.error)
          setDetailsLoading(false)
        }
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

  return <BrowseCard content={contentData} />
}

export default ContentCard
