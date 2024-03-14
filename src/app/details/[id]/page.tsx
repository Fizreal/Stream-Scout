import { useEffect, useState } from 'react'
import { useSocket } from '@/context/SocketContext'
import { Content } from '@/types'
import { notFound, useParams } from 'next/navigation'

const ContentDetails = () => {
  const socket = useSocket()
  const { id } = useParams()
  const [content, setContent] = useState<Content>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!socket) {
      return
    }

    socket.emit('get content', { id }, (content: Content | null) => {
      if (!content) {
        return notFound()
      }
      setContent(content)
      setLoading(false)
    })
  }, [id])

  return <div>{content ? <div></div> : <p>Loading...</p>}</div>
}

export default ContentDetails
