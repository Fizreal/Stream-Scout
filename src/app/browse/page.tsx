'use client'

import { Content, Profile } from '@/types'
import { useState } from 'react'
import { TitleSearch } from '@/utils/rapid-api'
import { useUser } from '@/context/UserContext'

const BrowsePage = () => {
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<Content[] | any[]>([])
  const [loading, setLoading] = useState(true)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true)
    e.preventDefault()
    // const data = await TitleSearch(user, title)
    // setContent(data.results)
    setTitle('')
    setLoading(false)
  }

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {content.map((content) => (
            <div key={content._id}>
              <h2>{content.title}</h2>
              <p>{content.overview}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
