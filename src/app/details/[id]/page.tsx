'use client'

import { useEffect, useState } from 'react'
import { useSocket } from '@/context/SocketContext'
import { Content } from '@/types'
import { TitleDetails } from '@/utils/rapid-api'
import { formatStreamingInfo } from '@/utils/content-methods'
// import { notFound } from 'next/navigation'
import NotFound from './not-found'

type Params = {
  params: {
    id: string
  }
}

const ContentDetails = ({ params }: Params) => {
  const socket = useSocket()
  const [content, setContent] = useState<Content | null>(null)
  const [loading, setLoading] = useState(true)

  const handleStreamingDetails = async () => {
    if (!content) return

    const streamingInfo = await TitleDetails(content.type, content.tmdbId)
    const formattedInfo = formatStreamingInfo(streamingInfo.streamingInfo)
    console.log(streamingInfo, formattedInfo)
    socket?.emit(
      'update availability',
      { id: content._id, streamingInfo: formattedInfo },
      (response: { success: boolean; content?: Content; error?: string }) => {
        if (response.success && response.content) {
          setContent(response.content)
        } else {
          console.error(response.error)
        }
      }
    )
  }

  useEffect(() => {
    if (!socket) {
      return
    }

    socket.emit('get content', { id: params.id }, (content: Content | null) => {
      console.log('ping', content)
      if (content === null) {
        // console.log('not found')
        // notFound()
      }
      setContent(content)
      setLoading(false)
    })
  }, [params.id, socket])

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : content ? (
        <div>
          {content?.title}
          <button onClick={handleStreamingDetails}>Streaming details</button>
        </div>
      ) : (
        <NotFound />
      )}
    </div>
  )
}

export default ContentDetails
