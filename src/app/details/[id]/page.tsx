import { useEffect, useState } from 'react'
import { useSocket } from '@/context/SocketContext'
import { Content } from '@/types'
import { useParams } from 'next/navigation'

const ContentDetails = () => {
  const socket = useSocket()
  const { id } = useParams()
  const [content, setContent] = useState<Content>(null)

  useEffect(() => {
    if (!socket) {
      return
    }

    socket.emit('get content', { id }, (content: Content) => {
      setContent(content)
    })
  }, [id])

  return <div>{content ? <div></div> : <p>Loading...</p>}</div>
}

export default ContentDetails
